import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../static/vendor/three/three.module.min.js';
import {buildEra,eraDefinition} from '../static/era-dinosaurs.mjs';
const TAU=Math.PI*2;

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

// ───────── 碰撞与外形一致：从高处落下，落脚高度与看得见的表面比较 ─────────
import {createMotion,stepMotion} from '../static/meadow-motion.mjs';
const asWorld=obs=>obs.map(o=>({...o,base:o.base??0,r:o.r??Math.hypot(o.hx||0,o.hz||0)}));// 与 era-world 相同的复制方式
function drop(x,z,obs,y=60){const m={...createMotion({x,z}),y,grounded:false};for(let i=0;i<700&&!m.grounded;i++)stepMotion(m,{x:0,z:0},1/60,obs,()=>0);return m;}
const FOOT=[[0,0],[.35,0],[-.35,0],[0,.35],[0,-.35],[.25,.25],[-.25,.25],[.25,-.25],[-.25,-.25]];// 人物脚下约 0.35 米半径
function surface(x,z,targets){const rc=new T.Raycaster(),down=new T.Vector3(0,-1,0);let top=-Infinity;for(const [dx,dz] of FOOT){rc.set(new T.Vector3(x+dx,90,z+dz),down);const h=rc.intersectObjects(targets,false)[0];if(h)top=Math.max(top,h.point.y);}return top;}
// 落点相对表面：高出 0.6 米以上算“站在空气上”，低于 1.2 米以上算“埋进去”
function fitStats(samples){let n=0,ok=0,gross=0;for(const {land,top} of samples){if(land<.3)continue;n++;const d=land-top;if(d<=.6&&d>=-1.2)ok++;if(d>2.2||d<-2.6)gross++;}return {n,ok:n?ok/n:1,gross:n?gross/n:0};}
let seed=17;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;

test('tree crowns, rocks, tent roof and strata can be stood on without floating or sinking',()=>{
 const scene=new T.Scene(),era=buildEra(scene),obs=asWorld(era.obstacles);scene.updateMatrixWorld(true);
 const m4=new T.Matrix4(),p=new T.Vector3(),q=new T.Quaternion(),s=new T.Vector3(),byKind={};
 scene.traverse(o=>{if(o.isInstancedMesh&&['araucaria','araucariaYoung','conifer','ginkgo','rock0','rock1','mesa'].includes(o.name))(byKind[o.name]??=[]).push(o);});
 assert.deepEqual(Object.keys(byKind).sort(),['araucaria','araucariaYoung','conifer','ginkgo','mesa','rock0','rock1']);
 const limits={araucaria:[.75,.05],araucariaYoung:[.45,.12],conifer:[.6,.05],ginkgo:[.6,.05],rock0:[.9,0],rock1:[.9,0],mesa:[.75,.05]};
 for(const [kind,meshes] of Object.entries(byKind)){const samples=[];
  for(const o of meshes)for(let i=0;i<o.count&&i<6;i++){o.getMatrixAt(i,m4);m4.decompose(p,q,s);if(Math.abs(p.x)>104||Math.abs(p.z)>104)continue;const mine=obs.filter(b=>Math.hypot(b.x-p.x,b.z-p.z)<.01);if(!mine.length)continue;
   const R=Math.max(...mine.map(b=>b.r)),one=new T.Mesh(o.geometry,o.material);one.matrixAutoUpdate=false;one.matrixWorld.copy(m4);
   // 树冠正中一定能站住，而且就站在树顶附近
   if(kind!=='rock0'&&kind!=='rock1'){const top=drop(p.x,p.z,mine);assert.ok(top.y>2,`${kind} crown top is standable`);}
   for(let k=0;k<12;k++){const a=rnd()*TAU,r=Math.sqrt(rnd())*R,l=drop(p.x+Math.cos(a)*r,p.z+Math.sin(a)*r,mine);samples.push({land:l.y,top:surface(l.x,l.z,[one])});}}
  const st=fitStats(samples),[minOk,maxGross]=limits[kind];
  assert.ok(st.n>20,`${kind}: enough landings (${st.n})`);
  assert.ok(st.ok>=minOk,`${kind}: ${(st.ok*100).toFixed(0)}% of landings sit on the visible surface`);
  assert.ok(st.gross<=maxGross,`${kind}: ${(st.gross*100).toFixed(0)}% gross mismatches`);
 }
 const camp=[];scene.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh&&!o.isSkinnedMesh&&o.material.type==='MeshStandardMaterial'&&o!==era.ground)camp.push(o);});
 // 化石营地遮阳棚：棚顶分层，正中站在屋脊上，檐口站在低处；棚下照常能走
 const tent={x:-26,z:24.5,ry:-.35},at=(lx,lz)=>[tent.x+lx*Math.cos(tent.ry)+lz*Math.sin(tent.ry),tent.z-lx*Math.sin(tent.ry)+lz*Math.cos(tent.ry)];
 for(const [lx,lz,lo,hi] of[[0,0,2.7,3.05],[1.2,.8,2.35,2.75],[-1.5,1.45,2.15,2.5]]){const [x,z]=at(lx,lz),l=drop(x,z,obs,20),top=surface(x,z,camp);assert.ok(l.y>lo&&l.y<hi,`tent roof at ${lx},${lz}: ${l.y.toFixed(2)}`);assert.ok(Math.abs(l.y-top)<.45,`tent roof matches canvas (${l.y.toFixed(2)} vs ${top.toFixed(2)})`);}
 {const [x,z]=at(0,1.2);assert.ok(!obs.some(o=>o.base<2.05&&o.base+o.height>.3&&blocks({x,z},o,.38)),'walking under the awning is not blocked');}
 // 地层剖面：坡顶和背坡能站，高度与岩面一致
 const S={x:-55.5,z:15.5,ry:-2.5},samples=[];for(let k=0;k<160;k++){const lx=(rnd()-.5)*20,lz=rnd()*11,x=S.x+lx*Math.cos(S.ry)+lz*Math.sin(S.ry),z=S.z-lx*Math.sin(S.ry)+lz*Math.cos(S.ry),l=drop(x,z,obs,30);samples.push({land:l.y,top:surface(l.x,l.z,camp)});}
 const st=fitStats(samples);assert.ok(st.n>60&&st.ok>=.7&&st.gross<=.08,`strata fit ${JSON.stringify(st)}`);
 // 每帧碰撞检测的开销：障碍物总数有上限；地面层不能再有大号的隐形圆（以前霸王龙巡游区是 13 米的圆）
 assert.ok(era.obstacles.length<3000,`${era.obstacles.length} obstacles`);
 assert.ok(!era.obstacles.some(o=>!o.water&&o.r>4.6&&o.base<2.05),'no oversized invisible ground colliders');
 era.dispose();
});

test('dinosaur colliders follow the skeleton, can be stood on and survive the world copy',()=>{
 const scene=new T.Scene(),era=buildEra(scene);
 // era-world 会复制障碍物数组再用；动画更新必须写进它正在用的那一份
 era.obstacles=asWorld(era.obstacles);const live=era.obstacles,dyn=live.filter(o=>o.dyn);assert.ok(dyn.length>100,'animals have body colliders');
 era.update(1/60,1,eraDefinition.spawn,false);const a=dyn.map(o=>[o.x,o.z,o.base]);
 era.update(1/60,40,eraDefinition.spawn,false);const moved=dyn.filter((o,i)=>Math.hypot(o.x-a[i][0],o.z-a[i][1])>5).length,posed=dyn.filter((o,i)=>Math.abs(o.base-a[i][2])>.05).length;
 assert.ok(moved>15,`the patrolling T. rex carries its colliders (${moved})`);assert.ok(posed>10,`neck and head colliders follow poses (${posed})`);
 // 站到恐龙背上：落点与身体表面一致
 scene.updateMatrixWorld(true);const bodies=[];scene.traverse(o=>{if(o.isSkinnedMesh&&o.position.y<5&&Math.abs(o.position.x)<110&&Math.abs(o.position.z)<110){o.skeleton.update();bodies.push(o);}});
 const samples=[];for(const o of dyn)if(o.base>-10&&o.r>.3){const ang=rnd()*TAU,r=Math.sqrt(rnd())*o.r*.9,l=drop(o.x+Math.cos(ang)*r,o.z+Math.sin(ang)*r,live,40);if(live.some(d=>d.dyn&&Math.abs(d.base+d.height-l.y)<.02))samples.push({land:l.y,top:surface(l.x,l.z,bodies)});}
 const st=fitStats(samples);assert.ok(st.n>60&&st.ok>=.8&&st.gross<=.05,`dinosaur backs ${JSON.stringify(st)}`);
 // 长颈恐龙背上很高，能站上去
 assert.ok(samples.some(s=>s.land>6),'can stand on the sauropod');
 // 任何时刻，学习站都能步行到达（低头吃草的头颈不挡路）
 for(const t of[3,17,29,51]){era.update(1/60,t,eraDefinition.spawn,false);for(const s of eraDefinition.stations)assert.ok(walkRoute(eraDefinition.spawn,{x:s.x,z:s.z+3.3},live),`${s.id} reachable at t=${t}`);}
 // 减少动态效果时碰撞也静止
 era.update(1/60,60,eraDefinition.spawn,true);const still=dyn.map(o=>o.x+o.z+o.base);era.update(1/60,600,eraDefinition.spawn,true);assert.deepEqual(dyn.map(o=>o.x+o.z+o.base),still);
 era.dispose();
});
