import assert from 'node:assert/strict';
import * as T from '../static/vendor/three/three.module.min.js';
import {buildEra,eraDefinition} from '../static/era-dinosaurs.mjs';

const scene=new T.Scene();
const era=buildEra(scene);
assert.equal(eraDefinition.stations.length,4);
assert.equal(eraDefinition.id,'dinosaurs');
assert.match(eraDefinition.description,/不同时期/);
for(const station of eraDefinition.stations){
 assert.equal(station.challenge.options.length,3);
 assert.ok(station.challenge.answer>=0&&station.challenge.answer<3);
 assert.ok(station.sources.every(s=>/^https:\/\//.test(s.url)));
}
let meshes=0,drawTriangles=0,instanced=0;
scene.traverse(o=>{
 if(!o.isMesh)return;meshes++;
 const p=o.geometry.attributes.position;
 assert.ok([...p.array].every(Number.isFinite));
 o.geometry.computeBoundingBox();assert.ok(!o.geometry.boundingBox.isEmpty());
 drawTriangles+=(o.geometry.index?.count??p.count)/3*(o.isInstancedMesh?o.count:1);
 if(o.isInstancedMesh){instanced+=o.count;assert.ok([...o.instanceMatrix.array].every(Number.isFinite));}
});
assert.ok(meshes<250,'Geometry batching stays under 250 mesh objects');
assert.ok(drawTriangles<450000,'Normal scene triangle budget');
assert.ok(instanced>5000,'Vegetation uses batched instances');
const overlaps=(p,o)=>o.base<2&&o.base+o.height>.1&&(o.hx!==undefined?Math.abs(p.x-o.x)<o.hx+.6&&Math.abs(p.z-o.z)<o.hz+.6:Math.hypot(p.x-o.x,p.z-o.z)<o.r+.6);
for(const point of[eraDefinition.spawn,...eraDefinition.stations])assert.equal(era.obstacles.filter(o=>overlaps(point,o)).length,0,'Spawn and guides must be accessible');
assert.ok(era.obstacles.some(o=>o.base>8),'Elevated neck collisions protect airborne exploration');
for(const o of era.obstacles)assert.ok([o.x,o.z,o.base,o.height,o.hx??o.r,o.hz??o.r].every(Number.isFinite));
const fullCounts=[];scene.traverse(o=>{if(o.isInstancedMesh)fullCounts.push(o.count)});
era.setQuality('low');const lowCounts=[];scene.traverse(o=>{if(o.isInstancedMesh)lowCounts.push(o.count)});
assert.ok(lowCounts.reduce((a,b)=>a+b,0)<fullCounts.reduce((a,b)=>a+b,0)*.65);
era.setQuality('normal');const restoredCounts=[];scene.traverse(o=>{if(o.isInstancedMesh)restoredCounts.push(o.count)});assert.deepEqual(restoredCounts,fullCounts);
function transforms(){scene.updateMatrixWorld(true);const values=[];scene.traverse(o=>values.push(...o.matrix.elements));return values;}
era.update(.016,1,eraDefinition.spawn,false);const before=transforms();era.update(.016,10,eraDefinition.spawn,false);assert.notDeepEqual(transforms(),before,'Animals and flights animate');
era.update(.016,10,eraDefinition.spawn,true);const still=transforms();era.update(.016,1000,eraDefinition.spawn,true);assert.deepEqual(transforms(),still,'Reduced motion freezes decorative animation');
let released=0;const seen=new Set();scene.traverse(o=>{for(const resource of[o.geometry,...(Array.isArray(o.material)?o.material:[o.material])])if(resource&&!seen.has(resource)){seen.add(resource);resource.addEventListener('dispose',()=>released++);}});
era.dispose();assert.equal(scene.children.length,0);assert.equal(released,seen.size);era.dispose();assert.equal(released,seen.size,'Dispose is idempotent');
const one=buildEra(scene),two=buildEra(scene);one.dispose();assert.equal(scene.children.length,1,'Sibling environment survives');two.update(.016,5,eraDefinition.spawn,false);two.dispose();
console.log(JSON.stringify({passed:true,meshObjects:meshes,triangles:drawTriangles,instances:instanced,metrics:era.metrics,checks:['learning-data','finite-geometry','budget','station-access','elevated-colliders','quality-toggle','animation','reduced-motion','resource-release','sibling-isolation']},null,2));
