import * as T from './vendor/three/three.module.min.js';
import {CAMPS,LAKE,terrainHeight as height,seededRandom,distance,clamp} from './meadow-math.mjs?v=5.0';
import {createLandmark,createRuinGate} from './meadow-landmarks.mjs?v=5.0';

export function createEnvironment(scene,stations){
 const random=seededRandom(94531),resources=new Set(),objects=[],clock={value:0},obstacles=[],navigationObstacles=[],landmarks=[],clouds=[],butterflies=[],birds=[],qualityMeshes=[];
 const geo=g=>(resources.add(g),g),material=(color,extra={})=>{const m=new T.MeshStandardMaterial({color,roughness:.94,...extra});resources.add(m);return m;};
 const add=o=>(scene.add(o),objects.push(o),o),mesh=(g,m,x=0,y=0,z=0)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.receiveShadow=true;return add(o);};
 const dummy=new T.Object3D(),color=new T.Color();
 function instanced(g,m,items,shadow=false){const o=new T.InstancedMesh(g,m,items.length);items.forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(p.rx||0,p.ry||0,p.rz||0);dummy.scale.set(p.sx||p.s||1,p.sy||p.s||1,p.sz||p.s||1);dummy.updateMatrix();o.setMatrixAt(i,dummy.matrix);if(p.color)o.setColorAt(i,color.set(p.color));});o.castShadow=shadow;o.receiveShadow=true;add(o);return o;}
 const stone=material('#c6c8ae'),wood=material('#807b58'),leaf=material('#a3b878'),gold=material('#dbc790'),white=material('#fff5d9');
 // A sky dome supplies a horizon gradient and a soft sun without an external image.
 const skyMat=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{top:{value:new T.Color('#68afd6')},horizon:{value:new T.Color('#c9e4df')},sun:{value:new T.Vector3(-.45,.46,-.6).normalize()}},vertexShader:'varying vec3 vDirection;void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec3 vDirection;uniform vec3 top;uniform vec3 horizon;uniform vec3 sun;void main(){vec3 d=normalize(vDirection);float t=pow(max(d.y,0.0),.65);vec3 c=mix(horizon,top,t);float sunDot=max(dot(d,sun),0.0);c+=vec3(1.0,.83,.49)*pow(sunDot,160.0)*.19;c+=vec3(1.0,.94,.73)*smoothstep(.9992,.9998,sunDot)*.6;gl_FragColor=vec4(c,1.0);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'});resources.add(skyMat);const sky=mesh(geo(new T.SphereGeometry(570,32,16)),skyMat);sky.frustumCulled=false;sky.renderOrder=-10;
 const routes=CAMPS.map(c=>new T.CatmullRomCurve3([new T.Vector3(0,0,22),new T.Vector3(c.x*.2,0,c.z*.24+12),new T.Vector3(c.x*.65,0,c.z*.70+5),new T.Vector3(c.x+3,0,c.z+8)]));
 const pathSamples=routes.flatMap(c=>c.getPoints(38));
 const pathDistance=(x,z)=>Math.sqrt(pathSamples.reduce((m,p)=>Math.min(m,(x-p.x)**2+(z-p.z)**2),Infinity));
 const groundGeometry=geo(new T.PlaneGeometry(900,900,360,360));groundGeometry.rotateX(-Math.PI/2);const pos=groundGeometry.attributes.position,colors=[];
 const green=new T.Color('#719760'),sand=new T.Color('#c5c99e'),far=new T.Color('#9da979'),rockColor=new T.Color('#abb49c');
 for(let i=0;i<pos.count;i++){
  const x=pos.getX(i),z=pos.getZ(i),y=height(x,z);pos.setY(i,y);
  const near=Math.hypot(x,z)<145,road=near?pathDistance(x,z):100;
  const campDistance=near?Math.min(...CAMPS.map(c=>distance({x,z},c))):100;
  const t=clamp((2.5-road)/1.7,0,1),camp=clamp((8.5-campDistance)/4,0,1);
  const noise=Math.sin(x*.13+Math.sin(z*.08))*Math.cos(z*.12)*.018+Math.sin(x*.047+z*.034)*.021;
  color.copy(green).lerp(far,clamp((y-12)/38,0,.6)).lerp(sand,Math.max(t,camp*.75));
  const slope=Math.hypot(height(x+1,z)-y,height(x,z+1)-y);if(slope>.5)color.lerp(rockColor,clamp((slope-.5)*.6,0,.55));
  color.offsetHSL(0,0,noise);colors.push(color.r,color.g,color.b);
 }
 groundGeometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));groundGeometry.computeVertexNormals();const groundMat=material('#ffffff',{vertexColors:true});
 groundMat.onBeforeCompile=shader=>{shader.uniforms.meadowTime=clock;shader.vertexShader='varying vec3 vMeadowPosition;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvMeadowPosition=(modelMatrix*vec4(transformed,1.0)).xyz;');shader.fragmentShader='varying vec3 vMeadowPosition;uniform float meadowTime;\n'+shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat clouds=sin(vMeadowPosition.x*.018+meadowTime*.025)*sin(vMeadowPosition.z*.023+meadowTime*.019);diffuseColor.rgb*=.96+clouds*.04;');};
 const ground=mesh(groundGeometry,groundMat);ground.receiveShadow=true;
 function cloudTexture(){const c=document.createElement('canvas');c.width=256;c.height=128;const ctx=c.getContext('2d');for(let i=0;i<28;i++){const x=37+random()*184,y=44+random()*43,r=22+random()*28,g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(255,255,255,.56)');g.addColorStop(.55,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;resources.add(tex);return tex;}
 const cloudTex=cloudTexture();
 for(let i=0;i<18;i++){const a=i/18*Math.PI*2,r=250+random()*170;const m=new T.SpriteMaterial({map:cloudTex,color:i%4?'#fffced':'#cfe2dc',transparent:true,opacity:.87,depthWrite:false,fog:false,toneMapped:false});resources.add(m);const o=add(new T.Sprite(m));o.position.set(Math.sin(a)*r,77+random()*35,Math.cos(a)*r);const s=90+random()*65;o.scale.set(s,s*.44,1);clouds.push({o,base:o.position.x,speed:.10+random()*.12});}
 // Long, rounded ridgelines replace the old cone-shaped mountains.
 for(let layer=0;layer<3;layer++){
  const g=geo(new T.CylinderGeometry(1,1,1,128,1,true));const a=g.attributes.position;
  for(let i=0;i<a.count;i++){const ang=Math.atan2(a.getX(i),a.getZ(i)),r=300+layer*75;const top=25+layer*20+Math.sin(ang*5+layer)*13+Math.cos(ang*9)*7+Math.sin(ang*13)*3;const bottom=a.getY(i)<0;a.setXYZ(i,Math.sin(ang)*r,bottom?-25:top,Math.cos(ang)*r);}g.computeVertexNormals();mesh(g,material(['#abc5b1','#b1cbbd','#c1d9c9'][layer],{side:T.DoubleSide}));
 }
 // Landmark groups carry their own ornamentation and animation.
 for(const c of stations){const asset=createLandmark(c.id,{color:c.color});asset.root.position.set(c.x,height(c.x,c.z),c.z);add(asset.root);landmarks.push({asset,station:c});navigationObstacles.push({x:c.x,z:c.z,r:asset.collisionRadius||3.9});for(const o of asset.colliders){obstacles.push({...o,x:c.x+o.x,z:c.z+o.z,base:height(c.x,c.z)+o.base});if(o.base<2&&o.base+o.height>.28&&Math.hypot(o.x,o.z)+o.r>asset.collisionRadius+.15)navigationObstacles.push({x:c.x+o.x,z:c.z+o.z,r:o.r});}}
 const gate=createRuinGate();gate.root.position.set(0,height(0,-1),-1);gate.root.scale.setScalar(.85);add(gate.root);landmarks.push({asset:gate,station:{x:0,z:-1}});
 // Gate pillars are solid, while the opening remains entirely traversable.
 for(const o of gate.colliders)obstacles.push({...o,x:o.x*.85,z:-1+o.z*.85,r:o.r*.85,hx:o.hx===undefined?undefined:o.hx*.85,hz:o.hz===undefined?undefined:o.hz*.85,base:height(0,-1)+o.base*.85,height:o.height*.85});for(const x of [-3.375,3.375])navigationObstacles.push({x,z:-1,r:.95});
 const centerClear=(x,z)=>Math.hypot(x,z-20)<9||Math.hypot(x,z+1)<8;
 const scenicClear=(x,z,pad=0)=>CAMPS.some(c=>distance({x,z},c)<13+pad)||distance({x,z},LAKE)<25+pad||centerClear(x,z)||pathDistance(x,z)<3+pad;
 const trunks=[],branches=[],foliage=[],canopyDark=[];
 const treeGeometry=geo(new T.SphereGeometry(1,9,7)),trunkGeometry=geo(new T.CylinderGeometry(.25,.5,1,8));
 for(let i=0;i<175;i++){
  const x=(random()-.5)*370,z=(random()-.5)*360;
  const clustered=Math.sin(x*.055)*Math.cos(z*.05)>.10||x<-90||z>100;if(!clustered||scenicClear(x,z,2))continue;
  const h=4+random()*4.3,base=height(x,z),s=.8+random()*.8;
  trunks.push({x,y:base+h*.45,z,sx:s,sz:s,sy:h*.9,ry:random()*6});
  for(let j=0;j<3;j++){const a=j*2.09+random()*.5,r=1.2*s;foliage.push({x:x+Math.sin(a)*r,y:base+h+random()*1.1,z:z+Math.cos(a)*r,sx:(2.1+random()*.5)*s,sy:(1.35+random()*.6)*s,sz:(2.1+random()*.6)*s,color:j%2?'#8da874':'#a7ba7e'});}
  canopyDark.push({x,y:base+h-.3,z,sx:2.2*s,sy:1.5*s,sz:2.1*s});
  obstacles.push({x,z,r:.5*s,base,height:h,walkable:true});navigationObstacles.push({x,z,r:.55*s});for(const canopy of foliage.slice(-3))obstacles.push({x:canopy.x,z:canopy.z,r:Math.max(canopy.sx,canopy.sz),base:canopy.y-canopy.sy,height:canopy.sy*2,walkable:true});
 }
 instanced(trunkGeometry,wood,trunks,true);instanced(treeGeometry,leaf,foliage,true);instanced(treeGeometry,material('#789a6c'),canopyDark,true);
 // Fine ribbons of grass bend in a shared wind field on the GPU.
 function grassGeometry(){const vertices=[],indices=[];for(let blade=0;blade<3;blade++){const a=blade*Math.PI/3,offX=Math.sin(a)*.12,offZ=Math.cos(a)*.12,base=vertices.length/3;for(let j=0;j<=3;j++){const t=j/3,w=.052*(1-t)+.002,bend=t*t*.17;for(const sign of [-1,1])vertices.push(offX+Math.cos(a)*w*sign+Math.sin(a)*bend,t,offZ+Math.sin(a)*w*sign+Math.cos(a)*bend);if(j<3){const b=base+j*2;indices.push(b,b+1,b+2,b+1,b+3,b+2);}}}const g=geo(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();return g;}
 function windMaterial(base){const m=material(base,{side:T.DoubleSide});m.onBeforeCompile=s=>{s.uniforms.meadowTime=clock;s.vertexShader='uniform float meadowTime;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvec3 wp=(modelMatrix*instanceMatrix*vec4(position,1.0)).xyz;float wind=sin(wp.x*.12+wp.z*.08+meadowTime*1.35)+.4*sin(wp.z*.32+meadowTime*2.0);float weight=pow(max(position.y,0.0),1.7);transformed.x+=wind*.16*weight;transformed.z+=cos(wp.x*.14+meadowTime*.9)*.09*weight;');};return m;}
 const grass=[],flowerItems=[],flowerCenters=[];
 for(let i=0;i<36000;i++){
  const r=Math.sqrt(random())*175,a=random()*Math.PI*2,x=Math.cos(a)*r,z=Math.sin(a)*r,y=height(x,z),road=pathDistance(x,z);
  if(road<1.7||CAMPS.some(c=>distance({x,z},c)<8)||distance({x,z},LAKE)<21||Math.hypot(x,z+1)<3||Math.hypot(x,z-22)<2.5)continue;
  const patch=Math.sin(x*.13)*Math.cos(z*.11);if(patch<-.55&&random()<.7)continue;
  grass.push({x,y:y-.015,z,ry:random()*6.28,sx:.7+random()*.8,sy:(.28+random()*.48)*(road<3?.55:1),sz:.7+random()*.8,color:i%4===0?'#a6b875':i%4===1?'#8da46e':i%4===2?'#759666':'#b6bf82'});
  if(i%16===0&&patch>.03){flowerItems.push({x,y:y+.02,z,ry:random()*6.28,s:.65+random()*.6,color:i%3?'#f5edcf':'#b3b9d2'});flowerCenters.push({x,y:y+.67,z,s:.055,color:'#dcc27a'});}
 }
 const grassMesh=instanced(grassGeometry(),windMaterial('#ffffff'),grass);qualityMeshes.push({o:grassMesh,count:grass.length,ratio:.35});
 const fv=[],fi=[];for(let p=0;p<5;p++){const a=p*Math.PI*.4,base=fv.length/3;fv.push(0,.64,0,Math.sin(a-.38)*.21,.68,Math.cos(a-.38)*.21,Math.sin(a)*.29,.71,Math.cos(a)*.29,Math.sin(a+.38)*.21,.68,Math.cos(a+.38)*.21);fi.push(base,base+1,base+2,base,base+2,base+3);}const fg=geo(new T.BufferGeometry());fg.setAttribute('position',new T.Float32BufferAttribute(fv,3));fg.setIndex(fi);fg.computeVertexNormals();instanced(fg,windMaterial('#fff9e3'),flowerItems);instanced(geo(new T.SphereGeometry(1,5,4)),gold,flowerCenters);
 // Rock shelves and ancient marker stones invite a small detour and a jump.
 const rocks=[];for(let i=0;i<70;i++){const x=(random()-.5)*330,z=(random()-.5)*330;if(scenicClear(x,z,1))continue;const scale=.8+random()*2.1;const ry=random()*6;rocks.push({x,y:height(x,z)+scale*.25,z,sx:scale*1.6,sy:scale*.7,sz:scale,ry});obstacles.push({x,z,r:scale*1.9,hx:scale*1.6,hz:scale,ry,base:height(x,z)-scale*.45,height:scale*1.4,walkable:true});navigationObstacles.push({x,z,r:scale*1.65});}
 instanced(geo(new T.DodecahedronGeometry(1,0)),stone,rocks,true);
 for(const [x,z,r,h] of [[13,17,1.4,.45],[16,14,1.2,.8],[19,12,1.7,1.15],[-23,12,1.3,.65]]){const y=height(x,z),g=geo(new T.CylinderGeometry(r,r*1.1,h,9));const o=mesh(g,stone,x,y+h/2,z);o.castShadow=true;obstacles.push({x,z,r:r*1.1,base:y,height:h,walkable:true});navigationObstacles.push({x,z,r:r*1.1});}
 for(const [x,z] of [[-37,-90],[92,-9],[-105,41],[43,110]]){
  const y=height(x,z),p=mesh(geo(new T.CylinderGeometry(.65,.95,3.8,7)),stone,x,y+1.9,z);p.castShadow=true;const ring=mesh(geo(new T.TorusGeometry(.47,.04,5,24)),gold,x,y+2.3,z+.66);ring.rotation.x=.1;obstacles.push({x,z,r:1,base:y,height:4,walkable:true});navigationObstacles.push({x,z,r:1});
 }
 // The lake has an animated, softly reflective surface and a shore of reeds.
 const waterMat=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{meadowTime:clock},vertexShader:'varying vec3 vPos;void main(){vPos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec3 vPos;uniform float meadowTime;void main(){float w=sin(vPos.x*1.7+meadowTime*.7)+sin(vPos.z*1.4-vPos.x*.5+meadowTime*.6);float caustic=pow(max(0.0,sin(vPos.x*.4+vPos.z*.55+meadowTime*.25)*sin(vPos.z*.9+meadowTime*.45)),18.0);vec3 c=mix(vec3(.29,.58,.56),vec3(.57,.77,.70),.6+w*.07);c+=caustic*.22;float edge=1.0-smoothstep(17.9,19.7,length(vPos.xz));gl_FragColor=vec4(c,edge*.92);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'});resources.add(waterMat);const wg=geo(new T.CircleGeometry(19.7,72));wg.rotateX(-Math.PI/2);mesh(wg,waterMat,LAKE.x,-.72,LAKE.z);obstacles.push({...LAKE,r:19.9,water:true,base:-2,height:2.2});navigationObstacles.push({...LAKE,r:20});
 const reed=[];for(let i=0;i<130;i++){const a=random()*6.28,r=20+random()*2,x=LAKE.x+Math.sin(a)*r,z=LAKE.z+Math.cos(a)*r;reed.push({x,y:height(x,z),z,sy:1.1+random(),sx:.8,sz:.8,ry:a});}instanced(grassGeometry(),windMaterial('#a3af77'),reed);
 // Small life in the landscape: butterflies near paths and birds over the valley.
 const wingGeo=geo(new T.SphereGeometry(1,6,4));
 for(let i=0;i<14;i++){const root=new T.Group(),m=material(i%2?'#f8dc94':'#f4eac5',{emissive:'#cfb878',emissiveIntensity:.08,side:T.DoubleSide});const wings=[];for(const s of [-1,1]){const w=new T.Mesh(wingGeo,m);w.scale.set(.19,.015,.13);w.position.x=s*.14;root.add(w);wings.push(w);}const x=(random()-.5)*90,z=(random()-.5)*100;root.position.set(x,height(x,z)+1.8,z);add(root);butterflies.push({root,wings,x,z,phase:random()*6});}
 const birdGeometry=geo(new T.BufferGeometry());birdGeometry.setAttribute('position',new T.Float32BufferAttribute([0,0,0,1.2,.08,-.2,.8,0,.3],3));birdGeometry.computeVertexNormals();const birdMat=material('#f7f4df',{side:T.DoubleSide});
 for(let i=0;i<9;i++){const root=new T.Group(),wings=[];for(const s of [-1,1]){const wing=new T.Mesh(birdGeometry,birdMat);wing.scale.x=s;root.add(wing);wings.push(wing);}add(root);birds.push({root,wings,phase:i*.8,r:35+i*6});}
 let low=false;
 return {ground,obstacles,navigationObstacles,update(dt,time,player,reduced=false){clock.value=reduced?0:time;for(const l of landmarks){const d=distance(player,l.station);l.asset.root.visible=d<(low?105:145)||l.asset===gate;if(l.asset.root.visible&&!reduced)l.asset.update(dt,time);}if(!reduced){for(const c of clouds)c.o.position.x=c.base+Math.sin(time*.008)*12;for(const b of butterflies){b.root.visible=distance(player,b)<35;b.root.position.set(b.x+Math.sin(time*.4+b.phase)*2,height(b.x,b.z)+1.5+Math.sin(time*1.1+b.phase)*.4,b.z+Math.cos(time*.4+b.phase)*2);b.root.rotation.y=-time*.4-b.phase;b.wings.forEach((w,i)=>w.rotation.z=Math.sin(time*13+b.phase)*.8*(i?-1:1));}for(const b of birds){const a=time*.035+b.phase;b.root.position.set(Math.sin(a)*b.r,32+Math.sin(a*2)*3,-50+Math.cos(a)*b.r);b.root.rotation.y=-a;b.root.rotation.z=Math.sin(a)*.12;b.wings.forEach((w,i)=>w.rotation.z=Math.sin(time*2+b.phase)*.3*(i?-1:1));}}},setQuality(value){low=value==='low';qualityMeshes.forEach(({o,count,ratio})=>o.count=low?Math.floor(count*ratio):count);},dispose(){for(const l of landmarks)l.asset.dispose();objects.forEach(o=>scene.remove(o));for(const r of resources)r.dispose();}};
}
