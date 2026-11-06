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
test('a moving obstacle that sweeps over a standing player pushes them out instead of trapping them',()=>{
 const m=actor(),leg={x:-3,z:0,r:.8,base:0,height:3};
 // 障碍物以 3 m/s 从左边扫过人物所在的位置
 let overlapped=0;for(let i=0;i<120;i++){leg.x=-3+3*i/60;stepMotion(m,{},1/60,[leg],flat);if(Math.hypot(m.x-leg.x,m.z-leg.z)<leg.r+.3)overlapped++;}
 assert.ok(overlapped<=2,`人物被压在障碍物里 ${overlapped} 帧`);
 const box={x:0,z:0,hx:1.2,hz:.6,ry:.7,r:Math.hypot(1.2,.6),base:0,height:2.5},n=actor();n.x=.2;n.z=.1;
 run(n,.25,60,{},[box]);assert.ok(!(Math.abs((n.x)*Math.cos(.7)-(n.z)*Math.sin(.7))<1.2+.3&&Math.abs((n.x)*Math.sin(.7)+(n.z)*Math.cos(.7))<.6+.3),'应从旋转的盒子里被推出');
});
test('a player caught inside a moving obstacle can walk away from it at once',()=>{
 const m=actor(),o={x:.5,z:0,r:1,base:0,height:3},far=[{x:60,z:60,r:1,base:0,height:3}];
 const before=m.x;stepMotion(m,{x:-1},1/60,[o,...far],flat);for(let i=0;i<6;i++)stepMotion(m,{x:-1},1/60,[o],flat);
 assert.ok(m.x<before-.05,'朝远离的方向走不应被挡住');
});
test('push-out never shoves the player into a wall behind them',()=>{
 const m=actor(),wall={x:-1.2,z:0,hx:.4,hz:5,r:Math.hypot(.4,5),base:0,height:4},mover={x:1.5,z:0,r:.9,base:0,height:3};
 // 墙和移动物体之间挤得站不下人时，也不能把人推进墙里
 for(let i=0;i<90;i++){mover.x=Math.max(.6,1.5-i/60);stepMotion(m,{},1/60,[wall,mover],flat);}
 assert.ok(m.x>-1.2+.4+.3,`人物被推进墙里：x=${m.x.toFixed(2)}`);
 const w=actor();run(w,2,60,{x:-1,run:true},[wall]);assert.ok(w.x>-1.2+.4+.3,'墙仍然挡路');
});
