import {clamp,terrainHeight,BOUND} from './meadow-math.mjs?v=5.0';
export const WALK_SPEED=4.4,RUN_SPEED=8.4,JUMP_SPEED=8.5,GRAVITY=22,BODY_HEIGHT=2.04;
export const angleDelta=(a,b)=>Math.atan2(Math.sin(b-a),Math.cos(b-a));
export const damp=(a,b,rate,dt)=>b+(a-b)*Math.exp(-rate*dt);
export function createMotion(position={x:0,z:22}){
 return {x:position.x,z:position.z,y:terrainHeight(position.x,position.z),vx:0,vz:0,vy:0,heading:Math.PI,grounded:true,jumpBuffer:0,landing:0,turn:0,speed:0,jumps:0};
}
export function overlaps(x,z,o,padding=0){
 const dx=x-o.x,dz=z-o.z;
 if(o.hx!==undefined){const a=o.ry||0,c=Math.cos(a),s=Math.sin(a),lx=dx*c-dz*s,lz=dx*s+dz*c;
  return Math.hypot(Math.max(0,Math.abs(lx)-o.hx),Math.max(0,Math.abs(lz)-o.hz))<padding+.0001;
 }return Math.hypot(dx,dz)<o.r+padding;
}
const bottom=o=>o.base??terrainHeight(o.x,o.z);
const top=o=>bottom(o)+(o.height??30);
export function groundAt(x,z,feet,obstacles,height=terrainHeight){
 let h=height(x,z);for(const o of obstacles)if(o.walkable&&overlaps(x,z,o,.12)&&feet>=top(o)-.25)h=Math.max(h,top(o));return h;
}
const blocks=(o,x,z,feet,padding)=>overlaps(x,z,o,padding)&&((o.water&&feet<top(o))||(!o.water&&feet<top(o)-.23&&feet+BODY_HEIGHT>bottom(o)+.025));
export function solidAt(x,z,feet,obstacles,padding=.38){
 if(Math.abs(x)>BOUND||Math.abs(z)>BOUND)return true;
 return obstacles.some(o=>blocks(o,x,z,feet,padding));
}
// 到障碍物边缘的水平距离：在外面为正，在里面为负
export function signedDistance(x,z,o){
 const dx=x-o.x,dz=z-o.z;if(o.hx===undefined)return Math.hypot(dx,dz)-o.r;
 const a=o.ry||0,c=Math.cos(a),s=Math.sin(a),qx=Math.abs(dx*c-dz*s)-o.hx,qz=Math.abs(dx*s+dz*c)-o.hz;
 return Math.hypot(Math.max(qx,0),Math.max(qz,0))+Math.min(Math.max(qx,qz),0);
}
// 离开障碍物最近的水平方向（单位向量）
function outward(x,z,o){
 const dx=x-o.x,dz=z-o.z;
 if(o.hx===undefined){const d=Math.hypot(dx,dz);return d>1e-6?[dx/d,dz/d]:[0,1];}
 const a=o.ry||0,c=Math.cos(a),s=Math.sin(a),lx=dx*c-dz*s,lz=dx*s+dz*c,qx=Math.abs(lx)-o.hx,qz=Math.abs(lz)-o.hz;
 let nx,nz;if(qx>0||qz>0){nx=Math.max(qx,0)*Math.sign(lx);nz=Math.max(qz,0)*Math.sign(lz);}else if(qx>qz){nx=Math.sign(lx)||1;nz=0;}else{nx=0;nz=Math.sign(lz)||1;}
 const n=Math.hypot(nx,nz);nx/=n;nz/=n;return [nx*c+nz*s,-nx*s+nz*c];
}
const PAD=.38,PUSH_SPEED=12;
export function queueJump(motion){motion.jumpBuffer=.13;}
export function stepMotion(m,input,dt,obstacles=[],height=terrainHeight){
 dt=clamp(dt,0,.08);const steps=Math.max(1,Math.ceil(dt/(1/120))),hdt=dt/steps;
 const nearby=obstacles.filter(o=>{const dx=o.x-m.x,dz=o.z-m.z,R=o.r+4;return dx*dx+dz*dz<R*R;});
 for(let step=0;step<steps;step++){
  m.landing=damp(m.landing,0,12,hdt);
  const press=(x,z,feet)=>{const r={count:0,sum:0,ux:0,uz:0,worst:null,deepest:0};for(const o of nearby)if(blocks(o,x,z,feet,PAD)){const d=Math.max(1e-4,PAD+1e-4-signedDistance(x,z,o)),[a,b]=outward(x,z,o);r.count++;r.sum+=d;r.ux+=a;r.uz+=b;if(!r.worst||d>r.deepest){r.worst=o;r.deepest=d;}}return r;};
  // 走动的恐龙等移动障碍物压到人物身上时，把人推出去，而不是原地卡住。
  // 一只恐龙由多个互相重叠的碰撞体组成：先试让总重叠下降最快的方向和最深那个碰撞体的外侧，不行再试 8 个方向，取重叠减少最多的
  const pressed=press(m.x,m.z,m.y);
  if(pressed.count){const step=Math.min(pressed.deepest+.01,PUSH_SPEED*hdt),n=Math.hypot(pressed.ux,pressed.uz),dirs=[];
   if(n>1e-6)dirs.push([pressed.ux/n,pressed.uz/n]);dirs.push(outward(m.x,m.z,pressed.worst));for(let k=0;k<8;k++)dirs.push([Math.cos(k*Math.PI/4),Math.sin(k*Math.PI/4)]);
   let best=null,bestSum=pressed.sum-1e-6;
   for(const [ux,uz] of dirs){const px=m.x+ux*step,pz=m.z+uz*step;if(Math.abs(px)>BOUND||Math.abs(pz)>BOUND)continue;const q=press(px,pz,m.y);
    if(!q.count){best=[px,pz];break;}if(q.sum<bestSum){bestSum=q.sum;best=[px,pz];}}
   if(best){m.x=best[0];m.z=best[1];}}
  if(m.jumpBuffer>0){m.vy=JUMP_SPEED;m.grounded=false;m.jumpBuffer=0;m.jumps++;}
  const length=Math.hypot(input.x||0,input.z||0),speed=input.run?RUN_SPEED:WALK_SPEED;
  const targetX=(input.x||0)/Math.max(1,length)*speed,targetZ=(input.z||0)/Math.max(1,length)*speed,rate=m.grounded?(length>.04?9:14):5;
  m.vx=damp(m.vx,targetX,rate,hdt);m.vz=damp(m.vz,targetZ,rate,hdt);
  if(Math.abs(m.vx)<.002)m.vx=0;if(Math.abs(m.vz)<.002)m.vz=0;
  const dx=m.vx*hdt,dz=m.vz*hdt,oldX=m.x,oldZ=m.z,nx=m.x+dx,nz=m.z+dz;
  // 没被压住时照常判断能不能走；已经被压住时，只要重叠在减少就让人走（朝离开的方向）
  const here=pressed.count?press(m.x,m.z,m.y):pressed;
  const can=(x,z)=>{if(Math.abs(x)>BOUND||Math.abs(z)>BOUND||(m.grounded&&height(x,z)-height(m.x,m.z)>=.3))return false;
   if(!here.count)return !nearby.some(o=>blocks(o,x,z,m.y,PAD));const q=press(x,z,m.y);return !q.count||q.sum<here.sum-1e-9;};
  if(can(nx,nz)){m.x=nx;m.z=nz;}else{if(can(nx,m.z))m.x=nx;else m.vx=0;if(can(m.x,nz))m.z=nz;else m.vz=0;}
  const ground=groundAt(m.x,m.z,m.y,nearby,height);
  if(m.grounded&&m.y-ground<.32&&m.y-ground>-.26){m.y=ground;m.vy=0;}else{
   m.grounded=false;const oldY=m.y;
   const gliding=input.jumpHeld&&m.vy<0;m.vy-=GRAVITY*hdt*(gliding?.22:m.vy>2&&!input.jumpHeld?1.35:1);
   if(gliding)m.vy=Math.max(m.vy,-2.6);
   m.y+=m.vy*hdt;
   // Sweep the character's full height against ceilings; falling lands on solids.
   if(m.vy>0)for(const o of nearby)if(!o.water&&overlaps(m.x,m.z,o,.30)&&oldY+BODY_HEIGHT<=bottom(o)+.04&&m.y+BODY_HEIGHT>=bottom(o)){m.y=bottom(o)-BODY_HEIGHT-.01;m.vy=0;}
   let floor=height(m.x,m.z);
   if(m.vy<=0)for(const o of nearby)if(!o.water&&overlaps(m.x,m.z,o,.12)&&oldY>=top(o)-.04&&m.y<=top(o))floor=Math.max(floor,top(o));
   if(m.y<=floor&&m.vy<=0){m.landing=clamp(-m.vy/12,0,1);m.y=floor;m.vy=0;m.grounded=true;}
  }
  const actual=Math.hypot(m.x-oldX,m.z-oldZ)/Math.max(hdt,.000001);m.speed=damp(m.speed,actual,14,hdt);
  if(actual>.05){const target=Math.atan2(m.vx,m.vz),delta=angleDelta(m.heading,target),rotation=delta*(1-Math.exp(-12*hdt));m.heading+=rotation;m.turn=damp(m.turn,clamp(rotation/Math.max(hdt,.000001),-5,5),12,hdt);}else m.turn=damp(m.turn,0,10,hdt);
 }return m;
}
export function cameraSafeDistance(anchor,end,obstacles,height=terrainHeight){
 const length=Math.hypot(end.x-anchor.x,end.y-anchor.y,end.z-anchor.z),samples=Math.ceil(length/.25);
 // 只保留离镜头视线足够近、高度上可能相交的障碍物（结果与逐个检查完全相同）
 const ax=anchor.x,az=anchor.z,ex=end.x-ax,ez=end.z-az,e2=ex*ex+ez*ez,minY=Math.min(anchor.y,end.y),maxY=Math.max(anchor.y,end.y);
 const nearby=obstacles.filter(o=>{if(o.water||bottom(o)-.1>maxY||top(o)+.25<minY)return false;
  const px=o.x-ax,pz=o.z-az,t=e2>0?Math.max(0,Math.min(1,(px*ex+pz*ez)/e2)):0,dx=px-ex*t,dz=pz-ez*t,R=(o.hx!==undefined?Math.sqrt(o.hx*o.hx+o.hz*o.hz):o.r)+.26;
  return dx*dx+dz*dz<R*R;});
 for(let i=3;i<=samples;i++){
  const t=i/samples,x=anchor.x+(end.x-anchor.x)*t,y=anchor.y+(end.y-anchor.y)*t,z=anchor.z+(end.z-anchor.z)*t;
  if(y<height(x,z)+.4||nearby.some(o=>overlaps(x,z,o,.25)&&y>bottom(o)-.1&&y<top(o)+.25))return Math.max(.75,length*(i-1)/samples-.18);
 }return length;
}
