// Pure movement and path helpers shared by the renderer and its tests.
export const BOUND=205;
export const CAMPS=[{id:'algorithm',x:-12,z:-21},{id:'data',x:-58,z:-65},{id:'ai',x:54,z:-52},{id:'network',x:-65,z:48},{id:'citizen',x:63,z:65}];
export const LAKE={x:-88,z:-57,r:19};
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const smooth=t=>t*t*(3-2*t);
export function rawHeight(x,z){
 const mound=(cx,cz,rx,rz,amp)=>amp*Math.exp(-(((x-cx)/rx)**2+((z-cz)/rz)**2));
 return 1.2+Math.sin(x*.021)*2.1+Math.cos(z*.023)*2.2+Math.sin((x+z)*.037)*.8
  +mound(-110,-155,70,58,27)+mound(130,-105,65,62,25)+mound(130,100,75,62,19)
  +mound(-130,105,63,77,22)+mound(0,170,87,60,16)+mound(12,29,20,20,1.4);
}
export function terrainHeight(x,z){
 let h=rawHeight(x,z);
 for(const p of CAMPS){const d=distance({x,z},p);if(d<23){const t=smooth(clamp((d-12)/11,0,1));h=h*t+rawHeight(p.x,p.z)*(1-t);}}
 const lake=distance({x,z},LAKE);if(lake<25){const t=smooth(clamp((lake-19)/6,0,1));h=-1.9*(1-t)+h*t;}
 return h;
}
export function seededRandom(seed=31){return ()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};}
export function blocked(x,z,obstacles,padding=.48){return Math.abs(x)>BOUND||Math.abs(z)>BOUND||obstacles.some(o=>Math.hypot(x-o.x,z-o.z)<o.r+padding);}
export function moveWithCollision(pos,dx,dz,obstacles){
 // Substeps prevent tunnelling when a frame takes longer than expected.
 const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.3));let x=pos.x,z=pos.z;
 for(let i=0;i<n;i++){const nx=x+dx/n,nz=z+dz/n;if(!blocked(nx,nz,obstacles)){x=nx;z=nz;}else{if(!blocked(nx,z,obstacles))x=nx;if(!blocked(x,nz,obstacles))z=nz;}}
 return {x,z};
}
export function clearLine(a,b,obstacles){const n=Math.max(1,Math.ceil(distance(a,b)/.5));for(let i=0;i<=n;i++)if(blocked(a.x+(b.x-a.x)*i/n,a.z+(b.z-a.z)*i/n,obstacles,.65))return false;return true;}
export function findPath(start,goal,obstacles){
 if(blocked(goal.x,goal.z,obstacles,.65))return [];
 if(clearLine(start,goal,obstacles))return [goal];
 const step=3,offset=204,size=137,key=(x,z)=>z*size+x,point=(x,z)=>({x:x*step-offset,z:z*step-offset}),cell=p=>({x:clamp(Math.round((p.x+offset)/step),0,size-1),z:clamp(Math.round((p.z+offset)/step),0,size-1)});
 const s=cell(start),g=cell(goal),heap=[],scores=new Map([[key(s.x,s.z),0]]),parents=new Map(),closed=new Set();
 const push=n=>{heap.push(n);let i=heap.length-1;while(i>0){const p=(i-1)>>1;if(heap[p].f<=n.f)break;heap[i]=heap[p];i=p;}heap[i]=n;};
 const pop=()=>{const first=heap[0],last=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let c=i*2+1;if(c+1<heap.length&&heap[c+1].f<heap[c].f)c++;if(heap[c].f>=last.f)break;heap[i]=heap[c];i=c;}heap[i]=last;}return first;};
 push({...s,f:distance(s,g)});let end=null;
 for(let count=0;heap.length&&count<18000;count++){
  const c=pop(),ck=key(c.x,c.z);if(closed.has(ck))continue;closed.add(ck);
  if(Math.abs(c.x-g.x)<=1&&Math.abs(c.z-g.z)<=1&&clearLine(point(c.x,c.z),goal,obstacles)){end=ck;break;}
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){if(!dx&&!dz)continue;const x=c.x+dx,z=c.z+dz;if(x<0||z<0||x>=size||z>=size)continue;const nk=key(x,z);if(closed.has(nk))continue;const a=point(c.x,c.z),b=point(x,z);if(!clearLine(a,b,obstacles))continue;const cost=scores.get(ck)+Math.hypot(dx,dz);if(cost>=(scores.get(nk)??Infinity))continue;scores.set(nk,cost);parents.set(nk,ck);push({x,z,f:cost+distance({x,z},g)});}
 }
 if(end===null)return [];
 const raw=[goal];for(let k=end;k!==undefined;k=parents.get(k))raw.push(point(k%size,Math.floor(k/size)));raw.push(start);raw.reverse();
 const result=[];for(let i=0;i<raw.length-1;){let j=raw.length-1;while(j>i+1&&!clearLine(raw[i],raw[j],obstacles))j--;result.push(raw[j]);i=j;}return result;
}
