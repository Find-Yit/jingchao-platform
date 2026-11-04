import * as T from './vendor/three/three.module.min.js';

// Shared sky, sun and haze for the three time-portal worlds. Everything is
// procedural (no textures, no network) and costs one extra draw call.
const DEFAULTS = {
  top:'#7fb2cf', horizon:'#dfe9e4', bottom:'#c9c3a8', sunDir:[-.72,.5,-.32], sunColor:'#fff1d6', sunIntensity:2.9,
  hemiSky:'#dceaf2', hemiGround:'#8f8b70', hemiIntensity:1.05, rimColor:'#c4e5f0', rimIntensity:.55,
  fog:null, fogNear:70, fogFar:330, cloud:.55, cloudColor:'#fffaf0', cloudShade:'#c9d3d6', haze:'#f3e6cf', sunGlow:.35
};

export function atmosphereSettings(definition={}) {
  return {...DEFAULTS, ...(definition.atmosphere||{})};
}

export function createAtmosphere(scene, definition={}) {
  const a = atmosphereSettings(definition), resources = new Set();
  const sunDir = new T.Vector3(...a.sunDir).normalize();
  const horizon = new T.Color(a.horizon);
  scene.background = horizon.clone();
  scene.fog = new T.Fog(a.fog || a.horizon, a.fogNear, a.fogFar);
  const uniforms = {
    top:{value:new T.Color(a.top)}, horizon:{value:horizon.clone()}, bottom:{value:new T.Color(a.bottom)},
    haze:{value:new T.Color(a.haze)}, sunColor:{value:new T.Color(a.sunColor)}, sunDir:{value:sunDir.clone()},
    cloudColor:{value:new T.Color(a.cloudColor)}, cloudShade:{value:new T.Color(a.cloudShade)},
    cloudAmount:{value:a.cloud}, sunGlow:{value:a.sunGlow}, time:{value:0}
  };
  const material = new T.ShaderMaterial({
    side:T.BackSide, depthWrite:false, depthTest:false, fog:false, uniforms,
    vertexShader:`varying vec3 vDir;void main(){vDir=position;vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position=p.xyww;}`,
    fragmentShader:`
      varying vec3 vDir;uniform vec3 top,horizon,bottom,haze,sunColor,sunDir,cloudColor,cloudShade;uniform float cloudAmount,sunGlow,time;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float v=0.0,w=.5;for(int i=0;i<5;i++){v+=w*noise(p);p=p*2.03+vec2(17.3,9.1);w*=.5;}return v;}
      void main(){
        vec3 d=normalize(vDir);float h=d.y;
        vec3 c=mix(horizon,top,1.0-exp(-max(h,0.0)*5.5));
        c=mix(c,haze,exp(-max(h,0.0)*24.0)*.6);
        c=mix(c,bottom,smoothstep(0.0,-.18,h));
        float s=max(dot(d,sunDir),0.0);
        c+=sunColor*(pow(s,9.0)*.16+pow(s,90.0)*.32)*sunGlow*2.6;
        float disc=smoothstep(.99935,.99965,s);
        if(h>0.015&&cloudAmount>0.0){
          vec2 uv=d.xz/(h+.16)*1.25+vec2(time*.004,time*.0015);
          float n=fbm(uv*.75)*.75+fbm(uv*2.6)*.25;float lo=.74-cloudAmount*.2;float m=smoothstep(lo,lo+.12,n);
          float shade=smoothstep(lo,lo+.3,fbm(uv*.75-sunDir.xz*.05)*.75+fbm(uv*2.6)*.25);
          vec3 cc=mix(cloudColor,cloudShade,shade*.55);
          cc+=sunColor*pow(s,7.0)*.45*m;
          m*=smoothstep(.015,.14,h)*(1.0-disc);
          c=mix(c,cc,m*.88);
        }
        c+=sunColor*disc*1.6;
        gl_FragColor=vec4(c,1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  resources.add(material);
  const geometry = new T.SphereGeometry(500, 48, 24); resources.add(geometry);
  const sky = new T.Mesh(geometry, material); sky.name = 'era-sky'; sky.frustumCulled = false; sky.renderOrder = -100; scene.add(sky);

  const hemi = new T.HemisphereLight(a.hemiSky, a.hemiGround, a.hemiIntensity); scene.add(hemi);
  const sun = new T.DirectionalLight(a.sunColor, a.sunIntensity); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, {left:-46, right:46, top:46, bottom:-46, near:1, far:240});
  sun.shadow.bias = -.00025; sun.shadow.normalBias = .04;
  scene.add(sun, sun.target);
  const rim = new T.DirectionalLight(a.rimColor, a.rimIntensity); rim.position.copy(sunDir).multiplyScalar(-100).setY(30); scene.add(rim);
  const sunOffset = sunDir.clone().multiplyScalar(120);

  return {
    sun, hemi, rim, sky, settings:a, sunDir,
    update(camera, focus, time) {
      sky.position.copy(camera.position);
      uniforms.time.value = time;
      const sx = Math.round(focus.x * 4) / 4, sz = Math.round(focus.z * 4) / 4;
      sun.position.set(sx + sunOffset.x, sunOffset.y, sz + sunOffset.z); sun.target.position.set(sx, 0, sz);
    },
    dispose() { scene.remove(sky, hemi, sun, sun.target, rim); resources.forEach(r => r.dispose()); sun.dispose?.(); }
  };
}

// World-space procedural mottling for large flat surfaces (ground, paving).
// Parameters are uniforms, so materials with different settings can share one program.
const DETAIL_VERTEX='#include <begin_vertex>\nvec4 eraWP=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\neraWP=instanceMatrix*eraWP;\n#endif\neraWP=modelMatrix*eraWP;vEraWorld=eraWP.xyz;';
const DETAIL_FUNCS=`varying vec3 vEraWorld;uniform vec4 eraDetail;uniform vec3 eraTintA,eraTintB;
float eraHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float eraNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(eraHash(i),eraHash(i+vec2(1,0)),f.x),mix(eraHash(i+vec2(0,1)),eraHash(i+vec2(1,1)),f.x),f.y);}
float eraFbm(vec2 p){float v=0.0,w=.5;for(int i=0;i<4;i++){v+=w*eraNoise(p);p=p*2.07+vec2(5.2,1.3);w*=.5;}return v;}
`;
export function addSurfaceDetail(material,{scale=1,strength=.14,grain=.05,ripple=0,tintA='#ffffff',tintB='#ffffff'}={}) {
  const uniforms={eraDetail:{value:new T.Vector4(scale,strength,grain,ripple)},eraTintA:{value:new T.Color(tintA)},eraTintB:{value:new T.Color(tintB)}};
  const previous=material.onBeforeCompile;
  material.onBeforeCompile=(shader,renderer)=>{
    previous?.call(material,shader,renderer);
    Object.assign(shader.uniforms,uniforms);
    shader.vertexShader='varying vec3 vEraWorld;\n'+shader.vertexShader.replace('#include <begin_vertex>',DETAIL_VERTEX);
    shader.fragmentShader=DETAIL_FUNCS+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      vec2 eq=vEraWorld.xz*eraDetail.x;
      float eLarge=eraFbm(eq*.03),eMid=eraFbm(eq*.21+3.7),eFine=eraHash(floor(eq*18.0));
      vec3 eTint=mix(eraTintA,eraTintB,smoothstep(.32,.68,eLarge));
      diffuseColor.rgb*=eTint*(1.0+(eMid-.5)*eraDetail.y*1.6+(eFine-.5)*eraDetail.z);
      if(eraDetail.w>0.0){float eR=sin(dot(eq,vec2(.82,.57))*2.4+eLarge*14.0+eMid*3.0);diffuseColor.rgb*=1.0+eR*eraDetail.w*(.4+eMid);}`);
  };
  const key='era-surface-detail:'+(previous?previous.toString():'');material.customProgramCacheKey=()=>key;
  material.needsUpdate=true;
  return material;
}
