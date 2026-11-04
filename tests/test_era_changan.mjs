import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../static/vendor/three/three.module.min.js';
import {eraDefinition,buildEra} from '../static/era-changan.mjs';

// 与 era-world / meadow-motion 相同的判定：base>=1.8 或很矮的障碍不挡路；盒子可带 ry 旋转
function hits(p,o,pad){
  if(o.base>=1.8||o.base+o.height<.1)return false;
  const dx=p.x-o.x,dz=p.z-o.z;
  if(o.hx!==undefined){const a=o.ry||0,c=Math.cos(a),s=Math.sin(a),lx=dx*c-dz*s,lz=dx*s+dz*c;return Math.hypot(Math.max(0,Math.abs(lx)-o.hx),Math.max(0,Math.abs(lz)-o.hz))<pad;}
  return Math.hypot(dx,dz)<o.r+pad;
}
const blocked=(p,obstacles,pad=.45)=>obstacles.some(o=>hits(p,o,pad));
function walkRoute(start,end,obstacles){
  const step=1,key=(x,z)=>`${x},${z}`,initial={x:Math.round(start.x/step),z:Math.round(start.z/step)},goal={x:Math.round(end.x/step),z:Math.round(end.z/step)},queue=[initial],seen=new Set([key(initial.x,initial.z)]);
  for(let i=0;i<queue.length;i++){
    const p=queue[i];if(Math.hypot(p.x-goal.x,p.z-goal.z)<1.5)return true;
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const n={x:p.x+dx,z:p.z+dz},k=key(n.x,n.z),world={x:n.x*step,z:n.z*step};
      if(seen.has(k)||Math.abs(world.x)>107||Math.abs(world.z)>107||blocked(world,obstacles))continue;
      seen.add(k);queue.push(n);
    }
  }
  return false;
}
function stats(scene){let meshes=0,triangles=0,instances=0;scene.traverse(o=>{if(!o.isMesh||!o.visible)return;meshes++;const g=o.geometry,n=(g.index?g.index.count:g.attributes.position.count)/3,c=o.isInstancedMesh?o.count:1;triangles+=n*c;instances+=c;});return {meshes,triangles,instances};}

test('长安学习内容结构完整，站点 id 与坐标保持不变',()=>{
  assert.equal(eraDefinition.id,'changan');assert.match(eraDefinition.description,/艺术化/);
  assert.deepEqual(eraDefinition.spawn,{x:0,z:43});assert.equal(eraDefinition.bounds,108);
  assert.deepEqual(eraDefinition.stations.map(s=>[s.id,s.x,s.z]),[['changan-gate',0,-9],['changan-market',-18,13],['changan-silk',20,12],['changan-build',-23,-45]]);
  for(const s of eraDefinition.stations){
    for(const k of ['title','teacher','role','intro','color'])assert.ok(typeof s[k]==='string'&&s[k].length>0,`${s.id}.${k}`);
    assert.ok(s.lesson.length>=2&&s.lesson.every(l=>l.length===2&&l.every(t=>t.length>0)));
    assert.ok(s.faq.length>=1&&s.faq.every(f=>f.length===2));
    assert.equal(s.challenge.options.length,3);assert.ok(s.challenge.answer>=0&&s.challenge.answer<3);assert.ok(s.challenge.explanation.length>0);
    assert.ok(s.sources.length>0&&s.sources.every(source=>/^https:\/\//.test(source.url)));
  }
});

test('出生点、导览员与传送落点周围是空地，并且都能步行到达',()=>{
  const scene=new T.Scene(),world=buildEra(scene);
  for(const o of world.obstacles){assert.ok([o.x,o.z,o.height,o.base].every(Number.isFinite));assert.ok(o.height>0);assert.ok(o.r>0||o.hx>0&&o.hz>0);}
  assert.equal(blocked(eraDefinition.spawn,world.obstacles,.8),false,'spawn blocked');
  for(const s of eraDefinition.stations){
    assert.equal(blocked(s,world.obstacles,1.2),false,`${s.id} 导览员位置被挡住`);
    assert.equal(blocked({x:s.x,z:s.z+3.3},world.obstacles,.9),false,`${s.id} 传送落点被挡住`);
    assert.ok(walkRoute(eraDefinition.spawn,{x:s.x,z:s.z+3.3},world.obstacles),`${s.id} 无法从出生点走到`);
  }
  world.dispose();
});

test('高/低画质都能构建，低画质明显减负，几何预算可控',()=>{
  const scene=new T.Scene(),world=buildEra(scene,{quality:'high'});
  const high=stats(scene);
  assert.ok(high.meshes<400,`${high.meshes} meshes`);assert.ok(high.triangles<1500000,`${high.triangles} triangles`);assert.ok(high.triangles>300000,'场景应有足够细节');
  world.setQuality('low');const low=stats(scene);
  assert.ok(low.triangles<high.triangles*.97,`low ${low.triangles} vs high ${high.triangles}`);assert.ok(low.meshes<high.meshes);
  world.setQuality('high');assert.deepEqual(stats(scene),high);
  const pos=world.ground.geometry.attributes.position;for(let i=0;i<pos.count;i++)assert.ok(Math.abs(pos.getY(i))<1e-9,"地面必须平坦");
  scene.traverse(o=>{if(o.isMesh&&o.geometry.boundingSphere)assert.ok(Number.isFinite(o.geometry.boundingSphere.radius),'几何体不能有 NaN');});
  world.dispose();
});

test('动画更新、减少动态效果与释放资源都安全',()=>{
  const scene=new T.Scene();
  for(const q of ['high','low']){
    const world=buildEra(scene,{quality:q});
    const seen=new Set();let released=0;
    scene.traverse(o=>{for(const r of [o.geometry,...(Array.isArray(o.material)?o.material:[o.material]),o.material?.map])if(r&&!seen.has(r)){seen.add(r);r.addEventListener('dispose',()=>released++);}});
    const snap=()=>{scene.updateMatrixWorld(true);const v=[];scene.traverse(o=>{if(o.isInstancedMesh)v.push(...o.instanceMatrix.array.slice(0,32));});return v;};
    world.update(1/60,1,eraDefinition.spawn,false);const a=snap();world.update(1/60,9,eraDefinition.spawn,false);assert.notDeepEqual(snap(),a,'行人和驼队应当移动');
    world.update(1/60,9,eraDefinition.spawn,true);const b=snap();world.update(1/60,99,eraDefinition.spawn,true);assert.deepEqual(snap(),b,'减少动态效果时应静止');
    world.setQuality(q==='low'?'high':'low');world.update(1/60,3,{x:-18,z:16},false);
    world.dispose();assert.equal(scene.children.length,0);assert.equal(released,seen.size,'所有几何体/材质/贴图都应释放');
    world.dispose();world.update(1/60,4,eraDefinition.spawn,false);
  }
  const one=buildEra(scene),two=buildEra(scene);one.dispose();assert.equal(scene.children.length,1,'另一个场景实例不受影响');two.dispose();
});
