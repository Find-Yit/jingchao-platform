import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../static/vendor/three/three.module.min.js';
import {CAMPS,findPath,distance} from '../static/meadow-math.mjs';
import {createMotion,stepMotion} from '../static/meadow-motion.mjs';
import {createEnvironment} from '../static/meadow-environment.mjs';
test('all five actual terrain routes reach their teachers without getting stuck',()=>{
 globalThis.document={createElement(){return {width:0,height:0,getContext(){return {createRadialGradient(){return {addColorStop(){}};},fillRect(){}};}};}};
 const environment=createEnvironment(new T.Scene(),CAMPS);
 try{
  for(const camp of CAMPS){
   const m=createMotion(),goal={x:camp.x+3,z:camp.z+9.3},path=findPath(m,goal,environment.navigationObstacles);
   assert.ok(path.length,camp.id+' must have a route');
   let frame=0;
   while(path.length&&frame++<60*90){
    const target=path[0],d=distance(m,target);
    if(d<.7){path.shift();continue;}
    const slow=path.length===1&&d<2?Math.max(.25,d/2):1;
    stepMotion(m,{x:(target.x-m.x)/d*slow,z:(target.z-m.z)/d*slow,jumpHeld:false},1/60,environment.obstacles);
   }
   for(let i=0;i<60;i++)stepMotion(m,{},1/60,environment.obstacles);
   assert.equal(path.length,0,camp.id+' navigation finished');
   assert.ok(distance(m,goal)<1,camp.id+' reached destination');
   assert.ok(m.grounded,camp.id+' stands on terrain');
   assert.equal(m.jumps,0);
  }
 }finally{environment.dispose();delete globalThis.document;}
});
