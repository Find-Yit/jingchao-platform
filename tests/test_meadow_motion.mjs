import test from 'node:test';
import assert from 'node:assert/strict';
import {createMotion,stepMotion,queueJump,cameraSafeDistance} from '../static/meadow-motion.mjs';
const flat=()=>0;
const actor=()=>({...createMotion({x:0,z:0}),y:0});
const run=(m,seconds,hz,input={},obs=[])=>{for(let i=0;i<seconds*hz;i++)stepMotion(m,input,1/hz,obs,flat);return m;};
test('walk acceleration and braking are gradual and stop cleanly',()=>{
 const m=actor();stepMotion(m,{z:1},1/60,[],flat);assert.ok(m.vz>0&&m.vz<1);run(m,1,60,{z:1});assert.ok(m.vz>4.3);const z=m.z;stepMotion(m,{},1/60,[],flat);assert.ok(m.vz>0&&m.z>z);run(m,1,60);assert.equal(m.vz,0);
});
test('30, 60 and 120 Hz walks cover the same distance',()=>{
 const positions=[30,60,120].map(hz=>run(actor(),3,hz,{z:1,run:true}).z);assert.ok(Math.max(...positions)-Math.min(...positions)<.025);
});
test('single jump has an arc and returns to ground',()=>{
 const m=actor();queueJump(m);let apex=0;for(let i=0;i<90;i++){stepMotion(m,{jumpHeld:i<30},1/60,[],flat);apex=Math.max(apex,m.y);}assert.ok(apex>1.4&&apex<1.8);assert.equal(m.jumps,1);assert.equal(m.y,0);assert.ok(m.grounded);
});
test('releasing jump produces a shorter hop',()=>{
 const peaks=[false,true].map(jumpHeld=>{const m=actor();queueJump(m);let peak=0;for(let i=0;i<60;i++){stepMotion(m,{jumpHeld},1/60,[],flat);peak=Math.max(peak,m.y);}return peak;});assert.ok(peaks[1]-peaks[0]>.25);
});
test('a running player cannot pass through a solid wall',()=>{
 const m=actor();run(m,2,30,{z:1,run:true},[{x:0,z:4,r:1,base:0,height:10}]);assert.ok(m.z<2.63&&m.z>2.3);
});
test('jumping onto a low shelf lands on its top',()=>{
 const m=actor(),obs=[{x:0,z:2.5,r:1.2,base:0,height:.7,walkable:true}];queueJump(m);run(m,.5,60,{z:1,jumpHeld:true},obs);run(m,.7,60,{},obs);assert.ok(m.grounded);assert.equal(m.y,.7);
});
test('walk off a shelf falls to ground instead of floating',()=>{
 const m={...actor(),z:2.5,y:.7},obs=[{x:0,z:2.5,r:1.2,base:0,height:.7,walkable:true}];run(m,1.5,60,{z:1},obs);assert.ok(m.grounded);assert.equal(m.y,0);assert.ok(m.z>5);
});
test('camera retracts before a wall and retains full distance in clear space',()=>{
 const a={x:0,y:2,z:0},b={x:0,y:3,z:10},wall=[{x:0,z:5,r:1,base:0,height:8}];assert.ok(cameraSafeDistance(a,b,wall,flat)<4);assert.ok(cameraSafeDistance(a,b,[],flat)>10);
});

test('repeated airborne jumps gain height without a jump-count limit',()=>{
 const m=actor();for(let jump=0;jump<12;jump++){queueJump(m);run(m,.2,60,{jumpHeld:true});}assert.equal(m.jumps,12);assert.ok(m.y>14);assert.ok(!m.grounded);
});
test('full body collides with the side of a high ledge',()=>{
 const m={...actor(),y:1,grounded:false},obs=[{x:0,z:2,r:1,hx:1,hz:.3,base:2,height:1,walkable:true}];run(m,.4,60,{z:1,jumpHeld:true},obs);assert.ok(m.z<1.35);
});
test('a jump cannot pass upward through a ceiling',()=>{
 const m=actor(),obs=[{x:0,z:0,r:3,hx:2,hz:2,base:3,height:.3,walkable:true}];queueJump(m);let peak=0;for(let i=0;i<60;i++){stepMotion(m,{jumpHeld:false},1/60,obs,flat);peak=Math.max(peak,m.y);}assert.ok(peak<.97);assert.ok(m.grounded);
});
test('a falling player lands on a high rooftop',()=>{
 const m={...actor(),y:8,grounded:false},obs=[{x:0,z:0,r:3,base:0,height:5,walkable:true}];run(m,1,60,{},obs);assert.ok(m.grounded);assert.equal(m.y,5);
});
test('rotated wide rocks block the visible long edge',()=>{
 const m={...actor(),x:1.8,z:-4},obs=[{x:0,z:0,r:3,hx:2.6,hz:1,ry:.1,base:0,height:1.5,walkable:true}];run(m,2,60,{z:1},obs);assert.ok(m.z<-1);
});
