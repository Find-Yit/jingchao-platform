import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../static/vendor/three/three.module.min.js';
import {buildEra,eraDefinition} from '../static/era-dinosaurs.mjs';

// 与 era-world / meadow-motion 相同的阻挡判定：base>=1.8 或很矮的东西不挡路；盒子支持 ry 旋转
function blocks(p,o,pad=.4){
 if(o.base>=1.8||o.base+o.height<.1)return false;
 if(o.hx!==undefined){const a=o.ry||0,c=Math.cos(a),s=Math.sin(a),dx=p.x-o.x,dz=p.z-o.z,lx=dx*c-dz*s,lz=dx*s+dz*c;return Math.hypot(Math.max(0,Math.abs(lx)-o.hx),Math.max(0,Math.abs(lz)-o.hz))<pad;}
 return Math.hypot(p.x-o.x,p.z-o.z)<o.r+pad;
}
const blocked=(p,obstacles,pad)=>obstacles.some(o=>blocks(p,o,pad));
// 网格广度优先搜索：只走地面，不跳不飞
function walkRoute(start,end,obstacles,bound=eraDefinition.bounds){
 const step=1,near=obstacles.filter(o=>!(o.base>=1.8||o.base+o.height<.1)),key=(x,z)=>x*10000+z,goal={x:Math.round(end.x/step),z:Math.round(end.z/step)},first={x:Math.round(start.x/step),z:Math.round(start.z/step)},queue=[first],seen=new Set([key(first.x,first.z)]);
 for(let i=0;i<queue.length;i++){
  const p=queue[i];if(Math.hypot(p.x-goal.x,p.z-goal.z)<=1)return true;
  for(const [dx,dz] of[[1,0],[-1,0],[0,1],[0,-1]]){const n={x:p.x+dx,z:p.z+dz},k=key(n.x,n.z),w={x:n.x*step,z:n.z*step};if(seen.has(k)||Math.abs(w.x)>bound-1||Math.abs(w.z)>bound-1||blocked(w,near,.42))continue;seen.add(k);queue.push(n);}
 }
 return false;
}
function stats(scene){let meshes=0,triangles=0,instances=0;scene.traverse(o=>{if(!o.isMesh&&!o.isPoints)return;meshes++;const g=o.geometry,p=g.attributes.position;triangles+=(g.index?.count??p.count)/3*(o.isInstancedMesh?o.count:1);if(o.isInstancedMesh)instances+=o.count;});return {meshes,triangles,instances};}
function transforms(scene){scene.updateMatrixWorld(true);const values=[];scene.traverse(o=>values.push(...o.matrix.elements));return values;}

test('learning content keeps the cross-period exhibit stance and valid questions',()=>{
 assert.equal(eraDefinition.id,'dinosaurs');assert.equal(eraDefinition.stations.length,4);
 assert.match(eraDefinition.description,/不同时期/);assert.match(eraDefinition.period,/跨时期/);
 assert.deepEqual(eraDefinition.stations.map(s=>[s.id,s.x,s.z]),[['giants',10,-7],['plates',-20,-9],['wings',40,22],['fossils',-35,34]]);
 assert.deepEqual(eraDefinition.spawn,{x:0,z:37});assert.equal(eraDefinition.bounds,110);
 for(const s of eraDefinition.stations){assert.equal(s.challenge.options.length,3);assert.ok(s.challenge.answer>=0&&s.challenge.answer<3);assert.ok(s.sources.every(x=>/^https:\/\//.test(x.url)));}
});

test('scene geometry is finite, batched and inside the triangle budget',()=>{
 const scene=new T.Scene(),era=buildEra(scene);
 scene.traverse(o=>{if(!o.isMesh&&!o.isPoints)return;const p=o.geometry.attributes.position;assert.ok(p.array.every(Number.isFinite),o.name||o.type);o.geometry.computeBoundingBox();assert.ok(!o.geometry.boundingBox.isEmpty());if(o.isInstancedMesh)assert.ok(o.instanceMatrix.array.every(Number.isFinite));});
 const s=stats(scene);
 assert.ok(s.meshes<250,`${s.meshes} mesh objects`);assert.ok(s.triangles<1500000,`${s.triangles} triangles`);assert.ok(s.instances>5000,'vegetation is instanced');
 // 多种中生代植物都在场景里
 for(const k of['araucaria','conifer','ginkgo','treeFern','cycad','horsetail','fern','moss'])assert.ok(era.metrics.plants[k]>10,`${k} present`);
 assert.ok(era.metrics.dinosaurs>=10&&era.metrics.flyingReptiles>=4);
 let skinned=0;scene.traverse(o=>{if(o.isSkinnedMesh){skinned++;assert.ok(o.skeleton.bones.length>6);}});assert.ok(skinned>=15,'animals use smooth skinned bodies');
 era.dispose();
});

test('walkable valley floor stays flat at y=0 inside the bounds',()=>{
 const scene=new T.Scene(),era=buildEra(scene),p=era.ground.geometry.attributes.position;
 for(let i=0;i<p.count;i++)if(Math.abs(p.getX(i))<=eraDefinition.bounds+2&&Math.abs(p.getZ(i))<=eraDefinition.bounds+2)assert.equal(p.getY(i),0);
 era.dispose();
});

test('spawn, guides and teleport landings are clear; every station is reachable on foot',()=>{
 for(const quality of['high','low']){
  const scene=new T.Scene(),era=buildEra(scene,{quality}),obs=era.obstacles;
  for(const o of obs){assert.ok([o.x,o.z,o.base,o.height].every(Number.isFinite));assert.ok(o.height>0);assert.ok(o.r>0||(o.hx>0&&o.hz>0));}
  // 与 era-world 的 safeSpot 相同的 0.65 余量
  assert.equal(blocked(eraDefinition.spawn,obs,.65),false,'spawn blocked');
  for(const s of eraDefinition.stations){
   assert.equal(blocked(s,obs,.65),false,`${s.id} guide blocked`);
   assert.equal(blocked({x:s.x,z:s.z+3.3},obs,.65),false,`${s.id} landing blocked`);
   assert.ok(walkRoute(eraDefinition.spawn,{x:s.x,z:s.z+3.3},obs),`${s.id} landing unreachable`);
   assert.ok(walkRoute(eraDefinition.spawn,s,obs),`${s.id} guide unreachable`);
  }
  assert.ok(obs.some(o=>o.base>8),'elevated neck colliders protect airborne exploration');
  assert.ok(obs.some(o=>o.water),'lake and river are solid water');
  era.dispose();
 }
});

test('quality toggle lightens the scene and restores exactly',()=>{
 const scene=new T.Scene(),era=buildEra(scene),counts=()=>{const c=[];scene.traverse(o=>{if(o.isInstancedMesh)c.push(o.count);});return c;},sum=a=>a.reduce((x,y)=>x+y,0);
 const full=counts();era.setQuality('low');const low=counts();assert.ok(sum(low)<sum(full)*.65,'low quality removes most small instances');
 let hidden=0;scene.traverse(o=>{if(!o.visible)hidden++;});assert.ok(hidden>0,'decorative effects hidden on low');
 era.setQuality('high');assert.deepEqual(counts(),full);era.dispose();
});

test('animals and flights animate, reduced motion freezes them',()=>{
 const scene=new T.Scene(),era=buildEra(scene);
 era.update(.016,1,eraDefinition.spawn,false);const a=transforms(scene);era.update(.016,10,eraDefinition.spawn,false);assert.notDeepEqual(transforms(scene),a,'animation runs');
 era.update(.016,10,eraDefinition.spawn,true);const still=transforms(scene);era.update(.016,1000,eraDefinition.spawn,true);assert.deepEqual(transforms(scene),still,'reduced motion is static');
 era.dispose();
});

test('high and low builds run, update and dispose every resource; siblings are isolated',()=>{
 for(const quality of['high','low']){
  const scene=new T.Scene(),era=buildEra(scene,{quality});
  for(let i=0;i<5;i++)era.update(1/60,i,{x:i,z:30},false);
  era.setQuality(quality==='high'?'low':'high');era.update(1/60,6,eraDefinition.spawn,true);
  let released=0;const seen=new Set();
  scene.traverse(o=>{for(const r of[o.geometry,...(Array.isArray(o.material)?o.material:[o.material])])if(r&&!seen.has(r)){seen.add(r);r.addEventListener('dispose',()=>released++);}const map=o.material?.map||o.material?.uniforms?.map?.value;if(map&&!seen.has(map)){seen.add(map);map.addEventListener('dispose',()=>released++);}});
  assert.doesNotThrow(()=>era.dispose());assert.equal(scene.children.length,0);assert.equal(released,seen.size,'all geometries, materials and textures released');
  assert.doesNotThrow(()=>era.dispose());assert.doesNotThrow(()=>era.update(1/60,7,eraDefinition.spawn,false));
 }
 const scene=new T.Scene(),one=buildEra(scene),two=buildEra(scene);one.dispose();assert.equal(scene.children.length,1,'sibling environment survives');two.update(.016,5,eraDefinition.spawn,false);two.dispose();assert.equal(scene.children.length,0);
});
