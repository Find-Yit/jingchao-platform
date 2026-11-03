import test from 'node:test';
import assert from 'node:assert/strict';
import {createPetFollower} from '../static/pet-follow.mjs';
const student=(x=0,z=0)=>({x,z,y:0,heading:Math.PI,speed:0,grounded:true,jumps:0});
test('walking and running stay nearby, pause freezes, trail stays bounded',()=>{
 const f=createPetFollower({bound:1000});let p=student();f.reset(p);
 for(let i=0;i<2000;i++){p.z-=8.4/60;p.speed=8.4;const s=f.update(1/60,p);assert.ok(Math.hypot(s.x-p.x,s.z-p.z)<5);assert.ok(Number.isFinite(s.y));}
 assert.ok(f.state.speed>6);assert.ok(f.trailLength<100);const before={...f.state};f.update(0,{...p,z:p.z-1});assert.deepEqual(f.state,before);
});
test('jump, repeated flight and landing follow altitude without falling below terrain',()=>{
 const f=createPetFollower({height:(x,z)=>2+x*.08});let p={...student(),y:2};f.reset(p);
 for(let i=0;i<90;i++){p.y=2+Math.sin(i/90*Math.PI)*7;p.grounded=i===0;p.jumps=3;f.update(1/60,p);assert.ok(f.state.y>=2+f.state.x*.08);}
 assert.ok(f.state.mode==='fly');p.y=2;p.grounded=true;
 for(let i=0;i<70;i++)f.update(1/60,p);
 assert.ok(f.state.grounded);assert.ok(f.state.y<2.2);
});
test('teleport and reset place companion beside student in the same update',()=>{
 const f=createPetFollower();f.reset(student());const p=student(48,-72);const s=f.update(1/60,p);
 assert.equal(s.recalls,1);assert.ok(Math.hypot(s.x-p.x,s.z-p.z)<2);assert.equal(s.speed,0);
 f.reset(student(-80,40));assert.ok(Math.hypot(f.state.x+80,f.state.z-40)<2);
});
test('solid obstacle and low ceiling never contain the pet along corner route',()=>{
 const obstacles=[{x:0,z:-7,hx:2,hz:2,r:3,base:0,height:5},{x:5,z:-11,hx:2,hz:2,r:3,base:1.9,height:.6}];
 const f=createPetFollower({obstacles});let p=student(0,1);f.reset(p);
 const path=[[4,1],[4,-14],[0,-14]];
 for(const [x,z]of path){for(let i=0;i<280;i++){
  const dx=x-p.x,dz=z-p.z,d=Math.hypot(dx,dz);if(d<.03)break;p.heading=Math.atan2(dx,dz);const step=Math.min(d,4.4/60);p.x+=dx/d*step;p.z+=dz/d*step;p.speed=4.4;
  const s=f.update(1/60,p);assert.ok(!f.isSolid(s),'companion intersects geometry');
 }}assert.ok(Math.hypot(f.state.x-p.x,f.state.z-p.z)<5);
});
test('long runs, rotations and steep obstacle regroup remain finite',()=>{
 const obstacles=[{x:0,z:0,hx:.5,hz:5,r:6,base:0,height:8}];const f=createPetFollower({obstacles});let p=student(-2,8);f.reset(p);
 for(let i=0;i<1200;i++){p.x=Math.cos(i*.01)*7;p.z=Math.sin(i*.01)*7;p.heading=-i*.01;p.speed=4.2;const s=f.update(.05,p);assert.ok([s.x,s.y,s.z,s.heading].every(Number.isFinite));assert.ok(!f.isSolid(s));}
});
