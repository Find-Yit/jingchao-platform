import * as T from './vendor/three/three.module.min.js';
import {createPetCompanionModel} from './pet-companion-model.mjs?v=9.2';
import {groundAt} from './meadow-motion.mjs?v=6.0';
import {createPetFollower} from './pet-follow.mjs?v=9.2';

export function createWorldPet(scene,pet,{height,obstacles,bound,leader}){
 const model=createPetCompanionModel({species:pet.species,stage:pet.stage_id,level:pet.level,nickname:pet.name});
 const follow=createPetFollower({height,obstacles,bound});follow.reset(leader);
 scene.add(model.root);let alive=true,time=0,recallTime=0,recalls=0;
 const textures=[],materials=[],geometries=[];
 function texture(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'));const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;textures.push(t);return t;}
 const labelMap=texture(512,96,ctx=>{ctx.font='500 30px "PingFang SC","Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.shadowColor='#294b40';ctx.shadowBlur=7;ctx.fillStyle='#fff8e5';ctx.fillText(pet.name,256,46);});
 const labelMaterial=new T.SpriteMaterial({map:labelMap,transparent:true,depthWrite:false});materials.push(labelMaterial);const label=new T.Sprite(labelMaterial);label.scale.set(3.4,.64,1);scene.add(label);
 const shadowMap=texture(128,128,ctx=>{const g=ctx.createRadialGradient(64,64,4,64,64,62);g.addColorStop(0,'rgba(37,58,45,.29)');g.addColorStop(1,'rgba(37,58,45,0)');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);});
 const geometry=new T.PlaneGeometry(1.9,1.9);geometry.rotateX(-Math.PI/2);geometries.push(geometry);
 const shadowMaterial=new T.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false});materials.push(shadowMaterial);const shadow=new T.Mesh(geometry,shadowMaterial);scene.add(shadow);
 function place(dt,reduced=false){
  const p=follow.state;model.root.position.set(p.x,p.y,p.z);model.root.rotation.y=p.heading;
  const regroup=recallTime>0?Math.min(1,(.38-recallTime)/.22):1;model.root.visible=regroup>0;model.root.scale.setScalar(Math.max(.02,regroup));
  model.update(dt,{time,speed:p.speed,grounded:p.grounded,verticalVelocity:p.vy,landing:p.landing,reducedMotion:reduced,flying:!p.grounded});
  label.position.set(p.x,p.y+1.9,p.z);label.visible=model.root.visible;labelMaterial.opacity=.88;
  const ground=groundAt(p.x,p.z,p.y,obstacles,height),altitude=Math.max(0,p.y-ground);shadow.position.set(p.x,ground+.04,p.z);shadow.scale.setScalar(Math.min(1.8,1+altitude*.08));shadowMaterial.opacity=Math.max(.08,1-altitude*.14);
 }
 place(0);
 return{
  species:pet.species,name:pet.name,
  get state(){return follow.state;},
  update(dt,current,reduced=false){if(!alive)return;time+=dt;follow.update(dt,current);if(follow.state.recalls!==recalls){recalls=follow.state.recalls;recallTime=reduced?0:.38;}recallTime=Math.max(0,recallTime-dt);place(dt,reduced);},
  reset(current){if(!alive)return;follow.reset(current,true);recalls=follow.state.recalls;recallTime=0;place(0);},
  dispose(){if(!alive)return;alive=false;scene.remove(model.root,label,shadow);model.dispose();textures.forEach(x=>x.dispose());materials.forEach(x=>x.dispose());geometries.forEach(x=>x.dispose());}
 };
}
