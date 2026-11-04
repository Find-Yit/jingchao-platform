import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../static/vendor/three/three.module.min.js';
import {eraDefinition,buildEra} from '../static/era-egypt.mjs';
import {overlaps,stepMotion,createMotion,cameraSafeDistance} from '../static/meadow-motion.mjs';

function blocked(p,obstacles,pad=.4){return obstacles.some(o=>{
  if(o.base>=1.8||o.base+o.height<.1)return false;
  return o.hx===undefined?Math.hypot(p.x-o.x,p.z-o.z)<o.r+pad:Math.abs(p.x-o.x)<o.hx+pad&&Math.abs(p.z-o.z)<o.hz+pad;
});}
function walkRoute(start,end,obstacles,{path=false,midpoints=false}={}){
  const step=1.5,key=(x,z)=>`${x},${z}`,initial={x:Math.round(start.x/step),z:Math.round(start.z/step)},goal={x:Math.round(end.x/step),z:Math.round(end.z/step)},queue=[initial],seen=new Map([[key(initial.x,initial.z),null]]);
  for(let i=0;i<queue.length;i++){
    const p=queue[i];
    if(Math.hypot(p.x-goal.x,p.z-goal.z)<1.5){
      if(!path)return true;
      const out=[];for(let q=p;q;q=seen.get(key(q.x,q.z)))out.unshift({x:q.x*step,z:q.z*step});return out;
    }
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const n={x:p.x+dx,z:p.z+dz},k=key(n.x,n.z),world={x:n.x*step,z:n.z*step};
      if(seen.has(k)||Math.hypot(world.x,world.z)>109||blocked(world,obstacles))continue;
      if(midpoints&&blocked({x:(p.x+dx/2)*step,z:(p.z+dz/2)*step},obstacles))continue;
      seen.set(k,p);queue.push(n);
    }
  }
  return path?null:false;
}
// 与 era-world.mjs 相同的处理：补齐 base/r，并加上四周边界墙
function frameworkObstacles(list){
  const bound=eraDefinition.bounds,out=list.map(o=>({...o,base:o.base??0,r:o.r??Math.hypot(o.hx||0,o.hz||0)}));
  for(const o of [{x:bound+3,z:0,hx:3,hz:bound+6},{x:-bound-3,z:0,hx:3,hz:bound+6},{x:0,z:bound+3,hx:bound+6,hz:3},{x:0,z:-bound-3,hx:bound+6,hz:3}])out.push({...o,r:Math.hypot(o.hx,o.hz),base:-1,height:180});
  return out;
}
// era-world.mjs 里传送落点的判定
const safeSpot=(p,obstacles)=>Math.abs(p.x)<eraDefinition.bounds-1&&Math.abs(p.z)<eraDefinition.bounds-1&&!obstacles.some(o=>overlaps(p.x,p.z,o,.65)&&o.base<2&&o.base+o.height>0);
const flat=()=>0;
const triangles=o=>(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);

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
test('Guides, teleport landing points and the space around them stay open',()=>{
  const scene=new T.Scene(),world=buildEra(scene),obstacles=frameworkObstacles(world.obstacles);
  assert.ok(safeSpot(eraDefinition.spawn,obstacles),'spawn is not a safe landing spot');
  for(const s of eraDefinition.stations){
    // 导览员脚下不能有任何碰撞体（含水面）
    assert.ok(!obstacles.some(o=>overlaps(s.x,s.z,o,.9)&&o.base<2&&o.base+o.height>0),`${s.id} guide overlaps scenery`);
    // 传送落点必须正好可用，否则框架会把玩家挪到别处
    assert.ok(safeSpot({x:s.x,z:s.z+3.3},obstacles),`${s.id} landing point is blocked`);
    // 落点到导览员之间、以及导览员四周 2.5 m 能站人
    for(let t=0;t<=1;t+=.25)assert.equal(blocked({x:s.x,z:s.z+3.3*t},world.obstacles),false,`${s.id} path to guide blocked`);
    for(let a=0;a<8;a++)assert.equal(blocked({x:s.x+Math.cos(a*Math.PI/4)*2.5,z:s.z+Math.sin(a*Math.PI/4)*2.5},world.obstacles),false,`${s.id} ring blocked at ${a}`);
  }
  world.dispose();
});
test('The default follow camera at the spawn and each landing point is not pushed in by scenery',()=>{
  const scene=new T.Scene(),world=buildEra(scene),obstacles=frameworkObstacles(world.obstacles);
  const yaw=.11,pitch=.015,zoom=13.5;
  for(const p of [eraDefinition.spawn,...eraDefinition.stations.map(s=>({id:s.id,x:s.x,z:s.z+3.3}))]){
    const anchor={x:p.x,y:1.34,z:p.z},end={x:p.x+Math.sin(yaw)*Math.cos(pitch)*zoom,y:1.34+Math.sin(pitch)*zoom+.6,z:p.z+Math.cos(yaw)*Math.cos(pitch)*zoom};
    const full=Math.hypot(end.x-anchor.x,end.y-anchor.y,end.z-anchor.z),safe=cameraSafeDistance(anchor,end,obstacles,flat);
    assert.ok(safe>full*.95,`${p.id||'spawn'} camera pulled to ${safe.toFixed(2)} of ${full.toFixed(2)}`);
  }
  world.dispose();
});
test('The real walking physics can follow a route from the spawn to every guide',()=>{
  const scene=new T.Scene(),world=buildEra(scene),obstacles=frameworkObstacles(world.obstacles);
  for(const s of eraDefinition.stations){
    const target={x:s.x,z:s.z+3.3},route=walkRoute(eraDefinition.spawn,target,world.obstacles,{path:true,midpoints:true});
    assert.ok(route,`${s.id} has no conservative route`);route.push(target);
    const m={...createMotion(eraDefinition.spawn),y:0};let frames=0,stuck=0;
    for(const wp of route){
      while(Math.hypot(wp.x-m.x,wp.z-m.z)>.55&&frames<20000){
        const dx=wp.x-m.x,dz=wp.z-m.z,d=Math.hypot(dx,dz),before={x:m.x,z:m.z};
        stepMotion(m,{x:dx/d,z:dz/d,run:true,jumpHeld:false},1/30,obstacles,flat);frames++;
        stuck=Math.hypot(m.x-before.x,m.z-before.z)<.01?stuck+1:0;
        assert.ok(stuck<90,`${s.id}: walker stuck near ${m.x.toFixed(1)},${m.z.toFixed(1)}`);
      }
    }
    assert.ok(Math.hypot(m.x-target.x,m.z-target.z)<1,`${s.id}: walker ended at ${m.x.toFixed(1)},${m.z.toFixed(1)}`);
    assert.ok(Math.abs(m.y)<.3,`${s.id}: walker climbed onto scenery (${m.y.toFixed(2)})`);
  }
  world.dispose();
});
test('High and low quality both build, animate, lighten the load and dispose every resource',()=>{
  for(const quality of ['high','low']){
    const scene=new T.Scene(),world=buildEra(scene,{quality}),resources=new Set(),disposed=new Set(),instanced=[];
    let meshes=0;
    scene.traverse(o=>{
      if(o.isMesh||o.isPoints)meshes++;if(o.isInstancedMesh)instanced.push(o);
      if(o.geometry)resources.add(o.geometry);for(const m of [].concat(o.material||[]))resources.add(m);
    });
    for(const r of resources)r.addEventListener('dispose',()=>disposed.add(r));
    const load=()=>{let n=0;scene.traverse(o=>{if(o.isMesh)n+=triangles(o);});return n;};
    world.setQuality('high');const high=load();world.setQuality('low');const lowLoad=load();world.setQuality(quality);
    assert.ok(meshes<110,`${quality}: ${meshes} meshes`);
    assert.ok(high<900000,`${high} triangles before shadows`);
    assert.ok(lowLoad<high*.85,`low quality only reduced ${high} → ${lowLoad}`);
    for(let i=0;i<150;i++)world.update(1/30,i*.9,eraDefinition.spawn,false);
    for(const o of instanced)assert.ok(o.instanceMatrix.array.every(Number.isFinite),`${o.name} has invalid animated matrices`);
    world.update(1/30,200,eraDefinition.spawn,true);
    world.dispose();
    assert.equal(scene.children.length,0);
    const missed=[...resources].filter(r=>!disposed.has(r));
    assert.equal(missed.length,0,`${quality}: ${missed.length} geometries/materials not disposed`);
    world.dispose();world.update(1/30,201,eraDefinition.spawn,false);
  }
});
// 从高处落下，按真实物理一直落到站稳为止
function dropOnto(x,z,obstacles,y=70){
  const m={...createMotion({x,z}),y,grounded:false};
  for(let i=0;i<900&&!(m.grounded&&i>5);i++)stepMotion(m,{x:0,z:0,run:false,jumpHeld:false},1/30,obstacles,flat);
  for(let i=0;i<20;i++)stepMotion(m,{x:0,z:0,run:false,jumpHeld:false},1/30,obstacles,flat);
  return m;
}
test('Flying onto the pyramids lands on each stone course and on the smooth casing, neither sunk in nor floating',()=>{
  const scene=new T.Scene(),world=buildEra(scene),obstacles=frameworkObstacles(world.obstacles);
  // 与 buildEra 里的金字塔参数一致：x,z,底边,高,层数,外壳起始层
  for(const [name,px,pz,size,height,layers,casing] of [['Khufu',0,-41,68,46,40,31],['Khafre',-70,-64,47,32,29,22],['queen',46,-49,12,8.5,12,9]]){
    const dy=height/layers,half=size/2*(1+1/layers);
    for(let row=1;row<layers-1;row+=Math.max(1,Math.floor(layers/9))){
      // 取这一级台阶面（或外壳斜面）的中间位置落下
      const d=(size*(1-row/layers)/2+size*(1-(row+1)/layers)/2)/2;
      // 外壳从 casing 层起向上，盖住下面一级台阶的顶面
      const stepped=row<casing-1,expect=stepped?(row+1)*dy:(half-d)*height/(size/2);
      for(const [dx,dz] of [[0,d],[-d,0],[d*.4,-d]]){
        const m=dropOnto(px+dx,pz+dz,obstacles);
        assert.ok(m.grounded,`${name} row ${row}: not standing`);
        assert.ok(Math.abs(m.y-expect)<(stepped?.05:.45),`${name} row ${row} at ${dx.toFixed(1)},${dz.toFixed(1)}: landed at ${m.y.toFixed(2)}, surface ${expect.toFixed(2)}`);
      }
    }
    const top=dropOnto(px,pz,obstacles);assert.ok(top.y>height*.97&&top.y<height*(1+1/layers)+.3,`${name} apex landing ${top.y.toFixed(2)}`);
  }
  world.dispose();
});
test('The Sphinx, temple, obelisks, tombs, houses, palms and dunes can be stood on at their real height',()=>{
  const scene=new T.Scene(),world=buildEra(scene),obstacles=frameworkObstacles(world.obstacles);
  for(const [name,x,z,lo,hi] of [['sphinx back',29,11,4.6,5.3],['sphinx rump',29,8.2,4.3,5],['sphinx chest',29,17.2,6.1,6.9],['sphinx head',29,19.9,9.7,10.15],['sphinx paw',31.05,24,1.4,2],
    ['hall roof',-56,12,8.4,8.6],['colonnade roof',-45.3,12,8.2,8.4],['obelisk tip',-37.4,6.4,9.6,10.2],['granary dome',-47.5,30.6,3.6,4],['scribe awning',-37.5,33,3.2,3.6],['big dune',-99,-102,6.6,7.1],['Menkaure capstone',68,-74,26.4,27]]){
    const m=dropOnto(x,z,obstacles);assert.ok(m.grounded&&m.y>=lo&&m.y<=hi,`${name}: landed at ${m.y.toFixed(2)} (want ${lo}–${hi})`);
  }
  // 棕榈树冠：能落在树冠上，且树冠碰撞体不挡地面行走
  const crowns=world.obstacles.filter(o=>o.canopy);assert.ok(crowns.length>40,`${crowns.length} tree crowns`);
  for(const c of crowns){assert.ok(c.base>=1.8,'a crown blocks walking');assert.ok(c.walkable);}
  const c=crowns.find(o=>Math.hypot(o.x+11.8,o.z-45.6)<1.5)||crowns[0],m=dropOnto(c.x,c.z,obstacles);
  assert.ok(Math.abs(m.y-(c.base+c.height))<.05,`palm crown landing ${m.y.toFixed(2)}`);
  world.dispose();
});
test('Low dunes can be climbed on foot, and walking off a roof drops back to the sand',()=>{
  const scene=new T.Scene(),world=buildEra(scene),obstacles=frameworkObstacles(world.obstacles);
  const m={...createMotion({x:-78,z:-100}),y:0};let peak=0;
  for(let i=0;i<400;i++){const dx=-99-m.x,dz=-102-m.z,d=Math.hypot(dx,dz);if(d<.4)break;stepMotion(m,{x:dx/d,z:dz/d,run:false,jumpHeld:false},1/30,obstacles,flat);peak=Math.max(peak,m.y);}
  assert.ok(peak>6.5,`walked up the dune only to ${peak.toFixed(2)}`);
  const r=dropOnto(-56,12,obstacles);for(let i=0;i<200;i++)stepMotion(r,{x:1,z:0,run:true,jumpHeld:false},1/30,obstacles,flat);
  assert.ok(r.y<.05&&r.x>-44,`walking off the hall roof ended at ${r.x.toFixed(1)}, y ${r.y.toFixed(2)}`);
  world.dispose();
});
