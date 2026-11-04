import * as T from './vendor/three/three.module.min.js';

// 原创的低多边形学习展区：不同时期的物种分区展示，并非同一生态的复原；人物都是虚拟导览员。
const fossilSource={title:'英国自然历史博物馆 · 化石如何形成',url:'https://www.nhm.ac.uk/discover/how-are-fossils-formed.html'};
const dinosaurSource={title:'澳大利亚博物馆 · 什么是恐龙',url:'https://australian.museum/learn/dinosaurs/fact-sheets/what-is-a-dinosaur/'};
const pterosaurSource={title:'英国自然历史博物馆 · 翼龙并不是恐龙',url:'https://www.nhm.ac.uk/discover/the-truth-about-pterosaurs.html'};
export const eraDefinition={
 id:'dinosaurs',title:'恐龙时代',subtitle:'风穿过蕨林，巨大的生命在呼吸。',description:'走进翡翠色的史前河谷，观察长颈恐龙、剑龙与角龙，在化石营地寻找证据。这里把不同时期的动物放进不同的虚拟学习展区，不是同一时间、同一地点的真实复原。',period:'中生代 · 跨时期虚拟学习展区',accent:'#8fc6a3',sky:'#bcd6cd',fog:'#c6dacd',sun:'#fff1d2',exposure:1.05,groundLight:'#8c8a68',spawn:{x:0,z:37},bounds:110,
 stations:[
  {id:'giants',title:'巨兽的餐桌',teacher:'林间观察员',role:'虚拟古生物导览员',x:10,z:-7,color:'#7fae91',intro:'抬头看看长颈恐龙。先观察身体，再提出一个有证据的问题。',lesson:[['身体会留下线索','蜥脚类恐龙有长颈、长尾和粗壮四肢。观察这些结构，可以提出关于取食、支撑和平衡的假设。'],['先观察，再验证','“脖子长”是能看到的特征；“一定吃某棵树的叶子”还需要牙齿、植物和其他化石证据。场景中的颜色与动作是艺术设计。']],faq:[['它的颜色真的如此吗？','这里的皮肤颜色是艺术设计。某些化石能保存颜色线索，但不能据此确定所有恐龙的颜色。'],['为什么长得这么大？','不同恐龙的体形差异很大。这里展示的是大型长颈恐龙的概念形象，并不代表所有恐龙都巨大。']],challenge:{prompt:'哪一句是我们在场景里能直接观察到的事实？',options:['这只长颈恐龙的颈部很长','所有恐龙都吃树叶','它一定和三角龙生活在同一个年代'],answer:0,explanation:'观察要区分看见的特征与进一步的推测；不同类群和时代也不能混为一谈。'},sources:[dinosaurSource]},
  {id:'plates',title:'背板里的秘密',teacher:'岩谷研究员',role:'虚拟古生物导览员',x:-20,z:-9,color:'#b9a47e',intro:'剑龙的轮廓很好认：沿着背部，找一找一块块高高的骨板。',lesson:[['看特征，做分类','剑龙属于恐龙，背上的骨板和尾部尖刺是醒目的特征。分类时要结合多种身体结构，而不只看体形大小。'],['它们没有一起生活','剑龙生活在晚侏罗世，三角龙生活在更晚的白垩纪末期。这里通过分区把它们放到同一座学习公园，方便对比。']],faq:[['骨板只有一种作用吗？','科学家会根据化石提出并检验不同解释。不能只凭模型就确定骨板的唯一作用。'],['恐龙都很凶吗？','恐龙是多样的动物群，有植食性种类，也有肉食性种类。体形、食物和行为不能只用“凶不凶”概括。']],challenge:{prompt:'在这座公园里看到剑龙和三角龙，可以得出什么结论？',options:['它们一定生活在同一时期','这是方便比较的不同时期虚拟展区','恐龙不需要生活环境'],answer:1,explanation:'场景把不同时期的动物集中展示；它不能作为这些动物真实同时出现的证据。'},sources:[{title:'英国自然历史博物馆 · 剑龙',url:'https://www.nhm.ac.uk/discover/dino-directory/Stegosaurus.html'},{title:'英国自然历史博物馆 · 三角龙',url:'https://www.nhm.ac.uk/discover/dino-directory/triceratops.html'},dinosaurSource]},
  {id:'wings',title:'仰望飞行的邻居',teacher:'天空记录员',role:'虚拟古生物导览员',x:40,z:22,color:'#85b8c5',intro:'远处的翼龙展开双翼，缓缓掠过河谷。它们和恐龙是什么关系？',lesson:[['翼龙不是恐龙','翼龙是与恐龙同时代的一类飞行爬行动物，但不属于恐龙。名称相似，不等于科学分类相同。'],['鸟类与恐龙','今天的鸟类属于恐龙演化谱系。研究分类需要比较身体结构与化石证据，不能只按“会不会飞”判断。']],faq:[['为什么叫翼龙却不是恐龙？','日常名字并不是分类依据。翼龙和恐龙在演化历史中属于不同分支。'],['模型飞得这样慢真实吗？','为了方便观察，这里放慢了动作。飞行路线、速度和颜色都是展示设计，不是科学测量。']],challenge:{prompt:'关于头顶的翼龙，哪种说法更准确？',options:['名字里有龙，所以一定是恐龙','它是飞行爬行动物，不属于恐龙','只要会飞的古生物都是鸟'],answer:1,explanation:'翼龙与恐龙关系接近，但属于不同的演化分支。'},sources:[pterosaurSource,dinosaurSource]},
  {id:'fossils',title:'时间留下的证据',teacher:'化石营地老师',role:'虚拟古生物导览员',x:-35,z:34,color:'#bdaf8f',intro:'这里不挖走化石。像研究者一样记录位置、形状，再说说你发现了什么。',lesson:[['化石不只是骨头','骨骼、牙齿、足迹等都可能成为认识过去生命的证据。足迹能留下活动线索。'],['让证据说话','发现化石时先记录、拍照，并由专业人员依法处理。化石和周围岩层的位置关系也有研究价值。']],faq:[['为什么化石很珍贵？','化石形成和保存需要条件，很多生物不会留下完整化石；每一条证据都有价值。'],['能从一个脚印知道所有事情吗？','不能。一个脚印能提供部分线索，还需要更多足迹、岩层和其他化石一起判断。']],challenge:{prompt:'野外看见疑似化石，较合适的第一步是什么？',options:['马上敲下来带走','记录位置、拍照并向专业人员报告','只根据颜色宣布它是什么动物'],answer:1,explanation:'保留现场信息有助于研究，避免自行挖掘损坏化石与岩层关系。'},sources:[fossilSource,{title:'英国自然历史博物馆 · 寻找恐龙化石',url:'https://www.nhm.ac.uk/discover/how-to-find-a-dinosaur.html'}]}
 ]
};

// ───────── 通用小工具（纯函数）─────────
const TAU=Math.PI*2;
const clamp01=v=>v<0?0:v>1?1:v;
const smooth=(a,b,v)=>{const t=clamp01((v-a)/(b-a));return t*t*(3-2*t);};
const lerp=(a,b,t)=>a+(b-a)*t;
const damp=(a,b,rate,dt)=>b+(a-b)*Math.exp(-rate*dt);
const angleDelta=(a,b)=>Math.atan2(Math.sin(b-a),Math.cos(b-a));
function hash(ix,iz,s=0){let h=(Math.imul(ix|0,374761393)+Math.imul(iz|0,668265263)+Math.imul(s|0,1442695041))|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return (h>>>0)/4294967296;}
function noise(x,z,s=0){const ix=Math.floor(x),iz=Math.floor(z),fx=x-ix,fz=z-iz,ux=fx*fx*(3-2*fx),uz=fz*fz*(3-2*fz),a=hash(ix,iz,s),b=hash(ix+1,iz,s),c=hash(ix,iz+1,s),d=hash(ix+1,iz+1,s);return a+(b-a)*ux+(c-a)*uz+(a-b-c+d)*ux*uz;}
const fbm=(x,z,s=0)=>noise(x,z,s)*.5+noise(x*2.03+5.1,z*2.03,s+1)*.3+noise(x*4.1,z*4.1+3.7,s+2)*.2;
const len2=(x,z)=>Math.sqrt(x*x+z*z);
const catmull=(a,b,c,d,t)=>.5*(2*b+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t);

// ───────── 场地布局：小径、湖、河（纯函数，场景与测试共用）─────────
const TRAILS=[
 [[0,37],[1,28],[4,16],[8,4],[10,-4]],
 [[10,-7],[2,-11],[-8,-12.5],[-16,-10.5],[-20,-9]],
 [[0,37],[9,34.5],[20,31],[31,27],[40,24]],
 [[0,37],[-9,40],[-19,41],[-28,38.5],[-35,36]],
 [[-20,-9],[-24,2],[-29,14],[-33,24],[-35,33]],
 [[40,22],[42,13],[44,5]],
];
const LAKE={x:54,z:-28,rx:17,rz:23};
const lakeRadius=a=>{const c=Math.cos(a)/LAKE.rx,s=Math.sin(a)/LAKE.rz;return (1/Math.hypot(c,s))*(1+.07*Math.sin(3*a+1)+.045*Math.sin(5*a+2.3)+.025*Math.sin(9*a+.4));};
const lakeDistance=(x,z)=>{const dx=x-LAKE.x,dz=z-LAKE.z,r=len2(dx,dz);return r>34?r-27:r-lakeRadius(Math.atan2(dz,dx));};
const RIVERS=[
 {pts:[[64,-175],[63,-122],[61,-100],[59,-80],[57,-62],[55,-46]],w:[3.4,3.4,3.6,3.8,4.2,4.8]},
 {pts:[[69,-30],[80,-23],[93,-25],[105,-21],[122,-17],[170,-10]],w:[4.6,3.9,3.6,3.5,3.4,3.4]},
];
function sampleCurve(pts,ws,step){
 const c=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(p[0],0,p[1])),false,'centripetal'),L=c.getLength(),n=Math.max(2,Math.ceil(L/step)),out=[];
 for(let i=0;i<=n;i++){const u=i/n,t=c.getUtoTmapping(u),p=c.getPoint(t),g=c.getTangent(t),f=t*(pts.length-1),k=Math.min(pts.length-2,Math.floor(f));out.push({x:p.x,z:p.z,tx:g.x,tz:g.z,w:ws?lerp(ws[k],ws[k+1],f-k):0,s:u*L,L});}
 return out;
}
// 网格加速的“到曲线距离”查询（减去半宽）
function makeField(samples,cell=4,reach=2){
 const N=130,grid=new Array(N*N);
 for(const s of samples){const i=Math.floor(s.x/cell)+N/2,j=Math.floor(s.z/cell)+N/2;if(i<0||j<0||i>=N||j>=N)continue;(grid[i*N+j]||(grid[i*N+j]=[])).push(s);}
 return (x,z)=>{const ci=Math.floor(x/cell)+N/2,cj=Math.floor(z/cell)+N/2;let best=1e9;for(let i=ci-reach;i<=ci+reach;i++)for(let j=cj-reach;j<=cj+reach;j++){if(i<0||j<0||i>=N||j>=N)continue;const a=grid[i*N+j];if(a)for(const s of a){const d=len2(x-s.x,z-s.z)-s.w;if(d<best)best=d;}}return best;};
}
const trailDistance=makeField(TRAILS.flatMap(p=>sampleCurve(p,null,.6)),4,2);
const riverSamples=RIVERS.map(r=>sampleCurve(r.pts,r.w,1.2));
const riverNear=makeField(riverSamples.flat(),4,2);
const waterDistance=(x,z)=>Math.min(lakeDistance(x,z),riverNear(x,z));
// 可走区域保持 y=0；方形边界以外才抬升成丘陵，河谷向外延伸
const squareDistance=(x,z)=>{const ax=Math.abs(x),az=Math.abs(z);return .5*(Math.max(ax,az)+(ax**6+az**6)**(1/6)/1.1225);};
function groundHeight(x,z){
 const d=squareDistance(x,z);if(d<113)return 0;
 let h=smooth(113,215,d)**1.25*(15+22*fbm(x*.011,z*.011,5))+smooth(113,150,d)*(noise(x*.06,z*.06,8)-.3)*2.2;
 const rv=riverNear(x,z);if(rv<10)h*=smooth(-1,10,rv);
 return Math.max(0,h);
}
const forestDensity=(x,z)=>clamp01(smooth(30,86,len2(x-4,z-6))*.9+(fbm(x*.025,z*.025,21)-.5)*.9+.06);
// 展区布置
const CAMP={pit:{x:-43.5,z:29.5,hx:4.2,hz:2.8,ry:.18},tent:{x:-26,z:24.5,ry:-.35},mud:{x:-15,z:22,rx:7.5,rz:4.6,ry:.5},strata:{x:-55.5,z:15.5,ry:-2.5,L:21,D:10,H:6.2}};
const HERD_HOME={x:-4,z:5,r:17};
const REX_HOME={x:88,z:-64,rx:9,rz:6};

// 骨骼链权重：顶点归属离根更近的关节，并在关节附近与相邻骨骼平滑过渡
function chainWeight(t,J,root,ext){
 const n=J.length;let o=root;
 if(t>=J[root].t){while(o+1<n&&J[o+1].t<=t)o++;}else{while(o-1>=0&&J[o-1].t>=t)o--;}
 const outward=o===root?(t>=J[root].t?1:-1):(o>root?1:-1),parent=o===root?null:o-outward,child=o+outward;
 const rad=i=>{let m=1e9;if(i>0)m=Math.min(m,Math.abs(J[i].t-J[i-1].t));if(i<n-1)m=Math.min(m,Math.abs(J[i+1].t-J[i].t));return .45*m;};
 const out=[];let wo=1;const d=Math.abs(t-J[o].t),r=rad(o);
 if(d<r){const pb=parent===null?ext:J[parent].b;if(pb>=0){const w=.5*(1-d/r);out.push([pb,w]);wo-=w;}}
 if(child>=0&&child<n){const dc=Math.abs(J[child].t-t),rc=rad(child);if(dc<rc){const w=.5*(1-dc/rc);out.push([J[child].b,w]);wo-=w;}}
 out.push([J[o].b,wo]);return out;
}

// ───────── 几何拼装器：静态植物与蒙皮动物共用 ─────────
const _p=new T.Vector3(),_n=new T.Vector3(),_nm=new T.Matrix3(),_q=new T.Quaternion(),_e=new T.Euler(),_s=new T.Vector3(),_v=new T.Vector3(),_up=new T.Vector3(0,1,0);
class Builder{
 constructor(skinned=false){this.skinned=skinned;this.p=[];this.n=[];this.c=[];this.w=[];this.si=[];this.sw=[];this.i=[];}
 get count(){return this.p.length/3;}
 vert(p,n,c,sway=0,wt=null){this.p.push(p.x,p.y,p.z);this.n.push(n.x,n.y,n.z);this.c.push(c.r,c.g,c.b);this.w.push(sway);if(this.skinned)for(let k=0;k<4;k++){const e=wt&&wt[k];this.si.push(e?e[0]:0);this.sw.push(e?e[1]:0);}}
 // 追加一个临时几何体；color / sway / weights 可以是常量，也可以是按顶点计算的函数
 add(g,m,color,{sway=0,weights=null}={}){
  const pos=g.attributes.position;if(!g.attributes.normal)g.computeVertexNormals();const nor=g.attributes.normal,base=this.count;_nm.getNormalMatrix(m);
  for(let k=0;k<pos.count;k++){_p.fromBufferAttribute(pos,k).applyMatrix4(m);_n.fromBufferAttribute(nor,k).applyMatrix3(_nm).normalize();
   this.vert(_p,_n,typeof color==='function'?color(_p,_n,k):color,typeof sway==='function'?sway(_p):sway,typeof weights==='function'?weights(_p):weights);}
  if(g.index)for(let k=0;k<g.index.count;k++)this.i.push(base+g.index.getX(k));else for(let k=0;k<pos.count;k++)this.i.push(base+k);
  return this;
 }
 build(){
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(this.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(this.n,3));g.setAttribute('color',new T.Float32BufferAttribute(this.c,3));
  if(this.skinned){g.setAttribute('skinIndex',new T.Uint16BufferAttribute(this.si,4));g.setAttribute('skinWeight',new T.Float32BufferAttribute(this.sw,4));}else g.setAttribute('aSway',new T.Float32BufferAttribute(this.w,1));
  g.setIndex(this.i);g.computeBoundingSphere();g.computeBoundingBox();return g;
 }
}
const M=(x=0,y=0,z=0,rx=0,ry=0,rz=0,sx=1,sy=sx,sz=sx)=>new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx,ry,rz)),new T.Vector3(sx,sy,sz));
// 把单位高度的几何体（y 轴向上）对齐到 a→b
function along(a,b,rx=1,rz=rx){_v.set(b[0]-a[0],b[1]-a[1],b[2]-a[2]);const len=_v.length();_q.setFromUnitVectors(_up,_v.normalize());return new T.Matrix4().compose(new T.Vector3((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2),_q.clone(),new T.Vector3(rx,len,rz));}
// 让几何体表面起伏（按位置哈希，接缝处的重复顶点保持一致）
function lumpy(g,amt,seed=1,freq=1.7){const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),k=1+(noise(x*freq+seed,z*freq+y*freq*.7,seed)-.5)*2*amt;p.setXYZ(i,x*k,y*(1+(k-1)*.6),z*k);}g.deleteAttribute('normal');g.computeVertexNormals();return g;}
// 沿曲线放样出平滑的管状体；每个截面可分别设定宽、背高、腹高
function loft(B,pts,{rings=40,sides=12,expo=.9,color,weights=null,sway=0,side=null}){
 const n=pts.length,P=pts.map(q=>[q[0],q[1],q[2],q[3],q[4]??q[3],q[5]??q[3]]),curve=new T.CatmullRomCurve3(P.map(q=>new T.Vector3(q[0],q[1],q[2])),false,'centripetal'),X=side||new T.Vector3(1,0,0);
 const R=(t,k)=>{const f=t*(n-1),i=Math.min(n-2,Math.floor(f)),u=f-i,g=j=>P[Math.max(0,Math.min(n-1,j))][k];return Math.max(.004,catmull(g(i-1),g(i),g(i+1),g(i+2),u));};
 const pos=[],meta=[],idx=[],up=new T.Vector3(),sd=new T.Vector3();
 for(let r=0;r<rings;r++){const u=r/(rings-1),t=curve.getUtoTmapping(u),c=curve.getPoint(t),tg=curve.getTangent(t);up.crossVectors(tg,X).normalize();sd.crossVectors(up,tg).normalize();const w=R(t,3),ht=R(t,4),hb=R(t,5);
  for(let j=0;j<sides;j++){const a=j/sides*TAU,ca=Math.cos(a),sa=Math.sin(a),ce=Math.sign(ca)*Math.abs(ca)**expo,se=Math.sign(sa)*Math.abs(sa)**expo,h=sa>0?ht:hb;pos.push(c.x+sd.x*ce*w+up.x*se*h,c.y+sd.y*ce*w+up.y*se*h,c.z+sd.z*ce*w+up.z*se*h);meta.push({t,u,s:sa,c:ca});}
  if(r<rings-1)for(let j=0;j<sides;j++){const a=r*sides+j,b=r*sides+(j+1)%sides,c2=a+sides,d=b+sides;idx.push(a,b,c2,b,d,c2);}
 }
 for(const end of[0,1]){const t=end,c=curve.getPoint(t),tg=curve.getTangent(t),w=R(t,3)*.45,tip=pos.length/3;pos.push(c.x+tg.x*w*(end?1:-1),c.y+tg.y*w*(end?1:-1),c.z+tg.z*w*(end?1:-1));meta.push({t,u:end,s:0,c:0});const ring=end?(rings-1)*sides:0;for(let j=0;j<sides;j++){const a=ring+j,b=ring+(j+1)%sides;if(end)idx.push(tip,a,b);else idx.push(tip,b,a);}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
 const nor=g.attributes.normal,np=new T.Vector3(),nn=new T.Vector3();
 for(let k=0;k<meta.length;k++){np.fromArray(pos,k*3);nn.fromBufferAttribute(nor,k);const m=meta[k];B.vert(np,nn,typeof color==='function'?color(m,np,nn):color,typeof sway==='function'?sway(m,np):sway,weights?weights(m):null);}
 const base=B.count-meta.length;for(const i of idx)B.i.push(base+i);
 return curve;
}

// ───────── 物种定义（z 朝前，y 向上，单位米）─────────
// spine: [z, y, 半宽, 背高, 腹高, 骨骼名]；legs 只写左侧，右侧自动镜像
const SPECIES={
 brachio:{pal:{back:'#8d9e86',belly:'#dcd2b0',dark:'#6c7f69',bands:16},rings:72,
  spine:[[-14.5,3.4,.06],[-12,3.9,.22],[-9,4.7,.45,.5,.5,'tail3'],[-6,5.5,.8,.85,.85,'tail2'],[-3.6,6.2,1.25,1.3,1.4,'tail1'],[-1.6,6.7,1.75,1.7,2,'pelvis'],[1,7.1,2.05,1.95,2.45],[3.4,7.6,1.9,1.95,2.3,'chest'],[5,8.3,1.45,1.6,1.7],[6.1,9.6,1,1.05,1.15,'neck1'],[7,11.6,.74,.78,.82],[7.8,13.6,.6,.62,.62,'neck2'],[8.5,15.6,.5,.5,.5],[9.1,17.3,.44,.44,.44,'neck3'],[9.7,18.5,.42,.45,.42,'head'],[10.5,18.8,.45,.62,.4],[11.3,18.55,.33,.36,.3],[11.9,18.25,.15,.16,.14]],
  legs:[{name:'f',from:'chest',pts:[[1.25,7,3.4],[1.35,4.3,3.3],[1.3,1.3,3.5],[1.3,.05,3.65]],r:[1,.72,.62,.62],foot:'pad'},{name:'h',from:'pelvis',pts:[[1.3,6.3,-1.6],[1.45,3.7,-1],[1.4,1.2,-1.7],[1.4,.05,-1.4]],r:[1.15,.8,.62,.62],foot:'pad'}],
  eyes:[.37,18.78,10.1,.09]},
 diplo:{pal:{back:'#b39975',belly:'#e4d6b1',dark:'#8a7455',bands:26},rings:80,
  spine:[[-19,2.3,.04],[-16,2.6,.1],[-13,3.1,.2,.22,.22,'tail4'],[-10,3.7,.36,.4,.4,'tail3'],[-7,4.4,.62,.68,.68,'tail2'],[-4.4,5,1,1.05,1.1,'tail1'],[-2.2,5.4,1.55,1.5,1.75,'pelvis'],[.4,5.3,1.8,1.6,2.1],[2.8,5,1.65,1.5,1.95,'chest'],[4.4,4.75,1.15,1.15,1.25],[6.2,4.85,.78,.78,.82,'neck1'],[8.4,5.1,.58,.58,.6],[10.6,5.2,.45,.45,.47,'neck2'],[12.6,5.05,.37,.37,.38],[14.3,4.8,.32,.32,.32,'neck3'],[15.4,4.6,.34,.36,.34,'head'],[16.1,4.45,.3,.3,.25],[16.8,4.28,.2,.18,.16],[17.15,4.2,.08,.07,.07]],
  legs:[{name:'f',from:'chest',pts:[[1.05,4.4,3.3],[1.15,2.5,3.2],[1.15,.85,3.4],[1.15,.05,3.55]],r:[.8,.6,.5,.5],foot:'pad'},{name:'h',from:'pelvis',pts:[[1.2,4.9,-2],[1.3,2.8,-1.4],[1.3,.95,-2.1],[1.3,.05,-1.8]],r:[1,.7,.55,.55],foot:'pad'}],
  eyes:[.27,4.68,15.85,.065]},
 stego:{pal:{back:'#879a7b',belly:'#d3cca4',dark:'#62755a',spots:true},rings:48,
  spine:[[-5,1.85,.05],[-3.9,2.05,.16,.17,.17,'tail3'],[-2.7,2.4,.3,.32,.32,'tail2'],[-1.4,2.85,.52,.55,.55,'tail1'],[-.1,3.2,.82,.9,1,'pelvis'],[1.2,3.05,.95,.92,1.1],[2.4,2.55,.82,.8,.95,'chest'],[3.3,2,.55,.55,.6],[3.9,1.6,.32,.32,.34,'neck1'],[4.4,1.32,.25,.25,.26],[4.8,1.18,.23,.24,.2,'head'],[5.25,1.02,.17,.16,.14],[5.6,.9,.07,.06,.06]],
  legs:[{name:'f',from:'chest',pts:[[.62,2,2.7],[.75,1.15,2.55],[.72,.4,2.75],[.72,.04,2.85]],r:[.42,.3,.24,.24],foot:'pad'},{name:'h',from:'pelvis',pts:[[.7,2.9,-.2],[.8,1.75,.25],[.8,.55,-.15],[.8,.04,.12]],r:[.55,.38,.28,.28],foot:'pad'}],
  eyes:[.2,1.27,4.93,.045],beak:'#7a705e'},
 trike:{pal:{back:'#b48a67',belly:'#e0cca6',dark:'#8b674a',spots:true},rings:46,
  spine:[[-4.4,1.35,.05],[-3.4,1.55,.18,.2,.2,'tail2'],[-2.2,1.9,.38,.42,.42,'tail1'],[-.9,2.25,.9,.95,1,'pelvis'],[.5,2.25,1.12,1,1.15],[1.8,2.05,1,.95,1.05,'chest'],[2.7,1.85,.72,.75,.78],[3.25,1.75,.6,.62,.62,'neck1'],[3.75,1.78,.62,.68,.62,'head'],[4.45,1.62,.55,.6,.55],[5,1.32,.36,.45,.32],[5.4,1.08,.14,.16,.12]],
  legs:[{name:'f',from:'chest',pts:[[.8,1.6,2],[1,.95,1.85],[.92,.32,2.1],[.92,.04,2.2]],r:[.42,.32,.27,.28],foot:'pad'},{name:'h',from:'pelvis',pts:[[.75,1.95,-.9],[.85,1.05,-.5],[.85,.38,-.95],[.85,.04,-.72]],r:[.55,.38,.3,.3],foot:'pad'}],
  eyes:[.42,1.98,4.12,.07],beak:'#6d665a'},
 rex:{pal:{back:'#74806a',belly:'#d6c7a0',dark:'#4f5b48',bands:22},rings:52,mouth:true,
  spine:[[-7,2.9,.05],[-5.6,3.15,.2,.22,.22,'tail3'],[-4,3.45,.4,.44,.44,'tail2'],[-2.3,3.75,.62,.66,.7,'tail1'],[-.6,4,.85,.9,1.05,'pelvis'],[.9,3.95,.95,1,1.3],[2.2,3.95,.8,.92,1.15,'chest'],[3,4.25,.55,.62,.7],[3.5,4.6,.48,.52,.55,'neck1'],[4,4.85,.52,.6,.6,'head'],[4.8,4.8,.55,.62,.62],[5.6,4.55,.42,.48,.44],[6.2,4.35,.2,.22,.2]],
  legs:[{name:'h',from:'pelvis',pts:[[.62,3.75,-.4],[.75,2.3,.35],[.68,.85,-.45],[.68,.05,.2]],r:[.62,.42,.25,.22],foot:'claw'},{name:'a',from:'chest',pts:[[.5,3.45,2.35],[.6,3.05,2.6],[.55,2.85,2.9],[.5,2.8,3.05]],r:[.14,.1,.07,.05]}],
  eyes:[.43,5.06,4.55,.07]},
 orni:{pal:{back:'#a9b27c',belly:'#ece2bd',dark:'#7f8b5c',bands:30},rings:40,mouth:true,
  spine:[[-1.75,.82,.025],[-1.25,.88,.07,.07,.07,'tail2'],[-.7,.95,.13,.14,.14,'tail1'],[-.15,1,.22,.25,.28,'pelvis'],[.3,.98,.24,.25,.3],[.65,1,.19,.2,.22,'chest'],[.88,1.12,.11,.12,.12,'neck1'],[1.02,1.28,.1,.11,.1,'head'],[1.18,1.27,.09,.09,.075],[1.33,1.2,.035,.03,.03]],
  legs:[{name:'h',from:'pelvis',pts:[[.15,.95,-.1],[.18,.58,.08],[.17,.22,-.12],[.17,.02,.02]],r:[.13,.08,.05,.05],foot:'claw'},{name:'a',from:'chest',pts:[[.14,.92,.68],[.17,.79,.78],[.15,.71,.88],[.14,.69,.93]],r:[.035,.028,.02,.015]}],
  eyes:[.085,1.32,1.12,.026],beak:'#8c7d62'},
 ptero:{pal:{back:'#c8b89a',belly:'#ece0c5',dark:'#a0907a'},rings:30,
  spine:[[-.75,0,.02],[-.45,0,.1],[-.15,.02,.2,.2,.2,'pelvis'],[.2,.04,.22,.22,.2],[.45,.06,.14,.14,.13,'chest'],[.75,.12,.07,.07,.07,'neck1'],[1.05,.2,.075,.08,.07,'head'],[1.35,.22,.07,.085,.05],[1.75,.17,.03,.035,.025],[2.15,.1,.008,.008,.008]],
  legs:[],eyes:[.06,.27,1.2,.022],beak:'#e6d6b0',wings:true},
};

export function buildEra(scene,{quality='normal'}={}){
 const root=new T.Group();root.name='era-dinosaurs-environment';scene.add(root);
 const resources=new Set(),obstacles=[],animators=[],qualityMeshes=[],highOnly=[],skeletons=[],clock={value:0};
 let alive=true,low=quality==='low';
 let seed=726305;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const rr=(a,b)=>a+(b-a)*random();
 const track=r=>(resources.add(r),r);
 const C=hex=>new T.Color(hex),tc=new T.Color(),tc2=new T.Color();
 const dummy=new T.Object3D(),tint=new T.Color();
 const std=o=>track(new T.MeshStandardMaterial({roughness:.9,metalness:0,...o}));
 const addMesh=(g,m,{shadow=false,receive=true,parent=root}={})=>{const o=new T.Mesh(g,m);o.castShadow=shadow;o.receiveShadow=receive;parent.add(o);return o;};
 // 远景物体只吃一部分雾，层次更清楚
 const fogScale=(m,s)=>{m.onBeforeCompile=sh=>{sh.uniforms.uFogScale={value:s};sh.fragmentShader='uniform float uFogScale;\n'+sh.fragmentShader.replace('#include <fog_fragment>','#ifdef USE_FOG\n gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,smoothstep(fogNear,fogFar,vFogDepth)*uFogScale);\n#endif');};return m;};

 // ── 材质（尽量共用）──
 const floraMat=std({vertexColors:true,side:T.DoubleSide,roughness:.92});
 floraMat.onBeforeCompile=sh=>{sh.uniforms.uTime=clock;sh.vertexShader='attribute float aSway;\nuniform float uTime;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n#ifdef USE_INSTANCING\n float wph=instanceMatrix[3][0]*.11+instanceMatrix[3][2]*.13;\n#else\n float wph=0.;\n#endif\n transformed.x+=sin(uTime*1.25+wph+position.y*.35)*aSway;\n transformed.z+=cos(uTime*.95+wph*1.7)*aSway*.7;');sh.fragmentShader=sh.fragmentShader.replace('#include <normal_fragment_begin>',T.ShaderChunk.normal_fragment_begin.replace('normal *= faceDirection;',''));};
 const farFloraMat=fogScale(std({vertexColors:true,roughness:.92}),.72);
 const rockMat=std({vertexColors:true,flatShading:true,roughness:.96});
 const campMat=std({vertexColors:true,side:T.DoubleSide,roughness:.88});
 const creatureMats=new Map();
 const creatureMat=(hex='#ffffff')=>{if(!creatureMats.has(hex))creatureMats.set(hex,std({vertexColors:true,roughness:.78,color:hex}));return creatureMats.get(hex);};

 // ── 实例化散布：按区块切分，便于视锥剔除；低画质按比例减少 ──
 function scatter(geo,mat,items,{shadow=false,cell=90,ratio=1}={}){
  if(!items.length)return [];const groups=new Map(),out=[];
  for(const it of items){const k=Math.floor((it.x+114.5)/cell)*1000+Math.floor((it.z+114.5)/cell);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(it);}
  for(const list of groups.values()){
   for(let i=list.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}
   const o=new T.InstancedMesh(geo,mat,list.length);
   list.forEach((p,i)=>{dummy.position.set(p.x,p.y||0,p.z);dummy.rotation.set(p.rx||0,p.ry||0,p.rz||0);const s=p.s??1;dummy.scale.set(p.sx??s,p.sy??s,p.sz??s);dummy.updateMatrix();o.setMatrixAt(i,dummy.matrix);o.setColorAt(i,tint.set(p.color||'#ffffff'));});
   o.castShadow=shadow&&list.some(p=>Math.abs(p.x)<125&&Math.abs(p.z)<125);o.receiveShadow=true;o.computeBoundingSphere();root.add(o);
   if(ratio<1)qualityMeshes.push({mesh:o,count:list.length,ratio});out.push(o);
  }
  return out;
 }
 // 简单的占位网格，防止大物体互相穿插
 const occupied=new Map();
 const occKey=(i,j)=>i*4096+j;
 const isFree=(x,z,r)=>{const ci=Math.floor(x/4),cj=Math.floor(z/4);for(let i=ci-3;i<=ci+3;i++)for(let j=cj-3;j<=cj+3;j++){const a=occupied.get(occKey(i,j));if(a)for(const o of a)if(len2(x-o.x,z-o.z)<r+o.r)return false;}return true;};
 const occupy=(x,z,r)=>{const k=occKey(Math.floor(x/4),Math.floor(z/4));if(!occupied.has(k))occupied.set(k,[]);occupied.get(k).push({x,z,r});};
 const keepOut=[];// {x,z,r,kind}
 // 每个站点镜头前方留出视野（镜头默认在站点南侧 13 米左右）
 for(const s of[{x:eraDefinition.spawn.x,z:eraDefinition.spawn.z-3.3},...eraDefinition.stations])keepOut.push({x:s.x,z:s.z+3.3+8,r:6.5,kind:'view'});
 const inKeepOut=(x,z,pad=0,kinds=null)=>{for(const k of keepOut)if((!kinds||kinds.includes(k.kind))&&len2(x-k.x,z-k.z)<k.r+pad)return true;return false;};
 const ST=[[eraDefinition.spawn.x,eraDefinition.spawn.z,2],...eraDefinition.stations.flatMap(s=>[[s.x,s.z,0],[s.x,s.z+3.3,0]])];
 const stationGap=(x,z)=>{let m=1e9;for(let i=0;i<ST.length;i++){const d=len2(x-ST[i][0],z-ST[i][1])-ST[i][2];if(d<m)m=d;}return m;};
 const inPlay=(x,z)=>Math.abs(x)<110&&Math.abs(z)<110;
 const mudInside=(x,z,pad=0)=>{const dx=x-CAMP.mud.x,dz=z-CAMP.mud.z,c=Math.cos(CAMP.mud.ry),s=Math.sin(CAMP.mud.ry),a=(dx*c+dz*s)/(CAMP.mud.rx+pad),b=(-dx*s+dz*c)/(CAMP.mud.rz+pad);return a*a+b*b<1;};
 const pitLocal=(x,z)=>{const dx=x-CAMP.pit.x,dz=z-CAMP.pit.z,c=Math.cos(CAMP.pit.ry),s=Math.sin(CAMP.pit.ry);return [dx*c-dz*s,dx*s+dz*c];};

 // ───────── 骨骼动物 ─────────
 const speciesCache={};
 function species(name){
  if(speciesCache[name])return speciesCache[name];
  const spec=SPECIES[name],B=new Builder(true),n=spec.spine.length,pal=spec.pal;
  const back=C(pal.back),belly=C(pal.belly),dark=C(pal.dark),beak=spec.beak?C(spec.beak):null,eyeC=C('#26302b'),shine=C('#f5efdc'),pad=C('#6d6858'),nail=C('#e7dcc0');
  const sj=[];spec.spine.forEach((q,k)=>{if(q[5])sj.push({t:k/(n-1),name:q[5],pos:[0,q[1],q[0]]});});
  const rootK=sj.findIndex(j=>j.name==='pelvis'),joints=[],index={};
  const addJoint=(nm,pos,parent)=>{index[nm]=joints.length;joints.push({name:nm,pos,parent});};
  addJoint('pelvis',sj[rootK].pos,null);for(let k=rootK+1;k<sj.length;k++)addJoint(sj[k].name,sj[k].pos,sj[k-1].name);for(let k=rootK-1;k>=0;k--)addJoint(sj[k].name,sj[k].pos,sj[k+1].name);
  const chain=sj.map(j=>({t:j.t,b:index[j.name]})),spineW=t=>chainWeight(t,chain,rootK,-1),tHead=sj.find(j=>j.name==='head').t;
  // 身体颜色：背深腹浅，加上条纹或斑点
  const skin=(m,p)=>{tc.copy(belly).lerp(back,smooth(-.45,.35,m.s));
   if(pal.bands&&m.s>-.2){const b=smooth(.45,.85,Math.sin(m.u*pal.bands*TAU));tc.lerp(dark,b*.5*smooth(-.2,.5,m.s));}
   if(pal.spots&&m.s>-.3&&noise(m.u*70,Math.atan2(m.s,m.c)*3.2,7)>.66)tc.lerp(dark,.55);
   if(spec.mouth&&m.t>tHead&&m.s>-.34&&m.s<-.16&&Math.abs(m.c)>.5)tc.lerp(eyeC,.6);
   if(beak&&m.t>tHead+(1-tHead)*.72)tc.lerp(beak,smooth(tHead+(1-tHead)*.72,tHead+(1-tHead)*.85,m.t));
   return tc;};
  const spineCurve=loft(B,spec.spine.map(q=>[0,q[1],q[0],q[2],q[3],q[4]]),{rings:spec.rings,sides:14,color:skin,weights:m=>spineW(m.t)});
  const samples=[];for(let i=0;i<=240;i++){const t=i/240;samples.push({t,p:spineCurve.getPoint(t)});}
  const nearestT=p=>{let best=0,d=1e9;for(const s of samples){const e=s.p.distanceToSquared(p);if(e<d){d=e;best=s.t;}}return best;};
  const W=nm=>[[index[nm],1]],SW=p=>spineW(nearestT(p));
  // 四肢：左右镜像
  const legs=[];for(const leg of spec.legs)for(const sgn of[1,-1])legs.push({...leg,name:(sgn>0?'l':'r')+leg.name,pts:leg.pts.map(p=>[p[0]*sgn,p[1],p[2]]),sgn});
  for(const leg of legs){
   const names=[leg.name+'0',leg.name+'1',leg.name+'2'];addJoint(names[0],leg.pts[0],leg.from);addJoint(names[1],leg.pts[1],names[0]);addJoint(names[2],leg.pts[2],names[1]);
   const m=leg.pts.length,lc=names.map((nm,k)=>({t:k/(m-1),b:index[nm]})),ext=index[leg.from];
   const legColor=(mm)=>{tc.copy(back).lerp(belly,.22-.12*mm.s).lerp(dark,smooth(.5,1,mm.t)*.3);return tc;};
   loft(B,leg.pts.map((p,k)=>[p[0],p[1],p[2],leg.r[k],leg.r[k],leg.r[k]]),{rings:14,sides:10,color:legColor,weights:mm=>chainWeight(mm.t,lc,0,ext)});
   const end=leg.pts[3],r=leg.r[3],wt=W(names[2]);
   if(leg.foot==='pad'){
    B.add(new T.SphereGeometry(1,12,6,0,TAU,0,Math.PI/2),M(end[0],0,end[2],0,0,0,r*1.18,r*.75,r*1.3),tc2.copy(back).lerp(pad,.45),{weights:wt});
    for(let i=-1;i<=1;i++)B.add(new T.SphereGeometry(1,6,4),M(end[0]+i*r*.5,r*.12,end[2]+r*1.12,0,0,0,r*.2,r*.16,r*.26),nail,{weights:wt});
   }else if(leg.foot==='claw'){
    for(let i=-1;i<=1;i++){const a=i*.38,len=r*(i?3.3:4),dx=Math.sin(a)*len,dz=Math.cos(a)*len,tip=[end[0]+dx,r*.25,end[2]+dz];
     B.add(new T.CylinderGeometry(.55,1,1,6),along([end[0],r*.55,end[2]],tip,r*.42),tc2.copy(back).lerp(dark,.3),{weights:wt});
     B.add(new T.ConeGeometry(1,1,6),along(tip,[tip[0]+dx*.22,.02,tip[2]+dz*.22],r*.22),nail,{weights:wt});}
   }
  }
  // 眼睛
  if(spec.eyes){const [ex,ey,ez,er]=spec.eyes;for(const sg of[1,-1]){B.add(new T.SphereGeometry(1,10,7),M(sg*ex,ey,ez,0,0,0,er*.75,er,er),eyeC,{weights:W('head')});B.add(new T.SphereGeometry(1,6,4),M(sg*(ex+er*.55),ey+er*.35,ez+er*.3,0,0,0,er*.28),shine,{weights:W('head')});B.add(new T.SphereGeometry(1,10,6,0,TAU,0,Math.PI*.42),M(sg*ex*.97,ey+er*.15,ez,0,0,sg*-.35,er*1.25,er*.9,er*1.3),tc2.copy(back).lerp(dark,.2),{weights:W('head')});}}
  const ctx={B,W,SW,index,spineCurve,nearestT,back,belly,dark};
  if(name==='stego')stegoExtras(ctx);if(name==='trike')trikeExtras(ctx);if(name==='rex')rexExtras(ctx);if(name==='brachio')brachioExtras(ctx);
  if(spec.wings)pteroWings(ctx,addJoint);
  const geometry=track(B.build());
  return speciesCache[name]={geometry,joints,index,spec,legs};
 }
 function brachioExtras({B,W,back,dark}){for(const sg of[1,-1])B.add(new T.ConeGeometry(1,1,6),along([sg*.9,.32,4.15],[sg*.72,.12,4.7],.12),C('#e2d7ba'),{weights:W((sg>0?'l':'r')+'f2')});
  // 鼻拱上的浅色鼻孔
  B.add(new T.SphereGeometry(1,8,5),M(0,19.32,10.55,0,0,0,.2,.12,.28),tc.copy(back).lerp(dark,.4),{weights:W('head')});}
 function stegoExtras({B,SW,spineCurve,nearestT}){
  const shape=new T.Shape();shape.moveTo(-.5,0);shape.bezierCurveTo(-.66,.42,-.34,.86,-.02,1);shape.bezierCurveTo(.36,.82,.64,.4,.5,0);shape.lineTo(-.5,0);
  const plateBase=C('#b9785a'),plateTip=C('#ecc08d'),up=new T.Vector3(),tg=new T.Vector3();
  const N=17,t0=.14,t1=.66,sp=SPECIES.stego.spine,htAt=t=>{const f=t*(sp.length-1),i=Math.min(sp.length-2,Math.floor(f)),a=sp[i][3]??sp[i][2],b=sp[i+1][3]??sp[i+1][2];return lerp(a,b,f-i);};// 从尾部到颈部
  for(let k=0;k<N;k++){
   const f=k/(N-1),t=lerp(t0,t1,f),c=spineCurve.getPoint(t);spineCurve.getTangent(t,tg);up.set(0,tg.z,-tg.y).normalize();
   const peak=Math.sin(Math.PI*Math.pow(f,.8))**1.2,h=.25+1.02*peak,w=.38+.62*peak,side=k%2?1:-1,ht=htAt(t);
   const base=c.clone().addScaledVector(up,ht*.78);base.x=side*.09;
   const slope=Math.atan2(tg.y,tg.z);
   const m=new T.Matrix4().makeTranslation(base.x,base.y,base.z).multiply(new T.Matrix4().makeRotationZ(side*.13)).multiply(new T.Matrix4().makeRotationX(-slope)).multiply(new T.Matrix4().makeRotationY(-Math.PI/2)).multiply(new T.Matrix4().makeScale(w,h,1));
   const g=new T.ExtrudeGeometry(shape,{depth:.07,bevelEnabled:true,bevelThickness:.02,bevelSize:.025,bevelSegments:1,curveSegments:7});g.translate(0,0,-.035);
   const by=base.y;B.add(g,m,p=>tc.copy(plateBase).lerp(plateTip,smooth(by,by+h,p.y)),{weights:SW});
  }
  // 尾刺
  for(const z of[-3.55,-4.25])for(const sg of[1,-1]){const t=nearestT(new T.Vector3(0,2,z)),c=spineCurve.getPoint(t),a=[sg*.1,c.y+.12,z],b=[sg*.78,c.y+.62,z-.42];B.add(new T.ConeGeometry(1,1,7),along(a,b,.085),C('#ebe1c6'),{weights:SW});}
 }
 function trikeExtras({B,W,back,dark}){
  const s=new T.Shape();s.moveTo(-.55,0);s.bezierCurveTo(-1.2,.25,-1.1,1.28,0,1.48);s.bezierCurveTo(1.1,1.28,1.2,.25,.55,0);s.quadraticCurveTo(0,.28,-.55,0);
  const g=new T.ExtrudeGeometry(s,{depth:.1,bevelEnabled:true,bevelThickness:.03,bevelSize:.04,bevelSegments:1,curveSegments:10});
  const fm=M(0,2.02,3.62,-.78,0,0,1,1,1),center=new T.Vector3(0,.7,0).applyMatrix4(fm),inner=C('#c4825c'),rim=C('#e6c690');
  B.add(g,fm,p=>tc.copy(inner).lerp(rim,smooth(.35,.95,p.distanceTo(center))).lerp(dark,noise(p.x*5,p.y*5,3)>.72?.35:0),{weights:W('head')});
  for(const p of s.getSpacedPoints(44))if(p.y>.12){const q=new T.Vector3(p.x*1.04,p.y*1.04,.05).applyMatrix4(fm);B.add(new T.SphereGeometry(1,6,4),M(q.x,q.y,q.z,0,0,0,.075),rim,{weights:W('head')});}
  const horn=C('#efe6cf');for(const sg of[1,-1])B.add(new T.ConeGeometry(1,1,9),along([sg*.3,2.2,4.22],[sg*.42,2.78,5.18],.12),horn,{weights:W('head')});
  B.add(new T.ConeGeometry(1,1,8),along([0,1.86,4.98],[0,2.22,5.2],.08),horn,{weights:W('head')});
 }
 function rexExtras({B,W,back,dark}){for(const sg of[1,-1])B.add(new T.SphereGeometry(1,8,5),M(sg*.4,5.2,4.5,0,0,0,.12,.07,.22),tc.copy(back).lerp(dark,.35),{weights:W('head')});}
 function pteroWings({B,index,back,belly},addJoint){
  const crest=new T.Shape();crest.moveTo(0,0);crest.lineTo(-.62,.42);crest.quadraticCurveTo(-.4,.1,-.05,-.04);crest.lineTo(0,0);
  const cg=new T.ExtrudeGeometry(crest,{depth:.025,bevelEnabled:false});cg.translate(0,0,-.012);
  B.add(cg,new T.Matrix4().makeTranslation(0,.27,1.12).multiply(new T.Matrix4().makeRotationY(-Math.PI/2)),C('#c9765c'),{weights:[[index.head,1]]});
  const lead=C('#c99f73'),trail=C('#eedcbb');
  for(const sg of[1,-1]){
   const nm=sg>0?'lw':'rw',LE=[[sg*.14,.06,.32],[sg*.95,.11,.2],[sg*1.6,.13,.32],[sg*3.7,.05,-.35]],TE=[[sg*.12,.0,-.36],[sg*1,-.02,-.62],[sg*2.35,0,-.55],[sg*3.7,.05,-.35]];
   addJoint(nm+'0',LE[0],'chest');addJoint(nm+'1',LE[1],nm+'0');addJoint(nm+'2',LE[2],nm+'1');
   const lens=[0];for(let i=1;i<4;i++)lens.push(lens[i-1]+Math.hypot(LE[i][0]-LE[i-1][0],LE[i][1]-LE[i-1][1],LE[i][2]-LE[i-1][2]));const tot=lens[3];
   const lc=[0,1,2].map(i=>({t:lens[i]/tot,b:index[nm+i]})),ext=index.chest,wf=u=>chainWeight(u,lc,0,ext);
   const at=(poly,u)=>{const L=[0];for(let i=1;i<poly.length;i++)L.push(L[i-1]+Math.hypot(poly[i][0]-poly[i-1][0],poly[i][2]-poly[i-1][2]));const d=u*L[L.length-1];let i=1;while(i<L.length-1&&L[i]<d)i++;const f=(d-L[i-1])/(L[i]-L[i-1]||1);return poly[i-1].map((v,k)=>lerp(v,poly[i][k],f));};
   const S=16,V=4,base=B.count,n1=new T.Vector3(0,1,0),n2=new T.Vector3(0,-1,0);
   for(const face of[0,1])for(let i=0;i<=S;i++){const u=i/S,a=at(LE,u),b=at(TE,u);for(let j=0;j<V;j++){const v=j/(V-1),p=new T.Vector3(lerp(a[0],b[0],v),lerp(a[1],b[1],v)+Math.sin(v*Math.PI)*.05*(1-u),lerp(a[2],b[2],v));B.vert(p,face?n2:n1,tc.copy(lead).lerp(trail,v*.85+u*.1),0,wf(u*.999));}}
   const stride=V,half=(S+1)*V;for(let i=0;i<S;i++)for(let j=0;j<V-1;j++){const a=base+i*stride+j,b=a+1,c=a+stride,d=c+1;if(sg>0)B.i.push(a,c,b,b,c,d);else B.i.push(a,b,c,b,d,c);const a2=a+half,b2=b+half,c2=c+half,d2=d+half;if(sg>0)B.i.push(a2,b2,c2,b2,d2,c2);else B.i.push(a2,c2,b2,b2,c2,d2);}
   loft(B,LE.map((p,k)=>[p[0],p[1],p[2],[.06,.05,.045,.012][k]]),{rings:18,sides:6,color:tc2.copy(back).lerp(lead,.4),weights:m=>wf(Math.min(.999,m.u)),side:new T.Vector3(0,0,1)});
   // 收在身后的后腿
   B.add(new T.CylinderGeometry(.6,1,1,6),along([sg*.1,-.05,-.25],[sg*.2,-.07,-.72],.04),back,{weights:[[index.pelvis,1]]});
  }
 }
 function spawn(name,{x,z,y=0,h=0,s=1,tint:tintHex='#ffffff',shadow=true}){
  const sp=species(name),bones=sp.joints.map(j=>{const b=new T.Bone();b.name=j.name;return b;});
  sp.joints.forEach((j,k)=>{if(j.parent===null)bones[k].position.set(j.pos[0],j.pos[1],j.pos[2]);else{const pi=sp.index[j.parent],pp=sp.joints[pi].pos;bones[k].position.set(j.pos[0]-pp[0],j.pos[1]-pp[1],j.pos[2]-pp[2]);bones[pi].add(bones[k]);}});
  const m=new T.SkinnedMesh(sp.geometry,creatureMat(tintHex));m.add(bones[0]);const sk=new T.Skeleton(bones);m.bind(sk);skeletons.push(sk);
  m.boundingSphere=sp.geometry.boundingSphere.clone();m.boundingSphere.radius*=1.3;
  m.position.set(x,y,z);m.rotation.y=h;m.scale.setScalar(s);m.castShadow=shadow;m.receiveShadow=true;root.add(m);
  const B={};bones.forEach(b=>B[b.name]=b);
  const pick=pre=>Object.keys(B).filter(k=>k.startsWith(pre)).sort().map(k=>B[k]);
  const legs={};for(const leg of sp.legs)legs[leg.name]={hip:B[leg.name+'0'],knee:B[leg.name+'1'],ankle:B[leg.name+'2']};
  return {mesh:m,B,tails:pick('tail'),necks:pick('neck'),legs,pelvisY:bones[0].position.y,phase:random()*TAU,sp};
 }
 // 碰撞体：沿脊柱的圆 + 脚掌；腹部高于 1.8m 的大型动物可以从肚子下面走过
 function bodyColliders(c,{x,z,h,s}){const co=Math.cos(h),si=Math.sin(h),P=(lx,lz)=>[x+(lx*co+lz*si)*s,z+(-lx*si+lz*co)*s];
  for(const q of c.sp.spec.spine){const [lz,ly,w,ht=w,hb=w]=q;if(w<.1)continue;const [wx,wz]=P(0,lz),base=(ly-hb)*s;obstacles.push({x:wx,z:wz,r:Math.max(.3,w*s*1.05),base:Math.max(0,base),height:(hb+ht)*s+Math.min(0,base),walkable:false});keepOut.push({x:wx,z:wz,r:Math.max(.5,w*s*1.3),kind:'animal'});}
  for(const leg of c.sp.legs){if(leg.pts[3][1]>.5)continue;const p=leg.pts[3],[wx,wz]=P(p[0],(p[2]+leg.pts[2][2])/2);obstacles.push({x:wx,z:wz,r:Math.max(.28,leg.r[2]*s*1.25),base:0,height:leg.pts[0][1]*s,walkable:false});keepOut.push({x:wx,z:wz,r:leg.r[2]*s*1.6,kind:'animal'});}
 }
 // 动作小工具
 const breathe=(c,t,a=.012)=>{if(c.B.chest){const k=1+Math.sin(t*.9+c.phase)*a;c.B.chest.scale.set(k,k,1);}};
 const tailWave=(c,t,amp=.06,speed=.7)=>{for(let i=0;i<c.tails.length;i++){const b=c.tails[i];b.rotation.y=Math.sin(t*speed+c.phase-i*.75)*amp*(1+i*.35);b.rotation.x=Math.sin(t*.45+c.phase-i*.5)*.012;}};
 const stepLeg=(leg,ph,amp,lift,front=false)=>{if(!leg)return;const f=Math.cos(ph),l=Math.max(0,-Math.sin(ph));leg.hip.rotation.x=-amp*f;leg.knee.rotation.x=(front?.6:1)*lift*l;leg.ankle.rotation.x=-(leg.hip.rotation.x+leg.knee.rotation.x)*.8;};
 const restLegs=c=>{for(const k in c.legs){const l=c.legs[k];l.hip.rotation.x=l.knee.rotation.x=l.ankle.rotation.x=0;}};
 const walk=(c,ph,amp,lift,quad=true,bob=.04)=>{if(quad){stepLeg(c.legs.lh,ph,amp,lift);stepLeg(c.legs.lf,ph+Math.PI*.5,amp*.8,lift*.8,true);stepLeg(c.legs.rh,ph+Math.PI,amp,lift);stepLeg(c.legs.rf,ph+Math.PI*1.5,amp*.8,lift*.8,true);}else{stepLeg(c.legs.lh,ph,amp,lift);stepLeg(c.legs.rh,ph+Math.PI,amp,lift);}c.B.pelvis.position.y=c.pelvisY+Math.abs(Math.sin(ph))*bob*(quad?1:2)-bob;c.B.pelvis.rotation.z=Math.sin(ph)*.02;};

 // ───────── 植物原型（顶点色 + 风摆权重）─────────
 const floraGeo={};
 {// 南洋杉（成年：高干伞形树冠；幼年：塔形）
  for(const mature of[true,false]){const B=new Builder(),H=mature?20:12,bark=C('#7d6753'),barkD=C('#5f5045'),leaf=C('#577d61'),leafL=C('#7f9f74');
   B.add(new T.CylinderGeometry(mature?.17:.12,mature?.52:.34,H,8,5),M(0,H/2,0),p=>tc.copy(bark).lerp(barkD,noise(p.y*1.6,Math.atan2(p.z,p.x)*1.5,4)*.7),{sway:p=>Math.max(0,p.y-H*.55)*.0035});
   const start=mature?.6:.2,wh=mature?7:7;
   for(let i=0;i<wh;i++){const f=i/(wh-1),y=H*lerp(start,.97,f),L=mature?3.5*(1-f*.7)+.6:3.7*(1-f*.9)+.4,k=5,off=i*1.3;
    for(let j=0;j<k;j++){const a=off+j/k*TAU+(noise(i,j,3)-.5)*.6,dx=Math.cos(a),dz=Math.sin(a),tilt=mature?.16:-.2;
     B.add(lumpy(new T.SphereGeometry(1,mature?7:6,mature?4:3),.18,i*7+j),M(dx*L*.55,y-.15+L*(mature?.1:-.08),dz*L*.55,0,-a,tilt,L*.58,.42+.1*(1-f),.48),(p,nn)=>tc.copy(leaf).lerp(leafL,clamp01(nn.y*.55+.3+(p.y-y)*.3)),{sway:p=>.012*Math.hypot(p.x,p.z)+Math.max(0,p.y-H*.55)*.004});}}
   B.add(lumpy(new T.SphereGeometry(1,7,5),.15,9),M(0,H*.99,0,0,0,0,mature?1.6:.7,mature?.7:1.1,mature?1.6:.7),(p,nn)=>tc.copy(leaf).lerp(leafL,clamp01(nn.y*.5+.4)),{sway:.05});
   floraGeo[mature?'araucaria':'araucariaYoung']=track(B.build());}
  // 背景树：远处用的简化版本（针叶塔形 / 南洋杉伞形）
  {const B=new Builder(),bark=C('#6f5a49'),dk=C('#4f7262'),lt=C('#6f9277');B.add(new T.CylinderGeometry(.15,.4,14,5),M(0,7,0),bark);for(let i=0;i<4;i++){const f=i/3,h=4.2*(1-f*.4),y0=3+f*9;B.add(new T.ConeGeometry(3*(1-f)+.7,h,7,1,true),M(0,y0+h/2,0,0,i,0),p=>tc.copy(dk).lerp(lt,clamp01((p.y-y0)/h)));}floraGeo.bgConifer=track(B.build());}
  {const B=new Builder(),bark=C('#6f5a49'),lf=C('#5a7f63'),lt=C('#7e9e74');B.add(new T.CylinderGeometry(.15,.45,18,5),M(0,9,0),bark);for(const [y,r,h] of[[15.6,3.6,2.4],[17.6,2.2,1.4]])B.add(lumpy(new T.SphereGeometry(1,9,4),.12,y),M(0,y,0,0,y,0,r,h,r*.92),(p,nn)=>tc.copy(lf).lerp(lt,clamp01(nn.y*.6+.3)));floraGeo.bgAraucaria=track(B.build());}
  // 针叶树（红杉/罗汉松类）：层层下垂的锥形枝层
  {const B=new Builder(),H=15,bark=C('#7a5f4d'),dk=C('#4f7262'),lt=C('#6f9277');B.add(new T.CylinderGeometry(.12,.42,H,7,3),M(0,H/2,0),bark,{sway:p=>p.y*.002});
   for(let i=0;i<7;i++){const f=i/6,y0=3+f*(H-4.2),rad=3.1*(1-f)+.55,h=3.3*(1-f*.4),g=new T.ConeGeometry(rad,h,9,2,true);const pp=g.attributes.position;for(let k=0;k<pp.count;k++){const yy=pp.getY(k);if(yy<0){const a=Math.atan2(pp.getZ(k),pp.getX(k)),j=1+(noise(Math.cos(a)*3+i,Math.sin(a)*3,5)-.5)*.35;pp.setXYZ(k,pp.getX(k)*j,yy-(j-1)*.9-.25,pp.getZ(k)*j);}}g.computeVertexNormals();
    B.add(g,M(0,y0+h/2,0,0,i*.7,0),p=>tc.copy(dk).lerp(lt,clamp01((p.y-y0)/h*.9+.1)),{sway:p=>p.y*.003+Math.hypot(p.x,p.z)*.008});}
   B.add(new T.ConeGeometry(.35,1.6,6),M(0,H+.5,0),lt,{sway:.05});floraGeo.conifer=track(B.build());}
  // 银杏：直立的主干和几团扇形叶簇
  {const B=new Builder(),bark=C('#7f6a57'),lf=C('#94ad66'),lf2=C('#bdc27a');B.add(new T.CylinderGeometry(.24,.38,5,7),M(0,2.5,0),bark);
   const ends=[[2.1,7.6,.6],[-1.6,8.4,1.4],[.4,9.4,-1.8],[-.9,6.8,-1.3],[1.3,8.9,1.7]];
   for(const [i,e] of ends.entries()){B.add(new T.CylinderGeometry(.08,.16,1,6),along([0,4.4+i*.25,0],[e[0]*.85,e[1]-.6,e[2]*.85],1),bark,{sway:p=>Math.max(0,p.y-5)*.006});
    B.add(lumpy(new T.SphereGeometry(1,9,6),.22,i*3+1,1.2),M(e[0],e[1],e[2],0,i,0,1.55,1.25,1.45),(p,nn)=>tc.copy(lf).lerp(lf2,clamp01(nn.y*.5+.25+noise(p.x,p.z,i)*.3)),{sway:p=>Math.max(0,p.y-5)*.012});}
   B.add(lumpy(new T.SphereGeometry(1,9,6),.2,17,1.2),M(.2,10.1,0,0,0,0,1.45,1.25,1.35),(p,nn)=>tc.copy(lf).lerp(lf2,clamp01(nn.y*.5+.3)),{sway:.06});floraGeo.ginkgo=track(B.build());}
  // 叶片：沿叶轴生成交错的小叶，用于树蕨、苏铁和地面蕨
  function frond(B,{len,rise,droop,a,y0,seg,leaflet,width,col1,col2,lean=0,stiff=false,swayK=.25,x0=0,z0=0,overlap=1}){
   const dir=[Math.cos(a),Math.sin(a)],perp=[-dir[1],dir[0]],P=s=>{const d=len*s;return [x0+dir[0]*d,y0+len*(rise*s-droop*s*s),z0+dir[1]*d];},tri=[],cols=[],sw=[];
   for(let i=0;i<seg;i++){const s0=i/seg,s1=(i+1)/seg,a0=P(s0),a1=P(Math.min(1,s0+(s1-s0)*overlap)),sm=(s0+s1)/2,L=leaflet*Math.sin(Math.PI*Math.min(1,sm*.92+.1))*(stiff?1:1-sm*.25),fw=(stiff?.55:.75);
    for(const sg of[1,-1]){const tip=[a0[0]+perp[0]*L*sg+dir[0]*L*fw,a0[1]+L*(stiff?.18:-.12)-sm*.05,a0[2]+perp[1]*L*sg+dir[1]*L*fw];tri.push(a0,a1,tip);const cc=tc.copy(col1).lerp(col2,sm*.8+(sg>0?.08:0));for(let k=0;k<3;k++){cols.push(cc.r,cc.g,cc.b);sw.push(swayK*(sm**1.4));}}
    if(width){const off=[perp[0]*width,0,perp[1]*width];tri.push([a0[0]-off[0],a0[1],a0[2]-off[2]],[a1[0]+off[0],a1[1],a1[2]+off[2]],[a1[0]-off[0],a1[1],a1[2]-off[2]]);const cc=tc.copy(col1).lerp(C('#7f7a52'),.4);for(let k=0;k<3;k++){cols.push(cc.r,cc.g,cc.b);sw.push(swayK*(sm**1.4));}}}
   const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(tri.flat(),3));g.computeVertexNormals();const nor=g.attributes.normal,p=new T.Vector3(),n=new T.Vector3(),base=B.count;
   for(let k=0;k<tri.length;k++){p.fromArray(tri[k]);n.fromBufferAttribute(nor,k);if(n.y<0)n.negate();n.y+=.6;n.normalize();tc2.setRGB(cols[k*3],cols[k*3+1],cols[k*3+2]);B.vert(p,n,tc2,sw[k]);B.i.push(base+k);}
  }
  // 树蕨
  {const B=new Builder(),H=4.4,bark=C('#6b5848'),fib=C('#584a3d');
   loft(B,[[0,0,0,.3],[.1,1.2,0,.2],[.05,2.6,.1,.18],[-.1,3.8,0,.2],[-.08,H,0,.24]],{rings:10,sides:7,color:m=>tc.copy(bark).lerp(fib,Math.sin(m.u*40)*.5+.5),sway:m=>m.u*.03});
   B.add(new T.SphereGeometry(.34,7,5),M(-.08,H+.05,0),C('#6e6a45'),{sway:.03});
   for(let i=0;i<11;i++)frond(B,{len:2.7+noise(i,2,3)*.6,rise:.55,droop:1.05,a:i/11*TAU+.3,y0:H+.1,x0:-.08,seg:11,leaflet:.5,width:.03,overlap:1.5,col1:C('#5d8150'),col2:C(i%3?'#93ad66':'#a9b872'),swayK:.32});
   floraGeo.treeFern=track(B.build());}
  // 苏铁：短粗树干 + 硬挺羽叶
  {const B=new Builder(),bark=C('#6f5c45'),bark2=C('#9a8361');B.add(new T.CylinderGeometry(.2,.27,.72,10,6),M(0,.36,0),p=>tc.copy(bark).lerp(bark2,(Math.sin(p.y*26+Math.atan2(p.z,p.x)*5)*Math.sin(p.y*26-Math.atan2(p.z,p.x)*5)>0?1:0)*.7));
   B.add(new T.ConeGeometry(.14,.34,7),M(0,.86,0),C('#c9a35f'));
   for(let i=0;i<15;i++)frond(B,{len:1.5+(i%3)*.18,rise:.85+(i%2)*.25,droop:.65,a:i/15*TAU+(i%2)*.1,y0:.7,seg:12,leaflet:.33,width:.03,overlap:2.3,col1:C('#4c6e43'),col2:C(i%2?'#86a35c':'#7a9a55'),stiff:true,swayK:.12});
   floraGeo.cycad=track(B.build());}
  // 木贼：一丛分节的直立茎
  {const B=new Builder(),stem=C('#8ea463'),node=C('#4f5e3e');for(let i=0;i<10;i++){const a=i*2.4,r=.12+noise(i,1,2)*.42,h=.7+noise(i,5,3)*1.05,x=Math.cos(a)*r,z=Math.sin(a)*r,lean=(noise(i,9,4)-.5)*.25;
    B.add(new T.CylinderGeometry(.024,.036,h,5,4,true),M(x,h/2,z,lean,0,lean*.7),p=>tc.copy(stem).lerp(node,(p.y%.2)<.03?.85:0),{sway:p=>p.y*p.y*.02});
    B.add(new T.ConeGeometry(1,1,5),M(x+Math.sin(lean*.7)*-h,h+.04,z+Math.sin(lean)*h,0,0,0,.034,.1,.034),C('#7b6a4c'),{sway:h*h*.02});}floraGeo.horsetail=track(B.build());}
  // 地面蕨类两种：直立型与匍匐型
  for(const [nm,cnt,len,rise,droop,seg,lf] of[['fern',7,1,.95,.75,8,.17],['fernLow',8,.8,.5,.6,7,.17],['carpet',5,.55,.38,.5,4,.15]]){const B=new Builder();for(let i=0;i<cnt;i++)frond(B,{len:len*(.8+noise(i,3,6)*.4),rise,droop,a:i/cnt*TAU+noise(i,1,1)*.4,y0:.02,seg,leaflet:lf*len,width:0,overlap:1.6,col1:C('#5f7f4c'),col2:C(i%3?'#98b067':'#a9b672'),swayK:.12});floraGeo[nm]=track(B.build());}
  // 苔藓垫、石块、地层小台地、倒木
  {const B=new Builder();B.add(lumpy(new T.SphereGeometry(1,8,5,0,TAU,0,Math.PI*.55),.3,3,2.2),M(0,-.1,0,0,0,0,1,.62,1),(p,nn)=>tc.copy(C('#4f6d40')).lerp(C('#7a9752'),clamp01(nn.y*.45+noise(p.x*5,p.z*5,2)*.55)));floraGeo.moss=track(B.build());}
  {const B=new Builder();B.add(lumpy(new T.IcosahedronGeometry(1,0),.3,7),M(0,0,0,0,0,0,1,.55,1),(p,nn)=>tc.copy(C('#8f8b77')).lerp(C('#b9b39a'),clamp01(nn.y*.6)));floraGeo.pebble=track(B.build());}
  for(const k of[0,1]){const g=lumpy(new T.IcosahedronGeometry(1,1),.32,k*11+2,1.1);const B2=new Builder();B2.add(g,M(0,0,0,0,0,0,1,.68,1),(p,nn)=>tc.copy(C(k?'#a9a58d':'#9a9a84')).lerp(C('#c4bea1'),noise(p.x*2,p.y*2,k)*.5).lerp(C('#7a9058'),smooth(.75,.95,nn.y)*.4));floraGeo['rock'+k]=track(B2.build());}
  {const B=new Builder(),bands=['#cdb98f','#b8946d','#dacaa4','#a88a6c','#c9b48b','#9e8b73'].map(C),moss=C('#86a061');let y=0;
   for(let i=0;i<4;i++){const h=.55+noise(i,2,8)*.55,r=2.7*(1-i*.11)*(.9+noise(i,5,8)*.2),g=new T.CylinderGeometry(r*.94,r,h,9,1);const pp=g.attributes.position;for(let k=0;k<pp.count;k++){const a=Math.atan2(pp.getZ(k),pp.getX(k)),j=1+(noise(Math.cos(a)*2+i*3,Math.sin(a)*2,9)-.5)*.5;pp.setX(k,pp.getX(k)*j);pp.setZ(k,pp.getZ(k)*j);}g.computeVertexNormals();
    const col=bands[i%bands.length];B.add(g,M((noise(i,4,2)-.5)*.9,y+h/2,(noise(i,7,2)-.5)*.9,(noise(i,1,3)-.5)*.1,i*.9,(noise(i,2,3)-.5)*.1),(p,nn)=>tc.copy(col).lerp(moss,i===3&&nn.y>.7?.6:0));y+=h*.97;}
   floraGeo.mesa=track(B.build());}
  {const B=new Builder(),bark=C('#7c6650'),moss=C('#7f9c5a');B.add(new T.CylinderGeometry(.34,.42,7,11,6),M(0,.36,0,0,0,Math.PI/2),(p,nn)=>tc.copy(bark).lerp(C('#5c4a3b'),(Math.sin(Math.atan2(p.z,p.y-.36)*11+p.x*.7)>.3?.5:0)).lerp(moss,smooth(.45,.85,nn.y)*smooth(.35,.7,noise(p.x*.9,1,4))*.9).lerp(C('#c9b58f'),Math.abs(p.x)>3.35?.6:0));
   B.add(new T.CylinderGeometry(.08,.14,1.3,6),along([1.2,.6,.2],[1.6,1.3,.9],1),bark);B.add(lumpy(new T.IcosahedronGeometry(1,1),.3,5),M(-1.5,.82,0,0,0,0,.55,.18,.42),moss);floraGeo.log=track(B.build());}
 }

 // ───────── 地面 ─────────
 const groundG=track(new T.PlaneGeometry(760,760,190,190));groundG.rotateX(-Math.PI/2);
 {const p=groundG.attributes.position,uv=groundG.attributes.uv,cols=[],hill=C('#6f8c64'),far=C('#86a08a');for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),h=groundHeight(x,z);p.setY(i,h);uv.setXY(i,(x+128)/256,(z+128)/256);const d=squareDistance(x,z);tc.setRGB(1,1,1).lerp(hill,smooth(118,150,d)*.5).lerp(far,smooth(180,330,d)*.6);cols.push(tc.r,tc.g,tc.b);}
  groundG.setAttribute('color',new T.Float32BufferAttribute(cols,3));groundG.computeVertexNormals();}

 // ───────── 展区：动物 ─────────
 const add=(name,o)=>{const c=spawn(name,o);if(o.collide!==false)bodyColliders(c,o);return c;};
 // 巨兽的餐桌：腕龙抬头够树冠，梁龙低头吃蕨
 const brachio=add('brachio',{x:21,z:-28,h:1.97,s:.72});
 animators.push(t=>{const c=brachio,p=c.phase,cyc=Math.sin(t*.21+p);for(let i=0;i<c.necks.length;i++){const b=c.necks[i];b.rotation.x=-.045*cyc+Math.sin(t*.5+p+i)*.008;b.rotation.y=Math.sin(t*.16+p)*.05;}c.B.head.rotation.x=.18+Math.sin(t*2.1+p)*.03*(cyc>0?1:.3);c.B.head.rotation.y=Math.sin(t*.3)*.08;tailWave(c,t,.045,.55);breathe(c,t);});
 const diplo=add('diplo',{x:-5,z:-39,h:-1.62,s:.7});
 animators.push(t=>{const c=diplo,p=c.phase,g=.5+.5*Math.sin(t*.13+p);for(let i=0;i<c.necks.length;i++){const b=c.necks[i];b.rotation.x=(.1+.06*g)*(i===0?.9:1.15)+Math.sin(t*.4+i)*.01;b.rotation.y=Math.sin(t*.19+p)*.09;}c.B.head.rotation.x=.25*g+Math.sin(t*1.9)*.03;tailWave(c,t,.06,.5);breathe(c,t);});
 const diploJ=add('diplo',{x:-17,z:-50,h:-1.2,s:.36,tint:'#f4f0e2'});
 animators.push(t=>{const c=diploJ,p=c.phase;for(const b of c.necks){b.rotation.x=.04+Math.sin(t*.35+p)*.05;b.rotation.y=Math.sin(t*.27+p)*.12;}c.B.head.rotation.x=.1;tailWave(c,t,.09,.9);breathe(c,t,.02);});
 // 背板里的秘密：剑龙母子
 const stego=add('stego',{x:-29,z:-27,h:-1.85,s:1});
 animators.push(t=>{const c=stego,p=c.phase,g=smooth(-.3,.6,Math.sin(t*.17+p));for(const b of c.necks){b.rotation.x=.16*g;b.rotation.y=Math.sin(t*.23+p)*.12;}c.B.head.rotation.x=.12*g+Math.sin(t*2.4)*.04*g;tailWave(c,t,.09,.6);breathe(c,t);});
 const stegoJ=add('stego',{x:-21,z:-33,h:-1.25,s:.52,tint:'#f6f1df'});
 animators.push(t=>{const c=stegoJ,p=c.phase;for(const b of c.necks){b.rotation.x=.08+Math.sin(t*.3+p)*.06;b.rotation.y=Math.sin(t*.4+p)*.15;}tailWave(c,t,.12,1);breathe(c,t,.02);});
 // 白垩纪末期展区：湖边的三角龙
 const trikes=[add('trike',{x:57.5,z:1,h:-2.55,s:1}),add('trike',{x:66,z:9,h:-1.85,s:.5,tint:'#f7f0df'}),add('trike',{x:73,z:3,h:-2.2,s:.95,tint:'#efe6d6'})];
 animators.push(t=>{for(let i=0;i<trikes.length;i++){const c=trikes[i],p=c.phase,g=i===0?smooth(-.2,.5,Math.sin(t*.2+p)):.3+.3*Math.sin(t*.25+p);for(const b of c.necks){b.rotation.x=(i===0?.2:.1)*g;b.rotation.y=Math.sin(t*.21+p)*(i===1?.2:.08);}c.B.head.rotation.x=.18*g;tailWave(c,t,.08,.8);breathe(c,t);}});
 // 霸王龙在河湾对岸慢慢巡游（水面把它和步道隔开）
 const rex=spawn('rex',{x:REX_HOME.x+REX_HOME.rx,z:REX_HOME.z,h:Math.PI,s:.95});obstacles.push({x:REX_HOME.x,z:REX_HOME.z,r:13,base:0,height:6,walkable:false});keepOut.push({x:REX_HOME.x,z:REX_HOME.z,r:12,kind:'animal'});
 animators.push(t=>{const c=rex,v=1.05/((REX_HOME.rx+REX_HOME.rz)/2),a=t*v+c.phase,ca=Math.cos(a),sa=Math.sin(a);c.mesh.position.set(REX_HOME.x+ca*REX_HOME.rx,0,REX_HOME.z+sa*REX_HOME.rz);c.mesh.rotation.y=Math.atan2(-sa*REX_HOME.rx,ca*REX_HOME.rz);const ph=t*1.6+c.phase;walk(c,ph,.32,.5,false,.05);for(const b of c.necks)b.rotation.y=Math.sin(t*.3)*.12;c.B.head.rotation.x=Math.sin(ph*2)*.03;c.B.head.rotation.y=Math.sin(t*.37)*.15;tailWave(c,ph*.5,.05,1);});
 // 小型植食恐龙群：会在附近游荡，玩家靠近时跑开
 const herd=[];for(let i=0;i<6;i++){const x=HERD_HOME.x+rr(-7,7),z=HERD_HOME.z+rr(-6,6),h=rr(-3,3),c=spawn('orni',{x,z,h,s:rr(.85,1.08),tint:i%2?'#ffffff':'#f1eee0'});herd.push({c,x,z,h,speed:0,tx:x,tz:z,timer:rr(0,5),mode:'graze',step:rr(0,6)});}
 keepOut.push({x:HERD_HOME.x,z:HERD_HOME.z,r:HERD_HOME.r-4,kind:'herd'});
 animators.push((t,dt,player,reduced)=>{for(const a of herd){const c=a.c,dxp=a.x-player.x,dzp=a.z-player.z,dp=Math.hypot(dxp,dzp)||1;let want=0,tx=0,tz=0;
  if(dp<9){want=2+5*(1-dp/9);tx=dxp/dp;tz=dzp/dp;}
  else if(!reduced){a.timer-=dt;if(a.timer<=0){a.timer=rr(3,8);a.mode=random()<.5?'graze':'walk';const r=rr(0,HERD_HOME.r-5),q=rr(0,TAU);a.tx=HERD_HOME.x+Math.cos(q)*r;a.tz=HERD_HOME.z+Math.sin(q)*r;}if(a.mode==='walk'){const d=Math.hypot(a.tx-a.x,a.tz-a.z);if(d>.8){want=1.3;tx=(a.tx-a.x)/d;tz=(a.tz-a.z)/d;}else a.mode='graze';}}
  if(reduced&&want===0){a.speed=0;}else for(const b of herd)if(b!==a){const d=Math.hypot(a.x-b.x,a.z-b.z);if(d<1.6&&d>0){a.x+=(a.x-b.x)/d*(1.6-d)*.5;a.z+=(a.z-b.z)/d*(1.6-d)*.5;}}
  if(want>0&&dt>0){a.h+=angleDelta(a.h,Math.atan2(tx,tz))*(1-Math.exp(-(want>2?7:3)*dt));}
  a.speed=damp(a.speed,want,want>2?6:2.5,dt);a.x+=Math.sin(a.h)*a.speed*dt;a.z+=Math.cos(a.h)*a.speed*dt;
  const dh=Math.hypot(a.x-HERD_HOME.x,a.z-HERD_HOME.z);if(dh>HERD_HOME.r){a.x=HERD_HOME.x+(a.x-HERD_HOME.x)/dh*HERD_HOME.r;a.z=HERD_HOME.z+(a.z-HERD_HOME.z)/dh*HERD_HOME.r;}
  c.mesh.position.set(a.x,0,a.z);c.mesh.rotation.y=a.h;a.step+=a.speed*dt/1.1*TAU;const moving=smooth(.05,.6,a.speed);
  walk(c,a.step,.55*moving,.9*moving,false,.03*moving);const graze=a.mode==='graze'&&a.speed<.2&&!reduced?smooth(-.4,.4,Math.sin(t*.6+c.phase)):0;
  c.B.chest.rotation.x=.35*graze;c.B.neck1.rotation.x=.3*graze-.1*smooth(2,6,a.speed);c.B.head.rotation.y=Math.sin(t*.9+c.phase)*.25*(1-graze);tailWave(c,t*1.4,.07+.05*moving,1.2);}});
 // 远处河滩上缓慢迁徙的蜥脚类恐龙（在边界以外）
 const parade=[['brachio',.6,115],['brachio',.36,128],['diplo',.58,190],['diplo',.55,214],['diplo',.33,228]].map(([nm,s,off])=>({c:spawn(nm,{x:0,z:-128,h:-Math.PI/2,s,shadow:false}),off,s}));
 animators.push(t=>{for(const q of parade){const c=q.c,x=175-((t*.85+q.off)%350),z=-128+Math.sin(x*.02)*4;c.mesh.position.set(x,groundHeight(x,z),z);c.mesh.rotation.y=-Math.PI/2+Math.cos(x*.02)*.08;const ph=(175-x)/(4.4*q.s)*TAU*.5;walk(c,ph,.14,.3,true,.06);tailWave(c,t,.05,.5);for(const b of c.necks)b.rotation.x=Math.sin(t*.2+q.off)*.03;}});
 // 翼龙：大部分时间滑翔，偶尔振翅；翼龙不是恐龙
 const fliers=[{c:[40,-20],r:38,y:30,w:.14,e:.7},{c:[18,-8],r:48,y:37,w:-.11,e:.8},{c:[55,-25],r:24,y:23,w:.2,e:1},{c:[32,8],r:26,y:15,w:-.18,e:.75},{c:[-12,-32],r:46,y:42,w:.1,e:.9},{c:[60,-60],r:30,y:34,w:-.15,e:.8}].map((f,i)=>({...f,p:spawn('ptero',{x:f.c[0],z:f.c[1],y:f.y,s:i===3?1.15:rr(.85,1.05),shadow:i===3}),ph:i*1.9}));
 for(const f of fliers)f.p.mesh.rotation.order='YXZ';
 animators.push(t=>{for(const f of fliers){const c=f.p,a=t*f.w+f.ph,ca=Math.cos(a),sa=Math.sin(a),x=f.c[0]+ca*f.r,z=f.c[1]+sa*f.r*f.e;c.mesh.position.set(x,f.y+Math.sin(a*1.7)*2.5,z);c.mesh.rotation.y=Math.atan2(-sa*f.w,ca*f.e*f.w);c.mesh.rotation.z=(f.w>0?-1:1)*.32;c.mesh.rotation.x=-Math.cos(a*1.7)*.06;
  const env=smooth(.45,.85,.5+.5*Math.sin(t*.33+f.ph)),fl=Math.sin(t*3.1+f.ph);const B=c.B;B.lw0.rotation.z=.08+fl*.5*env;B.rw0.rotation.z=-.08-fl*.5*env;B.lw1.rotation.z=Math.sin(t*3.1+f.ph-.7)*.28*env;B.rw1.rotation.z=-Math.sin(t*3.1+f.ph-.7)*.28*env;B.lw2.rotation.z=Math.sin(t*3.1+f.ph-1.3)*.22*env-.04;B.rw2.rotation.z=-Math.sin(t*3.1+f.ph-1.3)*.22*env+.04;
  B.neck1.rotation.y=Math.sin(t*.4+f.ph)*.18;B.head.rotation.x=Math.sin(t*.5+f.ph)*.08;B.pelvis.position.y=c.pelvisY-fl*.04*env;}});

 // ───────── 化石营地：发掘坑、骨骼、工具、地层剖面 ─────────
 const camp=new Builder(),soil=C('#c6a67c'),soilD=C('#9c7d5e'),bone=C('#ede2c4'),bone2=C('#d6c59f'),wood=C('#8d7155'),wood2=C('#a88a66'),white=C('#f3efe2'),orange=C('#e08b55'),dark=C('#3e413b');
 const P=CAMP.pit,pitM=(lx,ly,lz,rx=0,ry=0,rz=0,sx=1,sy=sx,sz=sx)=>new T.Matrix4().makeTranslation(P.x,0,P.z).multiply(new T.Matrix4().makeRotationY(P.ry)).multiply(M(lx,ly,lz,rx,ry,rz,sx,sy,sz));
 {const bandC=(p)=>{const y=p.y;return tc.copy(y<.1?soilD:y<.2?soil:y<.3?C('#b48f69'):y<.4?C('#d2b78e'):C('#86a061'));};
  camp.add(new T.BoxGeometry(P.hx*2,.04,P.hz*2),pitM(0,.02,0),C('#cfb388'));
  for(const [lx,lz,sx,sz,h] of[[0,-P.hz-.35,P.hx*2+1.4,.7,.5],[0,P.hz+.3,P.hx*2+1.4,.6,.22],[-P.hx-.35,0,.7,P.hz*2,.45],[P.hx+.35,0,.7,P.hz*2,.42]])camp.add(new T.BoxGeometry(sx,h,sz,4,4,1),pitM(lx,h/2,lz),bandC);
  camp.add(lumpy(new T.SphereGeometry(1,10,6,0,TAU,0,Math.PI/2),.2,4),pitM(P.hx+2.4,0,-1.4,0,0,0,1.7,.75,1.3),(p,nn)=>tc.copy(soil).lerp(soilD,noise(p.x*3,p.z*3,1)*.6));
  // 骨架：头骨、弯曲的颈椎、肋骨、腿骨（化石埋藏常见的仰头姿态）
  const spineAt=s=>[-3+6*s,.09,.55*Math.sin(s*Math.PI*1.35-.4)-(s<.22?(.22-s)*4.2:0)];
  camp.add(new T.SphereGeometry(1,10,7),pitM(...spineAt(0).map((v,k)=>k===0?v-.45:v),0,.5,0,.46,.17,.24),bone);camp.add(new T.SphereGeometry(1,8,6),pitM(spineAt(0)[0]-.55,.07,spineAt(0)[2]+.22,0,.5,0,.4,.07,.11),bone2);
  camp.add(new T.SphereGeometry(1,6,4),pitM(spineAt(0)[0]-.32,.2,spineAt(0)[2]+.03,0,0,0,.07,.05,.07),C('#8c7a62'));
  for(let i=1;i<34;i++){const s=i/34,q=spineAt(s),r=.11*(1-s*.75)+.02;camp.add(new T.SphereGeometry(1,6,4),pitM(q[0],q[1]+r*.3,q[2],0,0,0,r*1.2,r*.8,r),i%2?bone:bone2);}
  for(let i=0;i<8;i++){const s=.26+i*.03,q=spineAt(s);for(const sg of[1,-1])camp.add(new T.TorusGeometry(.55-i*.03,.028,4,10,Math.PI*.8),pitM(q[0],.06,q[2]+sg*.05,-Math.PI/2,0,sg>0?.2:Math.PI-.2),bone);}
  const hip=spineAt(.52);camp.add(new T.SphereGeometry(1,8,6),pitM(hip[0],.1,hip[2],0,.3,0,.42,.12,.3),bone2);
  for(const [a,b] of[[[hip[0],.1,hip[2]+.3],[hip[0]+.35,.1,hip[2]+1.05]],[[hip[0]+.35,.1,hip[2]+1.05],[hip[0]-.2,.1,hip[2]+1.7]],[[hip[0]-.15,.09,hip[2]-.25],[hip[0]+.5,.09,hip[2]-.85]]]){camp.add(new T.CylinderGeometry(.06,.07,1,7),pitM(0,0,0).multiply(along(a,b,1)),bone);camp.add(new T.SphereGeometry(.1,6,4),pitM(...b),bone2);}
 }
 obstacles.push({x:P.x,z:P.z,hx:P.hx+.75,hz:P.hz+.7,ry:P.ry,base:0,height:.5,walkable:false});keepOut.push({x:P.x,z:P.z,r:6.2,kind:'camp'});
 // 测量网格、木桩、标尺、编号牌、工具、三脚架相机
 for(let i=0;i<=8;i++)camp.add(new T.BoxGeometry(.018,.018,P.hz*2),pitM(-P.hx+i*P.hx/4,.46,0),white);
 for(let j=0;j<=5;j++)camp.add(new T.BoxGeometry(P.hx*2,.018,.018),pitM(0,.46,-P.hz+j*P.hz*2/5),white);
 for(const [lx,lz] of[[-P.hx,-P.hz],[P.hx,-P.hz],[-P.hx,P.hz],[P.hx,P.hz],[0,-P.hz],[0,P.hz]]){camp.add(new T.BoxGeometry(.06,.62,.06),pitM(lx,.31,lz),wood);camp.add(new T.BoxGeometry(.08,.07,.08),pitM(lx,.64,lz),orange);}
 for(let i=0;i<10;i++)camp.add(new T.BoxGeometry(.1,.025,.06),pitM(-2.6+i*.1,.06,-1.6),i%2?white:dark);
 camp.add(new T.ConeGeometry(.09,.26,3),pitM(-1.35,.06,-1.6,-Math.PI/2,0,0),white);
 for(const [lx,lz] of[[-2.9,.6],[.3,-.4],[1.8,1.2],[-1.1,1.4]]){camp.add(new T.CylinderGeometry(.008,.008,.3,4),pitM(lx,.17,lz),white);camp.add(new T.BoxGeometry(.13,.08,.01),pitM(lx+.06,.3,lz),C('#efd36a'));}
 camp.add(new T.CylinderGeometry(.19,.15,.32,12,1,true),pitM(P.hx+1.1,.16,1.3),C('#6f9aa1'));camp.add(new T.CircleGeometry(.15,12),pitM(P.hx+1.1,.01,1.3,-Math.PI/2),C('#5a7e85'));
 camp.add(new T.BoxGeometry(.75,.08,.55),pitM(P.hx+1.2,.18,.2,0,.3,0),wood2);camp.add(new T.PlaneGeometry(.66,.46),pitM(P.hx+1.2,.2,.2,-Math.PI/2,0,.3),C('#8a8a7c'));
 for(let i=0;i<3;i++){camp.add(new T.CylinderGeometry(.015,.015,.28,5),pitM(-P.hx+.6+i*.2,.03,P.hz+.05,Math.PI/2,0,0),C('#b08a5a'));camp.add(new T.BoxGeometry(.06,.04,.1),pitM(-P.hx+.6+i*.2,.03,P.hz+.24),C('#e4d4a8'));}
 camp.add(new T.BoxGeometry(.45,.05,.32),pitM(-1.8,.04,P.hz-.4),C('#7f97a6'));
 {const tp=[-P.hx-1.1,0,P.hz+1.2];for(let i=0;i<3;i++){const a=i/3*TAU;camp.add(new T.CylinderGeometry(.018,.022,1,5),pitM(0,0,0).multiply(along([tp[0]+Math.cos(a)*.45,0,tp[2]+Math.sin(a)*.45],[tp[0],1.35,tp[2]],1)),dark);}
  camp.add(new T.BoxGeometry(.24,.17,.13),pitM(tp[0],1.45,tp[2],0,.9,0),C('#4b4f4a'));camp.add(new T.CylinderGeometry(.06,.06,.12,10),pitM(tp[0]+.09,1.45,tp[2]-.09,Math.PI/2,.9,0),C('#2f3330'));
  obstacles.push({x:P.x+Math.cos(P.ry)*tp[0]+Math.sin(P.ry)*tp[2],z:P.z-Math.sin(P.ry)*tp[0]+Math.cos(P.ry)*tp[2],r:.5,base:0,height:1.6,walkable:false});}
 // 遮阳帐篷与标本桌
 {const tn=CAMP.tent,tM=(lx,ly,lz,rx=0,ry=0,rz=0,sx=1,sy=sx,sz=sx)=>new T.Matrix4().makeTranslation(tn.x,0,tn.z).multiply(new T.Matrix4().makeRotationY(tn.ry)).multiply(M(lx,ly,lz,rx,ry,rz,sx,sy,sz)),canvas=C('#f0e6cb'),stripe=C('#d8b98a');
  for(const [lx,lz,h] of[[-2.3,-1.6,2.3],[2.3,-1.6,2.3],[-2.3,1.6,2.3],[2.3,1.6,2.3],[-2.3,0,2.98],[2.3,0,2.98]]){camp.add(new T.CylinderGeometry(.05,.06,h,6),tM(lx,h/2,lz),wood);const w=Math.cos(tn.ry),s=Math.sin(tn.ry);obstacles.push({x:tn.x+lx*w+lz*s,z:tn.z-lx*s+lz*w,r:.18,base:0,height:h,walkable:false});}
  const th=Math.atan2(.68,1.62);for(const sg of[-1,1]){camp.add(new T.PlaneGeometry(5.2,1.9,12,1),tM(0,2.63,sg*.82,-Math.PI/2+sg*th,0,0),p=>tc.copy(canvas).lerp(stripe,Math.floor(((p.x-tn.x)*Math.cos(tn.ry)-(p.z-tn.z)*Math.sin(tn.ry))*1.6+40)%2?.65:0));camp.add(new T.PlaneGeometry(5.2,.3),tM(0,2.15,sg*1.7),stripe);}
  camp.add(new T.BoxGeometry(2.2,.07,.95),tM(0,.82,0),wood2);for(const [lx,lz] of[[-1,-.4],[1,-.4],[-1,.4],[1,.4]])camp.add(new T.BoxGeometry(.06,.8,.06),tM(lx,.4,lz),wood);
  camp.add(new T.SphereGeometry(1,10,7),tM(-.5,.98,0,0,.3,0,.32,.14,.18),bone);camp.add(new T.SphereGeometry(1,8,5),tM(-.66,.92,.1,0,.3,0,.26,.06,.1),bone2);
  for(let i=0;i<4;i++)camp.add(new T.BoxGeometry(.28,.05,.2),tM(.25+i*.3,.88,-.15),i%2?C('#e9e4d6'):C('#d9d2bf'));
  camp.add(new T.CylinderGeometry(.03,.035,.55,6),tM(.5,.9,.25,0,0,Math.PI/2+.3),bone);camp.add(new T.BoxGeometry(.32,.025,.24),tM(.9,.87,.25,0,.2,0),C('#5f7f8c'));
  camp.add(new T.TorusGeometry(.08,.012,5,14),tM(.1,.87,.25,Math.PI/2,0,0),dark);camp.add(new T.CylinderGeometry(.012,.012,.14,5),tM(.2,.87,.32,Math.PI/2,0,-.8),C('#7b5f3e'));
  obstacles.push({x:tn.x,z:tn.z,hx:1.2,hz:.6,ry:tn.ry,base:0,height:1,walkable:false});
  for(const [lx,lz,s,h] of[[3.3,-1.2,.7,.55],[3.35,-.4,.6,.5],[3.3,-.8,.55,1.05]]){camp.add(new T.BoxGeometry(s,h,s,1,2,1),tM(lx,h/2,lz),p=>tc.copy(wood2).lerp(wood,(Math.floor(p.y*7)%2)*.5));}
  {const w=Math.cos(tn.ry),s=Math.sin(tn.ry);obstacles.push({x:tn.x+3.3*w-.8*s,z:tn.z-3.3*s-.8*w,r:.85,base:0,height:1.1,walkable:false});}
  keepOut.push({x:tn.x,z:tn.z,r:4.5,kind:'camp'},{x:tn.x+3*Math.cos(tn.ry),z:tn.z-3*Math.sin(tn.ry),r:2,kind:'camp'});}
 // 地层剖面：一面带彩色岩层的小陡坎，岩层里露出一段腿骨和椎骨
 const strataB=new Builder();
 {const S=CAMP.strata,co=Math.cos(S.ry),si=Math.sin(S.ry),W2=(lx,y,lz)=>new T.Vector3(S.x+lx*co+lz*si,y,S.z-lx*si+lz*co);
  const bands=['#8f7760','#d4bf93','#b07f5c','#e6d6b0','#9c7a5e','#cfb88d','#a8896b','#ead9b4'].map(C),moss=C('#89a463'),cols=26,rows=10,face=[],faceIdx=[];
  const Hx=lx=>S.H*smooth(-S.L/2,-S.L/2+4.5,lx)*(1-smooth(S.L/2-4.5,S.L/2,lx))*(.82+.18*noise(lx*.3,1,4));
  const pos=[],colsArr=[],idx=[];
  for(let i=0;i<=cols;i++)for(let k=0;k<=rows;k++){const lx=-S.L/2+i/cols*S.L,h=Hx(lx),y=k/rows*h,lz=(noise(lx*.6,y*.7,2)-.5)*.5+y*.16+(k===rows?.3:0);const v=W2(lx,y,lz);pos.push(v.x,v.y,v.z);const b=Math.floor((y+.25*Math.sin(lx*.45)+.15*noise(lx,y,3))/.62);tc.copy(bands[((b%bands.length)+bands.length)%bands.length]);if(k===rows)tc.lerp(moss,.65);colsArr.push(tc.r,tc.g,tc.b);
   if(i<cols&&k<rows){const a=i*(rows+1)+k,b2=a+rows+1;idx.push(a,a+1,b2,a+1,b2+1,b2);}}
  // 坡顶与背坡
  const back=pos.length/3,dep=8;for(let i=0;i<=cols;i++)for(let k=1;k<=dep;k++){const lx=-S.L/2+i/cols*S.L,f=k/dep,h=Hx(lx)*(1-smooth(.2,1,f))*(1+.08*noise(lx*.4,f*5,6)),lz=Hx(lx)*.16+.3+f*S.D;const v=W2(lx,h,lz);pos.push(v.x,v.y,v.z);tc.copy(moss).lerp(C('#a2a873'),noise(lx*.5,f*4,8)*.6);colsArr.push(tc.r,tc.g,tc.b);
   const prev=k===1?i*(rows+1)+rows:back+i*dep+(k-2),cur=back+i*dep+(k-1);if(i<cols){const prevN=k===1?(i+1)*(rows+1)+rows:back+(i+1)*dep+(k-2),curN=back+(i+1)*dep+(k-1);idx.push(prev,cur,prevN,cur,curN,prevN);}}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(colsArr,3));g.setIndex(idx);g.computeVertexNormals();
  const gp=g.attributes.position,gn=g.attributes.normal,gc=g.attributes.color,p=new T.Vector3(),n=new T.Vector3();for(let k=0;k<gp.count;k++){p.fromBufferAttribute(gp,k);n.fromBufferAttribute(gn,k);tc.setRGB(gc.getX(k),gc.getY(k),gc.getZ(k));strataB.vert(p,n,tc);}for(const i of idx)strataB.i.push(i);
  // 岩层里的化石
  const fz=-.12,fy=2.3;camp.add(new T.CylinderGeometry(.11,.13,1,8),along(W2(-2.4,fy,fz).toArray(),W2(-.6,fy+.25,fz).toArray(),1),bone);for(const lx of[-2.45,-.55])camp.add(new T.SphereGeometry(.2,8,6),M(...W2(lx,fy+(lx>-1?.25:0),fz).toArray()),bone2);
  for(let i=0;i<6;i++)camp.add(new T.SphereGeometry(1,7,5),M(...W2(1+i*.42,3.45+Math.sin(i*.8)*.08,fz+.02).toArray(),0,0,0,.17,.13,.12),i%2?bone:bone2);
  for(let i=0;i<4;i++)camp.add(new T.TorusGeometry(.33,.025,4,10,Math.PI),new T.Matrix4().compose(W2(1.2+i*.4,3.2,fz),new T.Quaternion().setFromEuler(new T.Euler(0,S.ry,Math.PI)),new T.Vector3(1,1,1)),bone);
  obstacles.push({x:S.x+(S.D*.45)*si,z:S.z+(S.D*.45)*co,hx:S.L/2-2,hz:S.D*.5,ry:S.ry,base:0,height:S.H,walkable:false});keepOut.push({x:S.x+(S.D*.45)*si,z:S.z+(S.D*.45)*co,r:12,kind:'camp'});}
 // 展区说明牌（与课程内容一致：不同时期，分区展示）
 const signs=[{x:6.3,z:24,ry:-.35,title:'晚侏罗世展区',sub:'距今约1.5亿年 · 剑龙 · 长颈恐龙'},{x:31.5,z:31.8,ry:-1.05,title:'白垩纪末期展区',sub:'距今约6600万年 · 三角龙 · 霸王龙'}];
 for(const s of signs){const sM=(lx,ly,lz)=>new T.Matrix4().makeTranslation(s.x,0,s.z).multiply(new T.Matrix4().makeRotationY(s.ry)).multiply(M(lx,ly,lz));
  for(const sg of[-1,1])camp.add(new T.BoxGeometry(.13,2.25,.13),sM(sg*1.05,1.12,0),wood);camp.add(new T.BoxGeometry(2.6,1.2,.1),sM(0,1.7,-.02),wood2);camp.add(new T.BoxGeometry(2.8,.12,.3),sM(0,2.36,-.02),wood);
  obstacles.push({x:s.x,z:s.z,hx:1.35,hz:.25,ry:s.ry,base:0,height:2.4,walkable:false});keepOut.push({x:s.x,z:s.z,r:2.2,kind:'camp'});}
 // 倒木
 const logs=[[-12.5,31.5,.35],[19,-3.5,1.9],[-44,4,.9],[28,-12,-.4],[-27,-38,1.2],[62,22,.2]];
 for(const [x,z,ry] of logs){const co=Math.cos(ry),si=Math.sin(ry);for(let k=-3;k<=3;k+=1.5)obstacles.push({x:x+k*co,z:z-k*si,r:.55,base:0,height:.85,walkable:false});keepOut.push({x,z,r:4.2,kind:'log'});occupy(x,z,3.5);}
 scatter(floraGeo.log,floraMat,logs.map(([x,z,ry])=>({x,y:0,z,ry})),{shadow:true});
 addMesh(track(camp.build()),campMat,{shadow:true});
 addMesh(track(strataB.build()),rockMat,{shadow:true});

 // ───────── 水：湖与河 ─────────
 const waterMat=track(new T.ShaderMaterial({transparent:true,depthWrite:false,fog:true,
  uniforms:T.UniformsUtils.merge([T.UniformsLib.fog,{deep:{value:C('#2f6f68')},shallow:{value:C('#7fb6a2')},foam:{value:C('#eef3e4')},uTime:{value:0}}]),
  vertexShader:'#include <common>\n#include <fog_pars_vertex>\nattribute vec3 aWater;varying vec3 vW;varying vec3 vP;void main(){vW=aWater;vP=(modelMatrix*vec4(position,1.)).xyz;vec4 mvPosition=viewMatrix*vec4(vP,1.);gl_Position=projectionMatrix*mvPosition;\n#include <fog_vertex>\n}',
  fragmentShader:'#include <common>\n#include <fog_pars_fragment>\nuniform vec3 deep,shallow,foam;uniform float uTime;varying vec3 vW;varying vec3 vP;void main(){float e=vW.x;float w=sin(vP.x*.55+uTime*.5+sin(vP.z*.4))*sin(vP.z*.6-uTime*.38+vW.y*.25);float f=sin(vW.y*1.3-uTime*1.6+sin(vP.x*.7)*1.5)*sin(vP.x*1.9+vP.z*1.7);vec3 c=mix(deep,shallow,smoothstep(.15,.95,e)+w*.05);c+=smoothstep(.55,1.,w)*.07+smoothstep(.8,1.,f)*.05*step(.5,vW.z);float fl=smoothstep(.83,.93,e)*(1.-smoothstep(.95,1.,e));c=mix(c,foam,fl*(.45+.25*sin(vP.x*3.+uTime)));float a=(1.-smoothstep(.96,1.,e))*mix(.94,.82,e);gl_FragColor=vec4(c,a*clamp(vW.z+.0,0.,1.)+0.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n#include <fog_fragment>\n}'}));
 waterMat.uniforms.uTime=clock;
 {// 湖：从中心向岸边放射的网格，aWater.x 表示到岸边的比例
  const pos=[],wa=[],idx=[],S=96,rings=[0,.3,.55,.75,.88,.95,1,1.04];pos.push(LAKE.x,.03,LAKE.z);wa.push(0,0,1);
  for(const f of rings.slice(1))for(let j=0;j<S;j++){const a=j/S*TAU,r=lakeRadius(a)*f;pos.push(LAKE.x+Math.cos(a)*r,.03,LAKE.z+Math.sin(a)*r);wa.push(Math.min(1,f),r*.3,1);}
  for(let j=0;j<S;j++)idx.push(0,1+(j+1)%S,1+j);for(let k=0;k<rings.length-2;k++)for(let j=0;j<S;j++){const a=1+k*S+j,b=1+k*S+(j+1)%S,c=a+S,d=b+S;idx.push(a,b,c,b,d,c);}
  const g=track(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('aWater',new T.Float32BufferAttribute(wa,3));g.setIndex(idx);addMesh(g,waterMat).renderOrder=1;
  // 湖面碰撞：内部网格圆 + 岸线圆
  for(let x=LAKE.x-26;x<=LAKE.x+26;x+=3.4)for(let z=LAKE.z-30;z<=LAKE.z+30;z+=3.4)if(lakeDistance(x,z)<-3.2)obstacles.push({x,z,r:2.5,base:-1,height:2,walkable:false,water:true});
  for(let j=0;j<120;j++){const a=j/120*TAU,r=lakeRadius(a)-1.6;obstacles.push({x:LAKE.x+Math.cos(a)*r,z:LAKE.z+Math.sin(a)*r,r:1.75,base:-1,height:2,walkable:false,water:true});}}
 {const pos=[],wa=[],idx=[];riverSamples.forEach((ss,ri)=>{const base=pos.length/3,A=[-1.12,-.6,0,.6,1.12];for(const s of ss){const nx=-s.tz,nz=s.tx,fade=ri===0?1-smooth(s.L-9,s.L-1,s.s):smooth(1,9,s.s);for(const a of A){pos.push(s.x+nx*s.w*a,.032,s.z+nz*s.w*a);wa.push(Math.min(1,Math.abs(a)*.9+.04),s.s,fade);}}
   for(let i=0;i<ss.length-1;i++)for(let j=0;j<A.length-1;j++){const a=base+i*A.length+j,b=a+1,c=a+A.length,d=c+1;idx.push(a,b,c,b,d,c);}
   for(const s of ss)if(Math.abs(s.x)<116&&Math.abs(s.z)<116&&lakeDistance(s.x,s.z)>-2)obstacles.push({x:s.x,z:s.z,r:s.w*.98,base:-1,height:2,walkable:false,water:true});});
  const g=track(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('aWater',new T.Float32BufferAttribute(wa,3));g.setIndex(idx);addMesh(g,waterMat).renderOrder=1;}

 // ───────── 植被布置 ─────────
 const items={araucaria:[],araucariaYoung:[],conifer:[],ginkgo:[],treeFern:[],cycad:[],horsetail:[],fern:[],fernLow:[],moss:[],rock0:[],rock1:[],mesa:[],bgConifer:[],bgAraucaria:[]};
 const trees=[];// 用于树荫和碰撞
 const addTree=(kind,x,z,s,{ry=random()*TAU,color}={})=>{items[kind].push({x,y:0,z,s,ry,color});const trunk={araucaria:.5,araucariaYoung:.34,conifer:.42,ginkgo:.38}[kind]*s,crown={araucaria:4.2,araucariaYoung:3.2,conifer:3.2,ginkgo:3.4}[kind]*s,H={araucaria:20,araucariaYoung:12,conifer:15,ginkgo:10}[kind]*s;
  occupy(x,z,Math.max(1.6,crown*.55));trees.push({x,z,r:crown,kind});if(inPlay(x,z)){obstacles.push({x,z,r:trunk+.12,base:0,height:H,walkable:false});if(kind!=='araucariaYoung')obstacles.push({x,z,r:crown*.85,base:H*(kind==='araucaria'?.62:.35),height:H*.4,walkable:false});}};
 // 主景树：腕龙的“餐桌”、各站附近的构图树
 addTree('araucaria',30.5,-34,1.05,{ry:.4});addTree('araucaria',40,-50,.95);addTree('ginkgo',-10,-22,1.1,{ry:1});addTree('araucariaYoung',-37,-14,1.05);addTree('conifer',-18,31.5,1.05);addTree('ginkgo',22,18,.95,{ry:2.2});
 addTree('araucaria',-40,-40,1);addTree('conifer',-48,40,1.1);addTree('ginkgo',-24,48,.9);addTree('araucariaYoung',55,25,.95);addTree('conifer',28,-55,1.1);
 const kinds=['araucaria','araucariaYoung','araucariaYoung','conifer','ginkgo'];
 const treeOK=(x,z,r)=>trailDistance(x,z)>3.4+r*.35&&waterDistance(x,z)>3+r*.3&&stationGap(x,z)>7.5+r*.4&&!inKeepOut(x,z,r*.6+1)&&!mudInside(x,z,3)&&isFree(x,z,r);
 for(let i=0;i<2400&&trees.length<230;i++){const x=rr(-112,112),z=rr(-112,112);if(random()>forestDensity(x,z))continue;const kind=kinds[Math.floor(random()*kinds.length)],s=rr(.78,1.22),r=s*2.4;if(!treeOK(x,z,r))continue;addTree(kind,x,z,s,{color:random()<.3?'#e9efe1':random()<.5?'#f6f2df':'#ffffff'});}
 // 边界外的背景林（不需要碰撞）
 for(let i=0;i<1600;i++){const x=rr(-240,240),z=rr(-240,240),d=squareDistance(x,z);if(d<114||d>235)continue;if(z<-114&&z>-142&&Math.abs(x)<185)continue;if(riverNear(x,z)<4)continue;if(Math.hypot(x-30,z+190)<70)continue;if(random()>.55+.3*fbm(x*.02,z*.02,4))continue;
  const s=rr(.8,1.5)*(1+smooth(140,220,d)*.4);(random()<.86?items.bgConifer:items.bgAraucaria).push({x,y:groundHeight(x,z)-.3,z,s,ry:random()*TAU,color:random()<.5?'#dbe6d6':'#f1f1e2'});}
 // 林下层：树蕨、苏铁、木贼
 const under=(x,z,pad)=>trailDistance(x,z)>pad&&waterDistance(x,z)>1.2&&stationGap(x,z)>5&&!inKeepOut(x,z,.8,['animal','camp','log','herd','view'])&&!mudInside(x,z,1)&&isFree(x,z,1);
 for(let i=0;i<1500;i++){const x=rr(-108,108),z=rr(-108,108),f=forestDensity(x,z);if(random()>.25+f*.75)continue;if(!under(x,z,2.6))continue;const tf=random()<.45;if(tf){const s=rr(.75,1.25);items.treeFern.push({x,y:0,z,s,ry:random()*TAU,color:random()<.4?'#eef3dc':'#ffffff'});obstacles.push({x,z,r:.32*s,base:0,height:4.4*s,walkable:false});occupy(x,z,1.4);}else{const s=rr(.7,1.3);items.cycad.push({x,y:0,z,s,ry:random()*TAU,color:random()<.4?'#f3efd9':'#ffffff'});obstacles.push({x,z,r:.45*s,base:0,height:1.2*s,walkable:false});occupy(x,z,1.2);}if(items.treeFern.length+items.cycad.length>190)break;}
 // 出生点和学习站附近补几株，画面前景更丰富
 for(const [k,x,z,s] of[['cycad',6.5,31.5,1.15],['cycad',-6.5,30,1],['treeFern',11,27,1.1],['treeFern',-9,22.5,1.2],['cycad',16,-12,1],['treeFern',3,-15,1],['cycad',-26,-4,1.1],['treeFern',-13,-3,1.05],['cycad',46,17,1],['treeFern',35,14,1.15],['cycad',-41,40,.95],['treeFern',-29,44,1.15]]){if(!under(x,z,2.2))continue;items[k].push({x,y:0,z,s,ry:random()*TAU});obstacles.push({x,z,r:(k==='cycad'?.45:.32)*s,base:0,height:(k==='cycad'?1.2:4.4)*s,walkable:false});occupy(x,z,1.3);}
 // 水边的木贼
 for(let i=0;i<1400&&items.horsetail.length<120;i++){const x=rr(-112,112),z=rr(-112,112),wd=waterDistance(x,z),near=wd>.4&&wd<6.5,mud=mudInside(x,z,2.5)&&!mudInside(x,z,.2);if(!near&&!mud&&random()>.03)continue;if(trailDistance(x,z)<2||stationGap(x,z)<4||inKeepOut(x,z,.3,['animal','camp','view']))continue;items.horsetail.push({x,y:0,z,s:rr(.7,1.3),ry:random()*TAU});}
 // 石块与小台地
 for(let i=0;i<900&&items.rock0.length+items.rock1.length<120;i++){const x=rr(-108,108),z=rr(-108,108),s=rr(.45,1.9)*(random()<.12?1.8:1);if(trailDistance(x,z)<2.4+s||waterDistance(x,z)<-.5||stationGap(x,z)<6+s||inKeepOut(x,z,s,['animal','camp','log','view'])||!isFree(x,z,s*.9))continue;if(Math.abs(waterDistance(x,z))>6&&random()<.5)continue;
  (random()<.5?items.rock0:items.rock1).push({x,y:-.12*s,z,s,ry:random()*TAU,sy:s*rr(.75,1.15),color:random()<.4?'#f2ecdc':'#ffffff'});obstacles.push({x,z,r:s*.92,base:0,height:s*.7,walkable:false});occupy(x,z,s);}
 for(const [x,z,s,ry] of[[-60,26,1.2,.5],[-64,8,1,1.8],[-48,6,.7,2.6],[78,32,1.3,.3],[86,48,1,2],[-80,-30,1.4,1],[-70,-62,1.1,.2],[12,-78,1.3,2.2],[-30,-80,1,.7],[96,8,1.1,1.4],[-95,40,1.3,2.9],[50,70,1.2,.6],[-62,76,1.1,1.2]]){if(!isFree(x,z,2.5*s))continue;items.mesa.push({x,y:0,z,s,ry});obstacles.push({x,z,r:2.6*s,base:0,height:2.9*s,walkable:false});occupy(x,z,2.8*s);}
 // 地被：蕨丛与苔藓
 for(let i=0;i<9000&&items.fern.length+items.fernLow.length<3000;i++){const x=rr(-114,114),z=rr(-114,114),td=trailDistance(x,z),wd=waterDistance(x,z),patch=fbm(x*.07,z*.07,9),dens=.2+.55*smooth(.35,.68,patch)+.3*forestDensity(x,z)+.35*(1-smooth(1.6,6,td));
  if(random()>dens)continue;if(td<1.65||wd<.6||stationGap(x,z)<3.6||inKeepOut(x,z,-.4,['camp','log'])||inKeepOut(x,z,-.6,['animal'])||(mudInside(x,z,.3)))continue;
  const big=random()<.55;(big?items.fern:items.fernLow).push({x,y:0,z,s:rr(.7,1.35)*(1+.35*forestDensity(x,z)),ry:random()*TAU,color:random()<.25?'#e7e3c4':random()<.5?'#f4f6e8':'#ffffff'});}
 // 小径和站点周围更密的低矮蕨毯与碎石，镜头前景不再空白
 items.carpet=[];items.pebble=[];
 for(let i=0;i<30000&&items.carpet.length<4200;i++){const x=rr(-110,110),z=rr(-110,110),td=trailDistance(x,z),sg=stationGap(x,z);if(td>9&&sg>14&&random()>.08)continue;if(td<1.55||sg<3.2||waterDistance(x,z)<.5||inKeepOut(x,z,-.3,['camp','log','animal'])||mudInside(x,z,.2))continue;if(random()>.35+.5*smooth(.3,.65,fbm(x*.11,z*.11,41)))continue;items.carpet.push({x,y:0,z,s:rr(.9,1.7),ry:random()*TAU,color:random()<.35?'#d9dcc0':'#eef0e4'});}
 for(let i=0;i<20000&&items.pebble.length<1500;i++){const x=rr(-110,110),z=rr(-110,110),td=trailDistance(x,z),sg=stationGap(x,z),wd=waterDistance(x,z);if(td>5&&sg>10&&(wd<0||wd>4)&&random()>.05)continue;if(wd<.1||inKeepOut(x,z,0,['camp','animal']))continue;const s=rr(.06,.26)*(random()<.1?1.8:1);items.pebble.push({x,y:-.02,z,s,sy:s*rr(.6,1),ry:random()*TAU,color:random()<.5?'#e8e1cf':'#ffffff'});}
 for(let i=0;i<5000&&items.moss.length<650;i++){const x=rr(-112,112),z=rr(-112,112),td=trailDistance(x,z);if(td<1.5||waterDistance(x,z)<.2||stationGap(x,z)<2.5||inKeepOut(x,z,0,['camp','animal','log'])||mudInside(x,z))continue;if(random()>.25+.6*smooth(.45,.7,fbm(x*.09,z*.09,31)))continue;const s=rr(.2,.55);items.moss.push({x,y:0,z,s,sx:s*rr(.8,1.4),ry:random()*TAU,color:random()<.3?'#e6ead2':'#ffffff'});}
 // 石块和倒木上也长苔藓
 for(const r of[...items.rock0,...items.rock1])if(random()<.5)items.moss.push({x:r.x+rr(-.3,.3)*r.s,y:r.sy*.5,z:r.z+rr(-.3,.3)*r.s,s:r.s*.45,ry:random()*TAU});
 scatter(floraGeo.araucaria,floraMat,items.araucaria,{shadow:true,cell:114.5});scatter(floraGeo.araucariaYoung,floraMat,items.araucariaYoung,{shadow:true,cell:114.5});
 scatter(floraGeo.conifer,floraMat,items.conifer,{shadow:true,cell:114.5});scatter(floraGeo.ginkgo,floraMat,items.ginkgo,{shadow:true,cell:114.5});
 scatter(floraGeo.bgConifer,farFloraMat,items.bgConifer,{cell:175});scatter(floraGeo.bgAraucaria,farFloraMat,items.bgAraucaria,{cell:175});
 scatter(floraGeo.treeFern,floraMat,items.treeFern,{shadow:true,cell:76.4,ratio:.7});scatter(floraGeo.cycad,floraMat,items.cycad,{shadow:true,cell:76.4,ratio:.7});
 scatter(floraGeo.horsetail,floraMat,items.horsetail,{cell:114.5,ratio:.5});
 scatter(floraGeo.fern,floraMat,items.fern,{cell:76.4,ratio:.32});scatter(floraGeo.fernLow,floraMat,items.fernLow,{cell:76.4,ratio:.32});scatter(floraGeo.moss,floraMat,items.moss,{cell:114.5,ratio:.35});scatter(floraGeo.carpet,floraMat,items.carpet,{cell:76.4,ratio:0});scatter(floraGeo.pebble,rockMat,items.pebble,{cell:114.5,ratio:0});
 scatter(floraGeo.rock0,rockMat,items.rock0,{shadow:true,cell:114.5});scatter(floraGeo.rock1,rockMat,items.rock1,{shadow:true,cell:114.5});scatter(floraGeo.mesa,rockMat,items.mesa,{shadow:true,cell:240});

 // ───────── 足迹：泥滩上的化石足迹 + 湖岸新鲜脚印 ─────────
 {const three=new Builder();for(const a of[-.42,0,.42])three.add(new T.CircleGeometry(1,8),M(0,0,.2,-Math.PI/2,0,0,.06,(a?.19:.24),1).premultiply(new T.Matrix4().makeRotationY(a)),C('#ffffff'));three.add(new T.CircleGeometry(.11,8),M(0,0,-.02,-Math.PI/2),C('#ffffff'));
  const round=new Builder();round.add(new T.CircleGeometry(1,14),M(0,0,0,-Math.PI/2,0,0,.42,.52,1),C('#ffffff'));
  const printMat=std({color:'#6f6650',roughness:1,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
  const tp=[],rp=[],m=CAMP.mud,du=[Math.cos(m.ry),Math.sin(m.ry)],dp=[-Math.sin(m.ry),Math.cos(m.ry)];
  for(let i=0;i<11;i++){const s=i*1.25-6.5,o=i%2?.3:-.3;tp.push({x:m.x+du[0]*s+dp[0]*o,y:.022,z:m.z+du[1]*s+dp[1]*o,ry:Math.atan2(du[0],du[1])+(i%2?.1:-.1),s:1.1});}
  const a2=m.ry+1.15,eu=[Math.cos(a2),Math.sin(a2)],ep=[-Math.sin(a2),Math.cos(a2)];
  for(let i=0;i<5;i++){const s=i*1.9-3.8;for(const sg of[-1,1]){const q=s+(sg>0?.55:0);rp.push({x:m.x+.8+eu[0]*q+ep[0]*sg*.8,y:.021,z:m.z+eu[1]*q+ep[1]*sg*.8,ry:Math.atan2(eu[0],eu[1]),s:sg>0?.95:.72});}}
  for(let i=0;i<8;i++)rp.push({x:53+i*1.3+(i%2?.4:-.4),y:.021,z:4+i*1.1,ry:.9,s:.55});
  scatter(track(three.build()),printMat,tp,{cell:400});scatter(track(round.build()),printMat,rp,{cell:400});}

 // ───────── 地面贴图：苔藓斑块、小径、湖岸、泥滩、发掘区（程序生成）─────────
 const RES=512,HALF=128,data=new Uint8Array(RES*RES*4);
 {const mix=(o,c,t)=>{o[0]+=(c[0]-o[0])*t;o[1]+=(c[1]-o[1])*t;o[2]+=(c[2]-o[2])*t;};
  const mossD=[103,132,90],mossL=[146,170,110],fernF=[90,117,80],olive=[164,165,112],soilC=[176,156,114],path=[218,204,162],verge=[186,170,126],shore=[204,192,150],mudC=[150,138,106],wet=[112,112,90],deepC=[72,92,82],digC=[205,180,138],trod=[180,172,128],o=[0,0,0];
  // 低频噪声先在粗网格上算好再插值，加快生成
  const G=129,gs=2*HALF/(G-1),lowF=new Float32Array(G*G*5);for(let j=0;j<G;j++)for(let i=0;i<G;i++){const x=-HALF+i*gs,z=-HALF+j*gs,k=(j*G+i)*5;lowF[k]=fbm(x*.03,z*.03,1);lowF[k+1]=fbm(x*.09,z*.09,2);lowF[k+2]=noise(x*.05,z*.05,11);lowF[k+3]=noise(x*.08+9,z*.08,13);lowF[k+4]=forestDensity(x,z);}
  const L=[0,0,0,0,0],lowAt=(x,z)=>{const fx=(x+HALF)/gs,fz=(z+HALF)/gs,i=Math.min(G-2,Math.floor(fx)),j=Math.min(G-2,Math.floor(fz)),u=fx-i,v=fz-j,a=(j*G+i)*5,b=a+5,c=a+G*5,d=c+5;for(let q=0;q<5;q++)L[q]=(lowF[a+q]*(1-u)+lowF[b+q]*u)*(1-v)+(lowF[c+q]*(1-u)+lowF[d+q]*u)*v;};
  // 到小径、水边、站点的距离也先按 1 米网格算好再插值
  const F=257,fs=2*HALF/(F-1),dT=new Float32Array(F*F),dW=new Float32Array(F*F),dS=new Float32Array(F*F);for(let j=0;j<F;j++)for(let i=0;i<F;i++){const x=-HALF+i*fs,z=-HALF+j*fs,k=j*F+i;dT[k]=Math.min(50,trailDistance(x,z));dW[k]=Math.min(50,waterDistance(x,z));dS[k]=Math.min(50,stationGap(x,z));}
  const bil=(A,x,z)=>{const fx=(x+HALF)/fs,fz=(z+HALF)/fs,i=Math.min(F-2,Math.floor(fx)),j=Math.min(F-2,Math.floor(fz)),u=fx-i,v=fz-j,a=j*F+i;return (A[a]*(1-u)+A[a+1]*u)*(1-v)+(A[a+F]*(1-u)+A[a+F+1]*u)*v;};
  const pc=Math.cos(P.ry),ps=Math.sin(P.ry);
  for(let j=0;j<RES;j++){const z=-HALF+(j+.5)*(2*HALF/RES);for(let i=0;i<RES;i++){const x=-HALF+(i+.5)*(2*HALF/RES);
   lowAt(x,z);const n1=L[0],n2=L[1],n3=noise(x*.4,z*.4,3),n4=L[2];
   o[0]=mossD[0];o[1]=mossD[1];o[2]=mossD[2];mix(o,mossL,smooth(.3,.75,n1));mix(o,fernF,smooth(.52,.74,n2)*.55);mix(o,olive,smooth(.6,.82,n4)*.45);mix(o,soilC,smooth(.7,.86,L[3])*.45);
   mix(o,fernF,L[4]*.28);
   const sg=bil(dS,x,z);if(sg<7)mix(o,trod,(1-smooth(2,7,sg))*.45);
   const td=bil(dT,x,z),e=1.35+(n3-.5)*.6;if(td<5){mix(o,verge,(1-smooth(e,e+1.6,td))*.5);mix(o,path,1-smooth(e-.35,e+.2,td));}
   const wd=bil(dW,x,z);if(wd<4.5){if(wd<0)mix(o,wd<-4?deepC:wet,smooth(0,-5,wd)*.9+.1);else{const lakeSide=lakeDistance(x,z)<riverNear(x,z);mix(o,n3>.55&&!lakeSide?mudC:shore,(1-smooth(.4,3.2+n3*1.6,wd))*.9);mix(o,wet,(1-smooth(0,1.2,wd))*.5);}}
   if(mudInside(x,z,.8+n3*.8)){const inner=mudInside(x,z)?1:.5,crack=Math.abs(Math.sin(x*2.3+Math.sin(z*1.4)*2)*Math.sin(z*2.1+Math.sin(x*1.6)*2));mix(o,mudC,.85*inner);if(crack<.1&&inner>.9)mix(o,wet,.35);}
   const qx=x-P.x,qz=z-P.z,px=qx*pc-qz*ps,pz=qx*ps+qz*pc;if(Math.abs(px)<P.hx+2.8&&Math.abs(pz)<P.hz+2.4)mix(o,digC,(1-smooth(.5,2.6,Math.max(Math.abs(px)-P.hx,Math.abs(pz)-P.hz,0)))*.75);
   const dt=len2(x-CAMP.tent.x,z-CAMP.tent.z);if(dt<5)mix(o,trod,(1-smooth(2.5,5,dt))*.6);
   const k=(j*RES+i)*4,b=.95+n3*.1;data[k]=Math.min(255,o[0]*b);data[k+1]=Math.min(255,o[1]*b);data[k+2]=Math.min(255,o[2]*b);data[k+3]=255;}}
  // 树荫下颜色更深
  const px=RES/(2*HALF);for(const t of trees){if(Math.abs(t.x)>HALF||Math.abs(t.z)>HALF)continue;const cx=(t.x+HALF)*px,cz=(t.z+HALF)*px,r=t.r*.9*px;for(let j=Math.max(0,Math.floor(cz-r));j<Math.min(RES,Math.ceil(cz+r));j++)for(let i=Math.max(0,Math.floor(cx-r));i<Math.min(RES,Math.ceil(cx+r));i++){const d=Math.hypot(i-cx,j-cz)/r;if(d>=1)continue;const k=(j*RES+i)*4,f=1-.16*(1-d*d);data[k]*=f;data[k+1]*=f*1.01;data[k+2]*=f;}}}
 const groundTex=track(new T.DataTexture(data,RES,RES,T.RGBAFormat));groundTex.colorSpace=T.SRGBColorSpace;groundTex.wrapS=groundTex.wrapT=T.ClampToEdgeWrapping;groundTex.magFilter=T.LinearFilter;groundTex.minFilter=T.LinearMipmapLinearFilter;groundTex.generateMipmaps=true;groundTex.anisotropy=4;groundTex.needsUpdate=true;
 const groundMat=std({map:groundTex,vertexColors:true,roughness:.97});
 groundMat.onBeforeCompile=sh=>{sh.uniforms.uTime=clock;sh.vertexShader='varying vec3 vGW;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvGW=(modelMatrix*vec4(transformed,1.)).xyz;');
  sh.fragmentShader='varying vec3 vGW;uniform float uTime;\nfloat gh(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}\nfloat gn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(gh(i),gh(i+vec2(1.,0.)),f.x),mix(gh(i+vec2(0.,1.)),gh(i+1.),f.x),f.y);}\n'+sh.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n{float fade=1.-smoothstep(16.,60.,distance(vGW,cameraPosition));float n1=gn(vGW.xz*.42),n2=gn(vGW.xz*1.8+7.3),n3=gn(vGW.xz*6.1+2.1);float cl=sin(vGW.x*.021+uTime*.02)*sin(vGW.z*.026+uTime*.015);diffuseColor.rgb*=.9+n1*.13+((n2-.5)*.16+(n3-.5)*.1)*fade+cl*.035;diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.12,1.,.72),smoothstep(.7,.9,n2)*.35*fade);float s1=gn(vGW.xz*3.7+1.3),s2=gn(vGW.xz*5.3+8.1);diffuseColor.rgb*=1.-smoothstep(.72,.86,s1)*.17*fade;diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.28,1.2,.9),smoothstep(.78,.9,s2)*.35*fade);}');};
 const ground=addMesh(groundG,groundMat);ground.name='era-dinosaurs-ground';

 // ───────── 远景：山脉、火山、天空、云、雾 ─────────
 {const skyMat=track(new T.ShaderMaterial({side:T.BackSide,depthWrite:false,fog:false,toneMapped:false,uniforms:{top:{value:C('#86b8c6')},mid:{value:C('#b8d4cf')},horizon:{value:C(eraDefinition.fog)},sunDir:{value:new T.Vector3(-.5,.62,.6).normalize()}},
   vertexShader:'varying vec3 vD;void main(){vD=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'uniform vec3 top,mid,horizon,sunDir;varying vec3 vD;void main(){vec3 d=normalize(vD);float h=max(d.y,0.);vec3 c=mix(horizon,mid,smoothstep(0.,.2,h));c=mix(c,top,smoothstep(.18,.75,h));float s=max(dot(d,sunDir),0.);c+=vec3(1.,.93,.75)*pow(s,24.)*.12;gl_FragColor=vec4(c,1.);\n#include <colorspace_fragment>\n}'}));
  const sky=addMesh(track(new T.SphereGeometry(555,32,16)),skyMat,{receive:false});sky.renderOrder=-10;sky.frustumCulled=false;}
 for(let layer=0;layer<3;layer++){const g=new T.BufferGeometry(),pos=[],idx=[],cols=[],n=160,R=225+layer*62,c0=C(['#6d9183','#86a597','#a3bcb0'][layer]),c1=C(['#93ad9a','#a9c0b3','#bdd0c5'][layer]);
  for(let i=0;i<=n;i++){const a=i/n*TAU,r=R+Math.sin(a*3+layer)*12,pk=Math.max(0,Math.sin(a*5+layer*2))**3*26+Math.sin(a*11+layer)*6+fbm(a*6,layer*3,layer)*16,top=26+layer*16+pk;
   for(const [y,f] of[[-6,0],[top*.6,.55],[top,1]]){const rr2=r+(f===.55?-6:f===1?-14:0);pos.push(Math.sin(a)*rr2,y,Math.cos(a)*rr2);tc.copy(c0).lerp(c1,f);cols.push(tc.r,tc.g,tc.b);}
   if(i<n){const b=i*3;idx.push(b,b+3,b+1,b+1,b+3,b+4,b+1,b+4,b+2,b+2,b+4,b+5);}}
  g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(cols,3));g.setIndex(idx);g.computeVertexNormals();
  addMesh(track(g),fogScale(std({vertexColors:true,flatShading:true,side:T.DoubleSide}),[.55,.5,.45][layer]),{receive:false});}
 // 火山：凹形坡面、冲沟、暗色火山口、两道熔岩与烟柱
 const V={x:30,z:-218,H:80,R:118,Rc:11},vr=v=>V.Rc+(V.R-V.Rc)*((1-v)*.55+(1-v)**2.3*.45);
 {const S=96,K=24,pos=[],cols=[],idx=[],forest=C('#6a8a6a'),ash=C('#8f8b7c'),rock=C('#6b6460'),rim=C('#8a6556'),lavaC=C('#d9844f');
  const prof=[];for(let k=0;k<=K;k++){const v=k/K;prof.push([vr(v),V.H*v-8]);}prof.push([V.Rc*.78,V.H-10],[V.Rc*.4,V.H-13]);
  prof.forEach(([r,y],k)=>{for(let j=0;j<S;j++){const a=j/S*TAU,v=clamp01((y+8)/V.H),gul=Math.sin(a*13+Math.sin(a*5)*2)*.5+.5,rad=r*(1+(fbm(Math.cos(a)*2.5,Math.sin(a)*2.5+v*3,5)-.5)*.16-gul*.035*v),yy=y-(k<=K?gul*v*(1-v)*7:0);
   pos.push(V.x+Math.cos(a)*rad,yy,V.z+Math.sin(a)*rad);tc.copy(forest).lerp(ash,smooth(.18,.5,v)).lerp(rock,smooth(.55,.9,v)).lerp(rim,smooth(.93,1,v)*.6);if(k>K)tc.copy(rock).lerp(lavaC,.35*(k-K));tc.multiplyScalar(.92+gul*.12);cols.push(tc.r,tc.g,tc.b);
   if(k<prof.length-1){const a0=k*S+j,b0=k*S+(j+1)%S;idx.push(a0,a0+S,b0,b0,a0+S,b0+S);}}});
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(cols,3));g.setIndex(idx);g.computeVertexNormals();
  addMesh(track(g),fogScale(std({vertexColors:true,flatShading:true}),.55));
  // 熔岩：火山口里的光与沿坡流下的两条细带
  const lavaMat=fogScale(std({color:'#d9875a',emissive:'#ff6230',emissiveIntensity:.55,roughness:.6}),.45);
  const lava=new Builder();lava.add(new T.CircleGeometry(V.Rc*.55,20),M(V.x,V.H-12.6,V.z,-Math.PI/2),C('#ffffff'));
  for(const [a0,len] of[[1.5,.24]]){const pts=[];for(let k=0;k<=14;k++){const v=1-k/14*len,r=vr(v),a=a0+Math.sin(k*.7)*.05;pts.push([V.x+Math.cos(a)*(r+.35),V.H*v-8+.25,V.z+Math.sin(a)*(r+.35),.75-k*.035]);}
   for(let k=0;k<pts.length-1;k++){const p=pts[k],q=pts[k+1];lava.add(new T.CylinderGeometry(1,1,1,5),along(p,q,p[3],p[3]*.35),C('#ffffff'));}}
  addMesh(track(lava.build()),lavaMat);}
 // 软粒子贴图（数据纹理，测试环境也能生成）
 function softTexture(size,blobs){const d=new Uint8Array(size*size*4);for(let j=0;j<size;j++)for(let i=0;i<size;i++){let a=0;for(const [bx,by,br,bw] of blobs){const r=Math.hypot((i-bx*size)/(br*size),(j-by*size)/(br*size));a+=bw*Math.max(0,1-r*r)**1.6;}a=Math.min(1,a)*(.85+.15*noise(i*.15,j*.15,size));const k=(j*size+i)*4;d[k]=d[k+1]=d[k+2]=255;d[k+3]=a*255;}const t=track(new T.DataTexture(d,size,size,T.RGBAFormat));t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t;}
 const puffTex=softTexture(64,[[.5,.5,.48,1.15]]),cloudTex=softTexture(128,[[.3,.58,.22,.9],[.5,.5,.28,1],[.7,.6,.2,.9],[.42,.66,.2,.7],[.62,.42,.18,.6],[.2,.66,.14,.6],[.82,.66,.13,.6]]);
 function billboards(tex,list,{mode,color='#ffffff',color2=null,opacity=1,fog=true,toneMapped=true,blending=T.NormalBlending}){
  const g=track(new T.InstancedBufferGeometry().copy(new T.PlaneGeometry(1,1)));const ph=new Float32Array(list.length);list.forEach((b,i)=>ph[i]=b.phase??random());g.setAttribute('aPhase',new T.InstancedBufferAttribute(ph,1));
  const m=track(new T.ShaderMaterial({transparent:true,depthWrite:false,fog,toneMapped,blending,defines:{[mode]:''},uniforms:T.UniformsUtils.merge([T.UniformsLib.fog,{map:{value:tex},color:{value:C(color)},color2:{value:C(color2||color)},opacity:{value:opacity},uTime:{value:0}}]),
   vertexShader:'#include <common>\n#include <fog_pars_vertex>\nattribute float aPhase;uniform float uTime;varying vec2 vUv;varying float vA;varying float vL;void main(){vUv=uv;vec3 c=vec3(instanceMatrix[3]);float sx=length(instanceMatrix[0].xyz),sy=length(instanceMatrix[1].xyz),a=1.,life=0.;\n#ifdef SMOKE\nlife=fract(uTime*.016+aPhase);c+=vec3(life*life*34.,life*62.,life*10.);float g=.4+life*1.8;sx*=g;sy*=g;a=smoothstep(0.,.1,life)*pow(1.-life,1.3);\n#endif\n#ifdef DRIFT\nc.x+=sin(uTime*.012+aPhase*6.28)*16.;\n#endif\n#ifdef MIST\na=.7+.3*sin(uTime*.18+aPhase*6.28);c.x+=sin(uTime*.04+aPhase*6.28)*3.;\n#endif\nvA=a;vL=life;vec4 mvPosition=modelViewMatrix*vec4(c,1.);mvPosition.xy+=position.xy*vec2(sx,sy);gl_Position=projectionMatrix*mvPosition;\n#include <fog_vertex>\n}',
   fragmentShader:'#include <common>\n#include <fog_pars_fragment>\nuniform sampler2D map;uniform vec3 color,color2;uniform float opacity;varying vec2 vUv;varying float vA;varying float vL;void main(){float t=texture2D(map,vUv).a;vec3 c=mix(color2,color,smoothstep(0.,.3,vL));gl_FragColor=vec4(c,t*vA*opacity);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n#include <fog_fragment>\n}'}));
  m.uniforms.uTime=clock;m.uniforms.map.value=tex;const o=new T.InstancedMesh(g,m,list.length);list.forEach((b,i)=>{dummy.position.set(b.x,b.y,b.z);dummy.rotation.set(0,0,0);dummy.scale.set(b.sx,b.sy,1);dummy.updateMatrix();o.setMatrixAt(i,dummy.matrix);});o.frustumCulled=false;o.renderOrder=2;root.add(o);return o;}
 const smoke=[];for(let i=0;i<32;i++)smoke.push({x:V.x+rr(-4,4),y:V.H-9,z:V.z+rr(-4,4),sx:rr(22,32),sy:rr(18,26),phase:i/32});
 const smokeMesh=billboards(puffTex,smoke,{mode:'SMOKE',color:'#eef0e8',color2:'#c98f73',opacity:.58});smokeMesh.renderOrder=3;
 billboards(puffTex,[{x:V.x,y:V.H-8,z:V.z,sx:30,sy:12}],{mode:'MIST',color:'#ff9a5e',opacity:.32,fog:false,blending:T.AdditiveBlending});
 const clouds=[];for(let i=0;i<16;i++){const a=i/16*TAU+rr(-.15,.15),r=rr(280,420),s=rr(110,170);clouds.push({x:Math.sin(a)*r,y:rr(95,150),z:Math.cos(a)*r,sx:s,sy:s*rr(.38,.5)});}
 billboards(cloudTex,clouds,{mode:'DRIFT',color:'#fbfbf2',opacity:.82,fog:false,toneMapped:false});
 const mist=[];for(let i=0;i<26;i++){const a=rr(0,TAU),r=rr(70,118);mist.push({x:Math.sin(a)*r,y:rr(2,6),z:Math.cos(a)*r,sx:rr(30,55),sy:rr(6,10)});}for(let i=0;i<6;i++)mist.push({x:LAKE.x+rr(-10,10),y:rr(1.2,2.2),z:LAKE.z+rr(-15,15),sx:rr(16,26),sy:rr(2.5,4)});
 highOnly.push(billboards(puffTex,mist,{mode:'MIST',color:'#f2f5ec',opacity:.22}));

 // ───────── 小生命：蜻蜓与漂浮的孢子 ─────────
 const flyB=new Builder();flyB.add(new T.CylinderGeometry(.012,.02,.42,5),M(0,0,0,Math.PI/2),C('#3f7f8a'));flyB.add(new T.SphereGeometry(.04,6,4),M(0,0,.22),C('#2f5f66'));
 for(const [z,w] of[[.12,.36],[.02,.32]])for(const sg of[1,-1])flyB.add(new T.PlaneGeometry(w,.075),M(sg*w*.5,.01,z,-Math.PI/2,0,sg*.08),C('#e9f4f1'));
 const flyMat=std({vertexColors:true,side:T.DoubleSide,transparent:true,opacity:.85,roughness:.4});
 const flyBase=[];for(let i=0;i<18;i++){let x,z,ok=false;for(let k=0;k<60&&!ok;k++){x=rr(-60,80);z=rr(-55,45);const wd=waterDistance(x,z);ok=(wd>.5&&wd<7)||mudInside(x,z,2);}flyBase.push({x,z,y:rr(.7,1.8),r:rr(1.2,3.5),ph:rr(0,TAU),sp:rr(.5,1.1)});}
 const flies=new T.InstancedMesh(track(flyB.build()),flyMat,flyBase.length);flies.frustumCulled=false;root.add(flies);highOnly.push(flies);
 const motesG=track(new T.BufferGeometry());{const a=[];for(let i=0;i<220;i++)a.push(rr(-90,90),rr(.6,9),rr(-80,70));motesG.setAttribute('position',new T.Float32BufferAttribute(a,3));}
 const motes=new T.Points(motesG,track(new T.PointsMaterial({color:'#f1e8bd',size:.14,map:puffTex,transparent:true,opacity:.75,depthWrite:false})));root.add(motes);highOnly.push(motes);

 // 说明牌文字（只在浏览器里生成画布贴图）
 if(typeof document!=='undefined')for(const s of signs){const c=document.createElement('canvas');c.width=512;c.height=232;const x=c.getContext('2d');x.fillStyle='#8a6e50';x.fillRect(0,0,512,232);x.strokeStyle='#ead9b5';x.lineWidth=6;x.strokeRect(14,14,484,204);x.fillStyle='rgba(60,40,20,.12)';for(let i=0;i<9;i++)x.fillRect(0,24+i*24,512,3);x.fillStyle='#fbf1d6';x.textAlign='center';x.font='600 58px "PingFang SC","Microsoft YaHei",sans-serif';x.fillText(s.title,256,104);x.font='28px "PingFang SC","Microsoft YaHei",sans-serif';x.fillStyle='#f1e4c2';x.fillText(s.sub,256,164);
  const tex=track(new T.CanvasTexture(c));tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;const m=track(new T.MeshStandardMaterial({map:tex,roughness:.85}));const pg=track(new T.PlaneGeometry(2.45,1.1));for(const side of[1,-1]){const o=addMesh(pg,m);o.position.set(s.x+Math.sin(s.ry)*(side>0?.04:-.08),1.7,s.z+Math.cos(s.ry)*(side>0?.04:-.08));o.rotation.y=s.ry+(side>0?0:Math.PI);}}

 function setQuality(value){low=value==='low';for(const {mesh,count,ratio} of qualityMeshes){mesh.count=low?Math.max(ratio>0?1:0,Math.floor(count*ratio)):count;mesh.visible=mesh.count>0;}for(const o of highOnly)o.visible=!low;smokeMesh.count=low?14:smoke.length;}
 setQuality(quality);
 const counts={};for(const k in items)counts[k]=items[k].length;
 return {ground,obstacles,
  update(dt,time,player={x:0,z:0},reduced=false){
   if(!alive)return;const t=reduced?0:time;clock.value=t;
   for(const a of animators)a(t,dt,player||{x:0,z:0},reduced);
   if(!low){for(let i=0;i<flyBase.length;i++){const f=flyBase[i],a=t*f.sp+f.ph,dart=Math.sin(t*.7+f.ph)>.85?1.8:1,x=f.x+Math.sin(a)*f.r*dart,z=f.z+Math.cos(a*1.3)*f.r,y=f.y+Math.sin(a*2.1)*.25;dummy.position.set(x,y,z);dummy.rotation.set(0,Math.atan2(Math.cos(a)*f.r,-Math.sin(a*1.3)*f.r*1.3)+(Math.sin(t*9+i)*.03),0);dummy.scale.setScalar(1);dummy.updateMatrix();flies.setMatrixAt(i,dummy.matrix);}flies.instanceMatrix.needsUpdate=true;}
   motes.rotation.y=t*.004;motes.position.y=Math.sin(t*.2)*.3;
  },
  setQuality,
  dispose(){if(!alive)return;alive=false;scene.remove(root);root.traverse(o=>{if(o.isInstancedMesh)o.dispose();});skeletons.forEach(s=>s.dispose());resources.forEach(r=>r.dispose());resources.clear();},
  metrics:{animals:animators.length,dinosaurs:1+1+1+2+3+1+herd.length+parade.length,flyingReptiles:fliers.length,plants:counts,obstacleCount:obstacles.length}
 };
}
