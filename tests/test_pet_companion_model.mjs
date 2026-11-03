import assert from 'node:assert/strict';
import * as T from '../static/vendor/three/three.module.min.js';
import {createPetCompanionModel} from '../static/pet-companion-model.mjs';
const metrics=[];
const matrices=model=>{model.root.updateMatrixWorld(true);const result=[];model.root.traverse(o=>result.push(...o.matrix.elements));return result;};
const firstByName=(model,name)=>{let found;model.root.traverse(o=>{if(o.name===name&&!found)found=o;});return found;};
for(const species of ['dragon','rabbit','dog','cat']){
 let lastHeight=0;
 for(const stage of [1,2,3]){
  const model=createPetCompanionModel({species,stage,level:3,nickname:'团团'}),box=new T.Box3().setFromObject(model.root);let meshCount=0,triangles=0;
  const height=box.max.y-box.min.y;assert.ok(Math.abs(box.min.y)<1e-6,'Resting feet anchor is y=0');assert.ok(height>=1.099&&height<=1.401,'Child-scale model height');assert.ok(height>lastHeight,'Growth stages become larger');lastHeight=height;
  model.root.traverse(o=>{if(!o.isMesh)return;meshCount++;const p=o.geometry.attributes.position;assert.ok([...p.array].every(Number.isFinite));assert.ok([...o.geometry.attributes.normal.array].every(Number.isFinite));triangles+=(o.geometry.index?.count??p.count)/3;assert.equal(o.material.map,null,'No external textures');});
  assert.ok(meshCount<=48,'Small draw-call budget');assert.ok(triangles<17000,'Per-companion triangle budget');assert.equal(model.metadata.meshCount,meshCount);assert.equal(model.metadata.species,species);
  assert.ok(firstByName(model,'pet:leg'));assert.ok(firstByName(model,'pet:tail'));assert.ok(firstByName(model,'pet:ear'));assert.ok(firstByName(model,'pet:eye'));
  const positions=model.root.position.clone(),rotation=model.root.rotation.clone(),scale=model.root.scale.clone();
  model.root.position.set(3,4,5);model.root.rotation.set(.2,.7,-.1);model.root.scale.setScalar(.73);const callerPosition=model.root.position.clone(),callerQuaternion=model.root.quaternion.clone(),callerScale=model.root.scale.clone();
  model.update(.016,{time:1,speed:3,grounded:true});const walking=matrices(model);model.update(.016,{time:1.2,speed:3,grounded:true});assert.notDeepEqual(matrices(model),walking,'Independent joints animate walking');
  assert.deepEqual(model.root.position,callerPosition);assert.deepEqual(model.root.quaternion.toArray(),callerQuaternion.toArray());assert.deepEqual(model.root.scale,callerScale,'Wrapper can use root.scale for teleport effects');
  for(let i=0;i<50;i++)model.update(.016,{time:2+i*.016,speed:4,grounded:false,verticalVelocity:2,flying:true});
  assert.equal(firstByName(model,'pet:wings').visible,true,'All species can deploy wings');assert.equal(firstByName(model,'pet:flight-stars').visible,true);
  model.update(.016,{time:5,speed:4,grounded:false,flying:true,reducedMotion:true});const still=matrices(model);model.update(.016,{time:900,speed:4,grounded:false,flying:true,reducedMotion:true});assert.deepEqual(matrices(model),still,'Reduced motion has a stable flight pose');
  model.update(Infinity,{time:NaN,speed:Infinity,verticalVelocity:NaN,landing:Infinity});assert.ok(matrices(model).every(Number.isFinite),'Invalid runtime numbers cannot corrupt the scene');model.update(0,null);
  for(let i=0;i<60;i++)model.update(.016,{time:20+i*.016,grounded:true,speed:0});if(species!=='dragon')assert.equal(firstByName(model,'pet:wings').visible,false,'Non-dragon wings fold away on ground');
  metrics.push({species,stage,height:Number(height.toFixed(3)),meshCount,triangles});
  model.dispose();assert.equal(model.root.children.length,0);model.dispose();model.update(.016,{time:1});
 }
}
const first=createPetCompanionModel({species:'cat',stage:'growing'}),second=createPetCompanionModel({species:'cat',stage:'growing'}),scene=new T.Scene();scene.add(first.root,second.root);
assert.equal(first.metadata.stage,2);assert.equal(firstByName(first,'pet:face').geometry,firstByName(second,'pet:face').geometry,'Sibling geometry is shared');assert.equal(firstByName(first,'pet:face').material,firstByName(second,'pet:face').material,'Immutable materials are shared');
const resources=new Set();let released=0;for(const m of [first,second])m.root.traverse(o=>{for(const resource of[o.geometry,o.material])if(resource&&!resources.has(resource)){resources.add(resource);resource.addEventListener('dispose',()=>released++);}});
first.dispose();assert.equal(scene.children.length,1);assert.equal(released,0,'First disposal preserves live sibling resources');second.update(.016,{time:4,speed:2,grounded:true});assert.ok(matrices(second).every(Number.isFinite));second.dispose();assert.equal(scene.children.length,0);assert.equal(released,resources.size,'Last model releases all used shared resources');second.dispose();assert.equal(released,resources.size);
const fallback=createPetCompanionModel({species:'not-an-animal',stage:'shining',level:NaN});assert.equal(fallback.metadata.species,'dragon');assert.equal(fallback.metadata.stage,3);assert.equal(fallback.metadata.level,1);fallback.dispose();
console.log(JSON.stringify({passed:true,metrics,checks:['four-species-three-stages','ground-anchor','finite-geometry','small-budget','independent-walk-animation','caller-root-transform-ownership','all-species-flight','reduced-motion','invalid-input-stability','fold-wings','shared-resource-lifetime','idempotent-disposal','option-normalization']},null,2));
