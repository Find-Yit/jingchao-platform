import * as T from './vendor/three/three.module.min.js';

const silkSource = {title:'中国丝绸博物馆 · 九天阊阖：丝绸之路上的长安',url:'https://www.chinasilkmuseum.com/yz/info_18.aspx?itemid=31379'};
const unescoSource = {title:'联合国教科文组织 · 长安—天山廊道的路网',url:'https://whc.unesco.org/en/list/1442/'};
const buildingSource = {title:'旧金山亚洲艺术博物馆 · 大雁塔与中国建筑',url:'https://education.asianart.org/resources/great-wild-goose-pagoda/'};
export const eraDefinition = {
  id:'changan',title:'盛唐长安',subtitle:'穿过朱红城门，听见远方的回声',
  description:'沿着石板长街，走进灯笼摇曳的坊市，发现建筑、贸易与文化交流。原创唐风学习场景；街区比例、人物和建筑组合经过艺术化设计，并非考古复原。',
  period:'唐代 · 文化交流主题',accent:'#a7503e',sky:'#a8cbe0',fog:'#ebe1cb',sun:'#ffe1b8',groundLight:'#857559',exposure:1.05,
  spawn:{x:0,z:43},bounds:108,
  stations:[
    {id:'changan-gate',title:'长街与城门',teacher:'长安向导',role:'城市观察员',x:0,z:-9,color:'#b45541',intro:'先沿中轴线看看远处，再转身看看两侧。城市也有自己的组织方法。这里是唐风概念街区，并非长安城精确模型。',
      lesson:[['一座交流的城市','唐代长安是重要都城，也是东西文化交流的重要节点。不同地区的人带来了商品，也带来了故事和技艺。'],['像读地图一样读城市','先找主路，再找建筑和路口。你可以把观察到的位置记成一张简单地图，这是把现实信息整理成可读信息。']],
      faq:[['这里就是唐代长安的真实样子吗？','不是。这里参考唐代文化与建筑特征，重新设计了街区和尺度，方便自由探索；研究真实长安还要看遗址、地图与文物证据。'],['为什么要先找主路？','主路是地图的参照。先确定方向，再记录目的地，可以让别人按你的描述找到位置。']],
      challenge:{prompt:'要给同学写一份可靠的探索指南，哪一种做法最好？',options:['把场景中的每个细节都说成史实','区分资料事实与场景想象，并记录路线','只写“很好看”，不记录位置'],answer:1,explanation:'场景帮助观察，资料帮助核对。说明哪些是真实资料、哪些是艺术化设计，信息才更可靠。'},sources:[unescoSource,silkSource]},
    {id:'changan-market',title:'坊市里的发现',teacher:'坊市记录员',role:'生活观察员',x:-18,z:13,color:'#b87550',intro:'来看看绢帛、陶器与小摊。把物品、用途和来源整理起来，就是一份小小的数据表。',
      lesson:[['市场让人相遇','唐长安的东市、西市是重要市场。商人带来不同商品，市场也让不同文化接触。这里的摊位是为学习创作的示意。'],['把观察变成数据','记录一件物品时，可设置“名称、材料、用途、需要核实的问题”四列。不要只凭外观就猜出产地。']],
      faq:[['丝绸之路只运丝绸吗？','不是。它是许多路线组成的交流网络，往来还有其他商品、技术、艺术与思想。'],['看到一个漂亮陶罐，就能确定来自哪里吗？','不能。外形只是线索；还需要年代、材料、制作方法及可靠的文物说明等证据。']],
      challenge:{prompt:'你想把坊市见闻整理成 Excel 表格，哪一组表头最有帮助？',options:['名称、材料、用途、待核实问题','第一格、第二格、第三格','好看、不好看、非常好看'],answer:0,explanation:'清楚的字段让观察可比较，也能标出尚未确认的信息，避免把猜测当事实。'},sources:[silkSource,unescoSource]},
    {id:'changan-silk',title:'丝路来信',teacher:'行旅讲述人',role:'文化交流向导',x:20,z:12,color:'#547d89',intro:'想象你收到一封远方来信：它经过了哪些地方，又带来了怎样的新知识？',
      lesson:[['丝路是一张网络','丝绸之路不是一条单独的直线。长安—天山廊道是这张交流网络的一部分，连接着不同地区。'],['为信息标注来源','做一页丝路介绍 PPT 时，为图片和重要事实加上来源。你还可以用箭头和地图，表达信息在不同地方之间的流动。']],
      faq:[['为什么交流不只有商品？','旅行者和商人也会交流语言、技艺和生活经验。交流会影响不同地区的文化。'],['介绍页上的来源有什么用？','别人能顺着链接了解原始资料，也能检查你的表达是否准确。来源不是装饰，而是帮助核实的线索。']],
      challenge:{prompt:'要介绍“丝路是一张交流网络”，哪种网页最容易帮助理解？',options:['只有一大段文字，没有方向','地图节点与连线，并标明可靠资料来源','一张没有说明的随机照片'],answer:1,explanation:'节点与连线能把网络关系可视化；资料来源则帮助读者核实内容。'},sources:[unescoSource,silkSource]},
    {id:'changan-build',title:'屋檐下的智慧',teacher:'营造观察员',role:'结构与图形向导',x:-23,z:-45,color:'#6f8978',intro:'抬头看看屋顶和立柱，再看看远处的塔。试着把复杂建筑拆成简单图形。',
      lesson:[['从整体看到结构','中国传统木构建筑常用柱梁与斗拱支撑伸出的瓦屋顶。远处砖塔的材料和结构又不同。此处建筑是艺术化示意。'],['从形状想到建模','柱子可以近似为圆柱，墙面可以近似为长方体。先用基本形状搭整体，再逐步添加屋檐和纹理，这是三维建模的一种方法。']],
      faq:[['三维场景为什么需要碰撞？','模型只负责“看起来是什么”。碰撞范围告诉程序哪些位置不能直接穿过，所以画面和规则需要一起设计。'],['屋顶为什么不是一个简单三角形？','真实建筑的屋面、屋檐、支撑关系更复杂。学习建模可以先简化，再根据资料补细节，但要说明简化之处。']],
      challenge:{prompt:'如果人物能穿过柱子，应该优先检查什么？',options:['把天空变成红色','给柱子设置合适的碰撞范围','把背景音乐调大'],answer:1,explanation:'可见模型与碰撞规则并不相同。为柱子设置合理的碰撞范围，才能让人物绕行。'},sources:[buildingSource]}
  ]
};

// —— 场景说明：全部几何体程序生成，按「材质 × 区块 × 画质层」合并，顶点色区分颜色；无外部资源 ——
const CHUNK=44,HALF=110;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function seeded(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}

export function buildEra(scene,{quality='normal'}={}) {
  const root=new T.Group();root.name='Changan — original learning city';scene.add(root);
  const owned=new Set(),obstacles=[],buckets=new Map(),footprints=[],paint=[];
  const hasDOM=typeof document!=='undefined'&&typeof document.createElement==='function';
  let low=quality==='low',alive=true;
  // 雾：城内清透、远处才起薄雾（只改本场景的雾距，释放时还原）
  const fog=scene.fog&&scene.fog.isFog?scene.fog:null,fog0=fog&&[fog.near,fog.far];if(fog){fog.near=105;fog.far=500;}
  const timeU={value:0},rand=seeded(618);
  const R=(a=0,b=1)=>a+(b-a)*rand(),pick=a=>a[Math.floor(rand()*a.length)];
  const own=r=>(owned.add(r),r);
  const colorCache=new Map();
  const C=hex=>{if(hex&&hex.isColor)return hex;if(!colorCache.has(hex))colorCache.set(hex,new T.Color(hex));return colorCache.get(hex);};
  const jit=(hex,l=.04,h=0)=>{const c=C(hex).clone();const o={};c.getHSL(o);c.setHSL(o.h+R(-h,h),o.s,clamp(o.l+R(-l,l),0,1));return c;};
  // 调色：淡雅唐风（朱柱、白壁、灰瓦/青绿琉璃、黄土）
  const P={stone:'#cfc4ae',stoneDark:'#b3a68e',pave:'#d9d0bd',earth:'#cbb995',wall:'#efe7d7',plaster:'#e9dfcb',rammed:'#cdb28a',red:'#b4533f',redDark:'#8e4234',wood:'#8b6249',woodDark:'#5d4134',door:'#7a3c30',gold:'#d6ad66',ochre:'#c99a5c',teal:'#6e9690',tile:'#7d898b',tileDark:'#5d6767',glaze:'#5f8a7e',glazeDark:'#47665e',rafter:'#9a5f47',white:'#f6f1e6',leaf:'#89a275',leafDark:'#6f8b62',leafLight:'#a6b685',ink:'#2f2d2e',skin:'#e7c7a4',water:'#8fb6b0',brick:'#c8b596'};

  // —— 合并缓冲 ——
  const F0=new T.Matrix4();let F=F0;
  const _w=new T.Matrix4(),_n=new T.Matrix3(),_v=new T.Vector3(),_q=new T.Quaternion(),_s=new T.Vector3(),_e=new T.Euler(),_up=new T.Vector3(0,1,0),_d=new T.Vector3();
  const KINDS={solid:{uv:0,sway:0},flat:{uv:0,sway:0},roof:{uv:1,sway:0},cloth:{uv:0,sway:1},leaf:{uv:0,sway:1},glow:{uv:0,sway:1},water:{uv:0,sway:0}};
  const newAcc=(kind)=>({kind,p:[],n:[],c:[],uv:KINDS[kind]?.uv?[]:null,w:KINDS[kind]?.sway?[]:null});
  function bucketFor(kind,x,z,lod){
    const far=Math.abs(x)>HALF+12||Math.abs(z)>HALF+12;
    const cx=far?'f':clamp(Math.floor((x+HALF)/CHUNK),0,Math.ceil(2*HALF/CHUNK)-1),cz=far?'f':clamp(Math.floor((z+HALF)/CHUNK),0,Math.ceil(2*HALF/CHUNK)-1);
    const key=`${kind}|${cx},${cz}|${lod}`;
    if(!buckets.has(key))buckets.set(key,{...newAcc(kind),far,lod,cx,cz});
    return buckets.get(key);
  }
  // 把模板几何体 g 以局部矩阵 lm（再乘当前框架 F）写入缓冲
  function append(b,g,m,color,o){
    _n.getNormalMatrix(m);
    const Pp=g.attributes.position.array,N=g.attributes.normal.array,U=g.attributes.uv?.array,VC=g.attributes.color?.array,cnt=Pp.length/3;
    const col=C(color),ao=o.ao!==false&&b.kind==='solid';
    for(let i=0;i<cnt;i++){
      _v.set(Pp[i*3],Pp[i*3+1],Pp[i*3+2]).applyMatrix4(m);b.p.push(_v.x,_v.y,_v.z);
      const y=_v.y;
      if(b.w){let w=0;if(o.sway){const [y0,len,amp]=o.sway;w=clamp((y-y0)/len,0,1)*amp;}b.w.push(w);}
      _v.set(N[i*3],N[i*3+1],N[i*3+2]).applyMatrix3(_n).normalize();b.n.push(_v.x,_v.y,_v.z);
      let k=ao?.78+.22*clamp(y/1.6,0,1):1;if(o.shade)k*=1-o.shade*(1-clamp((y-o.shadeY)/o.shadeH,0,1));
      if(VC)b.c.push(col.r*VC[i*3]*k,col.g*VC[i*3+1]*k,col.b*VC[i*3+2]*k);else b.c.push(col.r*k,col.g*k,col.b*k);
      if(b.uv){if(U)b.uv.push(U[i*2],U[i*2+1]);else b.uv.push(0,0);}
    }
  }
  function put(kind,g,lm,color,o={}){
    const m=_w.multiplyMatrices(F,lm),e=m.elements;
    append(bucketFor(kind,e[12],e[14],o.lod||'c'),g,m,color,o);
  }
  const mtx=(p,s=[1,1,1],r)=>{r=r||[0,0,0];_e.set(r[0],r[1],r[2]);_q.setFromEuler(_e);return new T.Matrix4().compose(_v.set(p[0],p[1],p[2]),_q,_s.set(s[0],s[1],s[2]));};
  // 局部框架：x,z 平移 + 绕 y 旋转；内部所有 put/障碍都相对该框架
  function frame(x,z,rot,fn,y=0){const prev=F;F=prev.clone().multiply(new T.Matrix4().makeRotationY(rot).setPosition(x,y,z));try{fn();}finally{F=prev;}}
  const toWorld=(x,z)=>{_v.set(x,0,z).applyMatrix4(F);return [_v.x,_v.z];};
  const swapped=()=>Math.abs(F.elements[8])>.7;
  // 盒状碰撞体：90° 倍数时交换半宽，其余角度用 ry 旋转；extra 可带 walkable
  function block(x,z,hx,hz,height,base=0,extra){const [wx,wz]=toWorld(x,z),c=F.elements[0],s=F.elements[8];let o;
    if(Math.abs(s)<1e-4||Math.abs(c)<1e-4){const sw=Math.abs(s)>.7;o={x:wx,z:wz,hx:sw?hz:hx,hz:sw?hx:hz,base,height};}else o={x:wx,z:wz,hx,hz,ry:Math.atan2(s,c),base,height};
    if(extra)Object.assign(o,extra);obstacles.push(o);}
  function pillar(x,z,r,height,base=0,extra){const [wx,wz]=toWorld(x,z);obstacles.push(Object.assign({x:wx,z:wz,r,base,height},extra||{}));}
  function foot(x,z,hx,hz,dark=.16){const [wx,wz]=toWorld(x,z),s=swapped();footprints.push([wx,wz,s?hz:hx,s?hx:hz,dark]);}

  // —— 模板几何体 ——
  const tmpl=[];const T_=g=>{const n=g.index?g.toNonIndexed():g;if(n!==g)g.dispose();tmpl.push(n);return n;};
  const G={box:T_(new T.BoxGeometry(1,1,1)),cyl:T_(new T.CylinderGeometry(1,1,1,8)),cyl12:T_(new T.CylinderGeometry(1,1,1,14)),
    trunk:T_(new T.CylinderGeometry(.62,1,1,7)),cone:T_(new T.ConeGeometry(1,1,8)),cone4:T_(new T.ConeGeometry(1,1,4,1)),
    ball:T_(new T.IcosahedronGeometry(1,1)),ball2:T_(new T.IcosahedronGeometry(1,2)),dome:T_(new T.SphereGeometry(1,10,5,0,Math.PI*2,0,Math.PI/2)),
    plane:T_(new T.PlaneGeometry(1,1)),halfCyl:T_(new T.CylinderGeometry(1,1,1,10,1,false,0,Math.PI))};
  G.flagPlane=T_(new T.PlaneGeometry(1,1,1,6));
  const box=(kind,p,s,color,r,o)=>put(kind,G.box,mtx(p,s,r),color,o);
  const cyl=(kind,p,s,color,r,o)=>put(kind,G.cyl,mtx(p,s,r),color,o);
  const ball=(kind,p,s,color,r,o)=>put(kind,G.ball,mtx(p,s,r),color,o);
  // 两点之间的梁/杆
  function beam(kind,a,b,width,color,o={},g=G.cyl){
    _d.set(b[0]-a[0],b[1]-a[1],b[2]-a[2]);const len=_d.length();_d.normalize();
    const q=new T.Quaternion().setFromUnitVectors(_up,_d);
    const m=new T.Matrix4().compose(new T.Vector3((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2),q,new T.Vector3(width,len,o.depth??width));
    put(kind,g,m,color,o);
  }
  // 由三角形列表直接生成几何（自定义形状用）
  function triGeo(pos,uv){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));if(uv)g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();return g;}

  // —— 屋顶：庑殿 hip / 歇山 xie / 悬山 gable / 攒尖 pyr；凹曲屋面 + 檐角起翘 + 屋檐厚度 ——
  function roofShape(w,d,h,style,lift){
    const hw=w/2,hd=d/2,a=style==='hip'?Math.max(w*.1,hw-hd):0,xg=Math.max(hw*.3,hw-d*.3),tS=.5;
    const tf=(x,z)=>{const ax=Math.abs(x),v=Math.abs(z)/hd;
      if(style==='gable')return v;if(style==='pyr')return Math.max(ax/hw,v);
      if(style==='hip')return Math.max(v,Math.max(0,(ax-a)/(hw-a)));
      return ax<=xg?v:Math.max(v,tS+(1-tS)*(ax-xg)/(hw-xg));};
    const end=(x,z)=>{const ax=Math.abs(x),v=Math.abs(z)/hd;if(style==='gable')return false;if(style==='pyr')return ax/hw>v;if(style==='hip')return(ax-a)/(hw-a)>v;return ax>xg&&tS+(1-tS)*(ax-xg)/(hw-xg)>v;};
    const Y=(x,z)=>{const u=Math.abs(x)/hw,v=Math.abs(z)/hd;return h*Math.pow(1-clamp(tf(x,z),0,1),1.45)+lift*Math.pow(u*v,4)+lift*.25*Math.pow(Math.max(u,v),6)*(style==='gable'?0:1);};
    return {hw,hd,a,xg,tS,Y,end,tf};
  }
  function roofGeometry(S,style,th){
    const {hw,hd,a,xg,Y,end}=S;
    const xs=new Set(),zs=new Set(),nx=Math.max(6,Math.ceil(hw*2/.75)),nz=Math.max(6,Math.ceil(hd*2/.75));
    for(let i=0;i<=nx;i++)xs.add(+(-hw+2*hw*i/nx).toFixed(4));for(let i=0;i<=nz;i++)zs.add(+(-hd+2*hd*i/nz).toFixed(4));zs.add(0);xs.add(0);
    if(style==='hip'){xs.add(+a.toFixed(4));xs.add(-a);}
    if(style==='xie')for(const s of [-1,1]){xs.add(s*(xg-.03));xs.add(s*(xg+.03));}
    const X=[...xs].sort((p,q)=>p-q),Z=[...zs].sort((p,q)=>p-q);
    const top=[],tuv=[],bot=[];
    const tri=(arr,uv,p1,p2,p3,flip)=>{const pts=flip?[p1,p3,p2]:[p1,p2,p3];for(const p of pts)arr.push(p[0],p[1],p[2]);
      if(uv){const cx=(p1[0]+p2[0]+p3[0])/3,cz=(p1[2]+p2[2]+p3[2])/3,e=end(cx,cz);for(const p of pts)uv.push((e?p[2]:p[0])/.42,(e?Math.abs(p[0]):Math.abs(p[2]))/.34);}};
    for(let j=0;j<Z.length-1;j++)for(let i=0;i<X.length-1;i++){
      const x0=X[i],x1=X[i+1],z0=Z[j],z1=Z[j+1];
      const A=[x0,Y(x0,z0),z0],B=[x1,Y(x1,z0),z0],Cc=[x0,Y(x0,z1),z1],D=[x1,Y(x1,z1),z1];
      const mid=Y((x0+x1)/2,(z0+z1)/2),diagAD=Math.abs((A[1]+D[1])/2-mid),diagBC=Math.abs((B[1]+Cc[1])/2-mid);
      const quad=(arr,uv,o,flip)=>{const s=v=>[v[0],v[1]-o,v[2]];
        if(diagBC<=diagAD){tri(arr,uv,s(A),s(Cc),s(B),flip);tri(arr,uv,s(B),s(Cc),s(D),flip);}else{tri(arr,uv,s(A),s(D),s(B),flip);tri(arr,uv,s(A),s(Cc),s(D),flip);}};
      quad(top,tuv,0,false);quad(bot,null,th,true);
    }
    // 檐口立面（连接上下两层）
    const edge=(p,q)=>{const a1=[p[0],Y(p[0],p[1]),p[1]],b1=[q[0],Y(q[0],q[1]),q[1]];const a2=[a1[0],a1[1]-th,a1[2]],b2=[b1[0],b1[1]-th,b1[2]];bot.push(...a1,...a2,...b1,...b1,...a2,...b2);};
    for(let i=0;i<X.length-1;i++){edge([X[i],hd],[X[i+1],hd]);edge([X[i+1],-hd],[X[i],-hd]);}
    for(let j=0;j<Z.length-1;j++){edge([hw,Z[j+1]],[hw,Z[j]]);edge([-hw,Z[j]],[-hw,Z[j+1]]);}
    return {top:triGeo(top,tuv),under:triGeo(bot)};
  }
  const chiweiG=(()=>{const s=new T.Shape();s.moveTo(-.34,0);s.lineTo(.26,0);s.lineTo(.3,.3);s.quadraticCurveTo(.26,.78,-.02,1.08);s.lineTo(-.14,.98);s.quadraticCurveTo(.02,.66,-.06,.5);s.quadraticCurveTo(-.22,.42,-.34,.26);s.lineTo(-.34,0);
    const g=new T.ExtrudeGeometry(s,{depth:.2,bevelEnabled:false});g.translate(0,0,-.1);return T_(g);})();
  // 在当前框架 (x,y,z) 放一个屋顶；返回高度函数供上层构件使用
  function roof(x,y,z,w,d,h,style,o={}){
    const lift=o.lift??Math.min(.9,.22+w*.018),th=o.th??Math.min(.34,.16+d*.012),S=roofShape(w,d,h,style,lift),lod=o.lod||'c';
    const tile=o.tile||P.tile,ridge=o.ridge||P.tileDark,rafter=o.rafter||P.rafter;
    const geo=roofGeometry(S,style,th),m=mtx([x,y,z]);
    put('roof',geo.top,m,jit(tile,.025),{lod});put('solid',geo.under,m,rafter,{ao:false,lod});geo.top.dispose();geo.under.dispose();
    const {hw,hd,a,xg,tS,Y}=S,rw=Math.min(.42,.16+d*.018);
    const seg=(p,q,width=rw,col=ridge)=>beam('solid',[x+p[0],y+p[1]+width*.35,z+p[2]],[x+q[0],y+q[1]+width*.35,z+q[2]],width,col,{ao:false,lod,depth:width*1.25},G.box);
    const along=(fn,n=4)=>{for(let i=0;i<n;i++){const p=fn(i/n),q=fn((i+1)/n);seg(p,q,rw*.8);}};
    let ridgeHalf=0;
    if(style==='hip'){ridgeHalf=a;for(const sx of [-1,1])for(const sz of [-1,1])along(t=>{const px=sx*(a+(hw-a)*t),pz=sz*hd*t;return [px,Y(px,pz)+.02,pz];},5);}
    else if(style==='xie'){ridgeHalf=xg;for(const sx of [-1,1])for(const sz of [-1,1]){
        along(t=>{const pz=sz*hd*tS*t;return [sx*(xg-.12),Y(sx*(xg-.2),pz),pz];},3);
        along(t=>{const px=sx*(xg+(hw-xg)*t),pz=sz*hd*(tS+(1-tS)*t);return [px,Y(px,pz)+.02,pz];},3);}
      // 山花板
      const yb=Y(xg+.06,0)-.05,pos=[];for(const sx of [-1,1]){const px=sx*(xg-.16),n=8;for(let i=0;i<n;i++){const z0=-hd*tS+2*hd*tS*i/n,z1=-hd*tS+2*hd*tS*(i+1)/n,y0=Y(sx*(xg-.3),z0)-th*.6,y1=Y(sx*(xg-.3),z1)-th*.6;
          const q=[[px,yb,z0],[px,y0,z0],[px,y1,z1],[px,yb,z1]];const order=sx>0?[0,1,2,0,2,3]:[0,2,1,0,3,2];for(const k of order)pos.push(...q[k]);}}
      const g=triGeo(pos);put('solid',g,m,o.gableColor||'#e8dcc6',{ao:false,lod});g.dispose();}
    else if(style==='gable'){ridgeHalf=hw;for(const sx of [-1,1])for(const sz of [-1,1])along(t=>{const pz=sz*hd*t;return [sx*(hw-.05),Y(sx*hw,pz),pz];},4);}
    else if(style==='pyr'){for(const sx of [-1,1])for(const sz of [-1,1])along(t=>{const px=sx*hw*t,pz=sz*hd*t;return [px,Y(px,pz)+.02,pz];},4);
      cyl('solid',[x,y+h+.25,z],[.22,.5,.22],o.finial||P.gold,0,{lod});ball('solid',[x,y+h+.65,z],[.26,.32,.26],o.finial||P.gold,0,{lod});}
    if(ridgeHalf>0){seg([-ridgeHalf-.1,h,0],[ridgeHalf+.1,h,0],rw*1.25);
      if(o.chiwei!==false){const cs=clamp(d*.085,.45,1.5);for(const sx of [-1,1])put('solid',chiweiG,mtx([x+sx*(ridgeHalf+.05),y+h+rw*.5,z],[cs,cs,cs*.9],[0,sx>0?0:Math.PI,0]),o.chiweiColor||ridge,{ao:false,lod});}
      else for(const sx of [-1,1])box('solid',[x+sx*(ridgeHalf+.1),y+h+rw*.8,z],[.28,.42,.3],ridge,[0,0,sx*.3],{ao:false,lod});}
    // 翼角：檐角上翘的小构件
    // 碰撞：按高度分层，每层是“屋面高于该层”的矩形区域，顶面取该层中间高度
    if(o.collide!==false){const N=clamp(Math.ceil(h/.42),2,10);
      for(let j=0;j<N;j++){const y0=h*j/N,y1=h*(j+1)/N,t=1-Math.pow(y0/h,1/1.45),Z=hd*t;
        const X=style==='gable'?hw:style==='pyr'?hw*t:style==='hip'?a+(hw-a)*t:(t<tS?xg:xg+(t-tS)/(1-tS)*(hw-xg));
        const top=y+(y0+y1)/2+.06,base=j?y+y0-.15:y-th-.05;if(X>.05&&Z>.05)block(x,z,X,Z,top-base,base,{walkable:true});}
      if(ridgeHalf>0)block(x,z,ridgeHalf+.1,rw*.7,rw*1.1+.25,y+h-.25,{walkable:true});else if(style==='pyr')pillar(x,z,.3,1.27,y+h-.3);}
    if(style!=='gable'&&o.corners!==false)for(const sx of [-1,1])for(const sz of [-1,1])box('solid',[x+sx*(hw-.1),y+Y(hw,hd)+.12,z+sz*(hd-.1)],[.16,.3,.16],ridge,[sz*.5,0,-sx*.5],{ao:false,lod:'d'});
    return S;
  }
  // —— 斗拱（单组，朝向局部 +z）——
  const BR=[[[0,.14,0],[.56,.28,.56],P.ochre],[[0,.38,0],[1.5,.2,.26],P.red],[[0,.38,.2],[.26,.2,1.0],P.red],[[-.62,.54,0],[.28,.14,.3],P.ochre],[[.62,.54,0],[.28,.14,.3],P.ochre],[[0,.54,.62],[.3,.14,.28],P.ochre],
    [[0,.7,.62],[1.3,.18,.24],P.teal],[[0,.7,.3],[.24,.18,1.5],P.red],[[0,.7,0],[1.9,.18,.24],P.red],[[-.55,.85,.62],[.26,.13,.28],P.ochre],[[.55,.85,.62],[.26,.13,.28],P.ochre],[[0,.93,.98],[.22,.2,.5],P.ochre],[[0,1.0,.3],[.32,.12,1.9],P.redDark]];
  function bracket(x,y,z,rot,s=1,lod='c'){frame(x,z,rot,()=>{for(const [p,sc,c] of BR)box('solid',[p[0]*s,y+p[1]*s,p[2]*s],[sc[0]*s,sc[1]*s,sc[2]*s],c,0,{ao:false,lod});});}
  // 文字匾额（仅浏览器内有文字贴图）
  const plaques=[];
  function plaque(text,x,y,z,w=3,h=1.1,rot=0){
    frame(x,z,rot,()=>{box('solid',[0,y,0],[w,h,.14],'#3d2c27',0,{ao:false});box('solid',[0,y,0],[w+.16,h+.16,.1],P.gold,0,{ao:false});
      if(!hasDOM)return;const [wx,wz]=toWorld(0,.09);plaques.push({text,x:wx,y:y+F.elements[13],z:wz,w,h,rot:Math.atan2(F.elements[8],F.elements[0])});});
  }
  // —— 殿堂：台基、柱网、墙/门窗、阑额、斗拱、屋顶；正面朝局部 +z ——
  function hall(x,z,rot,o){frame(x,z,rot,()=>hallBody(o));}
  function hallBody(o){
    const w=o.w,d=o.d,h=o.h??4.2,plat=o.plat??.6,bays=o.bays??Math.max(3,Math.round(w/3.6)),style=o.roof||'xie',front=o.front||'door',lod=o.lod||'c',y0=o.y0||0,col=o.col||P.red,wallC=o.wall||P.wall;
    const br=o.brackets!==false,bs=o.bs??clamp(h/4.6,.6,1.15),eave=o.eave??(br?1.9:1.2),yb=y0+plat,blod=w<14?'d':lod;
    if(plat>0){box('solid',[0,y0+plat/2,0],[w+1.6,plat,d+1.6],jit(P.stone,.02),0,{ao:false,lod});box('solid',[0,yb-.04,0],[w+1.76,.09,d+1.76],P.stoneDark,0,{ao:false,lod});
      if(o.steps!==false&&y0===0)for(let i=0;i<3;i++){const hh=plat*(1-i/3);box('solid',[0,hh/2,d/2+.95+.42*i],[3.2,hh,.44],P.stone,0,{ao:false,lod});}}
    const xs=[];for(let i=0;i<=bays;i++)xs.push(-w/2+w*i/bays);
    const zs=d>7?[-d/2,0,d/2]:[-d/2,d/2];
    const cols=[];for(const cx of xs)for(const cz of [-d/2,d/2])cols.push([cx,cz]);for(const cz of zs)if(Math.abs(cz)<d/2-.1)for(const cx of [-w/2,w/2])cols.push([cx,cz]);
    for(const [cx,cz] of cols){cyl('solid',[cx,yb+h/2,cz],[.22,h,.22],col,0,{lod});cyl('solid',[cx,yb+.08,cz],[.36,.16,.36],P.stone,0,{lod,ao:false});}
    if(front!=='open'){
      box('solid',[0,yb+(h-.3)/2,-d/2],[w,h-.3,.34],wallC,0,{lod});for(const sx of [-1,1])box('solid',[sx*w/2,yb+(h-.3)/2,0],[.34,h-.3,d],wallC,0,{lod});
      box('solid',[0,yb+.35,-d/2],[w+.04,.7,.38],'#d6c9b1',0,{lod});for(const sx of [-1,1])box('solid',[sx*w/2,yb+.35,0],[.38,.7,d+.04],'#d6c9b1',0,{lod});
      const bw=w/bays,mid=Math.floor(bays/2);
      if(front==='shop'){box('solid',[0,yb+(h-.4)/2,-d/2+.45],[w-.5,h-.4,.1],'#6e5747',0,{lod});}
      for(let i=0;i<bays;i++){const bx=-w/2+bw*(i+.5),zf=d/2;
        if(front==='shop'){if(o.counter!==false){box('solid',[bx,yb+.45,zf-.35],[bw-.5,.9,.55],jit(P.wood,.05),0,{lod});box('solid',[bx,yb+.92,zf-.35],[bw-.4,.07,.65],P.woodDark,0,{lod});}continue;}
        if(i===mid||o.allDoors){box('solid',[bx,yb+(h-.7)/2,zf-.06],[bw-.36,h-.7,.12],P.door,0,{lod});box('solid',[bx,yb+(h-.7)/2,zf-.02],[.05,h-.7,.1],P.woodDark,0,{lod});
          for(const sx of [-1,1])for(let r=0;r<4;r++)for(let c=0;c<3;c++)box('solid',[bx+sx*(bw*.12+c*.22),yb+.8+r*.55,zf+.01],[.07,.07,.05],P.gold,0,{lod:'d',ao:false});
          box('solid',[bx,yb+h-.47,zf-.04],[bw-.2,.5,.26],wallC,0,{lod});}
        else{box('solid',[bx,yb+.45,zf-.05],[bw-.3,.9,.3],'#dcd0b9',0,{lod});box('solid',[bx,yb+h-.42,zf-.05],[bw-.3,.6,.3],wallC,0,{lod});
          const wh=h-1.92,wy=yb+.9+wh/2;box('solid',[bx,wy,zf-.08],[bw-.32,wh+.1,.12],'#4d3a31',0,{lod});
          const n=Math.max(5,Math.round(bw*2.2));for(let k=0;k<n;k++)box('solid',[bx-(bw-.6)/2+(bw-.6)*k/(n-1),wy,zf],[.07,wh,.08],P.wood,0,{lod:'d'});
          box('solid',[bx,wy+wh/2,zf],[bw-.34,.1,.1],P.woodDark,0,{lod:'d'});box('solid',[bx,wy-wh/2,zf],[bw-.34,.1,.1],P.woodDark,0,{lod:'d'});}
      }
    }
    // 阑额（含“七朱八白”白色小块）
    for(const sz of [-1,1])box('solid',[0,yb+h-.17,sz*d/2],[w+.44,.34,.3],col,0,{lod});for(const sx of [-1,1])box('solid',[sx*w/2,yb+h-.17,0],[.3,.34,d+.44],col,0,{lod});
    for(let i=0;i<bays;i++)for(const k of [.3,.7])box('solid',[-w/2+w*(i+k)/bays,yb+h-.17,d/2+.16],[w/bays*.22,.13,.04],P.white,0,{lod:'d',ao:false});
    if(br){for(const cx of xs){bracket(cx,yb+h,d/2,0,bs,blod);bracket(cx,yb+h,-d/2,Math.PI,bs,'d');}
      for(const cz of zs)if(Math.abs(cz)<d/2-.1)for(const sx of [-1,1])bracket(sx*w/2,yb+h,cz,sx*Math.PI/2,bs,'d');
      for(const sx of [-1,1])for(const sz of [-1,1])bracket(sx*w/2,yb+h,sz*d/2,Math.atan2(sx,sz),bs*.9,blod);}
    const yr=yb+h+(br?bs*1.02:.22),W=w+2*eave,D=d+2*eave,rh=o.rh??(style==='gable'?D*.27:D*.25);
    if(style==='gable'){const S=roofShape(W,D,rh,'gable',0);const pos=[];for(const sx of [-1,1]){const px=sx*(w/2+.02),n=8;for(let i=0;i<n;i++){const z0=-d/2+d*i/n,z1=-d/2+d*(i+1)/n,y0g=S.Y(px,z0)-.3,y1g=S.Y(px,z1)-.3;const yw=yb+h-.3,q=[[px,yw,z0],[px,y0g+yr,z0],[px,y1g+yr,z1],[px,yw,z1]];const ord=sx>0?[0,1,2,0,2,3]:[0,2,1,0,3,2];for(const k of ord)pos.push(...q[k]);}}
      const g=triGeo(pos);put('solid',g,mtx([0,0,0]),wallC,{lod,ao:false});g.dispose();}
    const rc=o.collide!==false;
    if(o.upper){const lower=roof(0,yr,0,W,D,D*.13,'hip',{tile:o.tile,ridge:o.ridge,lod,chiwei:false,corners:true,lift:o.lift,collide:rc});
      const u=o.upper,uy=yr+lower.Y(0,(u.d/2+.3))-.15;box('solid',[0,uy+.2,0],[u.w+1,.5,u.d+1],P.red,0,{lod});
      if(u.rail!==false)for(const sz of [-1,1]){box('solid',[0,uy+1.05,sz*(u.d/2+.45)],[u.w+.9,.1,.1],P.red,0,{lod:'d'});for(let k=0;k<=Math.round(u.w/.8);k++)box('solid',[-u.w/2-.4+(u.w+.8)*k/Math.round(u.w/.8),uy+.75,sz*(u.d/2+.45)],[.08,.6,.08],P.red,0,{lod:'d'});}
      hallBody({...o,...u,y0:uy+.3,plat:0,upper:null,steps:false,collide:rc,plaque:null});}
    else roof(0,yr,0,W,D,rh,style,{tile:o.tile,ridge:o.ridge,lod,chiwei:o.chiwei,lift:o.lift,rafter:o.rafter,collide:rc});
    if(o.plaque)plaque(o.plaque,0,yb+h-.85,d/2+.42,o.plaqueW||2.6,o.plaqueH||1);
    if(rc){if(front==='open')for(const [cx,cz] of cols)pillar(cx,cz,.34,yb+h-y0,y0);else{const m=y0?.3:.85;block(0,0,w/2+m,d/2+m,yr-y0,y0);}if(y0===0)foot(0,0,w/2+1.4,d/2+1.4,front==='open'?.1:.2);}
  }

  // —— 坊墙/院墙：夯土或白灰墙，带瓦顶；gaps 为沿墙方向的开口区间 ——
  function wall(x1,z1,x2,z2,o={}){
    const h=o.h??2.6,th=o.th??.9,alongX=Math.abs(x2-x1)>=Math.abs(z2-z1),a0=alongX?Math.min(x1,x2):Math.min(z1,z2),a1=alongX?Math.max(x1,x2):Math.max(z1,z2),c=alongX?z1:x1,lod=o.lod||'c';
    const gaps=(o.gaps||[]).slice().sort((p,q)=>p[0]-q[0]);let s=a0;const segs=[];for(const [g0,g1] of gaps){if(g0>s)segs.push([s,g0]);s=Math.max(s,g1);}if(s<a1)segs.push([s,a1]);
    for(const [s0,s1] of segs){const len=s1-s0,m=(s0+s1)/2;if(len<.2)continue;
      const at=(along,y,across,sx,sy,sz,col,kind='solid',r=[0,0,0],oo={})=>alongX?box(kind,[along,y,c+across],[sx,sy,sz],col,r,{lod,...oo}):box(kind,[c+across,y,along],[sz,sy,sx],col,[r[2],r[1],-r[0]],{lod,...oo});
      if(o.type==='plaster'){at(m,h/2,0,len,h,th,o.color||P.wall);at(m,.3,0,len+.02,.6,th+.06,'#cdbfa6');}
      else{const tone=o.color||P.rammed,nb=Math.max(1,Math.round(len/3.6)),bl=len/nb;for(let k=0;k<nb;k++){const bm=s0+bl*(k+.5),t=jit(tone,.03);at(bm,h*.2,0,bl+.01,h*.4,th,t);at(bm,h*.58,0,bl+.01,h*.36,th*.95,jit(t,.015));at(bm,h*.88,0,bl+.01,h*.24,th*.9,jit(t,.015));}at(m,.12,0,len+.04,.24,th+.12,'#b19a78');at(m,h-.04,0,len+.02,.08,th*.92,'#e6dccb');}
      for(const sd of [-1,1])at(m,h+.1,sd*th*.24,len+.12,.09,th*.62,o.tile||P.tile,'solid',[sd*.42,0,0],{ao:false});
      at(m,h+.24,0,len+.14,.13,.2,o.ridge||P.tileDark,'solid',[0,0,0],{ao:false});
      if(alongX){block(m,c,len/2,th/2+.08,h+.28);foot(m,c,len/2+.2,th/2+.7,.12);}else{block(c,m,th/2+.08,len/2,h+.28);foot(c,m,th/2+.7,len/2+.2,.12);}
    }
  }
  // 坊门/院门：门屋 + 半开门扇；开口可通行
  function gateHouse(x,z,rot,o={}){frame(x,z,rot,()=>{
    const w=o.w??6,d=o.d??3.6,h=o.h??3.6,lod=o.lod||'c',col=o.col||P.red;
    for(const sx of [-1,1])for(const sz of [-1,1]){cyl('solid',[sx*w/2,h/2,sz*d/2],[.2,h,.2],col,0,{lod});cyl('solid',[sx*w/2,.08,sz*d/2],[.32,.16,.32],P.stone,0,{lod,ao:false});pillar(sx*w/2,sz*d/2,.3,h);}
    for(const sz of [-1,1])box('solid',[0,h-.15,sz*d/2],[w+.4,.3,.26],col,0,{lod});for(const sx of [-1,1])box('solid',[sx*w/2,h-.15,0],[.26,.3,d+.3],col,0,{lod});
    box('solid',[0,h-.5,0],[w+.2,.24,.2],col,0,{lod});box('flat',[0,.06,0],[w-.2,.12,.3],P.stoneDark,0,{lod});
    const ds=o.doorsOut?1:-1;for(const sx of [-1,1]){frame(sx*(w/2-.1),0,0,()=>box('solid',[-sx*.05,(h-.6)/2,ds*(w/4-.1)],[.1,h-.62,w/2-.25],P.door,[0,0,0],{lod}));}
    if(o.brackets)for(const sx of [-1,1])for(const sz of [-1,1])bracket(sx*w/2,h,sz*d/2,sz>0?0:Math.PI,.62,lod);
    const yr=h+(o.brackets?.66:.2);roof(0,yr,0,w+2.6,d+2.4,(d+2.4)*.28,o.roof||'gable',{tile:o.tile,ridge:o.ridge,lod,chiwei:o.chiwei??false});
    if(o.plaque)plaque(o.plaque,0,h-1.05,d/2+.12,o.plaqueW||2.2,.85);
  });}
  // —— 树：槐、柳、杏花、柏；风摆由着色器完成 ——
  const blossomSpots=[];
  function treePit(x,z,s){for(const [px,pz,sx,sz] of [[0,.8*s,1.7*s,.16],[0,-.8*s,1.7*s,.16],[.8*s,0,.16,1.44*s],[-.8*s,0,.16,1.44*s]])box('flat',[x+px,.07,z+pz],[sx,.14,sz],P.stoneDark,0,{ao:false,lod:'d'});}
  function huai(x,z,s=1,o={}){
    const h=2.3*s,lean=R(-.07,.07);put('solid',G.trunk,mtx([x,h/2,z],[.26*s,h,.26*s],[lean,0,R(-.07,.07)]),jit(P.woodDark,.04));
    const cols=o.colors||[P.leafDark,P.leaf,P.leafLight],sw=[h*.8,3*s,.12*s];
    for(let i=0;i<3;i++){const a=i*2.1+R(0,.6);beam('solid',[x,h*.85,z],[x+Math.cos(a)*1.1*s,h+.9*s,z+Math.sin(a)*1.1*s],.13*s,P.woodDark);}
    ball('leaf',[x,h+1.55*s,z],[2.1*s,1.35*s,2.1*s],jit(cols[1],.035),[0,R(0,3),0],{sway:sw});
    const n=o.n||6;for(let i=0;i<n;i++){const a=i/n*Math.PI*2+R(-.3,.3),r=R(1.1,1.6)*s,y=h+R(.6,1.7)*s,sc=R(1.0,1.45)*s;ball('leaf',[x+Math.cos(a)*r,y,z+Math.sin(a)*r],[sc*1.15,sc*.82,sc*1.1],jit(cols[i%3],.04),[R(0,1),R(0,3),0],{sway:sw});}
    ball('leaf',[x+R(-.4,.4),h+2.5*s,z+R(-.4,.4)],[1.3*s,.9*s,1.3*s],jit(cols[2],.03),0,{sway:sw,lod:'d'});
    if(o.pit!==false)treePit(x,z,s*.9);if(o.collide!==false){pillar(x,z,.38*s,h+.3*s);pillar(x,z,2.1*s,h+2.45*s-Math.max(2.15,h+.4*s),Math.max(2.15,h+.4*s),{canopy:true});pillar(x,z,.95*s,h+3.2*s-Math.max(2.15,h+.6*s),Math.max(2.15,h+.6*s),{canopy:true});}
  }
  function blossom(x,z,s=1,o={}){huai(x,z,s,{...o,n:5,colors:['#e9c4bd','#f2dcd3','#dfb2ad']});const [wx,wz]=toWorld(x,z);blossomSpots.push([wx,wz,s]);}
  function willow(x,z,s=1,o={}){
    const h=2.6*s,lean=R(-.12,.12);put('solid',G.trunk,mtx([x,h/2,z],[.24*s,h,.24*s],[lean,0,R(-.1,.1)]),jit(P.wood,.04));
    const cx=x+Math.sin(lean)*-h*.4,cy=h+.9*s,cz=z;
    for(let i=0;i<4;i++){const a=i*1.7;ball('leaf',[cx+Math.cos(a)*.9*s,cy+R(0,.6)*s,cz+Math.sin(a)*.9*s],[1.6*s,.95*s,1.6*s],jit('#a4b67e',.035),0,{sway:[h,2*s,.15*s]});}
    const n=o.strands||16;for(let i=0;i<n;i++){const a=i/n*Math.PI*2+R(-.2,.2),r=R(1.3,2.1)*s,len=R(1.8,3.2)*s,top=cy+R(-.2,.4)*s;
      put('leaf',G.cone,mtx([cx+Math.cos(a)*r,top-len/2,cz+Math.sin(a)*r],[R(.2,.32)*s,len,R(.2,.32)*s],[Math.PI+R(-.12,.12),0,R(-.12,.12)]),jit(i%2?'#b5c48a':'#9fb279',.03),{sway:[top,-len,.35*s],lod:i%2?'d':'c'});}
    if(o.collide!==false){pillar(x,z,.35*s,h+.3*s);const cb=Math.max(2.15,h+.5*s);pillar(cx,cz,1.8*s,h+2.1*s-cb,cb,{canopy:true});}
  }
  function cypress(x,z,s=1){put('solid',G.trunk,mtx([x,.6*s,z],[.2*s,1.2*s,.2*s]),P.woodDark);
    for(let i=0;i<4;i++)put('leaf',G.cone,mtx([x,(1.6+i*1.15)*s,z],[(1.25-i*.24)*s,2*s,(1.25-i*.24)*s],[0,i,0]),jit('#62806b',.03),{sway:[.5,6*s,.07*s]});pillar(x,z,.3*s,5.9*s);pillar(x,z,.95*s,(4-2.2/s)*s,2.2,{canopy:true});}
  // —— 灯笼、旗、布幌 ——
  function lantern(x,y,z,s=1,col='#d9773f',lod='c'){
    const sw=[y+.35*s,-1.4*s,.12];cyl('glow',[x,y+.55*s,z],[.018,.4*s,.018],P.woodDark,0,{sway:sw,lod});
    put('glow',G.ball,mtx([x,y,z],[.36*s,.44*s,.36*s]),col,{sway:sw,lod});
    for(const sy of [-1,1])cyl('glow',[x,y+sy*.42*s,z],[.2*s,.08*s,.2*s],'#5b3a2e',0,{sway:sw,lod});
    cyl('glow',[x,y-.66*s,z],[.03*s,.32*s,.03*s],P.gold,0,{sway:sw,lod});
  }
  function banner(x,z,h,o={}){ // 长杆 + 竖幡
    const w=o.w??.9,len=o.len??2.6,col=o.color||P.red,lod=o.lod||'c',rot=o.rot||0;
    cyl('solid',[x,h/2,z],[.07,h,.07],P.woodDark,0,{lod});ball('solid',[x,h+.1,z],[.11,.14,.11],P.gold,0,{lod});
    frame(x,z,rot,()=>{box('solid',[w/2,h-.18,0],[w+.25,.07,.07],P.woodDark,0,{lod});
      put('cloth',G.flagPlane,mtx([w/2+.05,h-.22-len/2,0],[w,len,1]),jit(col,.03),{sway:[h-.25,-len,.35],lod});
      if(o.trim!==false)put('cloth',G.flagPlane,mtx([w/2+.05,h-.22-len-.12,0],[w,.26,1]),o.trim||P.gold,{sway:[h-.25,-len,.35],lod});});
    if(o.collide!==false)pillar(x,z,.14,h);
  }
  function awning(x,y,z,w,d,col,rot=0,lod='c'){frame(x,z,rot,()=>{
    put('cloth',G.flagPlane,mtx([0,y,0],[w,d,1],[-Math.PI/2+.22,0,0]),jit(col,.03),{lod,sway:[y+.3,-1.5,.04]});
    for(let i=0;i<Math.round(w/.7);i++)put('cloth',G.flagPlane,mtx([-w/2+.35+i*.7,y-d/2*Math.sin(.22)-.18,d/2*Math.cos(.22)],[.66,.34,1]),i%2?P.white:jit(col,.05),{lod,sway:[y,-.6,.08]});});}
  // —— 货摊：不同商品 ——
  function stall(x,z,rot,type){frame(x,z,rot,()=>{
    const w=3.6,d=2.2;box('solid',[0,.45,0],[w,.9,d],jit(P.wood,.05));box('solid',[0,.93,0],[w+.15,.07,d+.15],P.woodDark);
    for(const sx of [-1,1])for(const sz of [-1,1]){cyl('solid',[sx*(w/2+.1),1.3,sz*(d/2+.05)],[.06,2.6,.06],P.woodDark);}
    const cl={silk:'#c4796b',pottery:'#5f8a86',tea:'#8a9b6c',lantern:'#b5533e',bread:'#c99a5c',spice:'#8c6e9a'}[type]||'#a7706a';
    awning(0,2.62,0,w+.6,d+.9,cl);block(0,0,w/2+.2,d/2+.15,1);block(0,0,(w+.6)/2,(d+.9)/2,.3,2.4,{walkable:true});
    const top=.97;
    if(type==='silk'){const cs=['#d98f86','#7fa9a6','#e7cf8f','#a7b7d6','#f0e3cf','#c39ab8','#93b58a'];for(let i=0;i<7;i++)put('solid',G.cyl,mtx([-1.45+i*.48,top+.16,-.3],[.15,.9,.15],[Math.PI/2,0,0]),cs[i],{ao:false});
      for(let i=0;i<4;i++)put('solid',G.cyl,mtx([-1.2+i*.8,top+.42,-.3],[.15,.9,.15],[Math.PI/2,0,0]),cs[(i*3)%7],{ao:false});
      box('solid',[0,1.9,-d/2+.05],[w,.06,.06],P.woodDark);for(let i=0;i<4;i++)put('cloth',G.flagPlane,mtx([-1.3+i*.85,1.3,-d/2+.04],[.7,1.2,1]),cs[(i*2+1)%7],{sway:[1.9,-1.2,.06]});}
    else if(type==='pottery'){const cs=['#d1a55a','#6f9a79','#efe2c4','#b76e45','#5e8b8a'];for(let i=0;i<6;i++){const px=-1.4+i*.56,c=cs[i%5],hh=R(.35,.6);put('solid',G.ball2,mtx([px,top+hh*.5,-.1],[.22,hh*.55,.22]),c,{ao:false});cyl('solid',[px,top+hh*.98,-.1],[.09,.12,.09],c,0,{ao:false});}
      for(let i=0;i<3;i++){const px=-1.6+i*1.4;put('solid',G.ball2,mtx([px,.38,d/2+.35],[.32,.38,.32]),cs[(i+2)%5],{ao:false});}}
    else if(type==='tea'){for(let i=0;i<4;i++)for(let k=0;k<4;k++)cyl('solid',[-1.3+i*.5,top+.04+k*.07,-.3],[.18,.06,.18],k%2?'#8a6d4b':'#76603f',0,{ao:false});
      cyl('solid',[.9,top+.2,0],[.26,.4,.26],'#6c5d55');put('solid',G.dome,mtx([.9,top+.4,0],[.24,.18,.24]),'#4f4b47',{ao:false});for(let i=0;i<4;i++)put('solid',G.dome,mtx([-.2+i*.28,top+.06,.45],[.11,.07,.11],[Math.PI,0,0]),'#e9e1cf',{ao:false});}
    else if(type==='lantern'){box('solid',[0,2.2,0],[w,.06,.06],P.woodDark);for(let i=0;i<5;i++)lantern(-1.4+i*.7,1.75,0,.7,i%2?'#d76a46':'#e2a45d');for(let i=0;i<3;i++)put('solid',G.ball,mtx([-1+i,top+.25,-.4],[.24,.3,.24]),'#e7b56d',{ao:false});}
    else if(type==='bread'){cyl('solid',[1.2,.5,d/2+.6],[.5,1,.5],'#b8916a');cyl('solid',[1.2,1.02,d/2+.6],[.32,.05,.32],'#3c302a');for(let i=0;i<10;i++)cyl('solid',[-1.4+(i%5)*.45,top+.04+Math.floor(i/5)*.08,-.2+Math.floor(i/5)*.3],[.19,.06,.19],'#d8a965',0,{ao:false});}
    else {const cs=['#c9823e','#b54e3a','#d8b64f','#7b8f4f','#9a6b4f'];for(let i=0;i<5;i++){cyl('solid',[-1.4+i*.7,top+.15,-.1],[.3,.3,.3],'#b39a74',0,{ao:false});put('solid',G.dome,mtx([-1.4+i*.7,top+.3,-.1],[.27,.18,.27]),cs[i],{ao:false});}}
  });}
  // 货物：筐、罐、布匹堆
  function goods(x,z,kind){
    if(kind==='bales'){for(let i=0;i<5;i++){const a=R(0,6);box('solid',[x+(i%3)*1.05-1,.38+Math.floor(i/3)*.72,z+R(-.1,.1)],[1,.72,.75],pick(['#d9c9a5','#c9a982','#b5a58c']),[0,a*.05,0]);box('solid',[x+(i%3)*1.05-1,.38+Math.floor(i/3)*.72,z],[.08,.74,.8],'#7a5f48',[0,0,0],{lod:'d'});}block(x,z,1.7,.5,1.4);}
    else if(kind==='jars'){for(let i=0;i<4;i++){const px=x+(i%2)*.8,pz=z+Math.floor(i/2)*.8;put('solid',G.ball2,mtx([px,.45,pz],[.38,.46,.38]),pick(['#b98a5d','#9e7a5e','#c9a774']));cyl('solid',[px,.92,pz],[.16,.12,.16],'#8d6c52');}pillar(x+.4,z+.4,.9,1);}
    else if(kind==='baskets'){for(let i=0;i<3;i++){cyl('solid',[x+i*.8,.25,z],[.32,.5,.32],'#b39a6e');put('solid',G.dome,mtx([x+i*.8,.48,z],[.29,.17,.29]),pick(['#c9823e','#7c9a5a','#d8b64f','#b54e3a']));}}
    else if(kind==='logs'){for(let i=0;i<9;i++){const row=i<4?0:i<7?1:2,k=row===0?i:row===1?i-4:i-7;put('solid',G.cyl,mtx([x+(k-(row===0?1.5:row===1?1:.5))*.62,.3+row*.52,z],[.3,5.5,.3],[Math.PI/2,0,0]),jit('#b08a62',.05));}block(x,z,1.4,2.8,1.6);}
  }

  // —— 烘焙小模型（人物、骆驼、牛车），供实例化或静态合并 ——
  function segM(a,b,width){_d.set(b[0]-a[0],b[1]-a[1],b[2]-a[2]);const len=_d.length();_d.normalize();return new T.Matrix4().compose(new T.Vector3((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2),new T.Quaternion().setFromUnitVectors(_up,_d),new T.Vector3(width,len,width));}
  function bake(parts){const b=newAcc('solid');for(const p of parts){const m=p[1].isMatrix4?p[1]:mtx(p[1],p[2],p[4]||[0,0,0]);append(b,p[0],m,p[1].isMatrix4?p[2]:p[3],{ao:false});}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));g.setAttribute('color',new T.Float32BufferAttribute(b.c,3));g.computeBoundingSphere();return own(g);}
  const W='#ffffff',INK=P.ink,SK=P.skin;
  const sleeves=(y,len)=>[[G.trunk,[-.25,y,.03],[.09,len,.09],W,[0,0,-.13]],[G.trunk,[.25,y,.03],[.09,len,.09],W,[0,0,.13]]];
  const hands=y=>[[G.ball,[-.29,y,.06],[.055,.06,.055],SK],[G.ball,[.29,y,.06],[.055,.06,.055],SK]];
  const PEOPLE={
    man:{body:bake([[G.trunk,[0,.72,0],[.3,1.3,.27],W],[G.ball,[0,1.37,0],[.25,.15,.2],W],...sleeves(1.08,.56),[G.cyl,[0,1.02,0],[.205,.07,.19],'#3a3331'],[G.box,[-.09,.05,.07],[.12,.1,.26],'#3a3330'],[G.box,[.09,.05,.07],[.12,.1,.26],'#3a3330']]),
      head:bake([[G.cyl,[0,1.47,0],[.07,.12,.07],SK],[G.ball,[0,1.6,0],[.145,.165,.15],SK],[G.dome,[0,1.64,-.01],[.162,.13,.168],INK],[G.ball,[0,1.77,-.04],[.085,.08,.09],INK],[G.box,[-.06,1.6,-.17],[.035,.22,.025],INK,[.45,0,0]],[G.box,[.06,1.6,-.17],[.035,.22,.025],INK,[.45,0,0]],...hands(.8)])},
    woman:{body:bake([[G.trunk,[0,.64,0],[.34,1.28,.31],W],[G.ball,[0,1.3,0],[.2,.15,.17],W],...sleeves(1.04,.48),[G.cyl,[0,1.22,0],[.2,.07,.18],'#f3e6cf'],[G.box,[0,1.12,-.15],[.5,.06,.03],'#f6efe2',[0,0,.0]]]),
      head:bake([[G.cyl,[0,1.4,0],[.065,.1,.065],SK],[G.ball,[0,1.52,0],[.135,.155,.14],SK],[G.dome,[0,1.555,-.015],[.15,.13,.155],INK],[G.ball,[0,1.76,-.03],[.1,.13,.09],INK],[G.ball,[.06,1.7,.02],[.035,.035,.035],P.gold],...hands(.84)])},
    merchant:{body:bake([[G.trunk,[0,.7,0],[.3,1.26,.27],W],[G.ball,[0,1.36,0],[.26,.16,.21],W],...sleeves(1.06,.56),[G.cyl,[0,1.0,0],[.21,.08,.2],'#5a3a2c'],[G.box,[-.09,.05,.07],[.12,.1,.26],'#3a3330'],[G.box,[.09,.05,.07],[.12,.1,.26],'#3a3330']]),
      head:bake([[G.cyl,[0,1.47,0],[.07,.12,.07],SK],[G.ball,[0,1.6,0],[.145,.165,.15],'#d9b28c'],[G.ball,[0,1.52,.08],[.11,.1,.08],'#4a3328'],[G.cone,[0,1.86,-.01],[.16,.4,.16],'#e6d8bb'],[G.cyl,[0,1.69,-.01],[.17,.06,.17],'#a35a42'],...hands(.8)])}};
  const ROBES=['#c98b5e','#7fa1a0','#d7c6a0','#b9655a','#8a9bb4','#e0b07c','#9db38c','#c57f86','#efe2c8','#6d8a87','#a9845f','#c7a2b8'];
  function person(x,z,rot,type='man',color,lod='d',y=0,k=1){const t=PEOPLE[type],m=mtx([x,y,z],[k,k,k],[0,rot,0]);put('solid',t.body,m,color||pick(ROBES),{lod,ao:false});put('solid',t.head,m,'#ffffff',{lod,ao:false});}
  // 双峰驼：圆桶身、驼峰带毛、S 形颈与颈下长毛，驮丝绸卷与货包；腿单独实例化以摆动
  const sg=(g,a,b,w,c)=>[g,segM(a,b,w),c],CAM='#c9a273',CAMD='#b88f60',CAMH='#9c774f';
  const camelHead=(y,z)=>[sg(G.trunk,[0,y-.08,z-.18],[0,y,z+.12],.2,'#c39a6b'),[G.ball,[0,y+.02,z],[.15,.15,.28],'#c39a6b',[.22,0,0]],[G.ball,[0,y-.07,z+.24],[.11,.1,.12],'#b08a5f'],
    [G.box,[-.09,y+.13,z-.1],[.04,.1,.05],CAMD],[G.box,[.09,y+.13,z-.1],[.04,.1,.05],CAMD],[G.ball,[-.12,y+.06,z+.06],[.025,.025,.025],INK],[G.ball,[.12,y+.06,z+.06],[.025,.025,.025],INK]];
  const camelBody=bake([[G.ball2,[0,1.74,0],[.52,.5,1.0],CAM],[G.ball,[0,1.55,0],[.44,.34,.78],'#c09868'],[G.ball,[0,1.86,.6],[.42,.46,.42],'#c39a6b'],[G.ball,[0,1.82,-.68],[.42,.44,.4],CAM],
    [G.ball,[0,2.28,.4],[.29,.4,.31],CAMD],[G.ball,[0,2.6,.42],[.18,.12,.2],CAMH],[G.ball,[0,2.26,-.42],[.29,.4,.31],CAMD],[G.ball,[0,2.58,-.42],[.18,.12,.2],CAMH],
    sg(G.trunk,[0,1.9,.9],[0,1.44,1.48],.3,'#c39a6b'),[G.ball,[0,1.44,1.5],[.17,.17,.19],'#c39a6b'],sg(G.trunk,[0,1.44,1.5],[0,2.16,1.76],.21,'#c39a6b'),[G.ball,[0,1.42,1.24],[.17,.3,.3],CAMH],[G.ball,[0,1.94,1.66],[.15,.2,.14],CAMH],
    ...camelHead(2.24,1.92),sg(G.cyl,[0,1.98,-1.06],[0,1.36,-1.2],.05,'#8f6d4c'),[G.ball,[0,1.3,-1.21],[.07,.11,.07],'#6d5440'],
    [G.box,[0,2.25,0],[.98,.06,.5],'#a2584a'],[G.box,[-.5,2.0,0],[.05,.5,.5],'#a2584a'],[G.box,[.5,2.0,0],[.05,.5,.5],'#a2584a'],[G.box,[-.53,1.78,0],[.06,.08,.52],'#e1c27c'],[G.box,[.53,1.78,0],[.06,.08,.52],'#e1c27c'],
    [G.cyl,[-.72,2.02,0],[.2,.86,.2],'#d98f86',[Math.PI/2,0,0]],[G.cyl,[.72,2.02,0],[.2,.86,.2],'#7fa9a6',[Math.PI/2,0,0]],[G.cyl,[-.72,2.02,0],[.205,.08,.205],'#f0e3cf',[Math.PI/2,0,0]],[G.cyl,[.72,2.02,0],[.205,.08,.205],'#f0e3cf',[Math.PI/2,0,0]],
    [G.box,[0,2.4,0],[.72,.22,.3],'#e7cf8f'],[G.ball,[.42,1.62,.46],[.11,.14,.05],'#d6c7a6']]);
  const camelLeg=bake([sg(G.trunk,[0,.06,0],[0,-.74,.02],.17,'#b68e62'),[G.ball,[0,-.76,.02],[.085,.09,.09],'#ad8659'],sg(G.cyl,[0,-.76,.02],[0,-1.36,0],.066,'#b68e62'),[G.ball,[0,-1.41,.06],[.13,.055,.17],'#8f6d4c']]);
  const camelRest=bake([[G.ball2,[0,.64,0],[.56,.5,1.0],CAM],[G.ball,[0,.76,.56],[.42,.42,.4],'#c39a6b'],[G.ball,[0,.72,-.6],[.42,.42,.4],CAM],[G.ball,[0,1.16,.36],[.28,.38,.3],CAMD],[G.ball,[0,1.46,.38],[.17,.11,.19],CAMH],[G.ball,[0,1.14,-.4],[.28,.38,.3],CAMD],[G.ball,[0,1.44,-.4],[.17,.11,.19],CAMH],
    sg(G.cyl,[-.24,.1,.95],[-.24,.1,.5],.09,'#b68e62'),sg(G.cyl,[.24,.1,.95],[.24,.1,.5],.09,'#b68e62'),[G.ball,[-.24,.13,.98],[.12,.1,.12],'#a57f57'],[G.ball,[.24,.13,.98],[.12,.1,.12],'#a57f57'],
    [G.ball,[-.4,.42,-.45],[.17,.24,.42],'#bf9668'],[G.ball,[.4,.42,-.45],[.17,.24,.42],'#bf9668'],[G.ball,[-.5,.07,-.08],[.11,.06,.18],'#8f6d4c'],[G.ball,[.5,.07,-.08],[.11,.06,.18],'#8f6d4c'],
    sg(G.trunk,[0,.84,.86],[0,.96,1.32],.28,'#c39a6b'),[G.ball,[0,.96,1.34],[.16,.16,.18],'#c39a6b'],sg(G.trunk,[0,.96,1.34],[0,1.7,1.56],.2,'#c39a6b'),[G.ball,[0,.92,1.12],[.16,.24,.26],CAMH],...camelHead(1.8,1.72),
    sg(G.cyl,[0,.86,-1.0],[0,.36,-1.1],.045,'#8f6d4c'),[G.box,[0,1.1,0],[.98,.06,.5],'#a2584a'],[G.box,[-.5,.86,0],[.05,.5,.5],'#a2584a'],[G.box,[.5,.86,0],[.05,.5,.5],'#a2584a']]);
  // 唐马：短颈小头、剪鬃“三花”、结尾，鞍鞯与杏叶；rider 为真时不含马腿（马腿另做实例以便摆动），改为带骑者的腿与靴
  function horseParts(c,dark,cloth,rider){const L='#3b302b',legs=[];
    if(!rider)for(const sx of [-1,1]){legs.push(sg(G.trunk,[sx*.15,1.06,.5],[sx*.15,.56,.54],.13,c),sg(G.cyl,[sx*.15,.56,.54],[sx*.15,.08,.5],.062,c),[G.box,[sx*.15,.04,.52],[.1,.08,.13],L],
      sg(G.trunk,[sx*.16,1.14,-.52],[sx*.16,.6,-.68],.15,c),sg(G.cyl,[sx*.16,.6,-.68],[sx*.16,.08,-.58],.062,c),[G.box,[sx*.16,.04,-.58],[.1,.08,.13],L]);}
    const p=[[G.ball2,[0,1.24,0],[.34,.36,.72],c],[G.ball,[0,1.3,.5],[.33,.39,.36],c],[G.ball,[0,1.32,-.5],[.35,.38,.38],c],sg(G.trunk,[0,1.42,.64],[0,1.98,.96],.25,c),[G.ball,[0,1.97,.99],[.13,.14,.15],c],
      sg(G.trunk,[0,2.0,1.0],[0,1.62,1.32],.16,c),[G.ball,[0,1.6,1.34],[.09,.09,.1],dark],[G.cone,[-.06,2.12,.97],[.035,.12,.035],c],[G.cone,[.06,2.12,.97],[.035,.12,.035],c],
      sg(G.box,[0,1.62,.6],[0,2.08,.92],.07,dark),[G.box,[0,1.74,.71],[.06,.12,.07],dark],[G.box,[0,1.86,.8],[.06,.12,.07],dark],[G.box,[0,1.98,.89],[.06,.12,.07],dark],
      [G.ball,[0,1.4,-.88],[.06,.07,.07],dark],sg(G.trunk,[0,1.38,-.9],[0,.98,-.98],.055,dark),[G.ball,[0,.98,-.98],[.05,.06,.05],dark],
      [G.box,[0,1.6,.04],[.74,.05,.64],cloth],[G.box,[-.36,1.36,.04],[.04,.48,.6],cloth],[G.box,[.36,1.36,.04],[.04,.48,.6],cloth],[G.box,[0,1.66,.04],[.42,.1,.46],'#6b3f30'],[G.box,[0,1.75,.27],[.3,.12,.06],'#6b3f30'],[G.box,[0,1.75,-.19],[.32,.14,.06],'#6b3f30'],
      [G.box,[0,1.4,.82],[.5,.05,.05],'#a2584a'],[G.ball,[-.18,1.3,.84],[.05,.07,.04],'#b5533e'],[G.ball,[0,1.3,.87],[.05,.07,.04],'#b5533e'],[G.ball,[.18,1.3,.84],[.05,.07,.04],'#b5533e'],[G.box,[0,1.4,-.72],[.5,.05,.05],'#a2584a'],
      sg(G.cyl,[0,1.66,1.28],[0,1.74,.36],.02,L),...legs];
    if(rider)for(const sx of [-1,1])p.push(sg(G.cyl,[sx*.34,1.64,.08],[sx*.37,1.12,.2],.085,'#efe2c8'),[G.box,[sx*.37,1.06,.24],[.11,.12,.22],'#3a3330']);
    return p;}
  const horseLeg=bake([sg(G.trunk,[0,.06,0],[0,-.5,.03],.12,'#8d6a52'),[G.ball,[0,-.52,.03],[.065,.075,.07],'#84634c'],sg(G.cyl,[0,-.52,.03],[0,-.96,0],.052,'#8d6a52'),[G.ball,[0,-.96,.01],[.06,.05,.06],'#6d5444'],[G.box,[0,-1.02,.02],[.1,.08,.12],'#3b302b']]);
  const horseG=[bake(horseParts('#8d6a52','#4a3a30','#c9923f')),bake(horseParts('#ddd3c2','#8b8279','#5f8a86'))],riderHorse=bake(horseParts('#8d6a52','#4a3a30','#b5533e',true));
  // 挑担的人身上的扁担与两只箩筐（跟随“男子”实例移动）
  const porterLoad=bake([sg(G.cyl,[.2,1.42,-.95],[.2,1.42,.95],.035,'#9a7a52'),[G.ball,[.24,1.36,.12],[.06,.06,.06],SK],sg(G.cyl,[.25,.92,.12],[.24,1.34,.12],.05,W),
    ...[-.9,.9].flatMap(z=>[sg(G.cyl,[.2,1.4,z],[.2,.72,z],.012,'#6d5a44'),[G.cyl,[.2,.5,z],[.28,.42,.28],'#b39a6e'],[G.cyl,[.2,.72,z],[.3,.05,.3],'#9a7f58'],[G.dome,[.2,.7,z],[.25,.16,.25],z>0?'#c9823e':'#7c9a5a']])]);
  const oxCart=bake([[G.ball2,[0,1.05,1.7],[.46,.5,.9],'#8d7a66'],[G.ball,[0,1.38,1.25],[.3,.28,.36],'#7f6d5b'],[G.ball,[0,1.05,2.62],[.21,.23,.32],'#7d6a58'],[G.cone,[-.2,1.32,2.55],[.05,.3,.05],'#e7dcc4',[0,0,.7]],[G.cone,[.2,1.32,2.55],[.05,.3,.05],'#e7dcc4',[0,0,-.7]],
    ...[[-.25,1.15],[.25,1.15],[-.25,2.25],[.25,2.25]].map(([lx,lz])=>[G.cyl,[lx,.42,lz],[.09,.85,.09],'#6f5f50']),
    [G.box,[-.45,1.0,.75],[.06,.06,2.3],P.woodDark],[G.box,[.45,1.0,.75],[.06,.06,2.3],P.woodDark],[G.box,[0,1.25,1.95],[1.1,.08,.08],P.woodDark],
    [G.cyl12,[-.85,.82,-.5],[.8,.08,.8],'#6b4c3a',[0,0,Math.PI/2]],[G.cyl12,[.85,.82,-.5],[.8,.08,.8],'#6b4c3a',[0,0,Math.PI/2]],[G.cyl,[0,.82,-.5],[.06,1.85,.06],P.woodDark,[0,0,Math.PI/2]],
    [G.box,[0,1.0,-.5],[1.5,.12,2.1],P.woodDark],[G.box,[0,1.62,-.5],[1.4,1.1,1.9],'#a7543f'],[G.box,[0,1.62,.47],[1.0,.95,.04],'#efe2c6'],[G.box,[0,2.2,-.5],[1.55,.08,2.2],'#5b4336'],
    [G.halfCyl,[0,2.22,-.5],[.38,2.3,.82],'#5d6767',[0,Math.PI/2,Math.PI/2]]]);
  // —— 移动者：沿折线循环行走 ——
  const movers=[];
  function route(pts,closed=true){const seg=[];let total=0;const n=closed?pts.length:pts.length-1;for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%pts.length],l=Math.hypot(b[0]-a[0],b[1]-a[1]);seg.push([a[0],a[1],b[0]-a[0],b[1]-a[1],l,total]);total+=l;}return {seg,total};}
  function addMover(kind,pts,speed,offset,o={}){const r=route(pts,o.closed!==false);movers.push({kind,r,speed,offset:offset*r.total,x:pts[0][0],z:pts[0][1],h:0,phase:R(0,6.28),color:o.color,idx:0,low:o.low??false,stride:o.stride??1});}
  function sampleRoute(m,dist){const {seg,total}=m.r;let d=((dist%total)+total)%total;for(const s of seg){if(d<=s[5]+s[4]){const t=(d-s[5])/s[4];m.x=s[0]+s[2]*t;m.z=s[1]+s[3]*t;m.h=Math.atan2(s[2],s[3]);return;}}}

  // ================= 布局 =================
  const paintRect=(type,x1,z1,x2,z2)=>{const [a,b]=toWorld(x1,z1),[c,d]=toWorld(x2,z2);paint.push([type,Math.min(a,c),Math.min(b,d),Math.max(a,c),Math.max(b,d)]);};
  const SLAB=['#cdc3ae','#c7bca6','#d2c8b4','#c3b8a1','#cbc0a9','#d0c4aa'];
  // 1) 朱雀大街：石板路（错缝）、路缘石、排水沟、槐树
  for(let r=0;r<170;r++){const z0=-104+r*1.28;if(z0>-31&&z0<-17)continue;const off=r%2?.65:0;
    for(let x0=-7+off;x0<7;x0+=1.3){const x1=Math.min(7,x0+1.3),xa=Math.max(-7,x0);if(x1-xa<.3||(x1>-1.9&&xa<1.9))continue;box('flat',[(xa+x1)/2,.03,z0+.64],[x1-xa-.06,.06,1.22],jit(pick(SLAB),.02),0,{ao:false});}
    if(r%2===0)for(const sx of [-1,1])box('flat',[sx*.88,.035,z0+1.28],[1.68,.07,2.5],jit('#c2b195',.02),0,{ao:false});}
  for(const sx of [-1,1])box('flat',[sx*1.88,.05,2],[.14,.1,212],'#a8977c',0,{ao:false});
  for(let z0=-31;z0<-17;z0+=1.6)for(let x0=-3.2;x0<3.2;x0+=1.6)box('flat',[x0+.8,.03,z0+.8],[1.54,.06,1.54],jit(pick(SLAB),.012),0,{ao:false});
  for(const sx of [-1,1]){box('flat',[sx*7.15,.07,2],[.3,.14,212],P.stoneDark,0,{ao:false});
    for(const [z0,z1] of [[-104,-31],[-21,37],[51,108]]){const L=z1-z0,m=(z0+z1)/2;box('water',[sx*10.3,.025,m],[1.1,.05,L],P.water);for(const e of [-1,1])box('flat',[sx*10.3+e*.66,.09,m],[.24,.18,L],jit(P.stone,.01),0,{ao:false});}
    for(const z of [26,-26.5+28])box('flat',[sx*10.3,.12,z],[1.9,.16,7.6],P.stone,0,{ao:false});
    for(let z=-100;z<106;z+=8.5){if((z>-34&&z<-14)||(z>35&&z<53)||(z>20&&z<32)||(z>74&&z<86))continue;huai(sx*8.7,z+R(-.6,.6),R(.85,1.05));}}
  paintRect('walk',-12,-104,12,108);
  // 2) 城门（艺术化的唐代城门：夯土城墙、三门道、重檐庑殿门楼）
  const GZ=-24,WALLH=7.6;
  for(const sx of [-1,1]){const x0=19,x1=116,m=sx*(x0+x1)/2,L=x1-x0;
    box('solid',[m,WALLH*.5,GZ],[L,WALLH,5],jit('#cdb592',.01));box('solid',[m,.6,GZ],[L+.1,1.2,5.3],'#b9a27f');box('solid',[m,WALLH+.08,GZ],[L,.16,5.2],'#bfae92',0,{ao:false});
    for(let x=x0+1.5;x<x1;x+=2.6){box('solid',[sx*x,WALLH+.55,GZ+2.3],[1.4,.9,.45],'#cbb28d');if(x<108)block(sx*x,GZ+2.3,.72,.25,1.02,WALLH-.02);}box('solid',[m,WALLH+.4,GZ-2.35],[L,.6,.3],'#cbb28d');
    block(m,GZ,L/2,2.7,WALLH+.16);block(m,GZ-2.35,L/2,.17,.82,WALLH-.1);foot(m,GZ,L/2,3.6,.12);
    for(let x=x0+6;x<x1-4;x+=13)frame(sx*x,GZ+2,0,()=>banner(0,0,5.2,{collide:false,color:pick([P.red,'#c46a4c','#d19a5a']),w:.8,len:2.4}),WALLH);}
  // 墩台与门道
  const piers=[[-19,-10.4],[-5.6,-3.2],[3.2,5.6],[10.4,19]];
  for(const [a,b] of piers){box('solid',[(a+b)/2,4,GZ],[b-a,8,14],jit('#d2bd9b',.01));block((a+b)/2,GZ,(b-a)/2,7.15,8.22);}
  for(const [a,b,top] of [[-10.4,-5.6,4.9],[-3.2,3.2,5.6],[5.6,10.4,4.9]]){box('solid',[(a+b)/2,(top+8)/2,GZ],[b-a,8-top,14],jit('#d2bd9b',.01));box('solid',[(a+b)/2,top-.1,GZ],[b-a,.2,13.9],'#6d5b4c');
    for(const s of [-1,1])box('solid',[s>0?b-.25:a+.25,top-.35,GZ],[.5,.5,13.9],'#b9a684',[0,0,s*.75]);
    for(const sz of [-1,1])box('solid',[(a+b)/2,top+.25,GZ+sz*6.98],[b-a+.3,.35,.1],'#a68d6c');
    for(const s of [-1,1])box('solid',[s>0?b-.12:a+.12,(top-.2)/2,GZ+4.5],[.14,top-.25,(b-a)/2-.1],P.door,[0,0,0]);
    block((a+b)/2,GZ,(b-a)/2,7.15,8.22-top,top);}
  box('solid',[0,.75,GZ],[38.4,1.5,14.3],'#bea684');box('solid',[0,8.1,GZ],[38.6,.24,14.4],'#bfae92',0,{ao:false});
  for(const sz of [-1,1])for(let x=-18.6;x<=18.7;x+=1.55){box('solid',[x,8.65,GZ+sz*6.9],[.12,.9,.12],P.red,0,{lod:'d'});}
  for(const sz of [-1,1])box('solid',[0,9.05,GZ+sz*6.9],[37.6,.12,.14],P.red);
  hall(0,GZ,0,{w:30,d:9.6,h:5,y0:8.2,plat:.4,bays:7,roof:'hip',tile:P.glazeDark,ridge:'#3e5651',front:'door',plaque:'长 安',plaqueW:3.8,plaqueH:1.3,upper:{w:23,d:5.6,h:2.3,bays:5,front:'door',allDoors:true,rh:4.4,roof:'hip'}});
  for(const x of [-12.9,-4.3,4.3,12.9])lantern(x,12.2,GZ+5.9,1.05);
  for(const sx of [-1,1]){person(sx*4.4,GZ+7.6,0,'man','#8a5a4a','c');cyl('solid',[sx*4.4+.32*sx,1.3,GZ+7.7],[.03,2.6,.03],P.woodDark,0,{lod:'d'});put('solid',G.cone,mtx([sx*4.4+.32*sx,2.7,GZ+7.7],[.06,.25,.06]),'#c8c4bc',{lod:'d'});
    person(sx*11.9,GZ+7.6,0,'man','#8a5a4a','c');}
  // 门前广场：大方砖 + 两侧槐树
  for(let x=-21;x<21;x+=2.1)for(let z=-20.5;z<-1.5;z+=2.1)if(Math.abs(x+1.05)>7.2&&Math.abs(Math.abs(x+1.05)-10.3)>1.1)box('flat',[x+1.05,.025,z+1.05],[2.04,.05,2.04],jit(pick(SLAB),.012),0,{ao:false});
  paintRect('plaza',-108,-21.5,108,-1);
  for(const sx of [-1,1]){for(let x=26;x<104;x+=9)huai(sx*x,-4.5,R(.9,1.05));banner(sx*16.5,-19,8,{color:sx<0?P.red:'#5f8a86',w:1.1,len:3.6});}
  // 3) 坊墙与坊门（南半城）
  const wardW={h:2.7,th:.9};
  for(const sx of [-1,1]){
    wall(sx*12.6,-1,sx*12.6,37,{...wardW,gaps:[[22,30]]});wall(sx*72,-1,sx*72,37,{...wardW,gaps:[[14,22]]});
    wall(sx*12.6,-1,sx*72,-1,{...wardW,gaps:sx<0?[[-46,-38]]:[[38,46]]});wall(sx*12.6,37,sx*72,37,{...wardW,gaps:sx<0?[[-46,-38]]:[[38,46]]});
    wall(sx*12.6,51,sx*12.6,106,{...wardW,gaps:[[76,84]]});wall(sx*72,51,sx*72,106,{...wardW,gaps:[[76,84]]});wall(sx*12.6,51,sx*72,51,{...wardW,gaps:sx<0?[[-46,-38]]:[[38,46]]});wall(sx*12.6,106,sx*72,106,wardW);
    for(const [z0,z1,g] of [[-1,37,[[14,22]]],[51,106,[[76,84]]]])wall(sx*80,z0,sx*80,z1,{...wardW,gaps:g});
    gateHouse(sx*12.6,26,-sx*Math.PI/2,{doorsOut:true,w:6,d:3.4,h:3.8,brackets:true,roof:'xie',tile:P.tile,plaque:sx<0?'西 市':null});
    gateHouse(sx*12.6,80,-sx*Math.PI/2,{w:5.4,d:3.2,h:3.4});gateHouse(sx*42,-1,Math.PI,{w:5.4,d:3.2,h:3.4});gateHouse(sx*42,37,0,{w:5.4,d:3.2,h:3.4});gateHouse(sx*42,51,Math.PI,{w:5.4,d:3.2,h:3.4});
    gateHouse(sx*72,18,-sx*Math.PI/2,{w:5.4,d:3.2,h:3.4});gateHouse(sx*72,80,-sx*Math.PI/2,{w:5.4,d:3.2,h:3.4});
    paintRect('street',sx*12,37,sx*112,51);paintRect('street',sx*72,-21,sx*80,108);
    for(let x=18;x<108;x+=10.5)for(const z of [38.6,49.4])if(Math.abs(x-42)>5&&Math.abs(x-76)>5)huai(sx*x,z,R(.8,.95),{pit:false});
  }

  // 4) 西市：广场货摊、成排店铺、布幌、灯笼串、水井
  paintRect('yard',-72,-1,-12.6,37);
  const STALLS=['silk','pottery','tea','lantern'];
  STALLS.forEach((t,i)=>{const z=2.6+i*5.4;stall(-24.6,z,Math.PI/2,t);person(-26.4,z,Math.PI/2,i%2?'woman':'man');if(i%2===0)person(-22.2,z+.8,-Math.PI/2,i?'merchant':'woman');});
  stall(-20.6,3.2,0,'bread');stall(-15.6,2.8,0,'spice');person(-20.6,1.4,0,'merchant');person(-15.6,1.2,0,'woman');person(-17.2,5.4,Math.PI,'man');
  goods(-14.2,7.5,'jars');goods(-24.8,24.5,'baskets');goods(-24.2,31,'bales');
  const shopTile=()=>pick([P.tile,P.tile,'#6f7d7c','#86908c']),FLAGC=['#b5533e','#5f8a86','#c9923f','#8a6f9a','#d7c39a','#a0574a'];
  function shopRow(x,rot,zs){for(const z of zs){const two=rand()<.28,w=R(5.4,6.6);
    hall(x,z,rot,{w,d:4.8,h:R(3.2,3.7),plat:.3,bays:2+(rand()<.5?1:0),front:'shop',roof:pick(['gable','gable','xie']),brackets:false,eave:1.15,tile:shopTile(),col:pick([P.red,P.wood,'#9a5a43']),steps:false,upper:two?{w:w-.8,d:3.6,h:2.4,bays:2,front:'door',allDoors:false}:null});
    frame(x,z,rot,()=>{banner(w/2-.4,3.4,4.3,{w:.55,len:1.7,color:pick(FLAGC),trim:P.white});goods(-1,3.2,pick(['jars','baskets']));if(rand()<.7)person(R(-1.5,1.5),1.4,0,pick(['man','woman','merchant']));});}}
  shopRow(-31.2,Math.PI/2,[3.6,10.2,16.8,23.4,30]);const ZS=[3.6,10.2,26.4,33];shopRow(-37.4,-Math.PI/2,ZS);shopRow(-50,Math.PI/2,ZS);shopRow(-56.2,-Math.PI/2,ZS);shopRow(-66.6,Math.PI/2,ZS);
  // 水井与井亭
  frame(-42,18,0,()=>{cyl('solid',[0,.4,0],[.9,.8,.9],P.stone);cyl('water',[0,.78,0],[.7,.04,.7],'#5d7f7b');for(const sx of [-1,1])for(const sz of [-1,1])cyl('solid',[sx*1.6,1.5,sz*1.6],[.12,3,.12],P.red);roof(0,3,0,4.6,4.6,1.5,'pyr',{tile:P.tile});pillar(0,0,1.1,1);for(const sx of [-1,1])for(const sz of [-1,1])pillar(sx*1.6,sz*1.6,.2,3);});
  // 灯笼串
  function lanternString(a,b,y,n,lod='d'){for(const p of [a,b]){cyl('solid',[p[0],y/2+.3,p[1]],[.08,y+.6,.08],P.woodDark,0,{lod});pillar(p[0],p[1],.14,y);}
    const mid=[(a[0]+b[0])/2,y-.5,(a[1]+b[1])/2];beam('solid',[a[0],y,a[1]],mid,.025,P.woodDark,{lod});beam('solid',mid,[b[0],y,b[1]],.025,P.woodDark,{lod});
    for(let i=1;i<n;i++){const t=i/n,sag=1-Math.pow(2*t-1,2);lantern(a[0]+(b[0]-a[0])*t,y-.5*sag-.55,a[1]+(b[1]-a[1])*t,.62,i%2?'#d9773f':'#c95545',lod);}}
  lanternString([-22.8,20.6],[-13.6,20.6],4.6,6);lanternString([-22.8,32.5],[-13.6,32.5],4.6,6);lanternString([-46.5,14.2],[-37.5,14.2],4.4,5);lanternString([-46.5,21.8],[-37.5,21.8],4.4,5);
  blossom(-58,18,.9);blossom(-25,35,.75);
  // 5) 东侧：驿馆邸店与驼队歇脚场（丝路来信）
  paintRect('yard',12.6,-1,72,37);
  hall(45,14,-Math.PI/2,{w:22,d:8,h:3.8,bays:6,plat:.45,front:'shop',roof:'xie',tile:P.tile,brackets:true,bs:.75,upper:{w:20,d:6,h:2.8,bays:6,front:'door'}});
  hall(32,32.4,Math.PI,{w:10,d:4.4,h:3.2,bays:3,plat:.2,front:'open',roof:'gable',brackets:false,eave:1,tile:'#86908c',col:P.wood});
  for(let i=0;i<4;i++)put('solid',G.dome,mtx([29+i*2,.1,32.5],[.7,.7,.6]),'#d8c27c',{lod:'d'});
  goods(15.4,5.6,'bales');goods(15.6,-.2+3,'jars');goods(34,6,'bales');goods(37,25,'jars');
  frame(15.5,10.5,Math.PI/2,()=>{box('solid',[0,.4,0],[1.6,.8,.9],P.wood);for(let i=0;i<3;i++)put('solid',G.cyl,mtx([-.5+i*.5,.86,0],[.06,.7,.06],[Math.PI/2,0,0]),'#efe6cf',{lod:'d'});box('solid',[.2,.82,.1],[.5,.02,.4],P.white,0,{lod:'d'});block(0,0,.85,.5,.9);});
  person(14.4,10.5,Math.PI/2,'man','#6d8a87');person(16.8,8.6,-Math.PI/2,'merchant','#a35a42');
  function camelKneel(x,z,rot){frame(x,z,rot,()=>{put('solid',camelRest,mtx([0,0,0]),'#ffffff');block(0,0,.62,1.2,1.66);block(0,1.42,.2,.36,2.12);});}
  camelKneel(27.5,8.5,.7);camelKneel(30.5,15,2.5);camelKneel(33,9,-.4);
  for(const [x,z,r] of [[27,20,3.2],[24.5,2.8,.2]])person(x,z,r,'merchant',pick(['#8a6f9a','#a35a42','#6d8a87']));
  // 驿马与拴马桩、帐篷、更多货物
  function horse(x,z,rot,v){frame(x,z,rot,()=>{put('solid',horseG[v],mtx([0,0,0]),'#ffffff');block(0,0,.4,.95,1.8);block(0,1.12,.15,.3,2.2);});}
  for(const sz of [14.8,20.8])cyl('solid',[15,.6,sz],[.1,1.2,.1],P.woodDark);beam('solid',[15,1.05,14.8],[15,1.05,20.8],.06,P.woodDark);pillar(15,17.8,.3,1.2);
  horse(16.3,16.2,-Math.PI/2+.15,0);horse(16.4,19.3,-Math.PI/2-.1,1);
  frame(31,2.6,.25,()=>{for(const sx of [-1,1])for(const sz of [-1,1]){cyl('solid',[sx*2.1,1.3,sz*1.6],[.07,2.6,.07],P.woodDark);pillar(sx*2.1,sz*1.6,.15,2.6);}
    put('cloth',G.flagPlane,mtx([0,2.62,0],[4.6,3.6,1],[-Math.PI/2,0,0]),'#b5533e',{sway:[3,-1,.03]});for(const sz of [-1,1])put('cloth',G.flagPlane,mtx([0,2.35,sz*1.8],[4.6,.55,1]),'#e3c58a',{sway:[2.6,-.6,.08]});
    block(0,0,2.3,1.8,.3,2.42,{walkable:true});box('flat',[0,.03,0],[3.4,.05,2.4],'#a2584a',0,{ao:false});box('flat',[0,.04,0],[2.8,.05,1.8],'#d9b46a',0,{ao:false});person(-.8,-.2,.4,'merchant','#6d8a87');person(.9,.3,-2.6,'man','#c98b5e');});
  goods(14.5,24,'jars');goods(26.8,-.1+0.6,'baskets');goods(36.4,12.5,'bales');banner(17.2,.8,6.5,{color:'#5f8a86',w:.7,len:3,trim:P.gold});
  huai(14.9,29.5,.9);huai(35.5,22,.95);
  // 歇脚场地面：草料、水槽、踩踏痕迹
  frame(26.6,23.6,.1,()=>{box('solid',[0,.32,0],[2.6,.64,.8],'#9c8a74');box('water',[0,.6,0],[2.3,.06,.55],'#7ea5a0');block(0,0,1.35,.45,.66);});
  for(const [x,z,s] of [[16.6,26.8,1],[29.8,21.8,.8],[33.5,26.5,1.1]]){put('solid',G.dome,mtx([x,0,z],[1.1*s,.75*s,.9*s]),'#d6bf7a',{lod:'d'});pillar(x,z,.9*s,.8);}
  for(let i=0;i<10;i++)paint.push(['trod',R(14,36)-1.5,R(0,34)-1,R(14,36)+1.5,R(0,34)+1]);
  willow(24,-.2+33,1,{});cyl('solid',[18,.3,33],[1.2,.6,.5],'#9c8a74');
  courtyard(61,8,-Math.PI/2,{W:18,D:18});courtyard(61,28,-Math.PI/2,{W:16,D:16});
  // 6) 城门北：营造院、塔院、官署
  paintRect('yard',-44,-70,-12,-27);
  hall(-27,-62,0,{w:16,d:10,h:4.4,plat:.8,bays:5,roof:'xie',tile:P.tile,brackets:true,plaque:'营 造',plaqueW:2.8});
  // 正在搭建的木构架：柱、阑额、斗拱、梁、檩，外围脚手架
  frame(-45,-50,Math.PI/2,()=>{const w=11,d=7.5,h=4.2;box('solid',[0,.3,0],[w+1.4,.6,d+1.4],P.stone,0,{ao:false});
    for(let i=0;i<=3;i++)for(const sz of [-1,1]){const cx=-w/2+w*i/3;cyl('solid',[cx,.6+h/2,sz*d/2],[.22,h,.22],'#c58c62');cyl('solid',[cx,.68,sz*d/2],[.36,.16,.36],P.stone);pillar(cx,sz*d/2,.3,h);
      bracket(cx,.6+h,sz*d/2,sz>0?0:Math.PI,.9);}
    for(const sz of [-1,1])box('solid',[0,.6+h-.17,sz*d/2],[w+.4,.34,.3],'#c58c62');
    for(let i=0;i<=3;i++){const cx=-w/2+w*i/3;box('solid',[cx,.6+h+1.15,0],[.32,.42,d+2.2],'#b9875f');box('solid',[cx,.6+h+2.1,0],[.28,.36,d*.6],'#b9875f');cyl('solid',[cx,.6+h+1.6,0],[.1,1,.1],'#b9875f');}
    for(const [zz,yy] of [[d/2+1,.6+h+1.3],[d*.3,.6+h+2.1],[0,.6+h+2.7],[-d*.3,.6+h+2.1],[-d/2-1,.6+h+1.3]])put('solid',G.cyl,mtx([0,yy,zz],[.13,w+1.6,.13],[0,0,Math.PI/2]),'#c99a6c');
    for(let k=0;k<7;k++){const xx=-w/2+.6+k*1.6;beam('solid',[xx,.6+h+2.7,0],[xx,.6+h+1.1,d/2+1.6],.08,'#cfa77a',{lod:'d'});}
    for(const sx of [-1,1])for(const sz of [-1,1]){cyl('solid',[sx*(w/2+.9),3.5,sz*(d/2+.9)],[.07,7,.07],'#a88762',0,{lod:'d'});}
    for(const sx of [-1,1])for(const y of [2,4.4])beam('solid',[sx*(w/2+.9),y,-d/2-.9],[sx*(w/2+.9),y,d/2+.9],.05,'#a88762',{lod:'d'});
    for(const sz of [-1,1])for(const y of [2,4.4])beam('solid',[-w/2-.9,y,sz*(d/2+.9)],[w/2+.9,y,sz*(d/2+.9)],.05,'#a88762',{lod:'d'});
    for(let i=0;i<=3;i++)block(-w/2+w*i/3,0,.18,(d+2.2)/2,.5,.6+h+.9);block(0,0,(w+1.6)/2,.16,.4,.6+h+2.45);
    person(-2,d/2+1.8,Math.PI,'man','#b0805a','c');person(3,d/2+2,2.6,'man','#8a9bb4','c');foot(0,0,w/2+1.5,d/2+1.5,.12);});
  // 斗拱模型（放大展示）
  frame(-17.4,-49.5,-.5,()=>{box('solid',[0,.45,0],[1.4,.9,1.4],P.wood);box('solid',[0,.93,0],[1.6,.08,1.6],P.woodDark);cyl('solid',[0,1.6,0],[.24,1.3,.24],P.red);bracket(0,2.25,0,0,1.25);block(0,0,.9,.9,3.6);});
  goods(-36,-38.5,'logs');for(let i=0;i<5;i++)cyl('solid',[-33+i*1.3,.18,-43],[.42,.36,.42],P.stone);person(-31,-36,2.2,'man','#9db38c','c');
  huai(-14.5,-66,1);huai(-40,-68,.95);blossom(-15,-37,.75);
  // 塔院：方形砖塔（叠涩出檐、倚柱、券门）
  wall(-92,-72,-44,-72,{type:'plaster',h:2.8,th:.6,gaps:[[-69.2,-62.8]]});wall(-92,-106,-44,-106,{type:'plaster',h:2.8,th:.6});wall(-92,-106,-92,-72,{type:'plaster',h:2.8,th:.6});wall(-44,-106,-44,-72,{type:'plaster',h:2.8,th:.6});
  gateHouse(-66,-72,0,{w:5,d:4,h:4,roof:'xie',brackets:true,tile:P.glaze,ridge:P.glazeDark,chiwei:true});
  paintRect('court',-92,-106,-44,-72);
  (function pagoda(x,z){const brick='#c4ad8b',n=7;box('solid',[x,.7,z],[17,1.4,17],P.stone);for(let i=0;i<5;i++)box('solid',[x,.12+i*.28,z+8.6+i*.42*-1+2.1],[4,.28,.44],P.stone,0,{ao:false});
    let y=1.4;for(let i=0;i<n;i++){const s=12.2-i*1.05,hh=i?3.2-i*.12:4.4;box('solid',[x,y+hh/2,z],[s,hh,s],jit(brick,.012),0,{ao:false});
      const bays=i<3?5:3;for(const [fx,fz,r] of [[0,1,0],[1,0,Math.PI/2],[0,-1,Math.PI],[-1,0,-Math.PI/2]])frame(x+fx*s/2,z+fz*s/2,r,()=>{for(let k=0;k<=bays;k++)box('solid',[-s/2+s*k/bays,y+hh/2,.03],[.22,hh,.1],'#bca989',0,{ao:false});
        box('solid',[0,y+hh*.42,.04],[.9,hh*.5,.1],'#4f4440',0,{ao:false});put('solid',G.halfCyl,mtx([0,y+hh*.67,.05],[.45,.1,.45],[Math.PI/2,Math.PI/2,0]),'#4f4440',{ao:false});box('solid',[0,y+hh-.25,.04],[s,.14,.1],'#bca989',0,{ao:false});});
      const yS=y;y+=hh;block(x,z,(s+1.25)/2,(s+1.25)/2,y+.6-(i?yS-.1:0),i?yS-.1:0);block(x,z,(s+.5)/2,(s+.5)/2,.52,y+.48);for(let k=0;k<4;k++){box('solid',[x,y+k*.15+.07,z],[s+.35+k*.3,.15,s+.35+k*.3],k%2?'#c7b392':'#d6c5a6',0,{ao:false});}
      for(let k=0;k<3;k++)box('solid',[x,y+.6+k*.13+.06,z],[s+.9-k*.4,.13,s+.9-k*.4],'#c7b392',0,{ao:false});y+=1;}
    put('solid',G.cone4,mtx([x,y+.9,z],[3.4,1.8,3.4],[0,Math.PI/4,0]),'#bfae90',{ao:false});cyl('solid',[x,y+3,z],[.2,3,.2],P.gold);for(let k=0;k<3;k++)ball('solid',[x,y+2.2+k*.8,z],[.45-k*.1,.18,.45-k*.1],P.gold);
    block(x,z,8.5,8.5,1.4);block(x,z,1.75,1.75,1.05,y-.1);pillar(x,z,.3,4.6,y);foot(x,z,9.5,9.5,.2);})(-66,-91);
  hall(-84,-84,Math.PI/2,{w:13,d:8,h:4,plat:.7,bays:5,roof:'hip',tile:P.glaze,ridge:P.glazeDark,brackets:true});
  for(const [x,z] of [[-56,-79],[-76,-79],[-56,-101],[-76,-100.5],[-50,-90]])cypress(x,z,R(.9,1.1));
  frame(-66,-79.5,0,()=>{cyl('solid',[0,.4,0],[.55,.8,.55],'#6f6a5c');put('solid',G.ball2,mtx([0,1.05,0],[.6,.4,.6]),'#7a7465');cyl('solid',[0,1.5,0],[.35,.25,.35],'#6f6a5c');pillar(0,0,.7,1.6);});
  // 官署院落（东北）
  wall(16,-34,52,-34,{type:'plaster',h:2.8,th:.6,gaps:[[30,36]]});wall(16,-72,52,-72,{type:'plaster',h:2.8,th:.6});wall(16,-72,16,-34,{type:'plaster',h:2.8,th:.6});wall(52,-72,52,-34,{type:'plaster',h:2.8,th:.6,gaps:[[-52,-46]]});
  gateHouse(33,-34,0,{w:5.6,d:3.6,h:3.8,roof:'xie',brackets:true});paintRect('court',16,-72,52,-34);
  hall(33,-60,0,{w:17,d:9,h:4.4,plat:.9,bays:5,roof:'hip',tile:P.glaze,ridge:P.glazeDark,brackets:true});
  hall(22.5,-47,Math.PI/2,{w:9,d:5,h:3.4,plat:.4,bays:3,roof:'xie',brackets:false});hall(43.5,-47,-Math.PI/2,{w:9,d:5,h:3.4,plat:.4,bays:3,roof:'xie',brackets:false});
  for(const [x,z] of [[27,-40],[39,-40]])huai(x,z,.95);
  wall(58,-40,104,-40,{type:'plaster',h:2.8,th:.6,gaps:[[75,81]]});wall(58,-100,104,-100,{type:'plaster',h:2.8,th:.6});wall(58,-100,58,-40,{type:'plaster',h:2.8,th:.6,gaps:[[-52,-46]]});
  gateHouse(78,-40,0,{w:5.6,d:3.6,h:3.8,roof:'xie',brackets:true});paintRect('court',58,-100,104,-40);
  hall(78,-72,0,{w:13,d:10,h:4.6,plat:1,bays:5,roof:'xie',tile:P.glaze,ridge:P.glazeDark,brackets:true,upper:{w:11,d:8,h:3.6,bays:5,front:'door',rh:3.6}});
  hall(66,-55,Math.PI/2,{w:10,d:6,h:3.4,plat:.4,bays:3,roof:'gable',brackets:false});hall(93,-88,-Math.PI/2,{w:12,d:6,h:3.4,plat:.4,bays:4,roof:'xie',brackets:false});
  for(const [x,z] of [[68,-88],[90,-52],[88,-62]])huai(x,z,1);
  // 7) 南侧坊：院落、园林水池
  function courtyard(x,z,rot,o={}){frame(x,z,rot,()=>{const W=o.W??22,D=o.D??22,tile=o.tile||pick([P.tile,P.tile,'#6f7d7c']),wo={type:'plaster',h:2.3,th:.5,lod:o.lod};
    wall(-W/2,D/2,W/2,D/2,{...wo,gaps:[[-2.1,2.1]]});wall(-W/2,-D/2,W/2,-D/2,wo);wall(-W/2,-D/2,-W/2,D/2,wo);wall(W/2,-D/2,W/2,D/2,wo);
    gateHouse(0,D/2,0,{w:3.4,d:2.4,h:3,tile,lod:o.lod});paintRect('court',-W/2,-D/2,W/2,D/2);
    hall(0,-D/2+4.6,0,{w:W*.56,d:6,h:3.5,bays:pick([3,5]),plat:.5,roof:pick(['xie','gable','hip']),brackets:rand()<.4,tile,lod:o.lod});
    if(W>=16){hall(-W/2+3.2,D*.08,Math.PI/2,{w:D*.36,d:4,h:3,bays:3,plat:.3,roof:'gable',brackets:false,tile,lod:o.lod});hall(W/2-3.2,D*.08,-Math.PI/2,{w:D*.36,d:4,h:3,bays:3,plat:.3,roof:'gable',brackets:false,tile,lod:o.lod});}
    if(rand()<.6)blossom(-W*.16,D*.28,.7);else huai(-W*.16,D*.28,.75,{pit:false});if(rand()<.5)huai(W*.18,D*.3,.7,{pit:false});});}
  function garden(x,z){paintRect('grass',x-11,z-11,x+11,z+11);box('water',[x,.02,z],[11,.04,7],P.water);for(const [px,pz,sx,sz] of [[0,3.7,11.6,.5],[0,-3.7,11.6,.5],[5.8,0,.5,7.9],[-5.8,0,.5,7.9]])box('flat',[x+px,.1,z+pz],[sx,.2,sz],P.stone,0,{ao:false});
    block(x,z,5.5,3.5,.4,-.2);for(let i=0;i<9;i++){const px=x+R(-4.5,4.5),pz=z+R(-2.8,2.8);cyl('flat',[px,.05,pz],[.5,.03,.5],'#7f9b6f',0,{lod:'d'});if(i%3===0)ball('solid',[px+.2,.22,pz],[.12,.16,.12],'#e8b4b0',0,{lod:'d'});}
    for(const [px,pz] of [[-7.5,-5.5],[7.5,-5.5],[-7.5,5.5],[7.2,6]])willow(x+px,z+pz,R(.85,1));
    for(let i=0;i<3;i++)ball('solid',[x+8.6,.5+i*.15,z-1+i*.9],[.7,.8-i*.2,.6],'#a9a79a',[R(0,1),R(0,3),0]);pillar(x+8.6,z,1,1.4);
    frame(x,z-8.5,0,()=>{for(const sx of [-1,1])for(const sz of [-1,1])cyl('solid',[sx*1.5,1.4,sz*1.5],[.12,2.8,.12],P.red);roof(0,2.8,0,4.6,4.6,1.6,'pyr',{tile:P.glaze});for(const sx of [-1,1])for(const sz of [-1,1])pillar(sx*1.5,sz*1.5,.2,2.8);});}
  for(const sx of [-1,1]){paintRect('yard',sx*12.6,51,sx*72,106);paintRect('street',sx*38,51,sx*46,106);paintRect('street',sx*12.6,76,sx*72,84);}
  courtyard(-26,65,0,{W:22,D:22});garden(-58,65);courtyard(-26,94,Math.PI,{W:22,D:20});courtyard(-58,94,Math.PI,{W:20,D:20});
  courtyard(26,65,0,{W:20,D:22});courtyard(58,65,0,{W:22,D:22});garden(26,94);courtyard(58,94,Math.PI,{W:22,D:20});
  // 8) 外侧坊：较简单的院落（主要用于远景和俯瞰）
  for(const sx of [-1,1]){for(const z of [8,28,62,94])courtyard(sx*94,z,sx*Math.PI/2*-1,{W:18,D:16,lod:'c'});paintRect('yard',sx*80,-1,sx*108,106);}
  for(const sx of [-1,1])for(const x of [72,94])if(!(sx>0&&x<100))courtyard(sx*x,-50,0,{W:18,D:18});
  // 坊内空地补植树木与草地（避开建筑和导览站）
  const keep=[[0,43],[0,-9],[-18,13],[20,12],[-23,-45],[-18,24],[21.5,24],[-22,-34]];
  function scatter(x1,z1,x2,z2,n,kinds){for(let i=0,t=0;i<n&&t<n*12;t++){const x=R(x1,x2),z=R(z1,z2);
    if(keep.some(k=>Math.hypot(k[0]-x,k[1]-z)<9)||obstacles.some(o=>o.base<1.8&&(o.hx!==undefined?Math.abs(x-o.x)<o.hx+2.6&&Math.abs(z-o.z)<o.hz+2.6:Math.hypot(x-o.x,z-o.z)<o.r+2.6)))continue;
    const k=pick(kinds),s=R(.75,1.05);if(k==='w')willow(x,z,s);else if(k==='b')blossom(x,z,s*.85,{pit:false});else huai(x,z,s,{pit:false});paint.push(['grass',x-2.4*s,z-2*s,x+2.4*s,z+2*s]);i++;}}
  scatter(-71,-.5,-13,36.5,8,['h','h','b']);scatter(13,-.5,71,36.5,7,['h','w']);scatter(-71,51.5,-13,105.5,10,['h','b','w']);scatter(13,51.5,71,105.5,10,['h','b','w']);
  scatter(-107,-.5,-81,105.5,9,['h','w']);scatter(81,-.5,107,105.5,9,['h','w']);scatter(-107,-70,-44,-28,8,['h','b']);scatter(53,-104,107,-28,7,['h','h','b']);scatter(14,-104,52,-74,4,['h']);
  
  // 8.5) 街市生活细节（放在补植树木之后，不打乱原有布局的随机序列）；新增的人物带碰撞，所以高低画质都显示
  const sit=(x,z,rot,type,color)=>{person(x,z,rot,type,color,'c',-.52);pillar(x,z,.32,1.3);};
  const kid=(x,z,rot,color)=>{person(x,z,rot,pick(['man','woman']),color,'c',0,.62);pillar(x,z,.22,1.2);};
  const stand=(x,z,rot,type,color)=>{person(x,z,rot,type,color,'c');pillar(x,z,.3,1.85);};
  // 鼓：鼓身朝局部 z，架在四腿木座上（s 为缩放）
  function drum(s=1){for(const sx of [-1,1])for(const sz of [-1,1])cyl('solid',[sx*.55*s,.32*s,sz*.3*s],[.06*s,.64*s,.06*s],P.woodDark);box('solid',[0,.66*s,0],[1.3*s,.08*s,.78*s],P.wood);
    put('solid',G.cyl12,mtx([0,1.2*s,0],[.52*s,.62*s,.52*s],[Math.PI/2,0,0]),'#a8402f');for(const sz of [-1,1]){put('solid',G.cyl12,mtx([0,1.2*s,sz*.315*s],[.49*s,.02,.49*s],[Math.PI/2,0,0]),'#eadcbc',{ao:false});put('solid',G.cyl12,mtx([0,1.2*s,sz*.27*s],[.535*s,.05*s,.535*s],[Math.PI/2,0,0]),P.gold,{ao:false});}
    for(const sx of [-1,1])beam('solid',[sx*.3*s,.74*s,.5*s],[sx*.42*s,.72*s,.95*s],.025*s,P.woodDark,{lod:'d'});block(0,0,.7*s,.42*s,1.74*s,F.elements[13]);}
  // 街鼓亭：唐长安在主要街道的路口设“街鼓”，清晨和傍晚击鼓，坊门随之开闭
  frame(-10.2,38.55,0,()=>{for(const sx of [-1,1])for(const sz of [-1,1]){cyl('solid',[sx*1.05,1.2,sz*.7],[.1,2.4,.1],P.red);pillar(sx*1.05,sz*.7,.16,2.4);}
    for(const sz of [-1,1])box('solid',[0,2.32,sz*.7],[2.3,.16,.14],P.red);box('flat',[0,.04,0],[2.6,.08,1.9],P.stoneDark,0,{ao:false});
    drum(1);roof(0,2.42,0,3.0,2.0,.85,'xie',{tile:P.tile,lift:.25});});
  // 胡饼摊：土炉、案板与遮阳伞（胡饼是唐长安常见的街头食物）
  function parasol(x,z,h,r,col){cyl('solid',[x,h/2,z],[.05,h,.05],P.woodDark);put('cloth',G.cone,mtx([x,h+.22,z],[r,.5,r]),jit(col,.03),{sway:[h,1,.03]});ball('solid',[x,h+.5,z],[.07,.08,.07],P.gold);pillar(x,z,.12,h);pillar(x,z,r*.8,.3,h-.16,{walkable:true});pillar(x,z,r*.4,.3,h+.06,{walkable:true});}
  frame(10.2,38.45,0,()=>{box('solid',[.35,.4,0],[1.8,.8,.7],jit(P.wood,.04));box('solid',[.35,.82,0],[1.9,.05,.78],P.woodDark);block(.35,0,.95,.4,.86);
    cyl('solid',[-1.1,.45,-.05],[.42,.9,.42],'#b8916a');cyl('solid',[-1.1,.92,-.05],[.3,.06,.3],'#3c302a');put('glow',G.cyl,mtx([-1.1,.95,-.05],[.22,.02,.22]),'#e0773c');box('solid',[-1.1,.3,.36],[.28,.22,.04],'#3c302a');pillar(-1.1,-.05,.45,1);
    for(let i=0;i<8;i++)cyl('solid',[-.2+(i%4)*.34,.88+Math.floor(i/4)*.05,-.12+Math.floor(i/4)*.22],[.15,.04,.15],'#d9a75f',0,{ao:false});for(let i=0;i<4;i++)put('solid',G.dome,mtx([-.25+i*.3,.92,.22],[.1,.05,.1]),'#e3c48b',{ao:false,lod:'d'});
    parasol(.9,-.45,2.3,1.45,'#c9923f');stand(.2,-.75,0,'merchant','#a35a42');stand(-1.15,.95,Math.PI,'woman','#c57f86');});
  // 横街上的水果摊、路口踢蹴鞠（唐代流行的球戏）的孩子
  frame(22.5,45.2,0,()=>{for(let i=0;i<4;i++){const px=-.9+(i%2)*1.1,pz=Math.floor(i/2)*1.0-.5;cyl('solid',[px,.22,pz],[.34,.44,.34],'#b39a6e');put('solid',G.dome,mtx([px,.42,pz],[.3,.2,.3]),['#d8b64f','#c9823e','#b54e3a','#7c9a5a'][i],{ao:false});}
    beam('solid',[-.9,.5,.9],[.6,.55,1.3],.035,'#9a7a52');sit(1.0,.1,-Math.PI/2,'man','#8a9bb4');parasol(.2,-.9,2.2,1.3,'#5f8a86');pillar(-.35,0,.95,.6);});
  kid(-9.6,43.3,.6,'#d98f86');kid(-11.4,44.8,2.4,'#7fa9a6');kid(-8.5,45.1,-2.2,'#e7cf8f');ball('solid',[-9.9,.16,44.3],[.16,.16,.16],'#c9923f');
  stand(8.3,31,Math.PI*.6,'man','#7fa1a0');stand(8.5,32.3,-Math.PI*.7,'merchant','#c98b5e');
  // 西市：市鼓亭（午时击鼓开市、日落前击钲散市）与地摊
  frame(-18,34.8,0,()=>{box('solid',[0,.22,0],[2.9,.44,2.9],P.stone,0,{ao:false});for(const sx of [-1,1])for(const sz of [-1,1]){cyl('solid',[sx*1.05,.44+1.25,sz*1.05],[.11,2.5,.11],P.red);pillar(sx*1.05,sz*1.05,.17,2.94);}
    block(0,0,1.45,1.45,.44);frame(0,0,0,()=>drum(1.15),.44);roof(0,2.94,0,3.4,3.4,1.25,'pyr',{tile:P.tile});
    for(const sx of [-1,1])box('solid',[0,2.8,sx*1.05],[2.3,.14,.14],P.red);for(let i=0;i<3;i++)box('flat',[0,.12-i*.04,1.6+i*.3],[1.4,.24-i*.08,.3],P.stone,0,{ao:false});});
  function rug(x,z,w,d,rot,c1,c2,c3){frame(x,z,rot,()=>{box('flat',[0,.02,0],[w+.16,.03,d+.16],c2,0,{ao:false});box('flat',[0,.035,0],[w,.03,d],c1,0,{ao:false});box('flat',[0,.05,0],[w*.62,.03,d*.6],c2,0,{ao:false});
    box('flat',[0,.065,0],[w*.3,.03,w*.3],c3,[0,Math.PI/4,0],{ao:false});for(const sx of [-1,1])box('flat',[sx*w*.38,.05,0],[w*.06,.03,d*.7],c3,0,{ao:false,lod:'d'});});}
  rug(-20.4,22.6,1.4,2.2,0,'#a2584a','#e1c27c','#5f8a86');for(let i=0;i<5;i++){const pz=21.9+i*.36;put('solid',G.ball2,mtx([-20.6,.2,pz],[.15,.18,.15]),['#5f8a86','#d1a55a','#efe2c4','#b76e45','#6f9a79'][i],{ao:false});}sit(-21.6,22.6,Math.PI/2,'woman','#9db38c');
  rug(-20.4,27.4,1.4,2.2,0,'#5f6f8f','#d9c9a5','#b5533e');for(let i=0;i<4;i++)put('solid',G.cyl,mtx([-20.4,.14+(i%2)*.18,26.8+Math.floor(i/2)*.9],[.13,1.0,.13],[0,0,Math.PI/2]),['#d98f86','#e7cf8f','#7fa9a6','#c39ab8'][i],{ao:false});sit(-21.6,27.6,Math.PI/2,'merchant','#c98b5e');
  // 驿馆：地毯与挂毯架（胡商带来的毛织品）
  rug(21.6,21.2,2.6,1.8,.1,'#9b3f36','#e3c58a','#3f6a78');rug(36.6,19.2,2.4,1.7,-.15,'#3f6a78','#d9b46a','#a2584a');stand(23.3,21.8,-Math.PI/2,'merchant','#6d8a87');stand(20.2,22.9,2.5,'woman','#c7a2b8');
  frame(28.6,29.4,0,()=>{for(const sx of [-1,1]){cyl('solid',[sx*.95,1.1,0],[.06,2.2,.06],P.woodDark);pillar(sx*.95,0,.1,2.2);}box('solid',[0,2.15,0],[2.1,.06,.06],P.woodDark);
    put('cloth',G.flagPlane,mtx([0,1.3,0],[1.7,1.6,1]),'#8a3a32',{sway:[2.1,-1.6,.04]});put('cloth',G.flagPlane,mtx([0,1.3,.012],[1.2,1.1,1]),'#d9b46a',{sway:[2.1,-1.6,.04]});put('cloth',G.flagPlane,mtx([0,1.3,.024],[.5,.5,1]),'#3f6a78',{sway:[2.1,-1.6,.04]});});
  // 营造院：瓦件与砖垛、木工凳、绘图案、起重架
  frame(-30.5,-33.6,.1,()=>{box('solid',[0,.08,0],[1.9,.16,1.4],P.woodDark);for(let i=0;i<6;i++){const px=-.6+(i%3)*.6,pz=i<3?-.33:.33;box('solid',[px,.38,pz],[.5,.44,.6],jit('#6f7b7c',.03));for(let k=0;k<3;k++)box('solid',[px,.2+k*.14,pz+.31],[.52,.03,.02],'#56605f',0,{lod:'d',ao:false});}block(0,0,.95,.7,.62);});
  frame(-34.6,-33.4,-.2,()=>{for(let i=0;i<2;i++){box('solid',[i*1.4-.7,.45,0],[1.2,.9,.8],jit('#b58d6e',.03));for(let k=1;k<5;k++)box('solid',[i*1.4-.7,k*.18,.405],[1.21,.015,.01],'#8f6a50',0,{lod:'d',ao:false});}block(0,0,1.35,.45,.9);});
  frame(-17.3,-41.6,.35,()=>{for(const sx of [-1,1])for(const a of [-.35,.35]){beam('solid',[sx*.8+a*.5,0,0],[sx*.8-a*.5,.85,0],.05,P.wood);}put('solid',G.cyl,mtx([0,.98,0],[.2,2.6,.2],[0,0,Math.PI/2]),'#c99a6c');
    box('solid',[.6,1.08,.18],[.05,.5,.02],'#9aa0a0',[0,0,.3],{lod:'d'});block(0,0,1.35,.3,1.2);stand(.55,.75,Math.PI,'man','#9db38c');});
  frame(-27.6,-36.9,0,()=>{for(const sx of [-1,1])for(const sz of [-1,1])cyl('solid',[sx*.6,.38,sz*.33],[.04,.76,.04],P.woodDark);box('solid',[0,.79,0],[1.4,.06,.8],P.wood);box('solid',[0,.825,0],[1.0,.012,.62],'#f4ecd8',0,{ao:false});
    for(const [px,pz,w,d] of [[0,-.15,.7,.02],[0,.12,.7,.02],[-.35,0,.02,.3],[.35,0,.02,.3],[0,-.15,.02,.27]])box('solid',[px,.835,pz],[w,.01,d],'#a8402f',0,{ao:false,lod:'d'});box('solid',[.55,.84,.2],[.16,.04,.12],'#2f2d2e',0,{ao:false,lod:'d'});block(0,0,.72,.42,.85);
    stand(0,-.75,0,'merchant','#6d8a87');});
  // 放线：用木桩和白灰线在地上画出新殿的平面（长方形）与柱位，先定形状再搭木构
  frame(-23.4,-34.6,0,()=>{const W=8.4,D=4.6;for(const [px,pz,w,d] of [[0,-D/2,W,.07],[0,D/2,W,.07],[-W/2,0,.07,D],[W/2,0,.07,D],[0,0,W,.04]])box('flat',[px,.025,pz],[w,.02,d],'#f3eee2',0,{ao:false});
    for(let i=0;i<4;i++)for(const sz of [-1,1])put('flat',G.cyl12,mtx([-W/2+W*i/3,.03,sz*D/2],[.2,.02,.2]),'#e9e2cf',{ao:false});
    for(const sx of [-1,1])for(const sz of [-1,1]){cyl('solid',[sx*(W/2+.35),.22,sz*(D/2+.35)],[.045,.44,.045],'#9a7a52',0,{lod:'d'});beam('solid',[sx*(W/2+.35),.4,sz*(D/2+.35)],[-sx*(W/2+.35),.4,sz*(D/2+.35)],.008,'#efe6d2',{lod:'d'});}});
  frame(-37.4,-45,0,()=>{cyl('solid',[0,3.3,0],[.16,6.6,.16],'#a88762');cyl('solid',[0,.15,0],[.5,.3,.5],P.stone);pillar(0,0,.3,6.6);for(const a of [0,2.1,4.2])beam('solid',[0,6.4,0],[Math.cos(a)*3.2,0,Math.sin(a)*3.2],.03,'#8a7a62',{lod:'d'});
    beam('solid',[-1.2,5.6,0],[4.2,6.6,0],.11,'#b9875f');beam('solid',[4.0,6.55,0],[4.0,3.8,0],.02,'#6d5a44',{lod:'d'});put('solid',G.cyl,mtx([4.0,3.6,0],[.16,2.4,.16],[Math.PI/2,0,0]),'#c99a6c');
    beam('solid',[-1.1,5.6,0],[-1.1,1.4,.3],.02,'#6d5a44',{lod:'d'});stand(-1.1,.55,Math.PI/2,'man','#a9845f');});
  // 9) 远景：外郭城墙、宫城门楼、终南山与北原
  // 外郭东西墙在横街尽头开城门（驼队由西面城门进城、穿城而过）
  for(const sx of [-1,1]){box('solid',[sx*114,3.3,-36],[4.5,6.6,152],'#c8b28f');box('solid',[sx*114,3.3,81],[4.5,6.6,66],'#c8b28f');for(let z=-110;z<113;z+=3)if(z<33||z>55)box('solid',[sx*111.9,7,z],[.4,.8,1.4],'#c4ab86');
    for(const z of [36.5,51.5])box('solid',[sx*114,3.7,z],[9,7.4,6],'#cdb592');box('solid',[sx*114,6.3,44],[9,2.2,9],'#cdb592');box('solid',[sx*114,5.15,44],[9.02,.12,8.02],'#6d5b4c');
    hall(sx*114,44,-sx*Math.PI/2,{w:15,d:6,h:3.6,y0:7.4,plat:.3,bays:5,roof:'xie',tile:P.glazeDark,ridge:'#3e5651',collide:false,brackets:false,lod:'d'});}
  box('solid',[-62,3.3,114],[104,6.6,4.5],'#c8b28f');box('solid',[62,3.3,114],[104,6.6,4.5],'#c8b28f');box('solid',[0,3.5,114],[24,7,9],'#cbb592');
  hall(0,114,Math.PI,{w:18,d:6.5,h:4,y0:7,plat:.3,bays:5,roof:'hip',tile:P.glazeDark,ridge:'#3e5651',collide:false,brackets:true});
  box('solid',[0,4,-114],[260,8,6],'#c6ad88');box('solid',[0,4.5,-114],[36,9,14],'#cdb592');
  hall(0,-114,0,{w:30,d:10,h:5,y0:9,plat:.4,bays:7,roof:'hip',tile:P.glazeDark,ridge:'#3e5651',collide:false,upper:{w:23,d:6,h:2.3,bays:5,rh:4.4}});
  for(const x of [-60,-30,30,60])hall(x,-128,0,{w:20,d:10,h:4.5,plat:1,bays:5,roof:x%60?'xie':'hip',tile:P.glaze,ridge:P.glazeDark,collide:false,brackets:false});
  hall(0,-150,0,{w:44,d:18,h:6,plat:3,bays:11,roof:'hip',tile:P.glazeDark,ridge:'#3e5651',collide:false,brackets:false,upper:{w:36,d:12,h:3,bays:9,rh:6.5}});
  // 宫城：围墙、角楼、北门与庭树（只在飞高或航拍时看到）
  for(const sx of [-1,1]){box('solid',[sx*130,4,-157],[4,8,86],'#c6ad88',0,{ao:false});box('solid',[sx*130,8.3,-157],[4.4,.5,86.4],'#bfae92',0,{ao:false});
    frame(sx*130,-200,0,()=>{box('solid',[0,5,0],[9,10,9],'#cdb592',0,{ao:false});for(const k of [-1,1])for(const j of [-1,1])cyl('solid',[k*2.6,11.4,j*2.6],[.22,2.8,.22],P.red,0,{lod:'d'});roof(0,12.8,0,8.4,8.4,2.6,'xie',{tile:P.glazeDark,ridge:'#3e5651',collide:false,lod:'d'});});}
  box('solid',[0,4,-200],[264,8,4],'#c6ad88',0,{ao:false});box('solid',[0,8.3,-200],[264.4,.5,4.4],'#bfae92',0,{ao:false});box('solid',[0,4.5,-200],[30,9,12],'#cdb592',0,{ao:false});
  hall(0,-200,Math.PI,{w:18,d:6.5,h:4,y0:9,plat:.3,bays:5,roof:'hip',tile:P.glazeDark,ridge:'#3e5651',collide:false,brackets:false,lod:'d'});
  // 护城河与河岸（画在地面贴图上），南面大道从明德门跨河而出
  for(const sx of [-1,1])for(const [z0,z1] of [[-111,40],[48,127]])paint.push(['bank',sx>0?117:-127,z0,sx>0?127:-117,z1],['moat',sx>0?119.5:-124.5,z0,sx>0?124.5:-119.5,Math.min(z1,124.5)]);
  paint.push(['street',-128,40,-112,48],['street',112,40,128,48]);
  paint.push(['bank',-127,117,-6,127],['bank',6,117,127,127],['moat',-124.5,119.5,-6,124.5],['moat',6,119.5,124.5,124.5],['walk',-6,116,6,128],['court',-128,-128,128,-117]);
  // 远山：南面层叠的终南山、北面低缓的北原；单独的无雾材质，颜色按远近预先混入“空气透视”
  const mtnP=[],mtnC=[];
  function range(o){const rr=seeded(o.seed),M=o.cols,L=new T.Vector3(-.5,.83,.31).normalize(),hazeLow=C(eraDefinition.fog),hazeHigh=C('#b4c8d6'),haze=new T.Color(),base=C(o.col),top=C(o.top),ea=new T.Vector3(),eb=new T.Vector3(),nn=new T.Vector3(),cc=new T.Color();
    let H=[];for(let i=0;i<M;i++)H.push(o.h(i/M*Math.PI*2)*(.72+.56*rr()));
    H=H.map((h,i)=>(h*2+H[(i+M-1)%M]+H[(i+1)%M])/4*(rr()<.22?1+o.spike*rr():1));
    const prof=[[-.05,-1.5],[.3,.3],[.66,.76],[1,1],[1.6,.2]],maxH=Math.max(...H),pts=[];
    for(let i=0;i<M;i++){const t=(i+(rr()-.5)*.4)/M*Math.PI*2,row=[];for(const [f,hf] of prof){const r=o.r0+o.dr*f+(rr()-.5)*o.dr*.18,h=hf<0?hf:H[i]*hf*(f>0&&f<1?.85+.3*rr():1);row.push([Math.sin(t)*r,h,Math.cos(t)*r]);}pts.push(row);}
    const tri=(p,q,s)=>{ea.set(q[0]-p[0],q[1]-p[1],q[2]-p[2]);eb.set(s[0]-p[0],s[1]-p[1],s[2]-p[2]);nn.crossVectors(ea,eb).normalize();if(nn.y<0)nn.negate();
      const k=clamp((p[1]+q[1]+s[1])/3/maxH,0,1),sh=.64+.48*Math.max(0,nn.dot(L));haze.copy(hazeLow).lerp(hazeHigh,Math.min(1,k*1.6));cc.copy(base).lerp(top,Math.pow(k,.8)).multiplyScalar(sh).lerp(haze,o.hz+(1-o.hz)*.35*Math.pow(1-k,3));
      for(const v of [p,q,s]){mtnP.push(v[0],v[1],v[2]);mtnC.push(cc.r,cc.g,cc.b);}};
    for(let i=0;i<M;i++){const A=pts[i],B=pts[(i+1)%M];for(let j=0;j<prof.length-1;j++){tri(A[j],B[j],A[j+1]);tri(B[j],B[j+1],A[j+1]);}}}
  range({seed:9,cols:96,r0:350,dr:105,hz:.42,spike:.7,col:'#4f7480',top:'#7f9cab',h:t=>9+68*Math.pow(Math.max(0,Math.cos(t)),1.3)+12*Math.pow(Math.max(0,-Math.cos(t)),2)});
  range({seed:3,cols:120,r0:258,dr:50,hz:.22,spike:.5,col:'#5f8468',top:'#8fa684',h:t=>4+21*Math.pow(Math.max(0,Math.cos(t)),2)+13*Math.pow(Math.max(0,-Math.cos(t)),2)});
  const mtnG=own(triGeo(mtnP));mtnG.setAttribute('color',new T.Float32BufferAttribute(mtnC,3));mtnG.computeBoundingSphere();
  const mountains=new T.Mesh(mtnG,own(new T.MeshBasicMaterial({vertexColors:true,fog:false,toneMapped:false,side:T.DoubleSide})));mountains.matrixAutoUpdate=false;root.add(mountains);
  // 城外：护城河边的柳行、通往南方的大道树行、田间村落（细节层，低画质隐藏）
  function convex(tris){const c=[0,0,0];let n=0;for(const t of tris)for(const v of t){c[0]+=v[0];c[1]+=v[1];c[2]+=v[2];n++;}c[0]/=n;c[1]/=n;c[2]/=n;const pos=[];
    for(let [a,b,d] of tris){const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[d[0]-a[0],d[1]-a[1],d[2]-a[2]],nx=u[1]*v[2]-u[2]*v[1],ny=u[2]*v[0]-u[0]*v[2],nz=u[0]*v[1]-u[1]*v[0];
      if(nx*((a[0]+b[0]+d[0])/3-c[0])+ny*((a[1]+b[1]+d[1])/3-c[1])+nz*((a[2]+b[2]+d[2])/3-c[2])<0)[b,d]=[d,b];pos.push(...a,...b,...d);}return triGeo(pos);}
  {const A=[-.5,0,-.5],B=[.5,0,-.5],Cc=[.5,0,.5],D=[-.5,0,.5],E=[-.5,1,0],Fp=[.5,1,0];G.prism=T_(convex([[A,B,Fp],[A,Fp,E],[D,Cc,Fp],[D,Fp,E],[A,E,D],[B,Fp,Cc]]));}
  function lolly(x,z,s=1,col){cyl('solid',[x,1.1*s,z],[.2*s,2.2*s,.2*s],P.woodDark,0,{lod:'d',ao:false});ball('solid',[x,2.9*s,z],[1.8*s,1.45*s,1.8*s],jit(col||pick([P.leaf,P.leafDark,'#7f9a6a']),.04),[0,R(0,3),0],{lod:'d',ao:false});}
  function farmhouse(x,z,rot,s=1){frame(x,z,rot,()=>{box('solid',[0,1.1*s,0],[4.4*s,2.2*s,3*s],jit('#ddd0b4',.03),0,{lod:'d',ao:false});box('solid',[0,.9*s,1.52*s],[.9*s,1.6*s,.06],'#6d5444',0,{lod:'d',ao:false});put('solid',G.prism,mtx([0,2.15*s,0],[5*s,1.5*s,3.9*s]),jit('#7b8582',.03),{lod:'d'});});}
  for(let z=122;z<250;z+=9)for(const sx of [-1,1])lolly(sx*8,z+R(-1,1),R(.9,1.1));
  for(const sx of [-1,1])for(let z=-104;z<126;z+=6.5)lolly(sx*129,z,z%13?R(.7,.9):R(.9,1.05),z%13?'#a8b685':'#9fb07c');
  for(let x=-122;x<126;x+=13)if(Math.abs(x)>14)lolly(x,129,R(.85,1.05),'#9fb07c');
  for(let i=0,t=0;i<13&&t<400;t++){const a=R(0,Math.PI*2),r=R(150,232),x=Math.sin(a)*r,z=Math.cos(a)*r;
    if((z>100&&Math.abs(x)<20)||Math.abs(z+218)<26||(Math.abs(x)<146&&z<-104&&z>-212)||Math.max(Math.abs(x),Math.abs(z))<140)continue;i++;
    const rot=R(-.3,.3);for(let k=0;k<pick([3,4,5]);k++){const hx=x+R(-9,9),hz=z+R(-7,7);farmhouse(hx,hz,rot+(k%2)*Math.PI/2,R(.8,1.05));}for(let k=0;k<6;k++)lolly(x+R(-13,13),z+R(-11,11),R(.8,1.2));}
  for(const [x,z] of [[-80,-150],[80,-150],[-100,-176],[100,-176],[-45,-182],[45,-182],[-112,-128],[112,-128]])for(let k=0;k<3;k++)lolly(x+R(-5,5),z+R(-4,4),R(.9,1.2));

  // ================= 收尾：合并网格、材质、地面、天空 =================
  const solidMat=own(new T.MeshStandardMaterial({vertexColors:true,roughness:.86}));
  function windify(m,freq){m.onBeforeCompile=s=>{s.uniforms.uTime=timeU;s.vertexShader='attribute float sway;\nuniform float uTime;\n'+s.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>\nfloat wPh=position.x*.31+position.z*.23;transformed.x+=sin(uTime*${freq.toFixed(2)}+wPh)*sway;transformed.z+=cos(uTime*${(freq*.8).toFixed(2)}+wPh*1.3)*sway*.7;`);};m.customProgramCacheKey=()=>'changan-wind-'+freq;return m;}
  let tileMap=null,tileNormal=null;
  if(hasDOM){const c=document.createElement('canvas');c.width=64;c.height=64;const x=c.getContext('2d'),n=document.createElement('canvas');n.width=64;n.height=64;const y=n.getContext('2d');
    if(x&&y){for(let i=0;i<64;i++){const u=i/64,rib=Math.sin(u*Math.PI),l=Math.round(150+rib*95);x.fillStyle=`rgb(${l},${l},${l})`;x.fillRect(i,0,1,64);const nx=Math.cos(u*Math.PI)*.75;y.fillStyle=`rgb(${Math.round((nx*.5+.5)*255)},128,${Math.round(Math.sqrt(1-nx*nx)*.5*255+127)})`;y.fillRect(i,0,1,64);}
      x.fillStyle='rgba(40,40,40,.16)';for(let j=0;j<64;j+=16)x.fillRect(0,j,64,2);
      tileMap=own(new T.CanvasTexture(c));tileMap.colorSpace=T.SRGBColorSpace;tileNormal=own(new T.CanvasTexture(n));for(const t of [tileMap,tileNormal]){t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;}}}
  const MAT={solid:solidMat,flat:solidMat,roof:own(new T.MeshStandardMaterial({vertexColors:true,roughness:.74,map:tileMap,normalMap:tileNormal,normalScale:new T.Vector2(.9,.9)})),
    cloth:own(windify(new T.MeshStandardMaterial({vertexColors:true,roughness:.92,side:T.DoubleSide}),1.9)),leaf:own(windify(new T.MeshStandardMaterial({vertexColors:true,roughness:.95}),1.1)),
    glow:own(windify(new T.MeshStandardMaterial({vertexColors:true,roughness:.65,emissive:new T.Color('#c0602c'),emissiveIntensity:.42}),1.4)),water:own(new T.MeshStandardMaterial({vertexColors:true,roughness:.22,metalness:.12}))};
  const detail=[],shadowCasters=[];
  // 很小的分块（几百个顶点）单独占一次绘制不划算：按「种类 × 画质层」并进一个公共网格
  for(const [key,b] of buckets){if(b.far||b.p.length>=13500)continue;const mk=`${b.kind}|m|${b.lod}`;let m=buckets.get(mk);if(!m){m={...newAcc(b.kind),far:false,lod:b.lod,cx:'m',cz:'m'};buckets.set(mk,m);}
    if(m===b)continue;for(const a of ['p','n','c','uv','w'])if(b[a])for(let i=0;i<b[a].length;i++)m[a].push(b[a][i]);buckets.delete(key);}
  for(const b of buckets.values()){if(!b.p.length)continue;const g=own(new T.BufferGeometry());
    g.setAttribute('position',new T.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));g.setAttribute('color',new T.Float32BufferAttribute(b.c,3));
    if(b.uv)g.setAttribute('uv',new T.Float32BufferAttribute(b.uv,2));if(b.w)g.setAttribute('sway',new T.Float32BufferAttribute(b.w,1));g.computeBoundingSphere();
    const mesh=new T.Mesh(g,MAT[b.kind]);mesh.receiveShadow=true;mesh.castShadow=!b.far&&b.kind!=='flat'&&b.kind!=='water';if(mesh.castShadow)shadowCasters.push(mesh);
    mesh.matrixAutoUpdate=false;mesh.updateMatrix();if(b.lod==='d')detail.push(mesh);root.add(mesh);}
  buckets.clear();
  // 地面：画布贴图分区（街道、广场、院落、草地、车辙）+ 建筑接地阴影
  const groundG=own(new T.PlaneGeometry(256,256));groundG.rotateX(-Math.PI/2);
  const groundMat=own(new T.MeshStandardMaterial({color:hasDOM?'#ffffff':'#cdbc98',roughness:.96}));
  groundMat.onBeforeCompile=s=>{s.vertexShader='varying vec3 vGW;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvGW=(modelMatrix*vec4(transformed,1.0)).xyz;');s.fragmentShader='varying vec3 vGW;\n'+s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat gN=sin(vGW.x*.83)*sin(vGW.z*.71)+sin(vGW.x*.21+vGW.z*.29)*.9+sin(vGW.x*3.1-vGW.z*2.7)*.25;diffuseColor.rgb*=1.0+gN*.03;');};
  groundMat.customProgramCacheKey=()=>'changan-ground';
  if(hasDOM){const S=1024,k=S/256,c=document.createElement('canvas');c.width=S;c.height=S;const x=c.getContext('2d');
    if(x){const X=v=>(v+128)*k;x.fillStyle='#c9b893';x.fillRect(0,0,S,S);
      const ZC={walk:'#d5c7a7',street:'#cfbd98',plaza:'#d4c7a9',yard:'#ccbb97',court:'#d9d0bd',grass:'#b3b98b',trod:'rgba(150,120,85,.18)',moat:'#8db4b4',bank:'#c9b78f'};
      for(const t of ['yard','street','walk','plaza','court','grass','trod','bank','moat'])for(const [ty,x1,z1,x2,z2] of paint)if(ty===t){x.fillStyle=ZC[t];x.fillRect(X(x1),X(z1),(x2-x1)*k,(z2-z1)*k);
        if(t==='court'){x.fillStyle='rgba(120,100,80,.07)';for(let gx=x1;gx<x2;gx+=1.2)x.fillRect(X(gx),X(z1),1,(z2-z1)*k);for(let gz=z1;gz<z2;gz+=1.2)x.fillRect(X(x1),X(gz),(x2-x1)*k,1);}
        if(t==='street'){x.fillStyle='rgba(130,105,75,.14)';const along=(x2-x1)>(z2-z1);for(const o of [-.9,.9]){if(along)x.fillRect(X(x1),X((z1+z2)/2+o),(x2-x1)*k,3);else x.fillRect(X((x1+x2)/2+o),X(z1),3,(z2-z1)*k);}}}
      for(let i=0;i<36000;i++){const l=rand();x.fillStyle=l<.5?`rgba(110,90,60,${R(.03,.08)})`:`rgba(250,240,220,${R(.03,.08)})`;const s=R(1,4);x.fillRect(rand()*S,rand()*S,s,s);}
      for(let i=0;i<900;i++){x.fillStyle=`rgba(${120+R(-20,20)|0},${140+R(-15,15)|0},90,${R(.08,.2)})`;const px=X(R(-108,108)),pz=X(R(-108,108)),r=R(2,7);x.beginPath();x.ellipse(px,pz,r,r*R(.5,1),R(0,3),0,Math.PI*2);x.fill();}
      for(const [fx,fz,hx,hz,dk] of footprints)for(let i=0;i<4;i++){x.fillStyle=`rgba(80,60,40,${dk*.22})`;const e=i*.45;x.fillRect(X(fx-hx-e),X(fz-hz-e),(hx+e)*2*k,(hz+e)*2*k);}
      const tex=own(new T.CanvasTexture(c));tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;groundMat.map=tex;}}
  const ground=new T.Mesh(groundG,groundMat);ground.receiveShadow=true;root.add(ground);
  // 城外地面：田块拼接、田埂、通往南方的大道、渭水与宫城庭院（着色器生成，不增加绘制次数）
  const outerG=own(new T.PlaneGeometry(1400,1400));outerG.rotateX(-Math.PI/2);const outerMat=own(new T.MeshStandardMaterial({color:'#c9b893',roughness:1}));
  const FU={fA:{value:C('#d3c084')},fB:{value:C('#a7b779')},fC:{value:C('#bcc48a')},fD:{value:C('#c7aa7c')},fPath:{value:C('#dccdab')},fWater:{value:C('#8db4b4')},fPave:{value:C('#dcd3bf')}};
  outerMat.onBeforeCompile=s=>{Object.assign(s.uniforms,FU);s.vertexShader='varying vec3 vOW;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvOW=(modelMatrix*vec4(transformed,1.0)).xyz;');
    s.fragmentShader='varying vec3 vOW;uniform vec3 fA,fB,fC,fD,fPath,fWater,fPave;\nfloat h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      vec2 p=vOW.xz;float dc=max(abs(p.x),abs(p.y));vec2 cs=vec2(30.0,21.0),cl=floor(p/cs),f=fract(p/cs);float h=h21(cl);
      vec3 fc=h<.3?fA:h<.55?fB:h<.8?fC:fD;fc*=.95+.05*sin((h<.5?p.x:p.y)*2.4);fc*=.97+.06*h21(cl+7.0);
      fc=mix(fc,fPath,max(step(f.x,.035),step(f.y,.05)));
      fc=mix(fc,fPath,(1.0-smoothstep(4.5,5.5,abs(p.x)))*step(110.0,p.y));fc=mix(fc,fPath,(1.0-smoothstep(4.0,5.0,abs(p.y-44.0)))*step(110.0,abs(p.x)));
      float rz=-218.0+14.0*sin(p.x*.011)+7.0*sin(p.x*.029+1.3);fc=mix(fc,fWater,1.0-smoothstep(8.0,11.0,abs(p.y-rz)));
      fc=mix(diffuseColor.rgb,fc,smoothstep(132.0,150.0,dc));
      fc=mix(fc,fPave,step(abs(p.x),128.0)*step(-198.0,p.y)*step(p.y,-116.0));
      diffuseColor.rgb=fc;`);};
  outerMat.customProgramCacheKey=()=>'changan-outer';const outer=new T.Mesh(outerG,outerMat);outer.position.y=-.04;outer.receiveShadow=false;root.add(outer);
  // 匾额文字
  for(const p of plaques){const c=document.createElement('canvas');c.width=512;c.height=192;const x=c.getContext('2d');if(!x)continue;x.fillStyle='#e8c77c';x.font='600 120px "Songti SC","Noto Serif CJK SC","SimSun",serif';x.textAlign='center';x.textBaseline='middle';x.fillText(p.text,256,100);
    const t=own(new T.CanvasTexture(c));t.colorSpace=T.SRGBColorSpace;const m=own(new T.MeshBasicMaterial({map:t,transparent:true,depthWrite:false}));const g=own(new T.PlaneGeometry(p.w*.9,p.h*.86));const mesh=new T.Mesh(g,m);mesh.position.set(p.x,p.y,p.z);mesh.rotation.y=p.rot;root.add(mesh);}
  // 天空穹顶：直接输出屏幕色（不经色调映射），地平线颜色与雾色完全一致，远处建筑自然融进天色
  const disp=hex=>{const t={r:0,g:0,b:0};C(hex).getRGB(t,T.SRGBColorSpace);return new T.Vector3(t.r,t.g,t.b);};
  const skyMat=own(new T.ShaderMaterial({side:T.BackSide,depthWrite:false,fog:false,uniforms:{zen:{value:disp('#3f82c4')},mid:{value:disp('#93c0de')},hor:{value:disp(eraDefinition.fog)},glow:{value:disp('#fff3d8')},sun:{value:new T.Vector3(-.52,.36,.4).normalize()}},
    vertexShader:'varying vec3 vD;void main(){vD=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:'varying vec3 vD;uniform vec3 zen,mid,hor,glow,sun;void main(){vec3 d=normalize(vD);float y=d.y;vec3 c=mix(hor,mid,smoothstep(.0,.2,y));c=mix(c,zen,smoothstep(.14,.72,y));float s=max(dot(d,sun),0.0);c=mix(c,glow,clamp(pow(s,8.0)*.32+pow(s,80.0)*.7,0.0,1.0));gl_FragColor=vec4(c,1.0);}'}));
  const skyG=own(new T.SphereGeometry(600,32,16));const sky=new T.Mesh(skyG,skyMat);sky.frustumCulled=false;sky.renderOrder=-10;root.add(sky);
  // 云：四种云形画在一张贴图上，全部云片合成一个网格（一次绘制），面朝城市
  let cloudMesh=null,cloudN=0;
  if(hasDOM){const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d');if(x){
    for(let k=0;k<4;k++){const ox=(k%2)*256,oy=Math.floor(k/2)*128,bl=[];for(let i=0;i<8+k*2;i++){const r=12+rand()*20,t=i/(7+k*2);bl.push([ox+34+t*188+rand()*10,oy+96-r*.55-(1-Math.abs(t-.5)*2)*rand()*22,r]);}
      for(const [px,py,r] of bl){const g=x.createRadialGradient(px,py+r*.2,r*.1,px,py,r);g.addColorStop(0,'rgba(226,228,236,1)');g.addColorStop(.72,'rgba(238,238,240,.9)');g.addColorStop(1,'rgba(240,240,244,0)');x.fillStyle=g;x.beginPath();x.arc(px,py,r,0,Math.PI*2);x.fill();}
      for(const [px,py,r] of bl){const g=x.createRadialGradient(px-r*.25,py-r*.4,0,px,py-r*.1,r*.85);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.6,'rgba(255,253,248,.7)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.beginPath();x.arc(px,py-r*.1,r*.85,0,Math.PI*2);x.fill();}
      x.save();x.globalCompositeOperation='destination-out';const g=x.createLinearGradient(0,oy+88,0,oy+100);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,1)');x.fillStyle=g;x.fillRect(ox,oy+88,256,40);x.restore();}
    const tex=own(new T.CanvasTexture(c));tex.colorSpace=T.SRGBColorSpace;const pos=[],uv=[],col=[];cloudN=22;
    for(let i=0;i<cloudN;i++){const a=i/cloudN*Math.PI*2+R(-.12,.12),r=R(300,440),y=R(85,140),w=R(110,190),h=w*.4,k=i%4,cx=Math.sin(a)*r,cz=Math.cos(a)*r,rx=Math.cos(a)*w/2,rz=-Math.sin(a)*w/2;
      const u0=(k%2)*.5,v0=.5-Math.floor(k/2)*.5,tint=C(pick(['#ffffff','#fff8ec','#f1f4f8']));
      const q=[[cx-rx,y-h/2,cz-rz,u0,v0],[cx+rx,y-h/2,cz+rz,u0+.5,v0],[cx+rx,y+h/2,cz+rz,u0+.5,v0+.5],[cx-rx,y+h/2,cz-rz,u0,v0+.5]];
      for(const n of [0,1,2,0,2,3]){pos.push(q[n][0],q[n][1],q[n][2]);uv.push(q[n][3],q[n][4]);col.push(tint.r,tint.g,tint.b);}}
    const g=own(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.computeBoundingSphere();
    cloudMesh=new T.Mesh(g,own(new T.MeshBasicMaterial({map:tex,vertexColors:true,transparent:true,opacity:.92,depthWrite:false,fog:false,toneMapped:false,side:T.DoubleSide})));cloudMesh.frustumCulled=false;cloudMesh.renderOrder=-5;root.add(cloudMesh);}}

  // ================= 街市生活：行人、驼队、牛车、飞鸟、花瓣 =================
  const walk=(type,a,b,speed=R(.9,1.35))=>addMover(type,[a,b],speed,rand());
  const who=(m=.2)=>{const r=rand();return r<m?'merchant':r<.6?'man':'woman';};
  // 骑马的官员与驿使、挑担的小贩：排在各自列表最前面，低画质只保留部分行人时也不会丢
  for(const [pts,sp,type,color,off] of [[[[1.9,104],[1.9,-14]],1.7,'man','#b9655a',.61],[[[-1.9,-14],[-1.9,104]],1.55,'merchant','#5f7f9a',.05],[[[-60,-15.5],[60,-15.5]],1.5,'man','#8a6f9a',.3],[[[76,-18],[76,104]],1.6,'man','#c98b5e',.7]]){addMover(type,pts,sp,off,{color});Object.assign(movers[movers.length-1],{ride:true,lift:.84});}
  for(const pts of [[[6.4,100],[6.4,-12]],[[-6.4,-12],[-6.4,100]],[[-14,46.4],[-100,46.4]],[[-14.8,31],[-14.8,10.5]],[[18.2,31],[18.2,3]]]){addMover('man',pts,R(.85,1.05),rand(),{color:pick(['#8a9bb4','#a9845f','#7fa1a0','#c98b5e'])});movers[movers.length-1].load=true;}
  for(let i=0;i<12;i++){const x=pick([-5.8,-2.8,2.8,5.8]);walk(who(.15),[x,-14],[x,104]);}
  for(let i=0;i<4;i++)walk(who(),[-60,-12-i*1.6],[60,-12-i*1.6]);
  walk('man',[7.8,-12],[7.8,-70]);walk('woman',[-7.8,-70],[-7.8,-12]);walk('man',[2.6,-34],[2.6,-100]);walk(who(),[-2.6,-100],[-2.6,-34]);
  walk('woman',[-22.2,6],[-22.2,30]);walk('merchant',[-22.4,30],[-22.4,6]);walk(who(.4),[-42,0],[-42,36]);walk(who(.4),[-43.5,36],[-43.5,0]);walk(who(),[-70,15],[-30,15]);walk(who(),[-30,21.6],[-70,21.6]);walk('man',[-60.8,2],[-60.8,34]);
  walk('merchant',[25,30],[25,14]);walk('man',[39.3,2],[39.3,34]);walk('merchant',[38,34],[27,34]);
  for(let i=0;i<5;i++)walk(who(),[-100+i*7,48.2],[100-i*9,48.2]);
  walk(who(),[-42,52],[-42,104]);walk(who(),[42,104],[42,52]);walk(who(),[-70,80],[-14,80]);walk(who(),[70,80],[14,80]);walk('man',[-76,-20],[-76,104]);walk('woman',[76,104],[76,-20]);
  walk('man',[-34,-31],[-34,-52]);walk(who(),[33,-34],[33,-52]);walk('man',[-30,-31],[-14,-31],.8);
  const CAR=[[-118,40.6],[118,40.6]];for(let i=0;i<5;i++)addMover('camel',CAR,.95,.3+i*3.7/236,{closed:false});addMover('merchant',CAR,.95,.3+17.6/236,{closed:false});
  for(const [x,z,h] of [[25.8,5.6,.5],[28.4,5.0,-.9],[34.6,16.8,2.6]]){addMover('camel',[[x,z],[x,z]],0,0);pillar(x,z,1.1,2.6);movers[movers.length-1].fixedH=h;}
  addMover('cart',[[4.2,104],[4.2,-14],[-4.2,-14],[-4.2,104]],1.25,0);addMover('cart',[[4.2,104],[4.2,-14],[-4.2,-14],[-4.2,104]],1.25,.5);
  const groups={};for(const m of movers){(groups[m.kind]||(groups[m.kind]=[])).push(m);}
  const inst=[];const _mat=new T.Matrix4(),_l=new T.Matrix4(),_pos=new T.Vector3(),_one=new T.Vector3(1,1,1),_rq=new T.Quaternion(),_re=new T.Euler();
  function iMesh(geo,n){const m=new T.InstancedMesh(geo,solidMat,n);m.castShadow=true;m.receiveShadow=true;m.frustumCulled=false;m.instanceMatrix.setUsage(T.DynamicDrawUsage);root.add(m);return m;}
  for(const type of ['man','woman','merchant']){const list=groups[type]||[];if(!list.length)continue;const body=iMesh(PEOPLE[type].body,list.length),head=iMesh(PEOPLE[type].head,list.length);
    list.forEach((m,i)=>body.setColorAt(i,C(m.color||pick(ROBES))));body.instanceColor.needsUpdate=true;inst.push({list,meshes:[body,head],kind:'person',full:list.length});}
  const HIPS=[[-.3,1.45,.72,0],[.3,1.45,.72,Math.PI],[-.3,1.45,-.72,Math.PI],[.3,1.45,-.72,0]],HHIPS=[[-.15,1.06,.5,0],[.15,1.06,.5,Math.PI],[-.16,1.06,-.56,Math.PI],[.16,1.06,-.56,0]];
  const camels=groups.camel||[],riders=movers.filter(m=>m.ride),porters=movers.filter(m=>m.load),camelMesh=iMesh(camelBody,camels.length),legMesh=iMesh(camelLeg,camels.length*4),hLegMesh=iMesh(horseLeg,riders.length*4);inst.push({list:camels,meshes:[camelMesh],legs:legMesh,legBase:0,hips:HIPS,kind:'camel',full:camels.length});
  const horseMesh=iMesh(riderHorse,riders.length);inst.push({list:riders,meshes:[horseMesh],legs:hLegMesh,legBase:0,hips:HHIPS,kind:'horse',full:riders.length});
  const loadMesh=iMesh(porterLoad,porters.length);inst.push({list:porters,meshes:[loadMesh],kind:'load',full:porters.length});
  const carts=groups.cart||[],cartMesh=iMesh(oxCart,carts.length);inst.push({list:carts,meshes:[cartMesh],kind:'cart',full:carts.length});
  function placeMovers(time,moving){for(const g of inst){const n=g.meshes[0].count;
    for(let i=0;i<n;i++){const m=g.list[i],dist=m.offset+(moving?time*m.speed:0);if(m.speed>0)sampleRoute(m,dist);else{m.x=m.r.seg[0][0];m.z=m.r.seg[0][1];m.h=m.fixedH||0;}
      const gait=m.ride?'horse':g.kind,walker=!m.ride&&(gait==='person'||gait==='load');
      const ph=dist*(gait==='camel'?1.9:gait==='cart'?1.2:gait==='horse'?2.7:4.4)+m.phase,bob=m.speed>0?(walker?Math.abs(Math.sin(ph))*.05:Math.abs(Math.sin(ph))*.03):0;
      _re.set(0,m.h,m.speed>0&&walker?Math.sin(ph)*.035:0);_rq.setFromEuler(_re);_mat.compose(_pos.set(m.x,bob+(g.kind==='person'&&m.lift||0),m.z),_rq,_one);
      for(const mesh of g.meshes)mesh.setMatrixAt(i,_mat);
      if(g.legs)for(let k=0;k<4;k++){const hp=g.hips[k],a=m.speed>0?Math.sin(ph+hp[3])*.32:0;_l.makeRotationX(a).setPosition(hp[0],hp[1],hp[2]);if(g.legScale)_l.scale(g.legScale);_l.premultiply(_mat);g.legs.setMatrixAt(g.legBase+i*4+k,_l);}}
    for(const mesh of g.meshes)mesh.instanceMatrix.needsUpdate=true;if(g.legs)g.legs.instanceMatrix.needsUpdate=true;}}
  // 飞鸟
  const birdG=own(new T.BufferGeometry());birdG.setAttribute('position',new T.Float32BufferAttribute([0,0,.18,-.75,.12,-.08,0,0,-.12, 0,0,.18,0,0,-.12,.75,.12,-.08],3));birdG.computeVertexNormals();
  const birdMat=own(new T.MeshBasicMaterial({color:'#56605d',side:T.DoubleSide}));const birds=new T.InstancedMesh(birdG,birdMat,12);birds.frustumCulled=false;root.add(birds);
  const birdData=[];for(let i=0;i<12;i++)birdData.push({r:R(30,80),y:R(24,40),cx:R(-30,30),cz:R(-50,20),sp:R(.08,.14)*(i%3?1:-1),ph:R(0,6.28)});
  function placeBirds(time){for(let i=0;i<12;i++){const b=birdData[i],a=time*b.sp+b.ph;_re.set(0,b.sp>0?-a:Math.PI-a,Math.sin(a*1.3)*.15);_rq.setFromEuler(_re);_s.set(1,.35+.65*Math.abs(Math.sin(time*5+b.ph*3)),1);_mat.compose(_pos.set(b.cx+Math.sin(a)*b.r,b.y+Math.sin(a*2)*2,b.cz+Math.cos(a)*b.r),_rq,_s);birds.setMatrixAt(i,_mat);}birds.instanceMatrix.needsUpdate=true;}
  // 花瓣
  const PN=140,pPos=new Float32Array(PN*3),pBase=[];for(let i=0;i<PN;i++){const s=blossomSpots[i%Math.max(1,blossomSpots.length)]||[0,0,1];pBase.push(s);pPos[i*3]=s[0]+R(-2.5,2.5);pPos[i*3+1]=R(.3,4.5);pPos[i*3+2]=s[1]+R(-2.5,2.5);}
  const petalG=own(new T.BufferGeometry());petalG.setAttribute('position',new T.BufferAttribute(pPos,3));const petals=new T.Points(petalG,own(new T.PointsMaterial({color:'#f0cfc6',size:.07,transparent:true,opacity:.8,depthWrite:false})));petals.frustumCulled=false;root.add(petals);
  for(const g of tmpl)g.dispose();
  placeMovers(0,false);placeBirds(0);
  function setQuality(value){low=value==='low';for(const m of shadowCasters)m.castShadow=!low;for(const m of detail)m.visible=!low;
    for(const g of inst)for(const mesh of g.meshes){mesh.count=low&&g.kind==='person'?Math.ceil(g.full*.45):g.full;mesh.castShadow=!low;}
    legMesh.count=camelMesh.count*4;hLegMesh.count=horseMesh.count*4;hLegMesh.castShadow=!low;legMesh.castShadow=!low;birds.visible=!low;petals.visible=!low;if(cloudMesh)cloudMesh.geometry.setDrawRange(0,low?Math.ceil(cloudN*.6)*6:Infinity);}
  setQuality(quality);
  return {ground,obstacles,
    update(dt,time,player,reduced){if(!alive)return;
      if(!low&&player)for(const m of detail){const s=m.geometry.boundingSphere;m.visible=Math.hypot(s.center.x-player.x,s.center.z-player.z)<s.radius+70;}
      if(reduced)return;timeU.value=time;placeMovers(time,true);
      if(!low){placeBirds(time);if(cloudMesh)cloudMesh.rotation.y=time*.0025;
        const p=petalG.attributes.position;for(let i=0;i<PN;i++){let y=p.getY(i)-dt*.35;if(y<.15)y=4.5;p.setY(i,y);p.setX(i,p.getX(i)+Math.sin(time*.7+i)*dt*.12);}p.needsUpdate=true;}},
    setQuality,
    dispose(){if(!alive)return;alive=false;if(fog&&scene.fog===fog){fog.near=fog0[0];fog.far=fog0[1];}scene.remove(root);owned.forEach(r=>r.dispose());root.clear();}
  };
}
