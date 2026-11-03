import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../static/vendor/three/three.module.min.js';
import {eraDefinition,buildEra} from '../static/era-egypt.mjs';

function blocked(p,obstacles,pad=.4){return obstacles.some(o=>{
  if(o.base>=1.8||o.base+o.height<.1)return false;
  return o.hx===undefined?Math.hypot(p.x-o.x,p.z-o.z)<o.r+pad:Math.abs(p.x-o.x)<o.hx+pad&&Math.abs(p.z-o.z)<o.hz+pad;
});}
function walkRoute(start,end,obstacles){
  const step=1.5,key=(x,z)=>`${x},${z}`,initial={x:Math.round(start.x/step),z:Math.round(start.z/step)},goal={x:Math.round(end.x/step),z:Math.round(end.z/step)},queue=[initial],seen=new Set([key(initial.x,initial.z)]);
  for(let i=0;i<queue.length;i++){
    const p=queue[i];if(Math.hypot(p.x-goal.x,p.z-goal.z)<1.5)return true;
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const n={x:p.x+dx,z:p.z+dz},k=key(n.x,n.z),world={x:n.x*step,z:n.z*step};
      if(seen.has(k)||Math.hypot(world.x,world.z)>109||blocked(world,obstacles))continue;
      seen.add(k);queue.push(n);
    }
  }
  return false;
}

test('Egypt learning content is explicit about artistic interpretation and has valid questions',()=>{
  assert.equal(eraDefinition.id,'egypt');assert.match(eraDefinition.description,/艺术化/);assert.equal(eraDefinition.stations.length,4);
  for(const s of eraDefinition.stations){assert.equal(s.lesson.length,3);assert.equal(s.challenge.options.length,3);assert.ok(s.challenge.answer>=0&&s.challenge.answer<s.challenge.options.length);assert.ok(s.sources.every(source=>/^https:\/\//.test(source.url)));}
});
test('Egypt builds actual detailed 3D geometry with bounded draw calls and flat playable terrain',()=>{
  const scene=new T.Scene(),world=buildEra(scene);let draws=0,instances=0,vertices=0;
  scene.traverse(o=>{if(o.isMesh||o.isPoints){draws++;instances+=o.count||1;vertices+=o.geometry?.attributes.position.count||0;}});
  assert.ok(draws<100,`${draws} draw objects`);assert.ok(instances>3000,`${instances} detailed instances`);assert.ok(vertices<160000,`${vertices} shared vertices`);
  const pos=world.ground.geometry.attributes.position;
  for(let i=0;i<pos.count;i++)if(Math.hypot(pos.getX(i),pos.getZ(i))<110)assert.equal(pos.getY(i),0);
  assert.ok(world.obstacles.length>140);world.dispose();assert.equal(scene.children.length,0);
});
test('All four teachers and the entry point are clear and reachable on foot',()=>{
  const scene=new T.Scene(),world=buildEra(scene);
  for(const point of [eraDefinition.spawn,...eraDefinition.stations])assert.equal(blocked(point,world.obstacles),false,`${point.id||'spawn'} blocked`);
  for(const station of eraDefinition.stations)assert.ok(walkRoute(eraDefinition.spawn,station,world.obstacles),`${station.id} unreachable`);
  for(const o of world.obstacles){assert.ok([o.x,o.z,o.height,o.base].every(Number.isFinite));assert.ok(o.height>0);assert.ok(o.r>0||o.hx>0&&o.hz>0);}
  world.dispose();
});
test('Quality, reduced-motion updates and disposal are safe and do not leak scene objects',()=>{
  const scene=new T.Scene();
  for(let i=0;i<3;i++){
    const world=buildEra(scene,{quality:i%2?'low':'normal'});
    world.setQuality('low');world.update(1/60,2,eraDefinition.spawn,false);world.setQuality('normal');world.update(1/60,3,eraDefinition.spawn,true);
    world.dispose();world.dispose();world.update(1/60,4,eraDefinition.spawn,false);assert.equal(scene.children.length,0);
  }
});
