import test from 'node:test';
import assert from 'node:assert/strict';
import {CAMPS,LAKE,BOUND,terrainHeight,moveWithCollision,blocked,clearLine,findPath,distance} from '../static/meadow-math.mjs';
test('teacher clearings are flat',()=>{for(const c of CAMPS)assert.ok(Math.abs(terrainHeight(c.x,c.z)-terrainHeight(c.x+3,c.z+3))<.001);});
test('movement is bounded and cannot tunnel through a trunk',()=>{const obs=[{x:0,z:0,r:1}],p=moveWithCollision({x:-5,z:0},12,0,obs);assert.ok(p.x<-1);assert.ok(!blocked(p.x,p.z,obs));const edge=moveWithCollision({x:BOUND-1,z:0},20,0,[]);assert.ok(edge.x<=BOUND);});
test('diagonal movement slides around a colliding obstacle',()=>{const p=moveWithCollision({x:-2,z:0},2,2,[{x:0,z:0,r:1}]);assert.ok(p.z>1.9);assert.ok(!blocked(p.x,p.z,[{x:0,z:0,r:1}]));});
test('navigation routes around lake and every path segment is traversable',()=>{const start={x:-120,z:-57},goal={x:-55,z:-57},obs=[{...LAKE,r:20}],path=findPath(start,goal,obs);assert.ok(path.length>1);let prev=start;for(const p of path){assert.ok(clearLine(prev,p,obs));prev=p;}assert.equal(distance(path.at(-1),goal),0);});
test('navigation rejects blocked destinations and goes straight when clear',()=>{assert.deepEqual(findPath({x:0,z:0},{x:10,z:0},[{x:10,z:0,r:3}]),[]);assert.deepEqual(findPath({x:0,z:0},{x:10,z:0},[]),[{x:10,z:0}]);});
test('all five teacher entrances can be reached around camp buildings',()=>{const obs=CAMPS.map(c=>({x:c.x,z:c.z-1,r:3.7}));obs.push({...LAKE,r:19.7});for(const c of CAMPS){const start={x:0,z:10},goal={x:c.x+2.7,z:c.z+8.2},path=findPath(start,goal,obs);assert.ok(path.length);let prev=start;for(const p of path){assert.ok(clearLine(prev,p,obs));prev=p;}}});
