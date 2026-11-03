import {overlaps,angleDelta,damp,groundAt} from './meadow-motion.mjs?v=6.0';

// A short breadcrumb trail retains the student's turns; it never steers through a wall.
export function createPetFollower({height=()=>0,obstacles=[],bound=205}={}){
 const radius=.36,body=1.35,spacing=1.4;
 let trail=[],cursor=0,lastLeader=null,blocked=0,total=0;
 const state={x:0,y:0,z:0,heading:Math.PI,speed:0,vy:0,grounded:true,landing:0,recalls:0,mode:'idle'};
 const floor=(x,z,feet)=>groundAt(x,z,feet,obstacles,height);
 function solid(p,shapes=obstacles){return Math.abs(p.x)>bound-.4||Math.abs(p.z)>bound-.4||shapes.some(o=>overlaps(p.x,p.z,o,radius)&&p.y<(o.base??height(o.x,o.z))+(o.height??30)-.06&&p.y+body>(o.base??height(o.x,o.z))+.025);}
 function clear(a,b){const length=Math.hypot(b.x-a.x,b.y-a.y,b.z-a.z),nearby=obstacles.filter(o=>Math.hypot(o.x-a.x,o.z-a.z)<length+(o.r??Math.hypot(o.hx||0,o.hz||0))+1),n=Math.max(1,Math.ceil(length/.12));for(let i=1;i<=n;i++){const t=i/n;if(solid({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:a.z+(b.z-a.z)*t},nearby))return false;}return true;}
 function point(leader,offset=1.3,behind=.6){const h=leader.heading??Math.PI,x=leader.x+Math.cos(h)*offset-Math.sin(h)*behind,z=leader.z-Math.sin(h)*offset-Math.cos(h)*behind;const altitude=Math.max(0,leader.y-floor(leader.x,leader.z,leader.y));return{x,z,y:floor(x,z,leader.y)+altitude+.015,heading:h};}
 function reset(leader,recall=false){
  let p=null;for(const offset of [1.3,-1.3,.8,-.8,0]){for(const behind of [.6,1.3,0]){const candidate=point(leader,offset,behind);if(!solid(candidate)){p=candidate;break;}}if(p)break;}
  p ||= {x:leader.x,y:leader.y+.02,z:leader.z,heading:leader.heading};
  Object.assign(state,p,{speed:0,vy:0,grounded:leader.grounded!==false,landing:0,mode:recall?'recall':'idle'});
  if(recall)state.recalls++;
  trail=[{x:leader.x,z:leader.z,heading:leader.heading??Math.PI,s:0}];cursor=total=blocked=0;lastLeader={...leader};return state;
 }
 function sample(s){for(let i=1;i<trail.length;i++)if(trail[i].s>=s){const a=trail[i-1],b=trail[i],t=(s-a.s)/Math.max(.001,b.s-a.s);return{x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,heading:a.heading+angleDelta(a.heading,b.heading)*t};}return trail[trail.length-1];}
 function update(dt,leader){
  if(!lastLeader)return reset(leader);dt=Math.min(Math.max(0,dt),.05);if(!dt)return state;
  const moved=Math.hypot(leader.x-lastLeader.x,leader.z-lastLeader.z);
  if(moved>12||Math.abs(leader.y-lastLeader.y)>18)return reset(leader,true);
  const tail=trail[trail.length-1],d=Math.hypot(leader.x-tail.x,leader.z-tail.z);
  if(d>.045){total+=d;trail.push({x:leader.x,z:leader.z,heading:leader.heading,s:total});}
  lastLeader={...leader};
  const target=Math.max(0,total-spacing),gap=Math.max(0,target-cursor),advance=Math.min(gap,Math.min(11,gap*6+Math.min(leader.speed||0,8.4)*.4)*dt);
  cursor+=advance;
  while(trail.length>2&&trail[1].s<cursor-2)trail.shift();
  if(trail.length>512)trail.splice(0,trail.length-512);
  const base=sample(cursor),altitude=Math.max(0,leader.y-floor(leader.x,leader.z,leader.y));
  let goal=null;
  // Stay beside the trail in open ground, tuck behind the student in narrow passages.
  for(const offset of [1.3,.7,0,-.7]){
   const x=base.x+Math.cos(base.heading)*offset,z=base.z-Math.sin(base.heading)*offset;
   const surface=floor(x,z,leader.y),y=Math.max(surface, damp(state.y,surface+altitude,leader.grounded?13:18,dt));
   const candidate={x,z,y};
   if(!solid(candidate)&&clear(state,candidate)){goal=candidate;break;}
  }
  const old={...state};
  if(goal){
   const distance=Math.hypot(goal.x-state.x,goal.z-state.z),fraction=distance?Math.min(1,11*dt/distance):1;
   const next={x:state.x+(goal.x-state.x)*fraction,z:state.z+(goal.z-state.z)*fraction,y:goal.y};
   if(clear(state,next)){Object.assign(state,next);blocked=0;}else blocked+=dt;
  }else blocked+=dt;
  // A magical regroup is explicit, rather than a hidden walk through geometry.
  if(blocked>.7||Math.hypot(state.x-leader.x,state.z-leader.z)>13)return reset(leader,true);
  state.speed=damp(state.speed,Math.hypot(state.x-old.x,state.z-old.z)/dt,14,dt);
  state.vy=(state.y-old.y)/dt;
  const ground=floor(state.x,state.z,state.y),wasGrounded=state.grounded;
  state.grounded=leader.grounded&&state.y-ground<.08;
  state.landing=!wasGrounded&&state.grounded?Math.min(1,Math.abs(old.vy)/9):damp(state.landing,0,14,dt);
  if(state.speed>.14){const direction=Math.atan2(state.x-old.x,state.z-old.z);state.heading+=angleDelta(state.heading,direction)*(1-Math.exp(-10*dt));}
  else{const look=Math.atan2(leader.x-state.x,leader.z-state.z);state.heading+=angleDelta(state.heading,look)*(1-Math.exp(-2*dt));}
  state.mode=!state.grounded?(altitude>1.8||leader.jumps>1?'fly':'jump'):state.speed>5?'run':state.speed>.16?'walk':'idle';
  return state;
 }
 return{state,reset,update,isSolid:solid,get trailLength(){return trail.length;}};
}
