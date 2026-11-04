import * as T from './vendor/three/three.module.min.js';

const oldKingdom = {title:'埃及旅游与文物部 · 古王国',url:'https://egymonuments.gov.eg/historical-periods/old-kingdom/'};
const metKingdom = {title:'大都会艺术博物馆 · 古王国的埃及',url:'https://www.metmuseum.org/essays/egypt-in-the-old-kingdom-ca-2649-2150-b-c'};

// An original learning diorama, not a measured archaeological reconstruction.
export const eraDefinition = {
  id:'egypt', title:'古埃及金字塔', subtitle:'沙海之上，时间有了形状。',
  description:'沿着石板路走向金字塔，在柱廊、书吏营地和绿洲旁寻找建造与记录的秘密。场景为古王国主题的艺术化学习复原，建筑比例、绿洲位置与人物均为教学设计。',
  period:'古埃及 · 古王国主题', accent:'#c89c57', sky:'#8fbfdc', fog:'#ebe3d0', sun:'#ffd9a3', exposure:.9, groundLight:'#9c7b55',
  spawn:{x:0,z:52}, bounds:110,
  stations:[
    {id:'pyramid',title:'石层里的几何',teacher:'梅里 · 建造向导',role:'虚拟建造向导',x:0,z:4,color:'#b9925b',
      intro:'先抬头看看：宽大的底面，怎样一层层收拢成塔尖？',
      lesson:[['先观察，再比较','这里的缩尺模型保留了石块层次。吉萨大金字塔属于古王国时期；它最初还覆盖着较光滑的外壳，今天看到的面貌经历了漫长变化。'],['把形状拆开看','把金字塔看成一层层向上缩小的正方形，可以帮助我们理解它的整体形状。这个学习模型不是古人的施工方案，也不代表真实尺寸。'],['建造需要协作','宏大的工程需要采石、运输、测量与组织。关于具体施工方法，研究仍在继续；不能把一种猜想当成已经确定的全部过程。']],
      faq:[['金字塔一直都是这样粗糙的吗？','不完全是。古代金字塔有外壳石，部分原来的外表更平整。我们的模型特意露出石层，方便观察。'],['这些金字塔的大小是真实比例吗？','不是。这是适合走动和观察的缩尺学习场景，位置与比例经过艺术化调整。']],
      challenge:{prompt:'观察这里的金字塔模型，越靠近塔尖，同一高度那一层的宽度通常怎样变化？',options:['逐渐变小','逐渐变大','始终不变'],answer:0,explanation:'从宽阔的底部向顶部观察，各层逐渐收拢。这是模型的几何特征，不是对施工方法的完整解释。'},sources:[oldKingdom,metKingdom]},
    {id:'scribe',title:'把信息留下来',teacher:'萨提 · 记录向导',role:'虚拟记录向导',x:-30,z:40,color:'#6eaaa3',
      intro:'如果每天运来许多材料，你会怎样让记录清楚又容易检查？',
      lesson:[['记录帮助协作','古埃及有书吏负责记录。今天我们学习表格，也在做相似的事：把信息按一定方式组织起来，方便阅读、核对和交流。'],['分清事实与想象','桌上的纸卷、符号和货物是教学道具，装饰纹样不是一段真实古埃及文字的翻译。阅读历史材料时，要问清它来自哪里。'],['设计一张记录表','试着为一次材料运输设计“日期、材料、数量、记录人”四列。再想想：漏写单位会让别人产生什么误解？']],
      faq:[['书吏和今天的电脑有什么联系？','它们不属于同一时代，但我们可以比较“保存和整理信息”这个共同任务。电脑是现代工具，古埃及书吏并没有电脑。'],['怎样让表格更好读？','同一列放同一种信息，写清标题和单位，并检查是否有漏填或重复。']],
      challenge:{prompt:'记录一批石块时，哪一种写法最容易让别人读懂和核对？',options:['写“很多”','只写“12”，不写是什么','分别写清材料名称、数量和单位'],answer:2,explanation:'清楚的字段与单位能减少歧义。这个问题把历史情境与今天的信息整理方法连接起来。'},sources:[metKingdom]},
    {id:'sphinx',title:'从细节寻找证据',teacher:'娜芙 · 观察向导',role:'虚拟文物观察向导',x:29,z:32,color:'#b38d68',
      intro:'看见一个熟悉的形象时，先描述你真正观察到的部分。',
      lesson:[['用眼睛收集证据','斯芬克斯结合了人的头部与狮子的身体。这里用原创几何造型表现这种组合，不是对真实雕像的逐点复制。'],['观察和解释分开','“我看到它有前爪”是观察；“我认为它象征力量”是解释。提出解释时，还需要查找可靠材料。'],['用数字工具帮助观察','可以换角度、留影，再把观察记录成图文。照片能保留某个视角，却不能替代完整的历史证据。']],
      faq:[['真实的斯芬克斯也在金字塔附近吗？','吉萨的大斯芬克斯与哈夫拉金字塔建筑群有关。不过本场景的距离和方向是为学习重新编排的。'],['这里的装饰是不是都能翻译？','不是。场景里的装饰线条是原创纹样，没有冒充可翻译的古埃及铭文。']],
      challenge:{prompt:'哪一句更接近直接观察，而不是未经核实的推断？',options:['这座雕像一定在守护一件宝物','我看到雕像有人形头部和狮子前爪','所有古埃及人都喜欢相同的雕像'],answer:1,explanation:'先准确描述看得见的细节，再用可靠来源检验解释，这是观察历史文物和辨别信息的好习惯。'},sources:[oldKingdom]},
    {id:'nile',title:'水边的发现',teacher:'伊图 · 地理向导',role:'虚拟地理向导',x:42,z:42,color:'#659b94',
      intro:'沙色与绿色之间藏着一个问题：人们为什么会靠近水生活？',
      lesson:[['水与生活','尼罗河是理解古埃及的重要线索。水、耕地与交通都与人的生活有关。这里的小绿洲是教学景观，不是吉萨古代水域的精确位置。'],['看懂地图的表达','地图会用颜色和符号区分水面、道路和建筑。读地图时，先查看说明，再判断哪些是实景、哪些是示意。'],['比较不同证据','一张场景截图、一幅考古地图和一篇博物馆介绍，各能回答不同问题。它们不能互相完全替代。']],
      faq:[['这片水就是古代尼罗河吗？','不是。这是一处便于观察植物和水面的艺术化绿洲。真实河流与遗址的位置，需要查看可靠地图。'],['地图颜色能直接说明水很深吗？','不能。要看地图图例与制图规则，不能只凭颜色猜测。']],
      challenge:{prompt:'想知道金字塔与真实尼罗河的位置关系，下一步最合适做什么？',options:['只凭游戏里水的位置判断','查阅有来源和图例的地图','认为所有图片都完全相同'],answer:1,explanation:'学习场景帮助提出问题，真实位置关系应通过可靠地图和资料核对。'},sources:[metKingdom]}
  ]
};

const TAU=Math.PI*2;
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);};
// 整数格点哈希（比 sin 快，地面贴图要算几十万次）；hashF 用于非整数输入
const hash=(x,z)=>{let h=Math.imul(x|0,374761393)+Math.imul(z|0,668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296;};
const hashF=(x,z)=>{const s=Math.sin(x*127.1+z*311.7)*43758.5453;return s-Math.floor(s);};
function noise(x,z){
  const xi=Math.floor(x),zi=Math.floor(z),xf=x-xi,zf=z-zi,u=xf*xf*(3-2*xf),v=zf*zf*(3-2*zf);
  const a=hash(xi,zi),b=hash(xi+1,zi),c=hash(xi,zi+1),d=hash(xi+1,zi+1);
  return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;
}
const fbm=(x,z)=>noise(x,z)*.55+noise(x*2.1+5.2,z*2.1+1.3)*.3+noise(x*4.3+2.7,z*4.3+7.1)*.15;
const segDist=(x,z,ax,az,bx,bz)=>{const dx=bx-ax,dz=bz-az,t=clamp(((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz),0,1);return Math.hypot(x-ax-dx*t,z-az-dz*t);};
// 尼罗河中线与半宽：西岸大约在 x=86–97，越过边界继续流向远方
const riverX=z=>112+7*Math.sin(z*.012-.3);
const riverHalf=z=>20+2*Math.sin(z*.02+1);
const bankX=z=>riverX(z)-riverHalf(z);
// 学习站旁的小绿洲水池，以及通往尼罗河的引水渠
const POOL={x:58,z:45,rx:12,rz:8.5};
const poolEdge=a=>1+.07*Math.sin(a*3+.6)+.04*Math.sin(a*5+2.1);
const CANAL={z:45,half:1.5,x0:67};
// 地面高度：可走区域（边界 110 以内）严格为 0，沙丘与东岸石崖都在外围
function terrainY(x,z){
  const d=Math.max(Math.abs(x),Math.abs(z)),ramp=smooth(113,178,d),rx=riverX(z),flood=smooth(rx-50,rx-27,x);
  let h=0;
  if(ramp>0){
    const a=x*.021+z*.012,b=z*.017-x*.006,ridge=1-Math.abs(Math.sin(a+Math.sin(b)*1.4));
    h=(ridge*ridge*13+fbm(x*.012+3,z*.012)*10+3)*ramp*(1-flood);
  }
  return x>rx+80?h+smooth(rx+118,rx+136,x+(fbm(z*.015,7)-.5)*30)*(24+fbm(z*.03,1)*8):h;
}

export function buildEra(scene,{quality='normal'}={}) {
  const root=new T.Group();root.name='egypt-giza-learning-landscape';scene.add(root);
  const resources=new Set(),obstacles=[],thin=[],movers=[],clock={value:0};
  let seed=874123,disposed=false,low=quality==='low',zone='core';
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const rand=(a,b)=>a+(b-a)*random();
  const own=o=>(resources.add(o),o);
  const _q=new T.Quaternion(),_e=new T.Euler(),_p=new T.Vector3(),_s=new T.Vector3(),_d=new T.Vector3(),_up=new T.Vector3(0,1,0),dummy=new T.Object3D();
  function compose(p,s,r){_e.set(r[0]||0,r[1]||0,r[2]||0,r[3]||'XYZ');_q.setFromEuler(_e);return new T.Matrix4().compose(_p.set(p[0],p[1],p[2]),_q,_s.set(s[0],s[1],s[2]));}
  function between(a,b,rad){
    _d.set(b[0]-a[0],b[1]-a[1],b[2]-a[2]);const len=_d.length()||1e-4;_q.setFromUnitVectors(_up,_d.multiplyScalar(1/len));
    return new T.Matrix4().compose(_p.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2),_q,_s.set(rad,len,rad));
  }
  // —— 碰撞 ——
  // 实体默认可站立（顶面就是落脚面）；高处的树冠、外壳等 base≥1.8，不挡地面行走
  const solid=(x,z,hx,hz,height,base=0,extra={})=>obstacles.push({x,z,hx,hz,base,height,walkable:true,...extra});
  const round=(x,z,r,height,base=0,extra={})=>obstacles.push({x,z,r,base,height,walkable:true,...extra});
  // 斜面/锥面分层：从 y0 到 y1，半宽从 h0 线性收到 h1，每层顶面取该层中间高度处的宽度
  function slope(x,z,y0,y1,h0,h1,t=.42,shape='box') {
    const n=Math.max(1,Math.round((y1-y0)/t));
    for(let j=0;j<n;j++){const a=y0+(y1-y0)*j/n,b=y0+(y1-y0)*(j+1)/n,h=lerp(h0,h1,(j+.5)/n);if(h<.1)break;if(shape==='box')solid(x,z,h,h,b-a,a);else round(x,z,h,b-a,a);}
  }
  const wet=(x,z,hx,hz)=>obstacles.push({x,z,hx,hz,base:-.3,height:.45,water:true});
  // 低画质没有阴影贴图：记下树、房屋、人物的位置和高度，最后合成一批朝背光方向拉长的柔和投影
  // 每条记录：[x,z,长,宽,朝向,形状(0 圆/1 棕榈叶/2 圆角矩形),高度]；阳光从西南上方照来，影子朝东北偏东
  const blobs=[],SUN_DIR=[.848,-.53],SUN_RY=.559;
  const blob=(x,z,len,wide,h,y=.07)=>{const off=.707*h*.5;blobs.push([x+SUN_DIR[0]*off,z+SUN_DIR[1]*off,len+.707*h*.75,wide,SUN_RY,0,y]);};
  const boxShadow=(x,z,w,d,h,ry=0,y=.07)=>blobs.push([x+SUN_DIR[0]*.35*h,z+SUN_DIR[1]*.35*h,w+.6*h+.3,d+.38*h+.3,ry,2,y]);
  // 导览员、传送落点和默认镜头位置周围保持空地
  const keep=[[0,52,5],[1.5,62,4]];
  for(const s of eraDefinition.stations)keep.push([s.x,s.z,4.6],[s.x,s.z+3.3,4.2],[s.x+1,s.z+11,3.6],[s.x+1.5,s.z+16.6,3.2]);
  const open=(x,z,r=0)=>!keep.some(([kx,kz,kr])=>Math.hypot(x-kx,z-kz)<kr+r);

  // —— 几何与材质 ——
  function prep(g,flags={}){
    if(!g.attributes.color)g.setAttribute('color',new T.Float32BufferAttribute(new Float32Array(g.attributes.position.count*3).fill(1),3));
    Object.assign(g.userData,flags);return own(g);
  }
  const G={
    box:prep(new T.BoxGeometry(1,1,1)),sph:prep(new T.SphereGeometry(1,14,10)),sphLo:prep(new T.SphereGeometry(1,8,6)),sphMin:prep(new T.SphereGeometry(1,6,4)),
    cyl:prep(new T.CylinderGeometry(1,1,1,14)),cylLo:prep(new T.CylinderGeometry(1,1,1,6)),cone4:prep(new T.ConeGeometry(1,1,4).rotateY(Math.PI/4)),
    rock:prep(new T.DodecahedronGeometry(1,0)),
    // 石块：侧面自下而上由暗到亮，像接缝处的阴影，石层更清楚
    block:(()=>{const g=new T.BoxGeometry(1,1,1),p=g.attributes.position,c=[];for(let i=0;i<p.count;i++){const k=p.getY(i)>0?1:.72;c.push(k,k,k);}g.setAttribute('color',new T.Float32BufferAttribute(c,3));return prep(g);})(),
    jar:prep(new T.LatheGeometry([[0,0],[.42,.02],[.68,.32],[.74,.78],[.52,1.16],[.3,1.3],[.36,1.42],[.3,1.44]].map(p=>new T.Vector2(p[0],p[1])),12))
  };
  const tapers=new Map();
  function taper(tx,tz=tx){
    const k=tx+'|'+tz;if(tapers.has(k))return tapers.get(k);
    const g=new T.BoxGeometry(1,1,1);g.translate(0,.5,0);const p=g.attributes.position;
    for(let i=0;i<p.count;i++)if(p.getY(i)>.5){p.setX(i,p.getX(i)*tx);p.setZ(i,p.getZ(i)*tz);}
    g.computeVertexNormals();prep(g);tapers.set(k,g);return g;
  }
  // 截面放样：沿 z（或 y）排列的超椭圆截面，适合狮身、船身、树干等圆润造型
  function loft(sections,{seg=12,axis='z'}={}) {
    const pos=[],col=[],idx=[],n=sections.length,c=new T.Color(),flip=axis!=='z';
    for(const s of sections){
      const ex=2/(s.p||2.2);c.set(s.c||'#ffffff');
      for(let j=0;j<seg;j++){
        const a=j/seg*TAU,ca=Math.cos(a),sa=Math.sin(a),u=Math.sign(ca)*Math.abs(ca)**ex*s.w,v=Math.sign(sa)*Math.abs(sa)**ex*(sa>0?(s.top??s.h):s.h);
        if(axis==='z')pos.push((s.x||0)+u,s.y+v,s.t);else pos.push((s.x||0)+u,s.t,(s.z||0)+v);
        col.push(c.r,c.g,c.b);
      }
    }
    for(let i=0;i<n-1;i++)for(let j=0;j<seg;j++){const a=i*seg+j,b=i*seg+(j+1)%seg,d=a+seg,e=b+seg;if(flip)idx.push(a,d,b,b,d,e);else idx.push(a,b,d,b,e,d);}
    for(const [i,first] of [[0,true],[n-1,false]]){
      const s=sections[i],ci=pos.length/3;c.set(s.c||'#ffffff');
      if(axis==='z')pos.push(s.x||0,s.y,s.t);else pos.push(s.x||0,s.t,s.z||0);col.push(c.r,c.g,c.b);
      for(let j=0;j<seg;j++){const a=i*seg+j,b=i*seg+(j+1)%seg;if(first!==flip)idx.push(ci,b,a);else idx.push(ci,a,b);}
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();return g;
  }
  // 简单合并：把多个几何体（含颜色、可选摆动属性）烘焙成一个
  const _v=new T.Vector3(),_n=new T.Vector3(),_nm=new T.Matrix3(),_c=new T.Color(),_c2=new T.Color();
  function mergeParts(parts,actor=false) {
    let nv=0,ni=0;for(const p of parts){nv+=p.g.attributes.position.count;ni+=p.g.index?p.g.index.count:p.g.attributes.position.count;}
    const pos=new Float32Array(nv*3),nor=new Float32Array(nv*3),col=new Float32Array(nv*3),idx=nv>65000?new Uint32Array(ni):new Uint16Array(ni);
    const sw=actor?new Float32Array(nv):null,pv=actor?new Float32Array(nv):null;let vo=0,io=0;
    for(const p of parts){
      const P=p.g.attributes.position,N=p.g.attributes.normal,C=p.g.attributes.color,I=p.g.index,count=P.count,flip=p.m.determinant()<0;
      _nm.getNormalMatrix(p.m);
      for(let i=0;i<count;i++){
        const o=(vo+i)*3;_v.fromBufferAttribute(P,i).applyMatrix4(p.m);pos[o]=_v.x;pos[o+1]=_v.y;pos[o+2]=_v.z;
        if(N)_n.fromBufferAttribute(N,i).applyMatrix3(_nm).normalize();else _n.set(0,1,0);nor[o]=_n.x;nor[o+1]=_n.y;nor[o+2]=_n.z;
        _c.copy(p.c);if(C)_c.multiply(_c2.fromBufferAttribute(C,i));if(p.shade)_c.multiplyScalar(p.shade(_v.x,_v.y,_v.z));
        col[o]=_c.r;col[o+1]=_c.g;col[o+2]=_c.b;
        if(actor){sw[vo+i]=p.swing||0;pv[vo+i]=p.pivot||0;}
      }
      const tri=k=>I?I.getX(k):k,len=I?I.count:count;
      for(let k=0;k<len;k+=3){const a=tri(k),b=tri(k+1),d=tri(k+2);idx[io++]=vo+a;idx[io++]=vo+(flip?d:b);idx[io++]=vo+(flip?b:d);}
      vo+=count;
    }
    const g=new T.BufferGeometry();
    g.setAttribute('position',new T.BufferAttribute(pos,3));g.setAttribute('normal',new T.BufferAttribute(nor,3));g.setAttribute('color',new T.BufferAttribute(col,3));
    if(actor){g.setAttribute('swing',new T.BufferAttribute(sw,1));g.setAttribute('pivot',new T.BufferAttribute(pv,1));}
    g.setIndex(new T.BufferAttribute(idx,1));g.computeBoundingSphere();return own(g);
  }
  // 组件：多色小物件合成一个几何体，再用实例化大量复用
  function kit(build,{actor=false,flags={}}={}) {
    const parts=[];
    const k={
      add(g,color,p=[0,0,0],s=[1,1,1],r=[0,0,0],o={}){parts.push({g,m:compose(p,s,r),c:new T.Color(color),swing:o.swing,pivot:o.pivot,shade:o.shade});return k;},
      limb(a,b,rad,color,o={}){parts.push({g:o.g||G.cylLo,m:between(a,b,rad),c:new T.Color(color),swing:o.swing,pivot:o.pivot});return k;},
      raw(g,m,color='#ffffff'){parts.push({g,m,c:new T.Color(color)});return k;}
    };
    build(k);const g=mergeParts(parts,actor);Object.assign(g.userData,flags);return g;
  }
  const std=(extra={})=>own(new T.MeshStandardMaterial({color:'#ffffff',vertexColors:true,roughness:.9,metalness:0,...extra}));
  function patch(m,key,fn){m.customProgramCacheKey=()=>'egypt-'+key;m.onBeforeCompile=sh=>{sh.uniforms.egyptTime=clock;fn(sh);};return m;}
  function windMat(key,factor,extra={}) {
    return patch(std({side:T.DoubleSide,...extra}),'wind-'+key,sh=>{
      sh.vertexShader='uniform float egyptTime;\n'+sh.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
        vec4 egW=vec4(transformed,1.0);
        #ifdef USE_INSTANCING
        egW=instanceMatrix*egW;
        #endif
        egW=modelMatrix*egW;
        float egB=max(position.y,0.0)*${factor.toFixed(4)};
        transformed.x+=sin(egW.x*.13+egW.z*.07+egyptTime*1.4)*egB;
        transformed.z+=cos(egW.x*.06-egW.z*.11+egyptTime*1.15)*egB*.7;`);
    });
  }
  const M={vc:std(),flat:std({flatShading:true}),two:std({side:T.DoubleSide}),gold:std({roughness:.38,metalness:.45}),
    palm:windMat('palm',.011),reed:windMat('reed',.05),crop:windMat('crop',.1)};
  M.cloth=patch(std({side:T.DoubleSide}),'cloth',sh=>{
    sh.vertexShader='uniform float egyptTime;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.y+=sin(position.x*.9+egyptTime*1.7)*sin(position.z*.7+egyptTime*1.2)*.05;');
  });
  // 人物与牲口：腿和手臂按顶点上的 swing/pivot 绕 x 轴摆动；每个实例有独立的步幅与相位
  M.actor=patch(std(),'actor',sh=>{
    sh.vertexShader='uniform float egyptTime;\nattribute float swing;\nattribute float pivot;\nattribute vec2 walk;\n'+sh.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      float egA=sin(egyptTime*5.4+walk.y)*swing*walk.x*.5,egC=cos(egA),egS=sin(egA);
      vec2 egQ=vec2(transformed.y-pivot,transformed.z);
      transformed.y=pivot+egQ.x*egC-egQ.y*egS;transformed.z=egQ.x*egS+egQ.y*egC;
      transformed.y+=abs(sin(egyptTime*5.4+walk.y))*.03*walk.x;`);
  });
  M.bird=patch(std({side:T.DoubleSide}),'bird',sh=>{
    sh.vertexShader='uniform float egyptTime;\nattribute vec2 walk;\n'+sh.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      transformed.y+=sin(egyptTime*walk.x+walk.y)*max(abs(position.x)-.1,0.0)*clamp(walk.x/9.0,.2,1.0)*.8;`);
  });
  // 水面：法线波纹 + 掠射角天光 + 细碎闪光；不透明，避免排序问题
  M.water=patch(std({roughness:.14,metalness:0}),'water',sh=>{
    sh.vertexShader='varying vec3 egWP;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\negWP=(modelMatrix*vec4(transformed,1.0)).xyz;');
    sh.fragmentShader='uniform float egyptTime;\nvarying vec3 egWP;\nfloat egWave(vec2 p){return sin(p.x*.8+p.y*.25+egyptTime*1.1)*.5+sin(p.y*1.3-egyptTime*.9+p.x*.3)*.32+sin((p.x-p.y)*2.6+egyptTime*1.9)*.12+sin(p.x*5.1+p.y*4.3-egyptTime*2.6)*.06;}\n'+sh.fragmentShader
      .replace('#include <color_fragment>','#include <color_fragment>\nfloat egH=egWave(egWP.xz);diffuseColor.rgb*=.95+egH*.06;')
      .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
        float egHx=egWave(egWP.xz+vec2(.12,0.0)),egHz=egWave(egWP.xz+vec2(0.0,.12));
        vec3 egN=normalize(vec3(-(egHx-egH)*1.1,1.0,-(egHz-egH)*1.1));normal=normalize((viewMatrix*vec4(egN,0.0)).xyz);`)
      .replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
        float egF=pow(1.0-clamp(dot(normal,normalize(vViewPosition)),0.0,1.0),3.0);
        float egG=pow(max(0.0,sin(egWP.x*1.7+egyptTime*.7)*sin(egWP.z*2.1-egyptTime*.55)),30.0);
        totalEmissiveRadiance+=vec3(.36,.52,.6)*egF*.32+vec3(1.0,.93,.78)*egG*.18;`);
  });

  // —— 批处理：stamp 实例化、bake 合并、actor 可动的实例 ——
  const buckets=new Map(),bakes=new Map(),crowds=new Map();
  function stamp(g,mat,p,s=[1,1,1],r=[0,0,0],tint=null) {
    const key=zone+'|'+g.uuid+'|'+mat.uuid;let b=buckets.get(key);
    if(!b)buckets.set(key,b={g,mat,zone,items:[]});b.items.push({p,s,r,tint});
  }
  function bake(g,mat,color,p=[0,0,0],s=[1,1,1],r=[0,0,0],shade=null) {
    const key=zone+'|'+mat.uuid;let b=bakes.get(key);
    if(!b)bakes.set(key,b={mat,zone,parts:[]});b.parts.push({g,m:compose(p,s,r),c:new T.Color(color),shade});
  }
  const bakeRaw=(g,mat,m,color='#ffffff',shade=null)=>{const key=zone+'|'+mat.uuid;let b=bakes.get(key);if(!b)bakes.set(key,b={mat,zone,parts:[]});b.parts.push({g,m,c:new T.Color(color),shade});};
  function actor(g,mat,x,z,yaw=0,o={}) {
    let c=crowds.get(g);if(!c)crowds.set(g,c={g,mat,items:[]});
    const it={x,y:o.y||0,z,yaw,s:o.s||1,amp:o.walk||0,phase:o.phase??random()*TAU,tint:o.tint||null,index:c.items.length,mesh:null};
    c.items.push(it);return it;
  }
  function flush() {
    for(const b of buckets.values()) {
      const o=new T.InstancedMesh(b.g,b.mat,b.items.length);o.name='egypt-'+b.zone;
      if(b.g.userData.thin)for(let i=b.items.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[b.items[i],b.items[j]]=[b.items[j],b.items[i]];}
      const tinted=b.items.some(v=>v.tint);
      b.items.forEach((v,i)=>{o.setMatrixAt(i,compose(v.p,v.s,v.r));if(tinted)o.setColorAt(i,_c.set(v.tint||'#ffffff'));});
      o.castShadow=!b.g.userData.noShadow;o.receiveShadow=true;root.add(o);
      if(b.g.userData.thin)thin.push({mesh:o,full:b.items.length,keep:b.g.userData.thin});
    }
    for(const b of bakes.values()) {
      const o=new T.Mesh(mergeParts(b.parts),b.mat);o.name='egypt-'+b.zone;o.castShadow=b.zone!=='far'&&b.zone!=='water';o.receiveShadow=true;root.add(o);
    }
    for(const c of crowds.values()) {
      const n=c.items.length,o=new T.InstancedMesh(c.g,c.mat,n),walk=new Float32Array(n*2);o.name='egypt-life';
      c.items.forEach((it,i)=>{it.mesh=o;dummy.position.set(it.x,it.y,it.z);dummy.rotation.set(0,it.yaw,0);dummy.scale.setScalar(it.s);dummy.updateMatrix();o.setMatrixAt(i,dummy.matrix);walk[i*2]=it.amp;walk[i*2+1]=it.phase;if(c.items.some(v=>v.tint))o.setColorAt(i,_c.set(it.tint||'#ffffff'));});
      c.g.setAttribute('walk',new T.InstancedBufferAttribute(walk,2));
      o.castShadow=!c.g.userData.noShadow;o.receiveShadow=true;o.frustumCulled=false;root.add(o);
    }
    buckets.clear();bakes.clear();crowds.clear();
  }
  // 路径：闭合或开放折线，按长度采样位置与朝向
  function makePath(pts,closed=true) {
    const P=pts.map(p=>({x:p[0],z:p[1],y:p[2]||0}));if(closed)P.push(P[0]);
    const L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot(P[i].x-P[i-1].x,P[i].z-P[i-1].z));
    return {P,L,len:L[L.length-1],closed};
  }
  const _a={x:0,y:0,z:0},_b={x:0,y:0,z:0},_ps={x:0,y:0,z:0,h:0};
  function at(path,s,out) {
    const {P,L,len}=path;s=path.closed?((s%len)+len)%len:clamp(s,0,len);
    let i=1;while(i<L.length-1&&L[i]<s)i++;
    const t=(s-L[i-1])/((L[i]-L[i-1])||1),a=P[i-1],b=P[i];out.x=a.x+(b.x-a.x)*t;out.y=a.y+(b.y-a.y)*t;out.z=a.z+(b.z-a.z)*t;return out;
  }
  function sample(path,s) {at(path,s,_ps);at(path,s-.7,_a);at(path,s+.7,_b);_ps.h=Math.atan2(_b.x-_a.x,_b.z-_a.z);return _ps;}
  function place(it,x,y,z,yaw,pitch=0,roll=0) {
    dummy.position.set(x,y,z);dummy.rotation.set(pitch,yaw,roll,'YXZ');dummy.scale.setScalar(it.s);dummy.updateMatrix();
    it.mesh.setMatrixAt(it.index,dummy.matrix);it.mesh.instanceMatrix.needsUpdate=true;
  }

  // —— 天空：地平线与雾色一致，向上过渡到淡蓝，带太阳光晕、热浪和淡淡的卷云 ——
  const skyMat=own(new T.ShaderMaterial({side:T.BackSide,depthWrite:false,fog:false,
    uniforms:{egyptTime:clock,uHorizon:{value:new T.Color(eraDefinition.fog)},uMid:{value:new T.Color('#bcd8e2')},uTop:{value:new T.Color('#6aa5d3')},uSun:{value:new T.Vector3(-48,80,30).normalize()},uDetail:{value:low?0:1}},
    vertexShader:'varying vec3 vDir;void main(){vec4 w=modelMatrix*vec4(position,1.0);vDir=w.xyz-cameraPosition;gl_Position=projectionMatrix*viewMatrix*w;gl_Position.z=gl_Position.w*.9999;}',
    fragmentShader:`uniform vec3 uHorizon,uMid,uTop,uSun;uniform float egyptTime,uDetail;varying vec3 vDir;
      float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
      void main(){
        vec3 d=normalize(vDir);float y=d.y+sin(d.x*38.0+egyptTime*1.6)*sin(d.z*31.0-egyptTime*1.2)*.0022*(1.0-smoothstep(0.0,.07,abs(d.y)));
        vec3 c=mix(uHorizon,uMid,smoothstep(.0,.16,y));c=mix(c,uTop,smoothstep(.14,.8,y));
        float s=max(dot(d,uSun),0.0);c+=vec3(1.0,.88,.68)*(pow(s,6.0)*.12+pow(s,180.0)*.5)*smoothstep(-.05,.1,y);
        if(uDetail>.5&&y>.03){vec2 p=d.xz/(y+.15);p=vec2(p.x*1.6+egyptTime*.006,p.y*4.0);float cl=n2(p)*.55+n2(p*2.3+3.1)*.3+n2(p*5.1)*.15;
          cl=smoothstep(.56,.86,cl)*smoothstep(.04,.2,y)*(1.0-smoothstep(.45,.85,y));c=mix(c,vec3(.99,.98,.95),cl*.42);}
        gl_FragColor=vec4(c,1.0);
        #include <colorspace_fragment>
      }`}));
  const sky=new T.Mesh(own(new T.SphereGeometry(470,32,16)),skyMat);sky.renderOrder=-10;sky.frustumCulled=false;root.add(sky);

  // —— 农田地块（东边绿带）——
  const plots=[],plotTypes=['emmer','emmer','barley','flax','veg','barley','emmer','flood','flax','fallow'];
  for(const [z0,z1] of [[-46,37],[53,108]])for(let z=z0;z+7<z1;z+=9.6)for(let x=62.5;;x+=11) {
    const edge=Math.min(bankX(z),bankX(z+9))-5.5;if(x+6>edge)break;
    plots.push({x0:x,x1:Math.min(x+9.6,edge),z0:z,z1:Math.min(z+8.8,z1),type:plotTypes[Math.floor(hashF(x*.3,z*.7)*plotTypes.length)]});
  }
  const plotAt=(x,z)=>{if(x<62)return null;for(const p of plots)if(x>p.x0&&x<p.x1&&z>p.z0&&z<p.z1)return p;return null;};
  const ditchX=[72.5];
  // —— 地面细节贴图（可走区域 256m×256m）：沙色、踩出的小路、湿岸、田土、碎石 ——
  const EXT=128,TEX=low?256:512,tex=new Uint8Array(TEX*TEX*4);
  const trails=[[-4,46,-27,42.5,1.4],[-4,30,-33,26,1],[4,29,25,31,1.3],[33,34,40,41,1.2],[46,57.5,72,57.5,1.1],[72,57.5,88,52,1.2],[-33,42,-46,44,1.3],[-46,44,-96,44,1.8],[-58,52,-58,60,1],[-60,59.5,-98,59.5,1.6],[-60,74,-98,74,1.2],
    [8,4,30,3,1.1],[30,3,50,8,1.2],[-12,2,-34,-2,1],[-52,-2,-70,-6,1.2],[-70,-6,-100,-6,1.4],[0,62,-3,104,1],[74,-46,74,40,.8],[84,48,74,48,1],[-36,46,-45,52,1]];
  // 石料雪橇拖过、又被泼水压实的沙道（颜色更深）
  const drags=[[-9.6,34,-7,22,.6],[-7,22,-5.4,15,.6],[-9.6,37,-10.6,48,.6],[-10.6,48,-14,66,.6],[-14,66,-10,86,.6],[-10,86,-5,108,.6]];
  const dragBox=drags.map(t=>[Math.min(t[0],t[2])-2,Math.max(t[0],t[2])+2,Math.min(t[1],t[3])-2,Math.max(t[1],t[3])+2]);
  const trailBox=trails.map(t=>[Math.min(t[0],t[2])-t[4]-2,Math.max(t[0],t[2])+t[4]+2,Math.min(t[1],t[3])-t[4]-2,Math.max(t[1],t[3])+t[4]+2]);
  const SOIL={emmer:[150,130,94],barley:[160,138,98],flax:[128,128,90],veg:[118,124,82],flood:[118,108,84],fallow:[164,142,104]};
  // 低频噪声在粗网格上算好再双线性插值，省掉大部分逐像素开销
  const CS=8,CN=TEX/CS+2,px=2*EXT/TEX,coarseN=new Float32Array(CN*CN),coarseG=new Float32Array(CN*CN);
  for(let jj=0;jj<CN;jj++)for(let ii=0;ii<CN;ii++){const x=-EXT+ii*CS*px,z=-EXT+jj*CS*px;coarseN[jj*CN+ii]=fbm(x*.028,z*.028);coarseG[jj*CN+ii]=smooth(.62,.78,noise(x*.016+13,z*.016-7)*.7+noise(x*.05,z*.05)*.3);}
  const bil=(arr,i,j)=>{const fi=i/CS,fj=j/CS,i0=fi|0,j0=fj|0,tx=fi-i0,tz=fj-j0,k=j0*CN+i0,a=arr[k],b=arr[k+1],c=arr[k+CN],d=arr[k+CN+1];return a+(b-a)*tx+(c-a)*tz+(a-b-c+d)*tx*tz;};
  for(let j=0;j<TEX;j++) {
    const z=-EXT+(j+.5)*px,bz=bankX(z),rowTrails=[],rowPlots=plots.filter(p=>z>p.z0&&z<p.z1),belt=(z>-47&&z<38)||(z>52&&z<109),pdz=(z-POOL.z)/POOL.rz;
    for(let q=0;q<trails.length;q++)if(z>trailBox[q][2]&&z<trailBox[q][3])rowTrails.push(q);
    for(let i=0;i<TEX;i++) {
      const x=-EXT+(i+.5)*px,n=bil(coarseN,i,j),f=(hash(i>>1,j>>1)+hash(i,j))*.5-.5;
      let r=lerp(229,203,n)+f*8,g=lerp(199,170,n)+f*8,b=lerp(146,112,n)+f*7,rip=255;
      const gravel=bil(coarseG,i,j);
      if(gravel>0){const sp=hash(Math.floor(x*2.5),Math.floor(z*2.5))>.62?24:0;r=lerp(r,200-sp,gravel*.65);g=lerp(g,183-sp,gravel*.65);b=lerp(b,150-sp,gravel*.65);rip*=1-gravel*.75;}
      let dp=9;for(const q of rowTrails){const bb=trailBox[q],t=trails[q];if(x>bb[0]&&x<bb[1])dp=Math.min(dp,segDist(x,z,t[0],t[1],t[2],t[3])-t[4]);}
      if(dp<1.6){const k=(1-smooth(-.8,1.6,dp))*.7;r=lerp(r,234,k);g=lerp(g,214,k);b=lerp(b,174,k);rip*=1-k;}
      let dd=9;for(let q=0;q<drags.length;q++){const bb=dragBox[q],t=drags[q];if(x>bb[0]&&x<bb[1]&&z>bb[2]&&z<bb[3])dd=Math.min(dd,segDist(x,z,t[0],t[1],t[2],t[3])-t[4]);}
      if(dd<1.2){const k=(1-smooth(-.3,1.1,dd))*.55;r=lerp(r,196,k);g=lerp(g,164,k);b=lerp(b,118,k);rip*=1-k*.8;}
      // 工地附近散落的石灰岩碎屑
      const chips=x>36&&x<68&&z>-10&&z<22?1-smooth(4,14,Math.hypot(x-52,z-6)):0;if(chips>0){const sp=hash(Math.floor(x*4),Math.floor(z*4))>.7?1:0;r=lerp(r,244-sp*20,chips*.6);g=lerp(g,236-sp*22,chips*.6);b=lerp(b,214-sp*26,chips*.6);rip*=1-chips;}
      // 营地与村落的夯土地面
      const yard=x<-58&&x>-102&&z>30&&z<86?.55:x<-31&&x>-56&&z>28&&z<40?.4:0;
      if(yard){r=lerp(r,212,yard);g=lerp(g,188,yard);b=lerp(b,148,yard);rip*=1-yard;}
      if(x>34) {
        // 到水边的距离：水池、引水渠、田间沟渠、河岸
        const dx=(x-POOL.x)/POOL.rx;let dw=bz-x;
        if(Math.abs(dx)<2&&Math.abs(pdz)<2)dw=Math.min(dw,(Math.hypot(dx,pdz)-poolEdge(Math.atan2(pdz,dx)))*9.5);
        if(x>CANAL.x0-2)dw=Math.min(dw,Math.max(Math.abs(z-CANAL.z)-CANAL.half,CANAL.x0-x,x-bz-2));
        if(z>-46&&z<108)for(const dxc of ditchX)dw=Math.min(dw,Math.abs(x-dxc)-.4);
        if(dw<10){const k=1-smooth(0,10,dw),gr=1-smooth(.5,6,dw);r=lerp(r,lerp(178,128,gr),k);g=lerp(g,lerp(158,150,gr),k);b=lerp(b,lerp(118,92,gr),k);rip*=1-k;}
        if(x>62){
          let pl=null;for(const p of rowPlots)if(x>p.x0&&x<p.x1){pl=p;break;}
          if(pl){const border=Math.min(x-pl.x0,pl.x1-x,z-pl.z0,pl.z1-z),soil=SOIL[pl.type],k=smooth(0,.8,border);r=lerp(170,soil[0],k);g=lerp(156,soil[1],k);b=lerp(114,soil[2],k);rip=0;}
          else if(x<bz&&belt){r=lerp(r,150,.55);g=lerp(g,152,.55);b=lerp(b,100,.55);rip=0;}
        }else if(x>61&&x<bz&&belt){r=lerp(r,150,.55);g=lerp(g,152,.55);b=lerp(b,100,.55);rip=0;}
      }
      const o=(j*TEX+i)*4;tex[o]=clamp(r,0,255);tex[o+1]=clamp(g,0,255);tex[o+2]=clamp(b,0,255);tex[o+3]=clamp(rip,0,255);
    }
  }
  const detail=own(new T.DataTexture(tex,TEX,TEX,T.RGBAFormat));detail.colorSpace=T.SRGBColorSpace;detail.magFilter=T.LinearFilter;detail.minFilter=T.LinearMipmapLinearFilter;detail.generateMipmaps=true;detail.anisotropy=4;detail.needsUpdate=true;
  M.ground=patch(std({roughness:.97}),'ground',sh=>{
    sh.uniforms.egyptDetail={value:detail};
    sh.vertexShader='varying vec3 egGP;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\negGP=(modelMatrix*vec4(position,1.0)).xyz;');
    sh.fragmentShader='varying vec3 egGP;\nuniform sampler2D egyptDetail;\n'+sh.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      vec2 egUV=(egGP.xz+${EXT}.0)/${EXT*2}.0;
      float egIn=smoothstep(0.0,.035,min(min(egUV.x,1.0-egUV.x),min(egUV.y,1.0-egUV.y)));
      vec4 egD=texture2D(egyptDetail,clamp(egUV,0.0,1.0));
      diffuseColor.rgb=mix(diffuseColor.rgb,egD.rgb,egIn);
      float egR=mix(1.0,egD.a,egIn);
      float egS=fract(sin(dot(floor(egGP.xz*26.0),vec2(12.9898,78.233)))*43758.5453);
      float egWv=egGP.z*2.1+egGP.x*.55+sin(egGP.x*.09+egGP.z*.031)*4.0+sin(egGP.z*.19+egGP.x*.05)*1.3;
      float egSl=smoothstep(.78,.94,abs(normalize(cross(dFdx(egGP),dFdy(egGP))).y));
      float egFade=(1.0-smoothstep(.6,1.6,fwidth(egWv)))*egR*egSl;
      float egRip=pow(.5+.5*sin(egWv),2.5);
      diffuseColor.rgb*=.975+egS*.035+(egRip-.3)*.08*egFade;`)
      .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
      float egW2=egGP.z*5.3+egGP.x*1.7+sin(egGP.x*.31+egGP.z*.07)*2.2+sin(egGP.z*.53-egGP.x*.21)*1.1;
      float egF2=(1.0-smoothstep(.5,1.3,fwidth(egW2)))*egR*egSl;
      float egDh=(cos(egWv)+.45*cos(2.0*egWv+.6))*.2*egFade,egDh2=(cos(egW2)+.4*cos(2.0*egW2+.4))*.05*egF2;
      normal=normalize(normal+(viewMatrix*vec4(-egDh*.55-egDh2*1.7,0.0,-egDh*2.1-egDh2*5.3,0.0)).xyz);`);
  });
  // 地面网格：外围沙丘带有沙脊明暗，东岸是绿色农田，远处是石灰岩崖
  // 高画质 200×200 格，低画质 100×100 格（可走区域都是平地，只影响外围沙丘与石崖的细腻程度）
  const groundGeo={};
  function makeGround(seg) {
    const groundGeometry=new T.PlaneGeometry(620,620,seg,seg);groundGeometry.rotateX(-Math.PI/2);
    const gp=groundGeometry.attributes.position,gc=new Float32Array(gp.count*3),sc=new T.Color();
    for(let i=0;i<gp.count;i++) {
      const x=gp.getX(i),z=gp.getZ(i),y=terrainY(x,z),rx=riverX(z),n=fbm(x*.02,z*.02);gp.setY(i,y);
      sc.setRGB(lerp(.88,.8,n)+Math.min(y/40,.04),lerp(.76,.67,n)+Math.min(y/40,.04),lerp(.55,.45,n)+Math.min(y/50,.03),T.SRGBColorSpace);
      if(x>rx-27&&x<rx+112&&y<1.5) {
        const d=x-rx,h=riverHalf(z);
        if(Math.abs(d)<h+3)sc.setRGB(.6,.55,.42,T.SRGBColorSpace);
        else{const pal=[[.62,.69,.45],[.72,.72,.5],[.56,.65,.4],[.66,.6,.43],[.79,.75,.54]][Math.floor(hash(Math.floor(x/15),Math.floor(z/11))*5)];sc.setRGB(...pal,T.SRGBColorSpace);}
      }
      if(y>3&&x>rx+100){const band=.93+.07*Math.sin(y*1.15+fbm(z*.05,3)*2.5),top=smooth(20,26,y);sc.setRGB(lerp(.84,.93,top)*band,lerp(.72,.85,top)*band,lerp(.58,.72,top)*band,T.SRGBColorSpace);}
      gc[i*3]=sc.r;gc[i*3+1]=sc.g;gc[i*3+2]=sc.b;
    }
    groundGeometry.setAttribute('color',new T.BufferAttribute(gc,3));groundGeometry.computeVertexNormals();return own(groundGeometry);
  }
  const groundFor=q=>groundGeo[q]||(groundGeo[q]=makeGround(q==='low'?100:200));
  const ground=new T.Mesh(groundFor(low?'low':'high'),M.ground);ground.receiveShadow=true;ground.name='egypt-walkable-ground';root.add(ground);
  // 场地外围与角落的沙丘（不可走，带碰撞），和地面共用材质，接缝自然
  function duneMound(cx,cz,R,H,dir) {
    const rings=10,segs=28,pos=[],idx=[],col=[];
    for(let k=0;k<=rings;k++)for(let j=0;j<segs;j++){
      const f=k/rings,a=j/segs*TAU,stretch=1+.45*Math.cos(a-dir),rr=R*f*stretch,x=cx+Math.cos(a)*rr,z=cz+Math.sin(a)*rr;
      const lee=1+.5*Math.max(0,-Math.cos(a-dir));pos.push(x,H*Math.pow(1-f*f,1.4*lee)-.02,z);col.push(1,1,1);
      if(k<rings){const a0=k*segs+j,b0=k*segs+(j+1)%segs;idx.push(a0,b0,b0+segs,a0,b0+segs,a0+segs);}
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();
    zone='dunes';bakeRaw(g,M.ground,new T.Matrix4());
    // 碰撞：0.22 m 一级的圆台，能一步步走上沙丘；圆心偏向沙丘拉长的一侧
    const n=Math.ceil(H/.22);for(let j=0;j<n;j++){const y=H*(j+.5)/n,f=Math.sqrt(1-Math.pow(y/H,1/1.4)),r=R*f*.94;if(r<.3)break;round(cx+Math.cos(dir)*.45*R*f*.94,cz+Math.sin(dir)*.45*R*f*.94,r,H*(j+1)/n-H*j/n,H*j/n);}
  }
  // 出发点附近被风堆起的矮沙堆（不足 0.25 m，不设碰撞），和地面同一材质，颜色与沙纹无缝衔接
  for(const [x,z,R,H,d] of [[-7.6,61.5,3.2,.24,2.6],[8.4,63.2,3.6,.22,2.4],[-6.6,53.6,2.2,.18,2.8],[9.6,52.4,2.6,.2,2.5],[-5.6,42.6,1.8,.16,2.7],[6.8,33.8,2.4,.2,2.6],[-24.6,49.6,2.8,.22,2.5],[22.6,47.2,3,.24,2.6],[3.4,67.8,3.4,.22,2.7],[-3.8,69.4,2.6,.2,2.5]]){
    const rings=4,segs=14,pos=[],idx=[],col=[];
    for(let k=0;k<=rings;k++)for(let j=0;j<segs;j++){const f=k/rings,a=j/segs*TAU,rr=R*f*(1+.5*Math.cos(a-d)),y=H*Math.pow(1-f*f,1.6*(1+.6*Math.max(0,-Math.cos(a-d))))-.03;pos.push(x+Math.cos(a)*rr,y,z+Math.sin(a)*rr*.6);col.push(1,1,1);
      if(k<rings){const a0=k*segs+j,b0=k*segs+(j+1)%segs;idx.push(a0,b0,b0+segs,a0,b0+segs,a0+segs);}}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();zone='dunes';bakeRaw(g,M.ground,new T.Matrix4());
  }
  for(const [x,z,R,H,d] of [[-97,97,17,6.5,.6],[-62,103,12,4,1],[-104,64,12,5,.2],[18,105,13,4.2,.8],[-106,-22,12,5,.4],[-99,-102,17,7,.9],[-24,-104,13,5,1.2],[44,-103,12,4.5,.3]])duneMound(x,z,R,H,d);

  // —— 水面：小绿洲水池、引水渠、田间沟渠、尼罗河 ——
  zone='water';
  {
    const pos=[],col=[],idx=[],deep=new T.Color('#2f7f86'),shallow=new T.Color('#6aae9f'),c=new T.Color(),rings=7,segs=56;
    pos.push(POOL.x,.06,POOL.z);c.copy(deep);col.push(c.r,c.g,c.b);
    for(let k=1;k<=rings;k++)for(let j=0;j<segs;j++){
      const f=k/rings,a=j/segs*TAU,e=poolEdge(a)*1.03;pos.push(POOL.x+Math.cos(a)*POOL.rx*e*f,.06,POOL.z+Math.sin(a)*POOL.rz*e*f);
      c.copy(deep).lerp(shallow,f*f);col.push(c.r,c.g,c.b);
      const cur=1+(k-1)*segs+j,nxt=1+(k-1)*segs+(j+1)%segs;
      if(k===1)idx.push(0,nxt,cur);else idx.push(cur-segs,nxt-segs,cur,nxt-segs,nxt,cur);
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();
    bakeRaw(g,M.water,new T.Matrix4());
  }
  function strip(points,half,colorMid,colorEdge,y=.06) {
    const pos=[],col=[],idx=[],cols=4,a=new T.Color(colorMid),b=new T.Color(colorEdge),c=new T.Color();
    points.forEach((p,i)=>{
      const q=points[Math.min(i+1,points.length-1)],o=points[Math.max(i-1,0)],dx=q[0]-o[0],dz=q[1]-o[1],l=Math.hypot(dx,dz)||1,nx=-dz/l,nz=dx/l,h=typeof half==='function'?half(p):half;
      for(let k=0;k<=cols;k++){const t=k/cols*2-1;pos.push(p[0]+nx*h*t,y,p[1]+nz*h*t);c.copy(a).lerp(b,Math.abs(t)**1.6);col.push(c.r,c.g,c.b);
        if(i<points.length-1&&k<cols){const s=i*(cols+1)+k;idx.push(s,s+cols+1,s+1,s+1,s+cols+1,s+cols+2);}}
    });
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();
    // 确保朝上
    const nm=g.attributes.normal;if(nm.getY(0)<0){g.setIndex(idx.map((v,i)=>i%3===1?idx[i+1]:i%3===2?idx[i-1]:v));g.computeVertexNormals();}
    bakeRaw(g,M.water,new T.Matrix4());
  }
  const riverPts=[];for(let z=-330;z<=330;z+=6)riverPts.push([riverX(z),z]);
  strip(riverPts,p=>riverHalf(p[1])+1.4,'#4b9692','#8cbfa8',.05);
  strip([[CANAL.x0,CANAL.z],[bankX(CANAL.z)+2,CANAL.z]],CANAL.half+.2,'#4f9a92','#86bca6');
  for(const x of ditchX)strip([[x,-46],[x,CANAL.z-1]],.45,'#5a9e93','#8ab9a1',.055),strip([[x,CANAL.z+1],[x,108]],.45,'#5a9e93','#8ab9a1',.055);
  for(const p of plots)if(p.type==='flood')strip([[p.x0+.6,(p.z0+p.z1)/2],[p.x1-.6,(p.z0+p.z1)/2]],(p.z1-p.z0)/2-.6,'#6aa596','#8fb79c',.045);
  // 水体碰撞（站在岸边不会掉进水里）
  for(let x=POOL.x-POOL.rx+1.4;x<POOL.x+POOL.rx-1;x+=2){const t=(x-POOL.x)/POOL.rx;wet(x,POOL.z,1,POOL.rz*Math.sqrt(Math.max(0,1-t*t))*.9);}
  for(let x=CANAL.x0+5;x<bankX(CANAL.z)+1;x+=2.5)if(Math.abs(x-80)>1.6)wet(x,CANAL.z,1.25,CANAL.half);
  for(let z=-112;z<=112;z+=4){const b=Math.min(bankX(z-2),bankX(z+2))+.8;wet((b+114)/2,z,(114-b)/2,2);}

  // —— 金字塔 ——
  const TONE=['#e8d6b0','#dcc69d','#ecdcba','#d7c096','#e3cfa6'];
  function pyramid(x,z,size,height,layers,o={}) {
    zone=o.zone||'pyramids';
    const dy=height/layers,built=o.built??layers,from=Math.min(built,o.casing??layers),half=size/2*(1+1/layers),alpha=Math.atan2(height,size/2),hw=y=>half-size/2*y/height;
    const coreTop=built*dy,core=built<layers?new T.CylinderGeometry(size/2*(1-built/layers)/Math.cos(Math.PI/4)*.98,size/Math.SQRT2*.98,coreTop,4,1):new T.ConeGeometry(size/Math.SQRT2*.98,height,4);
    core.rotateY(Math.PI/4);bake(core,M.vc,'#ae946b',[x,(built<layers?coreTop:height)/2,z]);
    for(let row=0;row<from;row++) {
      const w=size*(1-row/layers),depth=Math.max(.35,size/layers*.7),n=Math.max(1,Math.ceil(w/2.7)),bw=w/n,y=(row+.5)*dy,rowShade=1+(row%2?-.025:.015)-(row<3?.04:0);
      for(let col=0;col<n;col++) {
        const d=-w/2+(col+.5)*bw;
        for(const sign of [-1,1]) {
          for(const side of [0,1]){
            const tint=_c.set(o.tone?o.tone(row,col):TONE[Math.floor(random()*TONE.length)]).multiplyScalar(rowShade*(random()<.06?.9:1)*(1+(random()-.5)*.03)).getHex();
            if(side===0)stamp(G.block,M.vc,[x+d,y,z+sign*(w/2-depth/2)],[bw-.04,dy-.04,depth],[0,0,0],tint);
            else stamp(G.block,M.vc,[x+sign*(w/2-depth/2),y,z+d],[depth,dy-.04,bw-.04],[0,0,0],tint);
          }
        }
      }
    }
    // 碰撞：露出的每级石阶一块（顶面就是台阶面）；光滑外壳与塔尖按斜面分层，站上去不陷脚也不悬空
    for(let row=0;row<from;row++){const h=size*(1-row/layers)/2;solid(x,z,h,h,dy,row*dy);}
    if(from<built)slope(x,z,from*dy,height*(1+1/layers),hw(from*dy),0);
    // 光滑外壳：顶部保留，下缘参差剥落
    const slab=(yaw,along,y0,y1,width,tint)=>{
      const t=.34,yc=(y0+y1)/2,slant=(y1-y0)/Math.sin(alpha),lz=hw(yc)+.03-Math.sin(alpha)*t/2,ly=yc-Math.cos(alpha)*t/2;
      stamp(G.box,M.vc,[x+along*Math.cos(yaw)+lz*Math.sin(yaw),ly,z-along*Math.sin(yaw)+lz*Math.cos(yaw)],[width,slant,t],[alpha-Math.PI/2,yaw,0,'YXZ'],tint);
    };
    if(from<built) {
      const y0=from*dy,apex=height*(1+1/layers),cap=new T.ConeGeometry((hw(y0)+.03)*Math.SQRT2,apex-y0,4);cap.rotateY(Math.PI/4);
      bake(cap,M.vc,o.capTone||'#efe5ca',[x,(y0+apex)/2,z]);
      for(const yaw of [0,Math.PI/2,Math.PI,-Math.PI/2]){
        const span=hw(y0)*2-1.2;let a=-span/2;
        while(a<span/2-1){const w=Math.min(rand(1.6,4.8),span/2-a),rows=Math.floor(random()*4);if(rows>0){const yb=(from-rows)*dy,lim=hw(y0)-.6;const c0=clamp(a+w/2,-lim+w/2,lim-w/2);slab(yaw,c0,yb,y0+.05,w,random()<.5?'#ece0c3':'#e4d6b6');}a+=w;}
      }
    }
    if(o.gold) {
      const ap=height*(1+1/layers),hp=Math.max(1.2,height*.06),g=new T.ConeGeometry((hw(ap-hp)+.07)*Math.SQRT2,hp+.1,4);g.rotateY(Math.PI/4);
      bake(g,M.gold,'#ead08e',[x,ap-hp+(hp+.1)/2,z]);
    }
    if(o.baseCasing)for(const yaw of [0,Math.PI/2,Math.PI,-Math.PI/2]){
      const span=size-6;let a=-span/2;
      while(a<span/2-1){const w=rand(1.4,3.2);if(random()<.3&&!(yaw===0&&o.plazaGap&&Math.abs(a)<o.plazaGap))slab(yaw,a+w/2,0,dy,Math.min(w,span/2-a),o.baseCasing);a+=w+rand(2,7);}
    }
    // 基座平台与堆积的风沙
    stamp(G.box,M.vc,[x,.15,z],[size+2.4,.3,size+2.4],[0,0,0],'#e2d3b2');solid(x,z,size/2+1.2,size/2+1.2,.3);
    for(const yaw of [0,Math.PI/2,Math.PI,-Math.PI/2])for(let k=0;k<(o.drifts??4);k++){
      const along=rand(-size*.45,size*.45);if(yaw===0&&o.plazaGap&&Math.abs(along)<o.plazaGap)continue;
      const l=rand(3,8),lz=size/2+.6;stamp(G.sphLo,M.vc,[x+along*Math.cos(yaw)+lz*Math.sin(yaw),0,z-along*Math.sin(yaw)+lz*Math.cos(yaw)],[l,rand(.35,.75),1.5],[0,yaw,0],'#e4cfa4');
    }
  }
  pyramid(0,-41,68,46,40,{casing:31,gold:true,baseCasing:'#e9dcc0',plazaGap:15,drifts:5});
  pyramid(-70,-64,47,32,29,{casing:22,gold:false,capTone:'#f0e7cf',drifts:4});
  pyramid(68,-74,36,24.5,24,{gold:false,drifts:3,tone:row=>row<5?(random()<.5?'#d3b3a3':'#cdab9c'):TONE[Math.floor(random()*TONE.length)]});
  {const g=new T.ConeGeometry(2.6,2.4,4);g.rotateY(Math.PI/4);zone='pyramids';bake(g,M.vc,'#e8dcc0',[68,24.5+1.15,-74]);slope(68,-74,24.45,26.85,1.84,0);}
  // 王后小金字塔：其中一座仍在施工
  pyramid(46,-49,12,8.5,12,{zone:'queens',casing:9,gold:true,drifts:0});
  pyramid(46,-33.5,12,8.5,12,{zone:'queens',casing:10,gold:true,drifts:0});
  pyramid(46,-18,12,8.5,12,{zone:'queens',built:7,drifts:0});
  zone='queens';
  for(const z of [-49,-33.5]){bake(taper(.92),M.vc,'#e3d2ae',[54,0,z],[3,2.6,4]);bake(G.box,M.vc,'#5b4d3f',[55.55,1,z],[.1,1.6,.8]);solid(54,z,1.5,2,2.6);}

  // —— 施工坡道、石料堆与拖石块的工人 ——
  zone='queens'; // 与王后金字塔同一批，少几次绘制
  const RAMP={x:46,z0:4,z1:-15.5,top:7*8.5/12};
  {
    const shape=new T.Shape([new T.Vector2(0,0),new T.Vector2(RAMP.z0-RAMP.z1,0),new T.Vector2(RAMP.z0-RAMP.z1,RAMP.top)]);
    const g=new T.ExtrudeGeometry(shape,{depth:3.4,bevelEnabled:false});
    bake(g,M.vc,'#bd9f7b',[RAMP.x-1.7,0,RAMP.z0],[1,1,1],[0,Math.PI/2,0],(x,y)=>.92+.08*((Math.floor(y*3.2)+Math.floor(x))%2));
    // 嵌在坡面的木轨枕
    const len=RAMP.z0-RAMP.z1,slope=Math.atan2(RAMP.top,len);
    for(let s=.8;s<len-.3;s+=1.05){const z=RAMP.z0-s,y=s/len*RAMP.top;stamp(G.box,M.vc,[RAMP.x,y+.03,z],[3.1,.1,.26],[slope,0,0],'#8a6a4a');}
    for(let k=0;k<26;k++){const s0=k/26*len,s1=(k+1)/26*len;solid(RAMP.x,RAMP.z0-(s0+s1)/2,1.7,(s1-s0)/2,s1/len*RAMP.top,0,{walkable:true});}
  }
  // 堆放的石块（部分带红色记号）
  for(let i=0;i<16;i++){const gx=i%4,gz=Math.floor(i/4)%2,lv=Math.floor(i/8),x=55.2+gx*1.6,z=8+gz*1.3,y=.45+lv*.9;
    if(lv&&gx===3)continue;stamp(G.box,M.vc,[x,y,z],[1.45,.86,1.15],[0,rand(-.05,.05),0],random()<.5?'#e8dcc0':'#dfd0b0');
    if(random()<.4)stamp(G.box,M.vc,[x,y+.1,z+.58],[.42,.08,.02],[0,0,0],'#b45a43');}
  solid(57.6,8.65,3.3,1.35,1.8);
  for(const [x,z,r] of [[52.5,12.5,.4],[60.5,12,1.2],[51,5,2.6]])stamp(G.box,M.vc,[x,.42,z],[1.4,.84,1.1],[0,r,0],'#e4d7b8'),solid(x,z,.85,.85,.84);
  for(let i=0;i<5;i++){const x=50.2+i*.55,z=14.2;stamp(G.jar,M.vc,[x,0,z],[.42,.48,.42],[0,i,0],'#b5875f');}
  round(51.3,14.2,1.4,.7);

  // —— 主路与金字塔前广场 ——
  zone='paving';
  for(let row=0;row<44;row++)for(let col=0;col<4;col++){const z=58-row*1.5;if(row===0&&(col===0||col===3))continue;if(z<-4)continue;const hv=hash(row*3+11,col*7+5);stamp(G.box,M.vc,[(col-1.5)*2.3+(hv-.5)*.06,.03+(hv-.5)*.016,z],[2.25,.06,1.45],[0,(hv-.5)*.03,0],hv<.12?'#cdb68e':hv>.9?'#ece0c4':((row*7+col*3)%5===0)?'#d6c29d':((row+col)%2?'#e3d4b5':'#dccbaa'));}
  for(const sx of [-1,1]){stamp(G.box,M.vc,[sx*4.85,.08,27],[.5,.16,62],[0,0,0],'#d2bf9b');}
  for(let i=-6;i<=6;i++)for(let j=0;j<9;j++){const x=i*1.8,z=-4.6+j*1.75;if(Math.abs(x)<4.7&&z>-4)continue;stamp(G.box,M.vc,[x,.03,z],[1.74,.06,1.69],[0,0,0],(i+j)%2?'#e0d0b0':'#d8c6a3');}
  // 风吹上石板的沙
  for(let i=0;i<34;i++){const edge=i<20,x=edge?(i%2?1:-1)*rand(3.4,4.6):rand(-3.8,3.8),z=i<10?rand(50,58.5):rand(-2,56);stamp(G.sphMin,M.vc,[x,.03,z],[rand(.8,2.4),.08,rand(.4,1.2)],[0,rand(-.5,.5),0],i%3?'#e0c391':'#d9b983');}
  // 入口一对圆顶石碑，碑面只有抽象色带
  for(const sx of [-1,1]){const x=sx*6.8,z=56.6;stamp(G.box,M.vc,[x,.17,z],[1.3,.34,.8],[0,0,0],'#d8c6a2');stamp(G.box,M.vc,[x,1.12,z],[.9,1.56,.28],[0,0,0],'#e8dcc0');
    stamp(G.cyl,M.vc,[x,1.9,z],[.45,.28,.45],[Math.PI/2,0,0],'#e8dcc0');for(let b=0;b<3;b++)stamp(G.box,M.vc,[x,.85+b*.34,z+.15],[.68,.08,.02],[0,0,0],['#c98a6f','#86a8b2','#d9bf86'][b]);solid(x,z,.65,.4,2.2);}
  // —— 出发点两侧：左边是拖石队的整备场，右边是工匠的面包房与歇脚棚（全部烘焙进同一批网格）——
  const ROPE='#a3814f',MAT='#c8ab6c',MAT_EDGE='#9f8450',WOOD_D='#7a5b3f';
  const coil=(x,z,r=.45)=>{bake(G.cylLo,M.vc,ROPE,[x,.09,z],[r,.18,r]);bake(G.cylLo,M.vc,'#8a6a42',[x,.1,z],[r*.82,.19,r*.82]);bake(G.cylLo,M.vc,'#6a5034',[x,.11,z],[r*.4,.2,r*.4]);};
  const shelter=(x,z,w,d,h,ry=0)=>{
    const c=Math.cos(ry),sn=Math.sin(ry),P=(a,b)=>[x+a*c+b*sn,z-a*sn+b*c];
    for(const [a,b] of [[-w/2+.2,-d/2+.2],[w/2-.2,-d/2+.2],[-w/2+.2,d/2-.2],[w/2-.2,d/2-.2]]){const [px,pz]=P(a,b);bake(G.cylLo,M.vc,WOOD_D,[px,h/2,pz],[.07,h,.07]);round(px,pz,.14,h);}
    bake(G.box,M.vc,MAT,[x,h+.04,z],[w,.08,d],[0,ry,0]);for(const s of [-1,1]){const [px,pz]=P(0,s*d/2);bake(G.box,M.vc,MAT_EDGE,[px,h-.06,pz],[w+.04,.2,.05],[0,ry,0]);}
    for(let i=0;i<5;i++){const [px,pz]=P(-w/2+w*(i+.5)/5,0);bake(G.box,M.vc,MAT_EDGE,[px,h+.09,pz],[.05,.03,d],[0,ry,0]);}
    obstacles.push({x,z,hx:w/2,hz:d/2,ry,base:h-.1,height:.24,walkable:true});blobs.push([x+SUN_DIR[0]*.707*h,z+SUN_DIR[1]*.707*h,w+.5,d+.4,ry,2,.07]);
  };
  {
    // 整备场（出发点左前方）：雪橇和拖石队在演员层里，这里是绳索、撬杠、滚木、带红色记号的石料和记录棚
    const sx0=-9.6,sz0=35.6;
    for(const s of [-1,1]){bakeRaw(G.cylLo,M.vc,between([sx0+s*.55,.05,sz0-1.3],[sx0+s*.7+.3,.05,sz0-3.6],.035),ROPE);bakeRaw(G.cylLo,M.vc,between([sx0+s*.7+.3,.05,sz0-3.6],[sx0+s*.6+.9,.05,sz0-6.4],.035),ROPE);}
    coil(-12.9,30.6);coil(-12.1,29.9,.34);coil(-7.4,39.2,.4);
    for(const [x,z,r] of [[-13.4,39.2,.25],[-13.1,40,.2],[-13.7,40.7,.3]])bake(G.cylLo,M.vc,'#8d6a46',[x,.13,z],[.13,2.6,.13],[0,r,Math.PI/2]);round(-13.4,40,1.3,.4);
    for(const [x,z,r] of [[-11.6,38.9,.9],[-11.1,39.6,1.0]])bake(G.cylLo,M.vc,'#937049',[x,.06,z],[.05,2.2,.05],[0,r,Math.PI/2]);
    const pile=[[-16,31.2,0,1.6,1,1.25],[-16,32.6,0,1.5,1.05,1.2],[-17.7,31.9,0,1.4,.95,1.3],[-16.7,31.9,1,1.5,.9,1.2],[-14.6,34.2,0,1.5,1,1.2]];
    pile.forEach(([x,z,lv,w,h,d],i)=>{const y=lv*1.02+h/2,ry=(i%3-1)*.06;bake(G.block,M.vc,i%3?'#ead9b6':'#e2cda4',[x,y,z],[w,h,d],[0,ry,0]);if(i%2===0)bake(G.box,M.vc,'#b4553f',[x+.2,y+.08,z+d/2+.005],[.5,.09,.02],[0,ry,0]);});
    solid(-16.7,31.9,1.75,1.3,1.02);solid(-16.7,31.9,.75,.62,.92,1.02);solid(-14.6,34.2,.8,.65,1);
    for(let i=0;i<16;i++)bake(G.rock,M.flat,'#efe4cc',[rand(-18.5,-13),.03,rand(29.5,35.5)],[rand(.07,.18),rand(.03,.07),rand(.06,.14)],[0,rand(0,6),0]);
    shelter(-15.8,37.6,3.4,2.4,2.3);
    for(let i=0;i<3;i++)bake(G.jar,M.vc,i%2?'#b98a62':'#c7976b',[-16.9+i*.7,0,38.3],[.42,.5,.42],[0,i,0]);round(-16.2,38.3,1.1,.75);
    bake(G.box,M.vc,'#8f6c4b',[-15,.18,37.2],[.8,.36,.5]);
    // 面包房（出发点右前方）：钟形面包模围着炉火，旁边是啤酒罐、面包筐和粮袋
    shelter(13.2,43.6,4.6,3.2,2.5,.08);
    const hx0=10.9,hz0=39.6;
    for(let i=0;i<7;i++){const a=i/7*TAU;bake(G.rock,M.flat,'#9a8a74',[hx0+Math.cos(a)*.62,.12,hz0+Math.sin(a)*.62],[.24,.18,.2],[0,a,0]);}
    bake(G.cylLo,M.vc,'#4a3b30',[hx0,.04,hz0],[.5,.06,.5]);for(let i=0;i<5;i++)bake(G.sphMin,M.vc,i%2?'#d0663a':'#a8452c',[hx0+Math.cos(i*1.3)*.24,.1,hz0+Math.sin(i*1.3)*.24],[.13,.07,.11]);
    const mold=new T.CylinderGeometry(.11,.26,.46,8);prep(mold);resources.delete(mold);
    for(let i=0;i<5;i++){const a=i/5*TAU+.3;bake(mold,M.vc,'#b4794f',[hx0+Math.cos(a)*.36,.3,hz0+Math.sin(a)*.36],[1,1,1],[Math.sin(a)*.5,0,-Math.cos(a)*.5]);}
    for(let i=0;i<9;i++){const lv=i<5?0:i<8?1:2,k=i<5?i:i<8?i-5:0;bake(mold,M.vc,i%3?'#c08559':'#ad7550',[13.4+k*.48+lv*.24,.23+lv*.4,39.9],[1,1,1],[Math.PI,0,0]);}
    round(hx0,hz0,.85,.3);solid(14.4,39.9,1.3,.35,1.1);
    for(let i=0;i<4;i++)bake(G.jar,M.vc,i%2?'#b98a62':'#a87b55',[14.6+i*.68,0,44.6],[.46,.56,.46],[0,i,0]);solid(15.6,44.6,1.5,.5,.85);
    for(const [x,z] of [[11.4,44.8],[10.6,44.1]]){bake(G.cylLo,M.vc,'#b08d55',[x,.17,z],[.36,.34,.36]);for(let i=0;i<4;i++)bake(G.sphMin,M.vc,'#c98d4e',[x+Math.cos(i*1.6)*.17,.36,z+Math.sin(i*1.6)*.17],[.15,.08,.15]);round(x,z,.4,.4);}
    for(let i=0;i<3;i++){bake(G.sphLo,M.vc,i%2?'#dfcea8':'#d3c19a',[8.9+i*.62,.3,47],[.36,.32,.3],[0,i,0]);bake(G.cylLo,M.vc,'#efe6d0',[8.9+i*.62,.62,47],[.1,.12,.1]);}solid(9.5,47,1.1,.4,.7);
    bake(G.cylLo,M.vc,WOOD_D,[17.2,.6,38.4],[.08,1.2,.08]);round(17.2,38.4,.15,1.2);
    // 石板路边：散落的绳卷、陶罐、木橇板和石屑
    coil(7.4,55.2,.38);bake(G.jar,M.vc,'#b5875f',[8.2,0,57.2],[.38,.44,.38]);bake(G.jar,M.vc,'#a97d58',[8.7,0,56.5],[.3,.36,.3],[.3,1,0]);round(8.4,56.9,.5,.6);
    for(const s of [-1,1])bake(G.box,M.vc,'#8a6a4a',[-7.4+s*.5,.08,47.2],[.16,.16,2.4],[0,.2,0]);bake(G.box,M.vc,'#7a5b3f',[-7.4,.2,47.2],[1.2,.08,.18],[0,.2,0]);
    for(let i=0;i<20;i++){const s=i%2?1:-1;bake(G.rock,M.flat,'#ece2cb',[s*rand(5.6,9),.02,rand(40,63)],[rand(.05,.12),rand(.02,.05),rand(.05,.1)],[0,rand(0,6),0]);}
  }
  // 通往神庙的石板支路
  for(let x=-6;x>-33;x-=1.6)for(let k=-1;k<=1;k++)stamp(G.box,M.vc,[x,.025,12+k*1.25],[1.55,.05,1.2],[0,0,0],(Math.round(x)+k)%2?'#e8dabd':'#e1d1b0');

  // —— 金字塔学习站：分层模型、测量绳与石板覆盖的船坑 ——
  zone='paving'; // 学习站广场与石板路同一批
  const WOOD_C='#8a6a4a',pebbleTmp=G.rock;
  {
    const mx=-7.6,mz=2.4;stamp(G.box,M.vc,[mx,.4,mz],[3.4,.8,3.4],[0,0,0],'#d8c5a0');
    for(let i=0;i<6;i++){const s=3*(1-i/6.4);stamp(G.box,M.vc,[mx,.93+i*.36,mz],[s,.26,s],[0,0,0],i%2?'#efe3c8':'#e2cda4');}
    {const g=new T.ConeGeometry(.42,.42,4);g.rotateY(Math.PI/4);bake(g,M.gold,'#ead08e',[mx,.8+6*.36+.2,mz]);}
    solid(mx,mz,1.7,1.7,.8);for(let i=0;i<6;i++){const s=3*(1-i/6.4)/2;solid(mx,mz,s,s,.36,.8+i*.36);}solid(mx,mz,.22,.22,.3,2.96);
    for(const [x,z] of [[5.8,-1.6],[10.5,-1.6],[10.5,3.6]])stamp(G.cylLo,M.vc,[x,.32,z],[.05,.64,.05],[0,0,0],'#8a6a4a'),round(x,z,.12,.64);
    stamp(G.box,M.vc,[8.15,.55,-1.6],[4.7,.025,.025],[0,0,0],'#b89a6a');stamp(G.box,M.vc,[10.5,.55,1],[.025,.025,5.2],[0,0,0],'#b89a6a');
    // A 字水平仪与铅垂线
    const ax=7.4,az=1.6;for(const s of [-1,1])bakeRaw(G.cylLo,M.vc,between([ax+s*.6,0,az],[ax,1.3,az],.035),'#8a6a4a');
    bakeRaw(G.cylLo,M.vc,between([ax-.35,.55,az],[ax+.35,.55,az],.03),'#8a6a4a');bakeRaw(G.cylLo,M.vc,between([ax,1.28,az],[ax,.42,az],.008),'#5a4a3a');bake(G.sphMin,M.vc,'#7b6248',[ax,.38,az],[.05,.07,.05]);
    round(ax,az,.7,1.3);
    // 船坑盖石
    for(let i=0;i<12;i++)stamp(G.box,M.vc,[-27+i*1.05,.22,-4.4],[1,.44,2.3],[0,0,rand(-.02,.02)],i%3?'#e3d4b4':'#d9c8a6');
    stamp(G.box,M.vc,[-13.8,.55,-3.6],[1,.44,2.3],[.35,0,.1],'#e3d4b4');stamp(G.box,M.vc,[-14.85,.08,-4.4],[1,.12,2.1],[0,0,0],'#5a4a3d');
    solid(-21,-4.4,6.4,1.2,.44);
    // 石匠在修整石块：雪橇上的石料、碎屑、木槌与水罐
    stamp(G.box,M.vc,[8.8,.62,6],[1.9,1.05,1.3],[0,.12,0],'#e9ddc2');for(const s of [-1,1])stamp(G.box,M.vc,[8.8+s*.5,.08,6],[.14,.16,2.2],[0,.12,0],WOOD_C);
    stamp(G.box,M.vc,[11.8,.45,4.2],[1.6,.9,1.2],[0,-.3,0],'#e3d5b6');stamp(G.box,M.vc,[12.02,.4,4.8],[.4,.5,.02],[0,-.3,0],'#b45a43');
    solid(8.8,6,1.2,1.1,1.2);solid(11.8,4.2,1,.9,.9);
    for(let i=0;i<26;i++)stamp(pebbleTmp,M.flat,[rand(7.2,12.8),.03,rand(3.4,8.6)],[rand(.05,.14),rand(.03,.06),rand(.05,.12)],[0,rand(0,6),0],'#efe6d2');
    for(const [x,z,r] of [[7.6,7.9,.4],[10.6,7.6,-.6]]){stamp(G.cylLo,M.vc,[x,.09,z],[.09,.22,.09],[Math.PI/2,r,0],'#8f6d4c');stamp(G.cylLo,M.vc,[x+.16,.05,z],[.02,.32,.02],[0,0,Math.PI/2],WOOD_C);}
    stamp(G.jar,M.vc,[12.6,0,7.4],[.42,.46,.42],[0,0,0],'#b5875f');round(12.6,7.4,.35,.66);
    // 靠在第一层台阶上的木梯，台阶上有人在测量
    const ladderA=[15.2,0,-5.4],ladderB=[15.2,4.4,-9.2];for(const s of [-.32,.32])bakeRaw(G.cylLo,M.vc,between([ladderA[0]+s,0,ladderA[2]],[ladderB[0]+s,ladderB[1],ladderB[2]],.05),WOOD_C);
    for(let i=1;i<9;i++){const t=i/9;bakeRaw(G.cylLo,M.vc,between([ladderA[0]-.32,ladderB[1]*t,lerp(ladderA[2],ladderB[2],t)],[ladderA[0]+.32,ladderB[1]*t,lerp(ladderA[2],ladderB[2],t)],.03),WOOD_C);}
  }

  // —— 斯芬克斯（面朝学习站），与雕凿出的岩石围槽 ——
  zone='sphinx';
  {
    const sx=29,sz=16,O=(x,y,z)=>[sx+x,y,sz+z];
    const body='#dcc49e',head='#e6d2ad',stripeA='#ecdcb8',stripeB='#c4a274',rock='#c9b089';
    // 石灰岩层理：硬层略亮、软层略暗，近地面风蚀更深
    const strata=(x,y)=>.9+.1*smooth(-.35,.35,Math.sin(y*2.3))-(y<1.2?.06*(1-y/1.2):0);
    bake(G.box,M.vc,rock,O(0,.35,0),[12.6,.7,22],[0,0,0],strata);blobs.push([sx+2.6,sz-1.5,6.4,19,0,2,.72]);solid(sx,sz,6.3,11,.7);
    const TORSO=[[-9.5,2.0,.5,.6],[-8.9,2.3,2.1,1.8],[-7.3,2.6,2.95,2.35],[-5,2.65,2.75,2.35],[-2.5,2.85,2.55,2.5],[0,3.1,2.7,2.85],[2,3.55,2.8,3.25],[3.4,3.9,2.45,3.35],[4.3,3.95,1.75,3.1],[4.95,4.0,1.35,2.7],[5.35,3.95,.6,1.7]];
    const LEG=[[.6,2.3,1.25,1.8],[3.5,1.4,1.05,1.0],[6,1.08,.95,.8],[8.5,1,1.1,.72],[9.9,.92,1.05,.6],[10.5,.84,.5,.32]];
    const torso=loft(TORSO.map(([t,y,w,h])=>({t,y,w,h,p:t>1?2.7:2.5})),{seg:16});
    bakeRaw(torso,M.vc,compose(O(0,0,0),[1,1,1],[0,0,0]),body,strata);
    for(const s of [-1,1]){
      bake(G.sph,M.vc,body,O(s*2.2,3.3,2.5),[1.15,2.0,1.8],[0,0,0],strata);
      bake(G.sph,M.vc,body,O(s*2.55,2.2,-6.2),[1,1.75,2.6],[0,0,0],strata);
      bake(G.sph,M.vc,body,O(s*2.85,.95,-2.7),[.85,.55,1.7],[0,0,0],strata);
      const leg=loft(LEG.map(([t,y,w,h])=>({t,y,x:s*2.05,w,h,p:2.4})),{seg:14});
      bakeRaw(leg,M.vc,compose(O(0,0,0),[1,1,1],[0,0,0]),body,strata);
      for(let k=0;k<4;k++)bake(G.sphLo,M.vc,'#d5ba90',O(s*2.05+(k-1.5)*.5,.82,10.15),[.24,.3,.42]);
    }
    // 尾巴绕在右侧后腿旁
    const tail=new T.TubeGeometry(new T.CatmullRomCurve3([[-1.6,.95,-9.2],[-2.8,.85,-8.4],[-3.5,.85,-6.3],[-3.55,.95,-4.2],[-3.2,1.05,-3.2]].map(p=>new T.Vector3(...O(...p)))),24,.2,7);
    prep(tail);resources.delete(tail);bakeRaw(tail,M.vc,new T.Matrix4(),body);
    // 胸、颈与头：头部稍前移，胸口抬高包住脖子，头巾两翼向肩部展开
    const hz=4.2,F=(x,y,dz)=>O(x,y,hz+dz);
    bake(G.cyl,M.vc,body,F(0,7.3,-.6),[1.05,1.0,1.0]);
    bake(G.sph,M.vc,head,F(0,8.35,0),[1.12,1.24,1.12]);
    bake(G.sph,M.vc,head,F(0,7.62,.55),[.58,.36,.48]);
    bake(G.box,M.vc,'#dfc49b',F(0,8.15,1.15),[.24,.44,.26],[-.32,0,0]);bake(G.sphLo,M.vc,'#dfc49b',F(0,7.95,1.27),[.19,.1,.12]);
    bake(G.box,M.vc,'#e9d4ad',F(0,8.74,1.07),[1.2,.1,.12]);bake(G.box,M.vc,stripeB,F(0,9.04,.98),[1.9,.16,.22]);
    for(const s of [-1,1]){bake(G.sphLo,M.vc,'#8a7152',F(s*.4,8.55,1.09),[.2,.075,.05]);bake(G.sphLo,M.vc,head,F(s*1.1,8.38,.67),[.17,.4,.24]);}
    bake(G.box,M.vc,'#b99068',F(0,7.74,1.01),[.46,.055,.06]);
    const nemes=[],prof=[[9.95,.95,1.0,-.2],[9.55,1.3,1.32,-.25],[8.95,1.36,1.32,-.4],[8.35,1.42,1.28,-.65],[7.6,2.2,1.12,-.45],[6.95,2.65,.98,-.5],[6.3,2.8,.85,-.55]];
    for(let y=9.95;y>=6.3-1e-6;y-=.1625){let k=0;while(k<prof.length-2&&prof[k+1][0]>y)k++;const a=prof[k],b=prof[k+1],t=(a[0]-y)/(a[0]-b[0]);
      const band=Math.floor((9.95-y)/.325+.001)%2?stripeB:stripeA,sec={t:y,w:lerp(a[1],b[1],t),h:lerp(a[2],b[2],t),z:lerp(a[3],b[3],t),p:2.6,c:band};nemes.push(sec,{...sec,c:band===stripeA?stripeB:stripeA,t:y-.0001});}
    nemes.pop();nemes.reverse();
    bakeRaw(loft(nemes,{axis:'y',seg:18}),M.vc,compose(F(0,0,0),[1,1,1],[0,0,0]));
    bake(G.sph,M.vc,stripeA,F(0,9.25,-.25),[1.28,.82,1.38]);
    for(const s of [-1,1])for(let i=0;i<8;i++)bake(G.box,M.vc,i%2?stripeB:stripeA,F(s*1.32,7.3-i*.3,.75+i*.05),[.52,.3,.34],[.08,0,s*.04]);
    bake(G.cyl,M.vc,'#d8b77e',F(0,9.08,1.06),[.16,.42,.14]);bake(G.sphLo,M.vc,'#d8b77e',F(0,9.33,1.13),[.14,.12,.13]);
    bake(G.cyl,M.vc,stripeB,F(0,6.6,-1.7),[.32,1.7,.32],[.35,0,0]);
    // 碰撞贴着造型：身体每 0.9 m 一段（中间高、两侧低），前腿、后胯、头巾两翼和头部分层，能站在背上和头顶
    const at=(arr,t,k)=>{let i=0;while(i<arr.length-2&&arr[i+1][0]<t)i++;const a=arr[i],b=arr[i+1];return lerp(a[k],b[k],clamp((t-a[0])/(b[0]-a[0]),0,1));};
    for(let t=-9.5;t<5.3;t+=.9){const m=Math.min(t+.45,5.3),y=at(TORSO,m,1),w=at(TORSO,m,2),h=at(TORSO,m,3);solid(sx,sz+m,w*.55,.45,y+h*.96);solid(sx,sz+m,w*.86,.45,y+h*.72);}
    for(const s of [-1,1]){
      for(let t=.6;t<10.4;t+=1.2){const m=Math.min(t+.6,10.5),y=at(LEG,m,1),w=at(LEG,m,2),h=at(LEG,m,3);solid(sx+s*2.05,sz+m,w*.85,.6,y+h*.9);}
      solid(sx+s*2.55,sz-6.2,.8,2,3.7);
    }
    solid(sx,sz+3.7,2.35,1,1.3,6.1);solid(sx,sz+3.8,1.4,1.5,1.5,7.4);solid(sx,sz+3.95,1.2,1.25,1.05,8.9);
    // 岩石围槽（只围住身后与两侧后半，前方开阔）
    for(const [x,z,w,d,h] of [[0,-11.6,21,2.2,3],[-10.2,-6,1.9,13,2.6],[10.2,-6,1.9,13,2.6],[-10.2,2.5,1.9,4,1.6],[10.2,2.5,1.9,4,1.6]]) {
      for(let l=0;l<3;l++)bake(G.box,M.flat,l%2?'#d6be95':'#ccb187',O(x+rand(-.15,.15),h*(l+.5)/3,z),[w-l*.25,h/3+.02,d-l*.2],[0,rand(-.01,.01),0]);
      for(let k=0;k<2;k++)stamp(G.rock,M.flat,O(x+rand(-w/2,w/2)*.8,h-.05,z+rand(-d/2,d/2)*.8),[rand(.5,.9),rand(.25,.45),rand(.5,.8)],[rand(0,.3),rand(0,3),0],'#d3bb92');
      solid(sx+x,sz+z,w/2,d/2,h);
    }
  }

  // —— 河谷神庙：殿堂、棕榈柱柱廊、星空天花板、彩色浮雕带、方尖碑 ——
  zone='temple';
  {
    const st=(x,y)=>.95+.05*smooth(-.4,.4,Math.sin(y*1.7+x*.1));
    bake(taper(.94,.97),M.vc,'#e4d3b0',[-56,0,12],[12,7.4,24],[0,0,0],st);boxShadow(-56,12,12,24.5,8.5);boxShadow(-45.3,12,8.8,22.2,8.3);solid(-56,12,6,12,7.4);
    bake(G.box,M.vc,'#8fb0b2',[-56,7.55,12],[11.6,.32,23.6]);bake(G.box,M.vc,'#cf9577',[-56,7.86,12],[11.6,.3,23.6]);
    bake(G.box,M.vc,'#efe4c8',[-56,8.25,12],[12.5,.48,24.5]);solid(-56,12,6.25,12.25,1.09,7.4);
    // 殿门、门框与带翼日轮
    bake(G.box,M.vc,'#efe2c4',[-49.95,2.2,12],[.36,4.4,3.5]);bake(G.box,M.vc,'#5e4f40',[-49.72,1.85,12],[.12,3.7,2.2]);
    bake(G.cyl,M.gold,'#e8cf8c',[-49.7,4.9,12],[.36,.08,.36],[0,0,Math.PI/2]);
    for(const s of [-1,1])bake(G.box,M.vc,'#7fa3b4',[-49.72,4.92,12+s*.95],[.08,.22,1.3],[s*-.08,0,0]);
    // 柱廊
    const cap=new T.CylinderGeometry(1,.56,1.25,16,2,true);{const p=cap.attributes.position;for(let i=0;i<p.count;i++){const a=Math.atan2(p.getZ(i),p.getX(i)),k=1+.13*Math.cos(a*8)*(p.getY(i)+.625)/1.25;p.setX(i,p.getX(i)*k);p.setZ(i,p.getZ(i)*k);}cap.computeVertexNormals();}
    prep(cap);
    for(const x of [-47,-43])for(let k=0;k<6;k++) {
      const z=2.5+k*3.8;
      stamp(G.cyl,M.vc,[x,.15,z],[.95,.3,.95],[0,0,0],'#ddcba6');
      stamp(G.cyl,M.vc,[x,2.9,z],[.6,5.2,.6],[0,0,0],'#ebdcbb');
      for(let b=0;b<3;b++)stamp(G.cyl,M.vc,[x,5.2+b*.16,z],[.62,.09,.62],[0,0,0],['#c98a6f','#86a8b2','#d9bf86'][b]);
      stamp(cap,M.vc,[x,6.1,z],[1,1,1],[0,0,0],'#c9c493');
      stamp(G.box,M.vc,[x,6.88,z],[1.3,.3,1.3],[0,0,0],'#e7d8b6');
      round(x,z,.8,7.1);
    }
    for(const x of [-47,-43])bake(G.box,M.vc,'#e9dbbb',[x,7.43,12],[1.35,.8,21.4]);
    bake(G.box,M.vc,'#e8d9b8',[-45.3,8.05,12],[8.8,.5,22.2]);bake(G.box,M.vc,'#86a7b9',[-45.3,7.79,12],[8.6,.04,21.8]);
    for(let i=0;i<34;i++)stamp(G.box,M.vc,[-45.3+rand(-4,4),7.76,12+rand(-10.5,10.5)],[.2,.02,.2],[0,Math.PI/4,0],'#f2dfa2');
    solid(-45.3,12,4.4,11.1,.5,7.8);
    // 两侧墙与浮雕色带（抽象纹样，不是文字）
    for(const z of [.45,23.55]) {
      const out=z<12?-1:1;bake(taper(.96,.9),M.vc,'#e2d1ad',[-45.2,0,z],[10,7.8,1.1],[0,0,0],st);solid(-45.2,z,5,.55,7.8);
      for(let i=0;i<12;i++){const x=-49.8+i*.82;bake(G.box,M.vc,['#c98a6f','#86a8b2','#d9bf86','#94b08a'][i%4],[x,4.9,z+out*.5],[.74,.6,.06]);bake(G.box,M.vc,['#d9bf86','#c98a6f'][i%2],[x,.75,z+out*.53],[.74,.45,.06]);}
      bake(G.box,M.vc,'#7fa0ae',[-45.2,5.32,z+out*.49],[9.9,.1,.07]);bake(G.box,M.vc,'#7fa0ae',[-45.2,4.48,z+out*.51],[9.9,.1,.07]);
    }
    // 方尖碑（粉红花岗岩）与殿前坐像
    for(const z of [6.4,17.6]) {
      bake(G.box,M.vc,'#d9c7a3',[-37.4,.5,z],[2,1,2]);bake(G.box,M.vc,'#e6d6b6',[-37.4,1.05,z],[1.5,.1,1.5]);bake(taper(.56),M.vc,'#e2cdbd',[-37.4,1.1,z],[.95,8.4,.95],[0,0,0],(x,y)=>1-.03*Math.sin(y*3));
      const g=new T.ConeGeometry(.38,.7,4);g.rotateY(Math.PI/4);bake(g,M.gold,'#ead08e',[-37.4,9.85,z]);
      solid(-37.4,z,1,1,1.1);blobs.push([-37.4+SUN_DIR[0]*3.4,z+SUN_DIR[1]*3.4,7.6,1.1,SUN_RY,0,.07]);slope(-37.4,z,1.1,9.5,.46,.28,2.1);slope(-37.4,z,9.5,10.2,.25,0,.35);
    }
    const throne=kit(k=>{
      k.add(G.box,'#6f6b62',[0,.75,-.1],[1.3,1.5,1.5]).add(G.box,'#6f6b62',[0,.15,.4],[1.3,.3,2.2]);
      k.add(G.box,'#75716a',[0,1.75,-.25],[.62,1.1,.5]).add(G.box,'#75716a',[0,1.6,.15],[.6,.3,.9]);
      for(const s of [-1,1])k.add(G.box,'#75716a',[s*.2,.9,.55],[.22,1.2,.24]).add(G.box,'#75716a',[s*.3,1.6,.2],[.16,.2,.65]);
      k.add(G.sphLo,'#7b776f',[0,2.55,-.22],[.26,.3,.26]).add(G.box,'#827d74',[0,2.6,-.28],[.68,.5,.36]).add(G.box,'#827d74',[0,2.85,-.25],[.48,.2,.44]);
    });
    for(const z of [9.1,14.9]){stamp(throne,M.vc,[-48.8,0,z],[1,1,1],[0,Math.PI/2,0]);solid(-48.6,z,.9,.75,3);}
    // 殿前石板
    for(let i=0;i<5;i++)for(let j=0;j<12;j++)stamp(G.box,M.vc,[-40.2+i*1.7,.025,2.3+j*1.75],[1.65,.05,1.7],[0,0,0],(i+j)%2?'#e8dabd':'#e0d0ae');
  }

  // —— 书吏营地：遮阳棚、坐姿书吏、记录板、粮袋、谷仓 ——
  zone='camp';
  const camp={x:-37.5,z:33};
  {
    for(const x of [-41.6,-37.5,-33.4])for(const z of [30.3,35.7]){stamp(G.cylLo,M.vc,[x,1.68,z],[.1,3.36,.1],[0,0,0],'#8a6a4a');round(x,z,.18,3.4);}
    const aw=new T.PlaneGeometry(9.6,6.2,12,8);aw.rotateX(-Math.PI/2);
    {const p=aw.attributes.position,c=[],cc=new T.Color();for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),edge=Math.min(4.8-Math.abs(x),3.1-Math.abs(z));p.setY(i,-.28*Math.cos(x/4.8*Math.PI/2)*Math.cos(z/3.1*Math.PI/2));cc.set(edge<.35?'#7fb0a8':edge<.6?'#d9b27a':'#f3ead3');c.push(cc.r,cc.g,cc.b);}aw.setAttribute('color',new T.Float32BufferAttribute(c,3));aw.computeVertexNormals();}
    bakeRaw(aw,M.cloth,compose([camp.x,3.42,camp.z],[1,1,1],[0,0,0]));blobs.push([camp.x+SUN_DIR[0]*2.4,camp.z+SUN_DIR[1]*2.4,10,6.6,0,2,.07]);solid(camp.x,camp.z,4.8,3.1,.3,3.12);
    stamp(G.box,M.vc,[camp.x,.02,camp.z],[8.4,.03,4.8],[0,0,0],'#cdb683');
    for(const s of [-1,1]){bake(G.box,M.two,'#7fb0a8',[camp.x,3.2,camp.z+s*3.08],[9.5,.4,.03]);bake(G.box,M.two,'#d9b27a',[camp.x,2.98,camp.z+s*3.08],[9.5,.06,.035]);}
    for(const [x,z] of [[-39.8,32.3],[-35.6,32.1]]){stamp(G.box,M.vc,[x,.22,z+.75],[.9,.36,.5],[0,0,0],'#8f6c4b');stamp(G.cylLo,M.vc,[x-.2,.44,z+.75],[.05,.5,.05],[0,0,Math.PI/2],'#efe4c4');stamp(G.box,M.vc,[x+.25,.42,z+.72],[.3,.03,.1],[0,.2,0],'#5d4e3e');}
    stamp(G.box,M.vc,[-41.3,.35,32.4],[.8,.7,.6],[0,0,0],'#7f5f42');for(let i=0;i<4;i++)stamp(G.cylLo,M.vc,[-41.5+i*.14,.75,32.4],[.06,.55,.06],[Math.PI/2,0,0],'#efe3c2');
    solid(-41.3,32.4,.45,.35,.75);
    // 记录板：网格表示“日期、材料、数量、记录人”四列，记号只是计数刻痕
    const bx=-34.6,bz=38.5;
    for(const s of [-1,1]){stamp(G.cylLo,M.vc,[bx+s*1.15,1.05,bz],[.06,2.1,.06],[0,0,0],'#7f5f42');}
    stamp(G.box,M.vc,[bx,1.42,bz],[2.4,1.4,.08],[0,0,0],'#ecdfbf');stamp(G.box,M.vc,[bx,1.42,bz-.02],[2.55,1.55,.06],[0,0,0],'#8a6a4a');
    for(let c=1;c<4;c++)stamp(G.box,M.vc,[bx-1.2+c*.6,1.42,bz+.05],[.025,1.36,.01],[0,0,0],'#6b5d4a');
    for(let r=1;r<5;r++)stamp(G.box,M.vc,[bx,.72+r*.28,bz+.05],[2.36,.022,.01],[0,0,0],'#6b5d4a');
    stamp(G.box,M.vc,[bx,1.96,bz+.05],[2.36,.2,.01],[0,0,0],'#c98a6f');
    for(let r=0;r<3;r++)for(let c=0;c<4;c++)for(let m=0;m<1+((r*3+c*5)%4);m++)stamp(G.box,M.vc,[bx-1.05+c*.6+m*.08,1.14+r*.28,bz+.06],[.025,.16,.01],[0,0,0],c===2?'#b45a43':'#3f3a33');
    solid(bx,bz,1.3,.15,2.2);
    // 粮袋、石块、储水罐
    const sack=kit(k=>{k.add(G.sphLo,'#ffffff',[0,.3,0],[.36,.32,.3]).add(G.cylLo,'#efe6d0',[0,.62,0],[.1,.12,.1]).add(new T.ConeGeometry(.14,.16,6),'#ffffff',[0,.74,0]);});
    for(let i=0;i<9;i++){const lv=i<5?0:i<8?1:2,k=i<5?i:i<8?i-5:0,x=-25.6+k*.78+lv*.39,y=.42+lv*.62;stamp(sack,M.vc,[x,y-.3,33.6],[1,1,1],[0,rand(-.4,.4),rand(-.08,.08)],random()<.5?'#dfcea8':'#d3c19a');}
    solid(-24,33.6,2.1,.6,1.6);
    for(const [x,z,r] of [[-22.2,36.8,.1],[-22.6,38.4,-.15],[-22.4,37.6,0]]){stamp(G.box,M.vc,[x,.45,z],[1.35,.9,.85],[0,r,0],'#e6d9ba');stamp(G.box,M.vc,[x,.5,z+.43],[.4,.07,.02],[0,0,0],'#b45a43');}
    stamp(G.box,M.vc,[-22.4,1.3,37.6],[1.2,.8,.8],[0,.2,0],'#e0d2b2');solid(-22.4,37.6,.85,1.3,1.7);
    for(let i=0;i<5;i++){const x=-41.5+i*.95,z=38;stamp(G.jar,M.vc,[x,0,z],[.55,.6,.55],[0,i,0],i%2?'#b98a62':'#c49870');round(x,z,.42,.86);}
    // 谷仓：抹白的圆顶粮仓
    for(const [x,z] of [[-47.5,30.6],[-51.6,30.6],[-47.5,34.8],[-51.6,34.8]]){
      bake(G.cyl,M.vc,'#ded0b4',[x,1.3,z],[1.6,2.6,1.6]);bake(G.sph,M.vc,'#e6dac2',[x,2.6,z],[1.6,1.3,1.6]);bake(G.box,M.vc,'#6e5b47',[x,3.3,z+.95],[.5,.4,.3],[.6,0,0]);bake(G.box,M.vc,'#6e5b47',[x+1.42,.55,z],[.2,.7,.6]);
      round(x,z,1.65,2.6);slope(x,z,2.6,3.9,1.55,.5,.43,'round');blob(x,z,3.2,3.2,3.9,.43);
    }
    stamp(G.box,M.vc,[-49.5,.2,32.7],[7.4,.4,7.6],[0,0,0],'#cdb995');
  }

  // —— 工匠村落：泥砖房、屋顶凉棚、面包炉 ——
  zone='village';
  {
    const tones=['#cfb58f','#c6a984','#d8c29d','#bfa07c','#d2b892'];
    for(const [rz,door] of [[37.4,1],[50.4,-1],[66,-1],[80.2,-1]]) {
      let x=-98+rand(0,2);
      while(x<-63) {
        const w=rand(4.8,7.2),d=rand(5,6.4),h=rand(2.8,3.6),cx=x+w/2,cz=rz+rand(-.4,.4),tone=tones[Math.floor(random()*tones.length)];
        if(cx+w/2>-60)break;
        bake(taper(.97,.97),M.vc,tone,[cx,0,cz],[w,h,d],[0,0,0],(x,y)=>.93+.07*Math.min(1,y/1.2));
        for(const [px,pz,sx,sz] of [[0,d/2-.12,w,.24],[0,-d/2+.12,w,.24],[w/2-.12,0,.24,d],[-w/2+.12,0,.24,d]])bake(G.box,M.vc,tone,[cx+px*.97,h+.17,cz+pz*.97],[sx*.97,.34,sz*.97]);
        bake(G.box,M.vc,'#55463a',[cx+rand(-w/4,w/4),.95,cz+door*(d/2*.985)],[.95,1.9,.12]);
        if(random()<.7)bake(G.box,M.vc,'#55463a',[cx+rand(-w/3,w/3),h-.7,cz+door*(d/2*.975)],[.5,.32,.1]);
        if(random()<.5){const ax=cx+rand(-.8,.8),az=cz+rand(-.6,.6);bake(G.box,M.two,'#b39b67',[ax,h+1.45,az],[2.6,.08,2.2]);for(const s of [-1,1])for(const t of [-1,1])stamp(G.cylLo,M.vc,[ax+s*1.1,h+.75,az+t*.9],[.05,1.4,.05],[0,0,0],'#8a6a4a');solid(ax,az,1.3,1.1,.12,h+1.37);}
        if(random()<.35){bake(G.sph,M.vc,'#c9ad86',[cx+w/2+.9,0,cz+door*(d/2+.9)],[.85,.75,.85]);bake(G.box,M.vc,'#4e4034',[cx+w/2+.9,.3,cz+door*(d/2+.9)+door*.75],[.35,.3,.1]);round(cx+w/2+.9,cz+door*(d/2+.9),.9,.8);}
        if(random()<.5)for(let k=0;k<2;k++)stamp(G.jar,M.vc,[cx-w/2+.6+k*.7,0,cz+door*(d/2+.5)],[.38,.42,.38],[0,k,0],'#b98a62');
        // 平屋顶可站，四周矮墙单独一圈
        solid(cx,cz,w/2,d/2,h+.03);boxShadow(cx,cz,w,d,h);for(const [px,pz,sx,sz] of [[0,d/2-.12,w,.24],[0,-d/2+.12,w,.24],[w/2-.12,0,.24,d],[-w/2+.12,0,.24,d]])solid(cx+px*.97,cz+pz*.97,sx*.97/2,sz*.97/2,.34,h);
        const back=cz-door*d/2,r=random();
        if(r<.32){for(let k=0;k<3;k++){const sh=h*(k+1)/3.2;bake(G.box,M.vc,tone,[cx-w/2+.7+k*.85,sh/2,back-door*.5],[.85,sh,.95],[0,0,0],(x,y)=>.9+.08*Math.min(1,y/1.2));solid(cx-w/2+.7+k*.85,back-door*.5,.425,.475,sh);}}
        else if(r<.62){const yd=2.6,zc=back-door*yd/2;for(const [px,pz,sx,sz] of [[0,-door*yd/2,w-.2,.3],[-w/2+.25,0,.3,yd],[w/2-.25,0,.3,yd]]){bake(G.box,M.vc,tone,[cx+px,.65,zc+pz],[sx,1.3,sz]);solid(cx+px,zc+pz,sx/2,sz/2,1.3);}
          stamp(G.jar,M.vc,[cx+rand(-w/4,w/4),0,zc],[.4,.45,.4],[0,0,0],'#b98a62');}
        if(random()<.3)bake(G.box,M.vc,'#d9c37f',[cx+rand(-.6,.6),h+.05,cz+rand(-.8,.8)],[rand(1.4,2.2),.04,rand(1,1.6)]);
        x+=w+rand(1.2,2.6);
      }
    }
  }

  // —— 马斯塔巴墓群 ——
  zone='mastabas';
  for(let r=0;r<3;r++)for(let c=0;c<4;c++) {
    const x=-97+c*10.5+rand(-.6,.6),z=-32+r*8.6,w=rand(7,8.6),d=rand(4.6,5.6),h=rand(3,3.9);
    bake(taper(.86,.8),M.vc,random()<.5?'#e0cba5':'#d9c39b',[x,0,z],[w,h,d],[0,0,0],(x,y)=>.94+.06*smooth(-.3,.3,Math.sin(y*2.2)));
    bake(G.box,M.vc,'#ead9b7',[x,h+.07,z],[w*.86+.1,.14,d*.8+.1]);
    bake(G.box,M.vc,'#efe2c4',[x+w*.43*.92,1.05,z],[.18,2.1,1.15]);bake(G.box,M.vc,'#5e4f40',[x+w*.43*.92+.06,1,z],[.1,1.6,.5]);
    // 墓室外墙向内收：分三层碰撞，顶面就是屋顶石板
    boxShadow(x,z,w,d,h);for(let l=0;l<3;l++){const y=l<2?(l+.5)/3:.9;solid(x,z,w/2*(1-.14*y),d/2*(1-.2*y),l<2?h/3:h/3+.14,h*l/3);}
    stamp(G.sphLo,M.vc,[x-w/2-.4,0,z+rand(-1,1)],[rand(1.5,3),rand(.6,1),1.3],[0,Math.PI/2,0],'#e3cda1');
  }

  // —— 植物：组件 ——
  // 羽状叶：中脉两侧各一条 V 形下折的叶带，叶缘分段错落，叶尖更亮
  const frond=(len,droop,k)=>{
    const v=[],col=[],idx=[],sp=t=>[0,Math.sin(t*Math.PI*.9)*droop-t*t*droop*.95,t*len],wid=t=>Math.sin(Math.PI*Math.min(1,t*1.08+.04))*len*.13+.03;
    const vert=(p,t)=>{v.push(...p);const g=.78+.3*t;col.push(g,g,g);return v.length/3-1;};
    for(let i=0;i<k;i++){const t=i/k,tt=(i+1)/k,a=sp(t),b=sp(tt);
      for(const s of [-1,1]){const wa=wid(t)*(i%2?.62:1),wb=wid(tt)*(i%2?1:.62);
        const A=vert(a,t),B=vert(b,tt),C=vert([s*wb,b[1]-wb*.42,b[2]+len*.035],tt),D=vert([s*wa,a[1]-wa*.42,a[2]+len*.035],t);
        idx.push(A,B,C,A,C,D);}}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();return own(g);
  };
  const frondHi=frond(4.9,1.3,16),frondLo=frond(4.6,1.2,6);resources.delete(frondHi);resources.delete(frondLo);
  function palmKit(h,lean,fronds,lo=false) {
    return kit(k=>{
      const segs=lo?4:9,trunk=[];
      for(let i=0;i<=segs;i++){const t=i/segs,x=lean*t*t;trunk.push({t:t*h,x,z:0,w:(.36-.12*t)*(i%2?1:1.06),h:(.36-.12*t)*(i%2?1:1.06),p:2,c:i%2?'#9c7c58':'#b08e66'});}
      k.raw(loft(trunk,{axis:'y',seg:lo?5:7}),new T.Matrix4());
      const top=[lean,h,0];
      for(let j=0;j<fronds;j++){const a=j/fronds*TAU+(j%2)*.2,tilt=(j%3===0?.6:j%3===1?.28:-.12)+(lo?.1:0),c=j%5===0?'#a9a96c':j%2?'#7f9d60':'#93ad6c';
        k.raw(lo?frondLo:frondHi,compose(top,[1,1,1],[tilt,a,0,'YXZ']),c);}
      if(!lo)for(let j=0;j<5;j++)k.add(G.sphMin,'#c58b4c',[lean+Math.cos(j*1.3)*.32,h-.55-(j%2)*.2,Math.sin(j*1.3)*.32],[.2,.32,.2]);
      k.add(G.sphLo,'#8e7a52',[lean,h-.1,0],[.42,.4,.42]);
    });
  }
  const PALMS=[palmKit(8.6,.7,18),palmKit(10.4,1.6,19),palmKit(6.6,.35,16)],PALM_FAR=palmKit(9,.8,8,true);
  // 低画质换成少分段的叶片和树干（同样的位置和朝向），三角形约为高画质的三分之一
  const PALMS_LO=[palmKit(8.6,.7,15,true),palmKit(10.4,1.6,16,true),palmKit(6.6,.35,13,true)];
  Object.assign(PALM_FAR.userData,{noShadow:true,thin:.45});
  const PALM_SHAPE=[[8.6,.7],[10.4,1.6],[6.6,.35]];
  // 树干两段（随倾斜偏移），树冠中心一块可站立的圆台
  function palm(x,z,v=Math.floor(random()*3),s=rand(.86,1.12)){zone='palms';const yaw=random()*TAU,[h,lean]=PALM_SHAPE[v],ox=Math.cos(yaw)*lean*s,oz=-Math.sin(yaw)*lean*s;
    stamp(PALMS[v],M.palm,[x,0,z],[s,s,s],[0,yaw,0]);round(x+ox*.08,z+oz*.08,.42*s,h*s*.5);round(x+ox*.5,z+oz*.5,.36*s,h*s*.5-.5,h*s*.5);round(x+ox,z+oz,1.5*s,.8,h*s-.55,{canopy:true});
    const H=h*s;blobs.push([x+ox+SUN_DIR[0]*.707*H,z+oz+SUN_DIR[1]*.707*H,5.4*s,5*s,yaw,1,.07]);blobs.push([x+(ox+SUN_DIR[0]*.707*H)*.5,z+(oz+SUN_DIR[1]*.707*H)*.5,.707*H,.5*s,SUN_RY,0,.07]);}
  const papyrus=kit(k=>{
    for(let i=0;i<11;i++){const a=i*2.4,r=.12+(i%4)*.09,h=1.8+((i*7)%5)*.32,lean=.12+(i%3)*.06,tx=Math.cos(a)*(r+h*lean),tz=Math.sin(a)*(r+h*lean);
      k.limb([Math.cos(a)*r,0,Math.sin(a)*r],[tx,h,tz],.025,'#6f9a55',{g:G.cylLo});
      k.add(new T.ConeGeometry(.3,.34,7,1,true),'#a9c27a',[tx,h+.12,tz],[1,-1,1],[Math.cos(a)*.3,0,Math.sin(a)*.3]);}
  },{flags:{noShadow:true,thin:.42}});
  const reeds=kit(k=>{
    for(let i=0;i<14;i++){const a=i*2.1,r=.1+(i%3)*.12,h=1.1+(i%5)*.28,bx=Math.cos(a)*r,bz=Math.sin(a)*r;
      k.raw(new T.ConeGeometry(.035,h,3,1,true).translate(0,h/2,0),compose([bx,0,bz],[1,1,1],[Math.sin(a)*.18,0,-Math.cos(a)*.18]),i%4?'#8ea064':'#a7ad72');}
    for(let i=0;i<3;i++)k.add(G.sphMin,'#d9cfae',[Math.cos(i*2)*.2,1.75+i*.1,Math.sin(i*2)*.2],[.06,.22,.06]);
  },{flags:{noShadow:true,thin:.4}});
  const tuft=kit(k=>{for(let i=0;i<7;i++){const a=i*.9,h=.35+(i%3)*.12;k.raw(new T.ConeGeometry(.03,h,3,1,true).translate(0,h/2,0),compose([Math.cos(a)*.08,0,Math.sin(a)*.08],[1,1,1],[Math.sin(a)*.5,0,-Math.cos(a)*.5]),i%2?'#b9ad7c':'#a59c6a');}},{flags:{noShadow:true,thin:.4}});
  const shrub=kit(k=>{for(let i=0;i<4;i++)k.add(G.rock,i%2?'#93996a':'#a3a676',[Math.cos(i*1.7)*.35,.3+(i%2)*.15,Math.sin(i*1.7)*.35],[.45,.38,.45],[i,i*2,0]);},{flags:{thin:.6}});
  const sycamore=kit(k=>{
    k.limb([0,0,0],[.2,2.4,0],.32,'#8c7356').limb([.2,2.2,0],[1.2,3.4,.4],.18,'#8c7356').limb([.1,2.2,0],[-1,3.3,-.4],.18,'#8c7356');
    for(const [x,y,z,s,c] of [[0,4,0,2.1,'#7f9a5e'],[1.5,3.7,.6,1.6,'#90aa68'],[-1.4,3.6,-.5,1.6,'#748f56'],[.3,3.5,-1.4,1.5,'#88a262'],[-.4,3.6,1.4,1.5,'#94ad6c'],[.6,4.9,.2,1.4,'#9bb373']])k.add(G.sph,c,[x,y,z],[s,s*.78,s]);
  });
  const acacia=kit(k=>{
    k.limb([0,0,0],[.3,2.2,0],.14,'#7d6a52').limb([.3,2,0],[1.4,3.1,.3],.09,'#7d6a52').limb([.3,2,0],[-.9,3.2,-.2],.09,'#7d6a52').limb([.3,2.1,0],[.2,3.3,-1],.08,'#7d6a52');
    for(const [x,z,s] of [[1.2,.3,1.5],[-.8,-.2,1.4],[.2,-.9,1.3],[.3,.8,1.2]])k.add(G.sphLo,'#8f9b63',[x,3.35,z],[s,.32,s]);
  });
  // 棕榈：水池、引水渠、河岸、营地与出发点附近
  for(const [x,z,v] of [[47.6,34.6,0],[52.6,32.4,1],[60,33.2,2],[66.5,34.6,0],[72.4,39.6,1],[71,52.6,0],[64,57.2,2],[56.6,58.6,1],[49.4,56.6,0],[37.5,61.5,2],
    [-11.5,47,1],[12,49.5,0],[-14,57,2],[-43.5,41.6,0],[-44,27.5,1],[-34,27,2],[-63,20,0],[-63.5,4,1],[-18,40,2],[20.5,40.5,0],[-58,63.5,1],[-58,72,0],[-58,86,2],[61,24,1],[62.5,-4,0],[61.5,-30,2],[86,58,1],[84,62,0]])palm(x,z,v);
  for(let z=-108;z<108;z+=rand(6,13)){const b=bankX(z);if(Math.abs(z-CANAL.z)<6||Math.abs(z-53)<6)continue;palm(b-rand(3,7),z,Math.floor(random()*3));}
  zone='far';
  for(let i=0;i<110;i++){const z=rand(-280,280),side=i%3,x=side?riverX(z)+riverHalf(z)+rand(3,45):bankX(z)-rand(2,14);if(side===0&&Math.abs(z)<112)continue;const s=rand(.8,1.2);stamp(PALM_FAR,M.palm,[x,terrainY(x,z),z],[s,s,s],[0,random()*TAU,0]);}
  zone='trees';
  for(const [x,z] of [[27,61],[70,61],[-56,46],[-88,58],[66,29],[88,-40]]){stamp(sycamore,M.vc,[x,0,z],[1,1,1],[0,random()*TAU,0]);blobs.push([x+SUN_DIR[0]*3,z+SUN_DIR[1]*3,6,5,SUN_RY,0,.07]);round(x,z,.55,3);round(x,z,2.5,2.1,3.3,{canopy:true});round(x,z,1.3,.6,5.4,{canopy:true});}
  for(const [x,z] of [[-22,74],[26,82],[-58,98],[78,-102],[-20,-14],[16,96],[-104,30]]){if(!open(x,z,3))continue;const s=rand(.9,1.2);stamp(acacia,M.vc,[x,0,z],[s,s,s],[0,random()*TAU,0]);blobs.push([x+SUN_DIR[0]*2.3*s,z+SUN_DIR[1]*2.3*s,5*s,4.2*s,SUN_RY,0,.07]);round(x,z,.3*s,3.05*s);round(x,z,2.1*s,.62*s,3.05*s,{canopy:true});}
  // 纸莎草、芦苇、睡莲
  zone='marsh';
  for(let i=0;i<46;i++){const a=rand(-2.35,2.35)+(random()<.15?Math.PI:0);if(Math.cos(a)<-.75)continue;const e=poolEdge(a)*rand(.98,1.1),x=POOL.x+Math.cos(a)*POOL.rx*e,z=POOL.z+Math.sin(a)*POOL.rz*e;const s=rand(.8,1.25);stamp(papyrus,M.reed,[x,0,z],[s,s,s],[0,random()*TAU,0]);}
  for(let i=0;i<22;i++){const a=rand(0,TAU);if(Math.cos(a)<-.6)continue;const e=poolEdge(a)*rand(1.02,1.16);stamp(reeds,M.reed,[POOL.x+Math.cos(a)*POOL.rx*e,0,POOL.z+Math.sin(a)*POOL.rz*e],[1,rand(.8,1.2),1],[0,random()*TAU,0]);}
  for(let x=CANAL.x0+3;x<bankX(CANAL.z);x+=rand(1.6,3.2))for(const s of [-1,1])if(random()<.75&&Math.abs(x-80)>2.5)stamp(random()<.6?papyrus:reeds,M.reed,[x,0,CANAL.z+s*(CANAL.half+rand(.1,.6))],[.8,rand(.7,1.05),.8],[0,random()*TAU,0]);
  for(let z=-110;z<=110;z+=rand(1.4,3)){if(Math.abs(z-CANAL.z)<3||(z>48&&z<58))continue;const x=bankX(z)+rand(-.6,1.6),s=rand(.85,1.3);stamp(random()<.55?papyrus:reeds,M.reed,[x,0,z],[s,s,s],[0,random()*TAU,0]);}
  const pad=prep(new T.CircleGeometry(1,9,.3,TAU-.6).rotateX(-Math.PI/2),{noShadow:true,thin:.5}),flower=kit(k=>{k.add(G.sphMin,'#f3dc8c',[0,.05,0],[.05,.04,.05]);for(let i=0;i<7;i++){const a=i/7*TAU;k.add(G.sphMin,'#ffffff',[-Math.cos(a)*.07,.08,Math.sin(a)*.07],[.035,.1,.06],[0,a,.6,'YXZ']);}},{flags:{noShadow:true}});
  for(let i=0;i<54;i++){const a=rand(0,TAU),f=Math.sqrt(random())*.86,x=POOL.x+Math.cos(a)*POOL.rx*f,z=POOL.z+Math.sin(a)*POOL.rz*f,s=rand(.28,.55);stamp(pad,M.two,[x,.085,z],[s,1,s],[0,random()*TAU,0],random()<.5?'#6f9a5a':'#86a868');
    if(i%4===0)stamp(flower,M.vc,[x+.12,.09,z],[1.4,1.4,1.4],[0,random()*TAU,0],i%8?'#f6f1e8':'#b2c4e6');}
  // 沙漠里的岩石、草丛、骆驼刺
  zone='desert';
  const busy=(x,z,r=0)=>!open(x,z,r)||(Math.abs(x)<7&&z>-8&&z<64)||(x<-30&&x>-102&&z>-2&&z<88)||(x<-46&&x>-94&&z<-38)||(Math.abs(x)<37&&z<-5)||(x>16&&x<40&&z>2&&z<30)||(x>38&&x<62&&z<16&&z>-58)||x>58||(Math.abs(x)<12&&z>-6&&z<11)||(x<-62&&x>-104&&z<-6&&z>-38)||(x>48&&x<88&&z<-54);
  for(let i=0;i<150;i++){const x=rand(-106,58),z=rand(-106,106),s=rand(.25,1.1);if(busy(x,z,s+1))continue;stamp(G.rock,M.flat,[x,s*.3,z],[s*1.25,s*.62,s],[rand(0,1),rand(0,6),rand(0,1)],random()<.5?'#d6c3a0':'#c9b38e');if(s>.55)round(x,z,s*1.2,s*.9);}
  for(let i=0;i<340;i++){const x=rand(-108,62),z=rand(-108,108);if(busy(x,z,.5)&&!(x>58&&x<63))continue;const s=rand(.7,1.4);stamp(tuft,M.crop,[x,0,z],[s,s,s],[0,random()*TAU,0]);}
  for(let i=0;i<60;i++){const x=rand(-106,60),z=rand(-106,106);if(busy(x,z,1))continue;const s=rand(.6,1.2);stamp(shrub,M.flat,[x,0,z],[s,s*.8,s],[0,random()*TAU,0]);}
  const pebble=prep(new T.DodecahedronGeometry(1,0),{noShadow:true,thin:.3});
  for(let i=0;i<700;i++){const x=rand(-108,62),z=rand(-108,108);if((Math.abs(x)<5.4&&z>-6&&z<61)||plotAt(x,z)||eraDefinition.stations.some(s=>Math.hypot(x-s.x,z-s.z)<2.2||Math.hypot(x-s.x,z-s.z-3.3)<2))continue;
    if((x<-36&&x>-63&&z>-2&&z<26)||(x<-58&&z>30&&z<86&&x>-102)||(Math.abs(x)<36&&z<-5)||(x>18&&x<40&&z>3&&z<28)||(x<-44&&x>-95&&z<-40))continue;
    const s=rand(.06,.22);stamp(pebble,M.flat,[x,s*.25,z],[s*1.3,s*.6,s],[rand(0,2),rand(0,6),0],random()<.5?'#cdb995':'#bfa883');}
  // 外围岩石台地（层状砂岩）
  for(const [cx,cz,n] of [[-101,96,5],[-104,12,4],[-34,104,4],[38,104,4],[-104,-64,5],[-60,-104,4]]) {
    for(let i=0;i<n;i++){const x=cx+rand(-5,5),z=cz+rand(-4,4),w=rand(3,7),d=rand(3,6),h=rand(1.6,4.5);
      for(let l=0;l<3;l++){const rx=rand(-.03,.03),ry=rand(0,3),rz=rand(-.03,.03);bake(G.box,M.flat,l%2?'#d9c19a':'#cbb089',[x,h*(l+.5)/3,z],[w*(1-l*.12),h/3+.02,d*(1-l*.1)],[rx,ry,rz]);
        solid(x,z,w*(1-l*.12)/2,d*(1-l*.1)/2,h/3,h*l/3,{ry});}}
  }

  // —— 农田：作物行、田埂 ——
  zone='fields';
  const cropRow=kit(k=>{for(let i=0;i<9;i++){const z=-1+i*.25+((i*7)%3)*.03;for(let j=0;j<3;j++){const h=.42+((i+j)%3)*.08,a=j*2.1+i;k.raw(new T.ConeGeometry(.035,h,3,1,true).translate(0,h/2,0),compose([Math.cos(a)*.07,0,z+Math.sin(a)*.05],[1,1,1],[Math.sin(a)*.3,0,-Math.cos(a)*.3]));}}},{flags:{noShadow:true,thin:.45}});
  const veg=kit(k=>{for(let i=0;i<5;i++)k.add(G.sphMin,'#ffffff',[0,.12,-.8+i*.4],[.16,.14,.16]);},{flags:{noShadow:true,thin:.45}});
  for(const p of plots) {
    const along=p.type==='flax'||p.type==='veg'?'x':'z',tint={emmer:'#b8b874',barley:'#d6c98b',flax:'#8fac7c',veg:'#7da35f'}[p.type];
    if(tint){const span=along==='z'?p.x1-p.x0:p.z1-p.z0,len=along==='z'?p.z1-p.z0:p.x1-p.x0;
      for(let r=.7;r<span-.5;r+=.85)for(let s=1.2;s<len-.8;s+=2.05){const x=along==='z'?p.x0+r:p.x0+s,z=along==='z'?p.z0+s:p.z0+r;stamp(p.type==='veg'?veg:cropRow,M.crop,[x,0,z],[1,rand(.85,1.1),1],[0,along==='z'?0:Math.PI/2,0],tint);}}
    for(const [x,z,sx,sz] of [[(p.x0+p.x1)/2,p.z0,p.x1-p.x0,.5],[p.x0,(p.z0+p.z1)/2,.5,p.z1-p.z0]])stamp(G.box,M.vc,[x,.06,z],[sx,.14,sz],[0,0,0],'#ab9671');
  }
  // 引水渠上的小木桥
  stamp(G.box,M.vc,[80,.16,CANAL.z],[2.4,.12,4.2],[0,0,0],'#8f6d4c');for(const s of [-1,1])stamp(G.box,M.vc,[80+s*1.1,.42,CANAL.z],[.1,.5,4.2],[0,0,0],'#7a5b3f');

  // —— 码头：石砌河埠、石料、系船柱 ——
  zone='fields'; // 码头并入农田批次
  {
    const qx=bankX(53)-2.4;stamp(G.box,M.vc,[qx,.2,53],[5.2,.4,8.4],[0,0,0],'#d8c7a4');stamp(G.box,M.vc,[qx-3.1,.1,53],[1.2,.2,6],[0,0,0],'#cfbd99');
    solid(qx,53,2.6,4.2,.4,0,{walkable:true});solid(qx-3.1,53,.6,3,.2,0,{walkable:true});
    for(let i=0;i<6;i++)stamp(G.box,M.vc,[qx-1+(i%3)*1.25,.85,50.6+Math.floor(i/3)*1.1],[1.15,.85,.95],[0,rand(-.1,.1),0],'#ece1c6');solid(qx+.25,51.15,2,1.2,1.3,0);
    for(const z of [49.6,56.4])stamp(G.cylLo,M.vc,[qx+2.2,.75,z],[.14,.7,.14],[0,0,0],'#7a5b3f');
    // 栈桥（水池西岸）
    for(let i=0;i<9;i++)stamp(G.box,M.vc,[47.6+i*.62,.3,49],[.56,.08,1.7],[0,0,rand(-.03,.03)],i%2?'#9b7652':'#8d6a48');
    for(const x of [48,50.4,52.6])for(const s of [-1,1])stamp(G.cylLo,M.vc,[x,.1,49+s*.82],[.07,.5,.07],[0,0,0],'#6f5339');
  }

  // —— 生活：人物、驴、船、鸟 ——
  zone='life';
  const SKIN='#b27c58',SKIN_F='#cba077',LINEN='#f3ebd7',WIG='#3d3532',WOOD='#8a6a4a';
  function personKit(type) {
    return kit(k=>{
      const fem=type==='woman'||type==='jarWoman',skin=fem?SKIN_F:SKIN,seat=type==='scribe',lean={hauler:.42,bender:1.0}[type]||0;
      const H=seat?.32:.86,Lc=Math.cos(lean),Ls=Math.sin(lean);
      const U=(x,y,z=0)=>{const yy=y-.86;return [x,H+yy*Lc-z*Ls,z*Lc+yy*Ls];};
      const S=(c,p,s,o={})=>k.add(o.g||G.sphLo,c,p,s,o.r||[lean,0,0],o);
      if(seat){
        for(const s of [-1,1]){k.limb([s*.1,.16,0],[s*.36,.13,.3],.075,skin);k.limb([s*.36,.11,.3],[-s*.08,.1,.44],.065,skin);}
        k.add(new T.CylinderGeometry(.17,.3,1,8),LINEN,[0,.22,.12],[1,.2,1]);
      }else for(const s of [-1,1]){const sw={swing:s,pivot:.86};k.limb([s*.085,.86,0],[s*.085,.06,0],.058,skin,sw);k.add(G.box,'#7a5a40',[s*.085,.03,.05],[.09,.06,.2],[0,0,0],sw);}
      if(fem)k.add(new T.CylinderGeometry(.165,.25,1,9),LINEN,[0,.68,0],[1,1.24,.84]);
      else if(type==='priest'||type==='official')k.add(new T.CylinderGeometry(.165,.22,1,9),LINEN,[0,.52,0],[1,.8,.86]);
      else if(!seat)k.add(new T.CylinderGeometry(.165,.23,1,9),LINEN,[0,.74,0],[1,.36,.86]);
      if(!seat)k.add(G.box,'#e6dbc2',U(0,.72,.15),[.12,.3,.04],[lean,0,0]);
      k.add(new T.CylinderGeometry(.205,.16,1,9),fem?LINEN:skin,U(0,1.13),[1,.46,.74],[lean,0,0]);
      k.add(G.cylLo,'#d8c9a2',U(0,.92),[.16,.04,.12],[lean,0,0]);
      for(const s of [-1,1])S(skin,U(s*.19,1.32),[.08,.08,.08],{g:G.sphMin});
      const arms={hauler:[[.15,1.12,.5],[.15,1.12,.5]],bender:[[.08,.95,.38],[.12,.92,.4]],scribe:[[.16,1.0,.32],[.1,.98,.36]],porter:[[.22,1.62,-.02],[.24,.9,.05]],jarWoman:[[.12,1.74,0],[.24,.9,.05]],yoke:[[.4,1.42,.05],[.4,1.42,.05]],official:[[.24,.9,.04],[.25,1.0,.2]]}[type]||[[.24,.9,.04],[.24,.9,.04]];
      for(const s of [-1,1]){const h=arms[s<0?0:1],sw=(type==='man'||type==='worker'||type==='woman'||type==='priest')?{swing:-s*.7,pivot:1.32}:{};
        k.limb(U(s*.2,1.32),U(s*h[0],h[1],h[2]),.045,skin,sw);k.add(G.sphMin,skin,U(s*h[0],h[1],h[2]),[.05,.05,.05],[0,0,0],sw);}
      k.limb(U(0,1.34),U(0,1.44),.06,skin);
      k.add(G.sphLo,skin,U(0,1.57,.01),[.165,.172,.158],[lean,0,0]);
      const cap=['worker','hauler','bender','porter','yoke'].includes(type);
      if(cap)S('#efe6cf',U(0,1.625,-.015),[.172,.135,.17]);
      else if(fem){S(WIG,U(0,1.6,-.03),[.185,.18,.18]);k.add(G.box,WIG,U(0,1.4,-.1),[.32,.4,.12],[lean,0,0]);for(const s of [-1,1])k.add(G.box,WIG,U(s*.15,1.38,.06),[.07,.34,.09],[lean,0,0]);}
      else if(type!=='priest')S(WIG,U(0,1.615,-.02),[.176,.155,.17]);
      if(['official','priest','woman','scribe','jarWoman'].includes(type)){k.add(G.cylLo,'#7fa8a0',U(0,1.37),[.21,.035,.16],[lean,0,0]);k.add(G.cylLo,'#d8b56a',U(0,1.345),[.22,.02,.17],[lean,0,0]);}
      if(type==='official')k.limb([.27,0,.2],[.27,1.8,.2],.022,WOOD);
      if(type==='porter')S('#e3d7b8',U(-.17,1.52,-.02),[.2,.15,.3]);
      if(type==='jarWoman')k.add(G.jar,'#b98a62',U(0,1.74),[.19,.21,.19]);
      if(type==='yoke'){k.limb(U(-.8,1.4),U(.8,1.4),.025,WOOD);for(const s of [-1,1]){k.limb(U(s*.76,1.4),U(s*.76,.75),.008,'#5a4a3a');k.add(G.jar,'#b98a62',U(s*.76,.4),[.2,.26,.2]);}}
      if(type==='bender')k.limb(U(.1,.92,.4),[.12,.05,1.05],.025,WOOD);
      if(type==='scribe'){k.add(G.cylLo,'#efe5c4',[0,.4,.32],[.05,.46,.05],[0,0,Math.PI/2]);k.add(G.box,'#efe5c4',[0,.41,.38],[.4,.01,.2]);}
    },{actor:true});
  }
  const P={};for(const t of ['man','worker','woman','priest','official','scribe','hauler','bender','porter','jarWoman','yoke'])P[t]=personKit(t);
  const donkey=kit(k=>{
    const g='#9a8f82',pale='#d8cebe',dark='#4d443d';
    k.raw(loft([[-.64,.8,.1,.12],[-.52,.82,.21,.24],[-.12,.8,.24,.27],[.3,.83,.23,.26],[.5,.86,.17,.21],[.6,.9,.08,.1]].map(([t,y,w,h])=>({t,y,w,h,c:g})),{seg:10}),new T.Matrix4());
    k.add(G.sphLo,pale,[0,.66,-.05],[.2,.12,.5]);
    k.limb([0,.95,.45],[0,1.22,.72],.1,g).add(G.sphLo,g,[0,1.2,.86],[.1,.12,.23],[.5,0,0]).add(G.sphLo,pale,[0,1.1,1.0],[.08,.08,.09]);
    for(const s of [-1,1])k.add(G.sphLo,g,[s*.06,1.42,.76],[.035,.17,.05],[-.3,0,s*.25]).add(G.sphMin,dark,[s*.07,1.56,.74],[.03,.05,.04]);
    k.add(G.box,dark,[0,1.1,.6],[.04,.26,.3],[.75,0,0]);
    for(const [x,z,sw] of [[.13,.42,1],[-.13,.42,-1],[.13,-.45,-1],[-.13,-.45,1]]){k.limb([x,.78,z],[x,.06,z],.045,g,{swing:sw,pivot:.78});k.add(G.cylLo,dark,[x,.04,z],[.05,.08,.05],[0,0,0],{swing:sw,pivot:.78});}
    k.limb([0,.88,-.62],[0,.45,-.72],.025,g).add(G.sphMin,dark,[0,.42,-.73],[.05,.1,.05]);
    k.add(G.box,'#c4a26e',[0,1.06,0],[.5,.06,.6]);
    for(const s of [-1,1])k.add(new T.CylinderGeometry(.2,.16,1,8),'#b39260',[s*.33,.86,0],[1,.38,1.1]).add(G.sphLo,'#e3d7b8',[s*.33,1.05,0],[.17,.08,.2]);
  },{actor:true});
  // 静态人物
  const life=[
    ['scribe',-39.8,31.4,0],['scribe',-35.6,31.2,-.2],['official',-34.4,32.6,.5],['man',-24.6,31.6,-2.2],['porter',-26.6,35.4,2.6],
    ['bender',55.4,6.8,-.6],['bender',58.6,10.2,2.8],['official',53.8,13.9,-2.2],['worker',45.2,-16.8,0,RAMP.top],['worker',47.2,-19.3,2.5,RAMP.top],
    ['priest',-38.8,12,1.57],['woman',-37,20.4,-1.2],['bender',-70.5,41.6,.3],['woman',-84,47,3.1],['man',-79.5,41.3,0],
    ['jarWoman',46.4,39.6,1.2],['bender',68.5,-8,1],['bender',78.5,14,-2],['man',70.5,22.3,.4],['bender',66.5,72,.8],['worker',86.9,51.8,1.3,.2],['worker',87.2,54.5,-1.4,.2],
    ['man',-7.6,53,1.14],['woman',-6.4,53.5,-2],['worker',58.8,13.2,3.6]
  ];
  for(const [t,x,z,yaw,y] of life){actor(P[t],M.actor,x,z,yaw,{y:y||0,s:rand(.94,1.05)});if(!y)blob(x,z,.6,.5,1.6);}
  actor(donkey,M.actor,-25.6,30.2,-.9);actor(donkey,M.actor,88.5,57.8,2.6);
  // 行走的人与驴
  const routes={
    causeway:makePath([[6.2,46],[6.2,24],[-6.2,24],[-6.2,46]]),
    caravan:makePath([[-44,45],[-64,44.6],[-101,44.2],[-101.5,59.2],[-64,59.6],[-47,54]]),
    street:makePath([[-62,73.6],[-97,73.6],[-97,74.6],[-62,74.6]]),
    ditch:makePath([[73.1,-38],[73.1,36],[73.4,36],[73.4,-38]]),
    quay:makePath([[bankX(53)-3.4,50.4],[bankX(53)-.6,52.4],[bankX(53)-1.2,55.6],[bankX(53)-3.8,54.4]]),
    camp:makePath([[-27.4,34.6],[-23.8,36.4],[-27.4,38.6],[-31,36.4]])
  };
  const walk=(kitG,route,speed,s0,o={})=>movers.push({kind:'path',it:actor(kitG,M.actor,0,0,0,{walk:o.walk??1,s:o.s||rand(.95,1.04)}),path:route,speed,s0,dy:o.y||0,turn:o.turn||0});
  walk(P.priest,routes.causeway,.9,0);walk(P.woman,routes.causeway,.9,2.2);walk(P.man,routes.causeway,1.05,24);walk(P.porter,routes.causeway,1,40);walk(P.jarWoman,routes.causeway,.85,58);
  walk(P.man,routes.caravan,1.1,0);for(let i=0;i<3;i++)walk(donkey,routes.caravan,1.1,-1.8-i*2.1,{walk:1.2});
  walk(P.jarWoman,routes.street,.8,0);walk(P.yoke,routes.ditch,.75,10);walk(P.porter,routes.quay,.8,0,{y:.4});walk(P.worker,routes.quay,.8,6,{y:.4});walk(P.porter,routes.camp,.7,3);
  function plazaLife(){
    actor(P.bender,M.actor,8.9,7.7,Math.PI*.95);actor(P.worker,M.actor,12.2,5.9,-1.9);
    actor(P.official,M.actor,13.4,-9.95,.3,{y:4.6});actor(P.worker,M.actor,-9.4,-8.25,.2,{y:2.3});
  }
  // 拖运石块的队伍：雪橇、石块、浇水润滑的人；工人与绳子跟随路径
  plazaLife();
  const sledKit=kit(k=>{
    for(const s of [-1,1])k.add(G.box,WOOD,[s*.55,.1,0],[.16,.2,2.6]).add(G.box,WOOD,[s*.55,.2,1.25],[.16,.16,.4],[-.5,0,0]);
    for(let i=0;i<4;i++)k.add(G.box,'#7a5b3f',[0,.23,-.9+i*.6],[1.3,.08,.16]);
    k.add(G.box,'#ebdfc3',[0,.78,-.1],[1.25,1.05,1.75]).add(G.box,'#b45a43',[.63,.85,0],[.02,.08,.5]);
    k.raw(P.man,compose([0,1.3,.75],[1,1,1],[0,0,0]));k.add(G.jar,'#b5875f',[.15,2.35,1.15],[.16,.2,.16],[1.9,0,0]);
  },{actor:true});
  const sledPath=makePath([[57.5,12.8],[52,8.6],[46.4,6.4],[RAMP.x,RAMP.z0,0],[RAMP.x,RAMP.z1,RAMP.top],[RAMP.x,-19.6,RAMP.top]],false);
  const sled={it:actor(sledKit,M.actor,0,0,0),crew:[],ropes:[]};
  for(let i=0;i<6;i++)sled.crew.push({it:actor(P.hauler,M.actor,0,0,0,{walk:.7}),side:i%2?.62:-.62,ahead:2.6+Math.floor(i/2)*1.25});
  sled.crew.push({it:actor(P.official,M.actor,0,0,0,{walk:.6}),side:1.8,ahead:.6});
  // 出发点两侧的静态人物：整备场的拖石队、书吏和挑水人；面包房的工匠与驴
  actor(sledKit,M.actor,-9.6,35.6,Math.PI);solid(-9.6,35.6,.8,1.35,1.32);
  for(const [t,x,z,yaw] of [['official',-11.8,34.4,1.2],['worker',-8.4,31.4,-2.5],['man',-10.6,30.2,2.6],['hauler',-8.2,29.2,Math.PI],['hauler',-9.6,28.6,Math.PI],['bender',-9.1,32.6,Math.PI],['scribe',-15.4,36.9,1.57],['yoke',-8.1,40.9,2.9],
    ['woman',10.1,40.4,2.3],['bender',11.9,38.8,-1.1],['man',13.6,44.2,-2.9],['worker',12.5,45.2,2.8],['jarWoman',16.2,46.2,-1.9]]){actor(P[t],M.actor,x,z,yaw,{s:rand(.95,1.04)});blob(x,z,.6,.5,1.6);}
  actor(donkey,M.actor,17.8,38.9,2.5);
  const ropeG=prep(new T.CylinderGeometry(.025,.025,1,4),{noShadow:true});
  for(const side of [-.62,.62])sled.ropes.push({it:actor(ropeG,M.vc,0,0,0),side});
  // 船：古王国式的高窄方帆船、划桨船、纸莎草小舟、运石驳船
  const hull=(len,w,rise,c)=>loft([[-len*.52,.48+rise,.1,.1],[-len*.45,.48+rise*.55,w*.25,.22],[-len*.36,.62,w*.65,.38],[-len*.18,.5,w*.95,.46],[0,.48,w,.48],[len*.18,.5,w*.95,.46],[len*.36,.62,w*.65,.38],[len*.45,.48+rise*.5,w*.27,.22],[len*.52,.48+rise*.9,.1,.1]].map(([t,y,ww,h])=>({t,y,w:ww,h,top:.06,p:2.2,c})),{seg:14});
  const crewMan=(k,x,z,yaw=0,y=.55)=>k.raw(P.man,compose([x,y,z],[1,1,1],[0,yaw,0]));
  const sailBoat=kit(k=>{
    k.raw(hull(11,1.45,1.3,'#a27652'),new T.Matrix4());k.add(G.box,'#c9a979',[0,.58,0],[2.1,.06,7.6]);
    for(const s of [-1,1])k.limb([s*.55,.6,.6],[0,7.3,.6],.07,'#7a5b3f');k.limb([-.4,3,.6],[.4,3,.6],.05,'#7a5b3f');
    const sail=new T.PlaneGeometry(3.6,5.3,4,6);{const p=sail.attributes.position;for(let i=0;i<p.count;i++)p.setZ(i,.45*Math.cos(p.getX(i)/1.8*Math.PI/2)*Math.cos(p.getY(i)/2.65*Math.PI/2));sail.computeVertexNormals();}
    k.raw(sail,compose([0,4.45,.9],[1,1,1],[0,0,0]),'#f2ead6');
    k.add(G.cylLo,'#7a5b3f',[0,7.12,.85],[.06,3.9,.06],[0,0,Math.PI/2]).add(G.cylLo,'#7a5b3f',[0,1.8,.85],[.05,3.9,.05],[0,0,Math.PI/2]);
    k.limb([0,7.3,.6],[0,1.3,5.1],.012,'#5a4a3a').limb([0,7.3,.6],[0,1.4,-4.6],.012,'#5a4a3a');
    for(const s of [-1,1])k.limb([s*.55,1.9,-4.2],[s*.95,-.1,-5.7],.05,'#7a5b3f');
    k.add(G.box,'#9b7a55',[0,1.05,-2.3],[1.5,.9,1.7]).add(G.box,'#efe4c8',[0,1.55,-2.3],[1.7,.08,1.9]);
    crewMan(k,.3,-3.8,Math.PI);crewMan(k,-.4,2.6,0);crewMan(k,.5,-1.2,1.2);
  },{flags:{}});
  const rowBoat=kit(k=>{
    k.raw(hull(10,1.35,1.1,'#9c7150'),new T.Matrix4());k.add(G.box,'#c4a474',[0,.58,0],[1.9,.06,6.8]);
    k.add(G.cylLo,'#7a5b3f',[0,1.35,0],[.07,6.5,.07],[Math.PI/2,0,0]);for(const z of [-2.6,2.6])k.limb([0,.6,z],[0,1.35,z],.05,'#7a5b3f');
    for(let i=0;i<5;i++)for(const s of [-1,1]){const z=-2.2+i*1.1;k.limb([s*1.1,.75,z],[s*2.6,-.1,z-.5],.03,'#7a5b3f');crewMan(k,s*.55,z,0,.25);}
    for(const s of [-1,1])k.limb([s*.5,1.7,-3.6],[s*.85,-.1,-5.1],.05,'#7a5b3f');
  });
  const skiff=kit(k=>{
    const bands=[];for(let i=0;i<=10;i++){const t=i/10*2-1;bands.push({t:t*2.1,y:.32+Math.pow(Math.abs(t),3)*.6,w:.42*(1-Math.pow(Math.abs(t),2.2))+.06,h:.2*(1-Math.abs(t)*.5)+.04,c:i%2?'#a9a466':'#c2b97a'});}
    k.raw(loft(bands,{seg:9}),new T.Matrix4());k.raw(P.man,compose([0,.42,-.3],[1,1,1],[0,.5,0]));k.limb([.2,.9,-.1],[.6,2.8,.6],.02,WOOD);
  });
  const barge=kit(k=>{
    k.raw(hull(12,2.2,.6,'#9a7050'),new T.Matrix4());k.add(G.box,'#c2a273',[0,.6,0],[3.6,.06,9]);
    for(let i=0;i<6;i++)k.add(G.box,'#ece2c8',[(i%2-.5)*1.5,1.1,-3+Math.floor(i/2)*2.4],[1.3,.95,1.6]);
  });
  const boat=(g,lane,z0,speed,s=1)=>movers.push({kind:'river',it:actor(g,M.two,0,0,0,{s}),lane,z0,speed});
  boat(sailBoat,-8,-40,1.6);boat(sailBoat,4,120,1.3,1.1);boat(rowBoat,-2,60,-1.9);boat(rowBoat,9,-170,-1.6);boat(skiff,-14.5,-10,.35);boat(sailBoat,12,-250,1.4);
  actor(barge,M.two,bankX(53)+3.2,53,0,{y:0});actor(skiff,M.two,54.6,51,1.9,{y:-.22});
  // 鸟：成群的朱鹭、盘旋的隼；水边站立的朱鹭
  const ibis=kit(k=>{
    k.add(G.sphLo,'#f2efe8',[0,0,0],[.13,.11,.32]).limb([0,.03,.25],[0,.05,.62],.03,'#f2efe8').add(G.sphMin,'#2f2d2a',[0,.06,.68],[.06,.06,.08]);
    k.limb([0,.05,.7],[0,-.08,1.05],.012,'#2f2d2a').limb([0,-.02,-.25],[0,-.04,-.62],.012,'#4a4038');
    for(const s of [-1,1]){const w=new T.BufferGeometry();w.setAttribute('position',new T.Float32BufferAttribute([s*.08,0,.14,s*.08,0,-.12,s*.62,0,-.02,s*.62,0,-.02,s*.08,0,-.12,s*.85,0,-.14],3));w.computeVertexNormals();k.raw(w,new T.Matrix4(),'#f1eee6');
      const tip=new T.BufferGeometry();tip.setAttribute('position',new T.Float32BufferAttribute([s*.62,.002,-.02,s*.85,.002,-.14,s*.95,.002,-.06],3));tip.computeVertexNormals();k.raw(tip,new T.Matrix4(),'#2f2d2a');}
  },{flags:{noShadow:true}});
  const hawk=kit(k=>{
    k.add(G.sphLo,'#7d6752',[0,0,0],[.14,.12,.36]).add(G.sphMin,'#6b5848',[0,.05,.36],[.1,.1,.11]).add(G.cone4,'#e2c37a',[0,.03,.48],[.04,.08,.04],[Math.PI/2,0,0]);
    for(const s of [-1,1]){const w=new T.BufferGeometry();w.setAttribute('position',new T.Float32BufferAttribute([s*.1,0,.18,s*.1,0,-.16,s*1.25,0,-.1,s*.1,0,.18,s*1.25,0,-.1,s*1.15,0,.12],3));w.computeVertexNormals();k.raw(w,new T.Matrix4(),'#8a735d');}
    const tail=new T.BufferGeometry();tail.setAttribute('position',new T.Float32BufferAttribute([0,0,-.25,-.22,0,-.7,.22,0,-.7],3));tail.computeVertexNormals();k.raw(tail,new T.Matrix4(),'#7a6450');
  },{flags:{noShadow:true}});
  const ibisStand=kit(k=>{
    k.add(G.sphLo,'#f2efe8',[0,.72,0],[.13,.12,.3],[-.15,0,0]).add(G.sphLo,'#2f2d2a',[0,.74,-.26],[.11,.1,.14]);
    k.limb([0,.8,.22],[0,1.02,.32],.03,'#f2efe8').limb([0,1.02,.32],[0,.95,.46],.03,'#f2efe8').add(G.sphMin,'#2f2d2a',[0,.96,.48],[.055,.055,.07]).limb([0,.95,.5],[0,.7,.72],.012,'#2f2d2a');
    for(const s of [-1,1])k.limb([s*.04,.65,0],[s*.05,0,.02],.012,'#3a332d');
  });
  for(const [x,z,yaw] of [[56,36.4,.4],[61.2,37,2.2],[69.6,44,-1.4],[50.2,38.8,2.8],[bankX(20)+.4,20,1.5],[bankX(-6)+.5,-6,-1.2]])actor(ibisStand,M.vc,x,z,yaw);
  const flock=makePath([[52,46],[86,20],[100,-40],[96,-90],[70,-60],[60,-10],[40,30],[30,70],[70,80]]);
  for(let i=0;i<7;i++)movers.push({kind:'flock',it:actor(ibis,M.bird,0,0,0,{walk:9,phase:i*.9}),path:flock,s0:-i*1.7,side:(i%2?1:-1)*Math.ceil(i/2)*1.1,y:11+i*.25});
  for(let i=0;i<3;i++)movers.push({kind:'orbit',it:actor(hawk,M.bird,0,0,0,{walk:2.2,phase:i*2}),cx:[4,-40,30][i],cz:[-24,-40,10][i],r:[48,34,58][i],y:[42,36,50][i],w:[.09,-.12,.07][i],a0:i*2.1});

  // —— 远景：萨卡拉阶梯金字塔、远处金字塔、东岸村舍 ——
  zone='far';
  for(let i=0;i<6;i++)bake(G.box,M.vc,'#e3cfa8',[-118,i*4.2+2.1+terrainY(-118,232),232],[44-i*6.6,4.2,34-i*5]);
  {const g=new T.ConeGeometry(46,52,4);g.rotateY(Math.PI/4);bake(g,M.vc,'#e1cda6',[-212,26+terrainY(-212,150)-2,150]);}
  {const g=new T.ConeGeometry(30,34,4);g.rotateY(Math.PI/4);bake(g,M.vc,'#e3d0aa',[-150,17+terrainY(-150,-205)-2,-205]);}
  for(let i=0;i<14;i++){const z=rand(-200,200),x=riverX(z)+riverHalf(z)+rand(10,60);bake(G.box,M.vc,i%2?'#d7c1a0':'#cdb594',[x,1.2,z],[rand(3,6),2.4,rand(3,5)]);}

  flush();

  // —— 低画质的柔和投影：一张径向渐变小贴图 + 一批实例化平面（高画质用真实阴影，不显示）——
  // 三格贴图：柔和圆斑、棕榈叶冠、圆角矩形；每个实例用 blobKind 选格
  const BT=64,bt=new Uint8Array(BT*3*BT*4);
  for(let j=0;j<BT;j++)for(let i=0;i<BT*3;i++){
    const k=Math.floor(i/BT),u=((i%BT)+.5)/BT*2-1,v=(j+.5)/BT*2-1,r=Math.hypot(u,v),o=(j*BT*3+i)*4;let a;
    if(k===0)a=1-smooth(.15,1,r);
    else if(k===1){const th=Math.atan2(v,u)+r*.5,w=Math.max(.06,.34-.24*r),c=Math.cos(9*th);a=Math.max(smooth(Math.cos(Math.min(Math.PI,9*w*1.5)),Math.cos(9*w*.55),c)*(1-smooth(.78,1,r)),1-smooth(.12,.32,r))*(.75+.25*(1-r));}
    else{const q=Math.pow(Math.abs(u)**6+Math.abs(v)**6,1/6);a=1-smooth(.8,1,q);}
    bt[o]=bt[o+1]=bt[o+2]=255;bt[o+3]=255*clamp(a,0,1);
  }
  const blobTex=own(new T.DataTexture(bt,BT*3,BT,T.RGBAFormat));blobTex.magFilter=blobTex.minFilter=T.LinearFilter;blobTex.needsUpdate=true;
  const blobMat=own(new T.MeshBasicMaterial({color:'#6b4a2b',map:blobTex,transparent:true,opacity:.38,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));
  blobMat.customProgramCacheKey=()=>'egypt-blob';
  blobMat.onBeforeCompile=sh=>{sh.vertexShader='attribute float blobKind;\n'+sh.vertexShader.replace('#include <uv_vertex>','#include <uv_vertex>\nvMapUv.x=(vMapUv.x+blobKind)/3.0;');};
  const blobGeo=own(new T.PlaneGeometry(1,1).rotateX(-Math.PI/2)),blobMesh=new T.InstancedMesh(blobGeo,blobMat,blobs.length);blobMesh.name='egypt-soft-shadows';
  blobGeo.setAttribute('blobKind',new T.InstancedBufferAttribute(new Float32Array(blobs.map(b=>b[5])),1));
  blobs.forEach(([x,z,l,w,ry,k,y],i)=>blobMesh.setMatrixAt(i,compose([x,y,z],[l,1,w],[0,ry,0])));
  blobMesh.renderOrder=-1;root.add(blobMesh);

  // —— 漂浮的沙尘 ——
  const dustG=own(new T.BufferGeometry()),dust=[];
  for(let i=0;i<220;i++)dust.push(rand(-80,80),rand(.4,6),rand(-60,95));
  dustG.setAttribute('position',new T.Float32BufferAttribute(dust,3));
  const dustMat=own(new T.PointsMaterial({color:'#fff2cf',size:.06,transparent:true,opacity:.32,depthWrite:false}));
  const dustCloud=new T.Points(dustG,dustMat);root.add(dustCloud);

  const palmMeshes=root.children.filter(o=>o.isInstancedMesh&&PALMS.includes(o.geometry)).map(mesh=>({mesh,i:PALMS.indexOf(mesh.geometry)}));
  function setQuality(value) {
    low=value==='low';dustCloud.visible=!low;blobMesh.visible=low;skyMat.uniforms.uDetail.value=low?0:1;
    for(const t of thin)t.mesh.count=low?Math.ceil(t.full*t.keep):t.full;
    for(const p of palmMeshes)p.mesh.geometry=(low?PALMS_LO:PALMS)[p.i];
    ground.geometry=groundFor(low?'low':'high');
  }
  setQuality(quality);
  const tmp={x:0,y:0,z:0,h:0};
  function updateLife(t) {
    for(const m of movers) {
      if(m.kind==='path'){const p=sample(m.path,m.s0+t*m.speed);place(m.it,p.x,p.y+m.dy,p.z,p.h+m.turn);}
      else if(m.kind==='river'){const span=620,z=((m.z0+t*m.speed+span/2)%span+span)%span-span/2,x=riverX(z)+m.lane,dir=Math.atan2(7*.012*Math.cos(z*.012-.3),1);
        place(m.it,x,Math.sin(t*1.3+m.z0)*.04,z,(m.speed>0?0:Math.PI)+dir*(m.speed>0?1:-1),Math.sin(t*.9+m.lane)*.015,Math.sin(t*1.1+m.z0)*.025);}
      else if(m.kind==='flock'){const p=sample(m.path,m.s0+t*3.2);place(m.it,p.x+Math.cos(p.h)*m.side,m.y+Math.sin(t*.7+m.side)*.6,p.z-Math.sin(p.h)*m.side,p.h,0,Math.sin(t*.5)*.08);}
      else if(m.kind==='orbit'){const a=m.a0+t*m.w;place(m.it,m.cx+Math.cos(a)*m.r,m.y+Math.sin(t*.3+m.a0)*3,m.cz+Math.sin(a)*m.r,Math.atan2(-Math.sin(a)*Math.sign(m.w),Math.cos(a)*Math.sign(m.w)),0,-.28*Math.sign(m.w));}
    }
    // 雪橇：约 70 秒拉上坡道，停一会儿再从石料堆重新出发
    const run=sledPath.len-7.4,cycle=run/.45+6,s=Math.min(run,(t%cycle)*.45);
    const p=sample(sledPath,s);tmp.x=p.x;tmp.y=p.y;tmp.z=p.z;tmp.h=p.h;const moving=s<run?1:0;place(sled.it,tmp.x,tmp.y,tmp.z,tmp.h,-Math.atan2(RAMP.top,RAMP.z0-RAMP.z1)*smooth(RAMP.z0+.5,RAMP.z0-1,tmp.z)*(tmp.x<47?1:0));
    for(const c of sled.crew){const q=sample(sledPath,s+c.ahead);place(c.it,q.x+Math.cos(q.h)*c.side,q.y,q.z-Math.sin(q.h)*c.side,q.h);c.it.mesh.geometry.attributes.walk.setX(c.it.index,moving*(c.side>1?.5:.8));c.it.mesh.geometry.attributes.walk.needsUpdate=true;}
    for(const r of sled.ropes){const a=sample(sledPath,s+1.2),ax=a.x+Math.cos(a.h)*r.side*.5,ay=a.y+.45,az=a.z-Math.sin(a.h)*r.side*.5;const b=sample(sledPath,s+5.2),bx=b.x+Math.cos(b.h)*r.side,by=b.y+1.08,bz=b.z-Math.sin(b.h)*r.side;
      _d.set(bx-ax,by-ay,bz-az);const len=_d.length();dummy.position.set((ax+bx)/2,(ay+by)/2,(az+bz)/2);dummy.quaternion.setFromUnitVectors(_up,_d.multiplyScalar(1/len));dummy.scale.set(1,len,1);dummy.updateMatrix();r.it.mesh.setMatrixAt(r.it.index,dummy.matrix);r.it.mesh.instanceMatrix.needsUpdate=true;}
  }
  updateLife(0);
  return {
    ground,obstacles,
    update(dt,time,player,reduced=false) {
      if(disposed)return;clock.value=reduced?0:time;
      dustCloud.visible=!low&&!reduced;
      if(reduced)return;
      dustCloud.position.x=Math.sin(time*.045)*3;dustCloud.position.y=Math.sin(time*.17)*.2;
      updateLife(time);
    },
    setQuality,
    dispose(){if(disposed)return;disposed=true;scene.remove(root);root.traverse(o=>{if(o.isInstancedMesh)o.dispose();});for(const r of resources)r.dispose();resources.clear();}
  };
}
