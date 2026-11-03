import * as T from './vendor/three/three.module.min.js';

const oldKingdom = {title:'埃及旅游与文物部 · 古王国',url:'https://egymonuments.gov.eg/historical-periods/old-kingdom/'};
const metKingdom = {title:'大都会艺术博物馆 · 古王国的埃及',url:'https://www.metmuseum.org/essays/egypt-in-the-old-kingdom-ca-2649-2150-b-c'};

// An original learning diorama, not a measured archaeological reconstruction.
export const eraDefinition = {
  id:'egypt', title:'古埃及金字塔', subtitle:'沙海之上，时间有了形状。',
  description:'沿着石板路走向金字塔，在柱廊、书吏营地和绿洲旁寻找建造与记录的秘密。场景为古王国主题的艺术化学习复原，建筑比例、绿洲位置与人物均为教学设计。',
  period:'古埃及 · 古王国主题', accent:'#c89c57', sky:'#d9e5df', fog:'#e7d6b5', sun:'#ffe4b1', exposure:1.03,
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

export function buildEra(scene,{quality='normal'}={}) {
  const root=new T.Group();root.name='egypt-original-learning-landscape';scene.add(root);
  const resources=new Set(),obstacles=[],buckets=new Map(),motionObjects=[],clock={value:0};
  let seed=874123,disposed=false,low=quality==='low';
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const own=o=>(resources.add(o),o),geo=g=>own(g);
  const material=(color,extra={})=>own(new T.MeshStandardMaterial({color,roughness:.91,...extra}));
  const stone=material('#e8d5ae'),darkStone=material('#c3a77b'),warmStone=material('#d9bd90'),paleStone=material('#f4e5c5');
  const wood=material('#886345'),green=material('#637e51',{side:T.DoubleSide}),teal=material('#488e86'),brass=material('#b4935e',{metalness:.25,roughness:.55});
  const linen=material('#f5ecd1',{side:T.DoubleSide}),ink=material('#555647'),waterline=material('#899b6a');
  const box=geo(new T.BoxGeometry(1,1,1)),sphere=geo(new T.SphereGeometry(1,16,12)),cylinder=geo(new T.CylinderGeometry(1,1,1,16)),cone=geo(new T.ConeGeometry(1,1,16));
  const dummy=new T.Object3D(),color=new T.Color();
  function stamp(g,m,p=[0,0,0],s=[1,1,1],r=[0,0,0],tint=null) {
    const key=g.uuid+':'+m.uuid;if(!buckets.has(key))buckets.set(key,{g,m,items:[]});
    buckets.get(key).items.push({p,s,r,tint});
  }
  function mesh(g,m,p=[0,0,0]) {const o=new T.Mesh(g,m);o.position.set(...p);o.castShadow=true;o.receiveShadow=true;root.add(o);return o;}
  function solid(x,z,hx,hz,height,base=0){obstacles.push({x,z,hx,hz,base,height,walkable:false});}
  function roundSolid(x,z,r,height,base=0){obstacles.push({x,z,r,base,height,walkable:false});}
  function flush() {
    for(const {g,m,items} of buckets.values()) {
      const o=new T.InstancedMesh(g,m,items.length);o.name='egypt-batched-detail';
      items.forEach((v,i)=>{dummy.position.set(...v.p);dummy.rotation.set(...v.r);dummy.scale.set(...v.s);dummy.updateMatrix();o.setMatrixAt(i,dummy.matrix);o.setColorAt(i,color.set(v.tint||'#ffffff'));});
      o.castShadow=true;o.receiveShadow=true;root.add(o);
    }
    buckets.clear();
  }
  // The entire playable region is level. Dunes begin beyond its 110 m boundary.
  const groundGeometry=geo(new T.PlaneGeometry(620,620,180,180));groundGeometry.rotateX(-Math.PI/2);
  const gp=groundGeometry.attributes.position,gc=[],sandColor=new T.Color();
  for(let i=0;i<gp.count;i++) {
    const x=gp.getX(i),z=gp.getZ(i),rad=Math.hypot(x,z),far=Math.max(0,Math.min(1,(rad-116)/70));
    const dune=(9+Math.sin(x*.029+z*.018)*8+Math.cos(z*.043-x*.016)*5+Math.sin(x*.071+z*.028)*2)*far*far;
    gp.setY(i,Math.max(0,dune));
    const variation=Math.sin(x*.07+z*.04)*.018+Math.cos(z*.17-x*.09)*.012;
    sandColor.set('#d8bf90').offsetHSL(.003,0,variation+far*.035);gc.push(sandColor.r,sandColor.g,sandColor.b);
  }
  groundGeometry.setAttribute('color',new T.Float32BufferAttribute(gc,3));groundGeometry.computeVertexNormals();
  const groundMat=material('#ffffff',{vertexColors:true});
  groundMat.onBeforeCompile=shader=>{
    shader.vertexShader='varying vec3 egyptGroundPos;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\negyptGroundPos=position;');
    shader.fragmentShader='varying vec3 egyptGroundPos;\n'+shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat grains=fract(sin(dot(floor(egyptGroundPos.xz*35.0),vec2(12.9898,78.233)))*43758.5453);float ripple=sin(egyptGroundPos.x*2.6+sin(egyptGroundPos.z*.13)*2.0);diffuseColor.rgb*=.97+grains*.045+ripple*.015;');
  };
  const ground=mesh(groundGeometry,groundMat);ground.castShadow=false;ground.name='egypt-walkable-ground';
  // One instanced draw per material for thousands of stone courses.
  function pyramid(x,z,size,height,layers,capped=false) {
    const core=geo(new T.ConeGeometry(size/Math.SQRT2,height,4));core.rotateY(Math.PI/4);
    mesh(core,darkStone,[x,height/2,z]);
    const dy=height/layers;
    for(let row=0;row<layers;row++) {
      const w=size*(1-row/layers),depth=Math.max(.35,size/layers*.65),n=Math.max(1,Math.ceil(w/2.8)),bw=w/n;
      for(let col=0;col<n;col++) {
        const d=-w/2+(col+.5)*bw,y=(row+.5)*dy;
        for(const sign of [-1,1]) {
          const tint=['#f4e8cd','#e7d4b0','#d8bf94','#efdcba','#e2c89e'][Math.floor(random()*5)];
          stamp(box,stone,[x+d,y,z+sign*(w/2-depth/2)],[bw-.035,dy-.035,depth],[0,0,0],tint);
          stamp(box,stone,[x+sign*(w/2-depth/2),y,z+d],[depth,dy-.035,bw-.035],[0,0,0],tint);
        }
      }
      // Tier-shaped collision fits the sides, leaving no invisible full-height cube.
      solid(x,z,w/2,w/2,dy,row*dy);
    }
    if(capped) {
      const h=height*.2,w=size*.2,g=geo(new T.ConeGeometry(w/Math.SQRT2,h,4));g.rotateY(Math.PI/4);
      mesh(g,paleStone,[x,height-h/2+.06,z]);
    }
    const plinth=mesh(box,warmStone,[x,.15,z]);plinth.scale.set(size+1.3,.3,size+1.3);solid(x,z,(size+1.3)/2,(size+1.3)/2,.3);
  }
  pyramid(0,-41,68,46,40,true);
  pyramid(-70,-64,47,32,29,true);
  pyramid(68,-74,36,24.5,24,false);
  // Fine paving seams guide the visitor without adding raised collision steps.
  const pavement=material('#d9c8a8');
  for(let row=0;row<37;row++)for(let col=0;col<4;col++)stamp(box,pavement,[(col-1.5)*2.35,.022,52-row*1.55],[2.29,.045,1.48],[0,0,0],row%3?'#f3e6cf':'#e2cfac');
  for(let i=0;i<20;i++)stamp(box,pavement,[-7-i*1.6,.018,39-i*.08],[1.53,.036,3.2]);
  for(let i=0;i<25;i++)stamp(box,pavement,[7+i*1.55,.018,33+i*.32],[1.48,.036,3]);
  // A valley-temple-inspired colonnade: simple stone pillars, not later-period pylons.
  for(const x of [-56,-42])for(const z of [5,13,21,29]) {
    stamp(box,warmStone,[x,3.8,z],[2.2,7.6,2.2]);solid(x,z,1.1,1.1,7.6);
    stamp(box,paleStone,[x,7.75,z],[2.65,.45,2.65]);
    stamp(box,darkStone,[x,.22,z],[2.7,.44,2.7]);solid(x,z,1.35,1.35,.44);
    for(let j=0;j<5;j++)stamp(box,darkStone,[x,1.35+j*1.05,z+1.108],[.63,.045,.016]);
  }
  for(const x of [-56,-42]) {stamp(box,warmStone,[x,8.25,17],[2.75,.8,28]);solid(x,17,1.375,14,.8,7.85);}
  for(const z of [5,29]){stamp(box,paleStone,[-49,8.25,z],[17,.8,2.75]);solid(-49,z,8.5,1.375,.8,7.85);}
  stamp(box,pavement,[-49,.012,17],[18,.025,30]);
  // Low carved side-wall panels deliberately use abstract decorative marks.
  for(const z of [11,23]) {
    stamp(box,warmStone,[-59,1.9,z],[1.2,3.8,8]);solid(-59,z,.6,4,3.8);
    for(let k=0;k<5;k++) {
      const zz=z-2.7+k*1.3;
      stamp(box,darkStone,[-58.385,2.2,zz],[.035,1.05,.12]);
      stamp(box,darkStone,[-58.37,2.65,zz],[.04,.1,.65]);
      stamp(sphere,darkStone,[-58.36,1.35,zz],[.04,.18,.18]);
    }
  }
  // A sculpted, original sphinx: rounded lion body, paws and human face.
  const sx=29,sz=16;
  stamp(box,warmStone,[sx,.28,sz],[11,.56,17]);solid(sx,sz,5.5,8.5,.56);
  stamp(sphere,stone,[sx,2.5,sz-1],[3.6,2.3,5.7]);roundSolid(sx,sz-1,3.6,4.6,.4);
  for(const side of [-1,1]) {
    stamp(sphere,warmStone,[sx+side*2.4,1.35,sz-4.2],[1.8,1.3,2.4]);roundSolid(sx+side*2.4,sz-4.2,1.8,2.6);
    stamp(sphere,stone,[sx+side*2,1.1,sz+4.2],[1.5,.8,4.3]);solid(sx+side*2,sz+4.2,1.4,4.1,1.9);
    for(let toe=0;toe<3;toe++)stamp(sphere,warmStone,[sx+side*2+(toe-1)*.7,.93,sz+7.6],[.36,.5,.7]);
  }
  stamp(sphere,stone,[sx,4.65,sz+2.4],[2.3,3.1,2.1]);roundSolid(sx,sz+2.4,2.4,7.5);
  stamp(sphere,paleStone,[sx,6.9,sz+3.0],[1.55,1.85,1.35]);
  // Headdress flares are bevelled custom geometry, not a flat face decal.
  function headcloth(sign) {
    const shape=new T.Shape();shape.moveTo(.5,1.5);shape.lineTo(1.65,1.1);shape.lineTo(2.25,-2);shape.quadraticCurveTo(1.5,-2.5,.8,-1.7);shape.closePath();
    const g=geo(new T.ExtrudeGeometry(shape,{depth:.6,bevelEnabled:true,bevelSize:.18,bevelThickness:.18,bevelSegments:2,steps:1,curveSegments:8}));
    const m=mesh(g,warmStone,[sx,7,sz+2.2]);m.scale.x=sign;
    for(let j=0;j<10;j++)stamp(box,darkStone,[sx+sign*(1.14+j*.07),7.65-j*.32,sz+3.05],[.95,.07,.045],[0,0,sign*-.14]);
  }
  headcloth(-1);headcloth(1);
  stamp(sphere,warmStone,[sx,8.1,sz+2.65],[1.65,.95,1.4]);
  for(const side of [-1,1]) {
    stamp(sphere,darkStone,[sx+side*.59,7.14,sz+4.12],[.33,.09,.06]);
    stamp(sphere,stone,[sx+side*1.51,6.84,sz+3.01],[.23,.55,.3]);
    stamp(box,warmStone,[sx+side*.58,7.36,sz+4.05],[.76,.16,.12],[0,0,side*-.07]);
  }
  stamp(sphere,warmStone,[sx,6.84,sz+4.21],[.28,.57,.35]);
  stamp(sphere,darkStone,[sx,6.17,sz+4.12],[.46,.055,.055]);
  stamp(sphere,stone,[sx,6,sz+4.04],[.43,.17,.15]);
  stamp(box,warmStone,[sx,5.37,sz+3.92],[.44,.85,.4],[.12,0,0]);
  // Low rope markers leave the main walkway open.
  for(const x of [-8.2,8.2])for(const z of [0,11,22,33]) {
    stamp(cylinder,wood,[x,.7,z],[.13,1.4,.13]);roundSolid(x,z,.16,1.4);
  }
  const rope=geo(new T.CylinderGeometry(.025,.025,1,6));
  for(const x of [-8.2,8.2])for(const z of [5.5,16.5,27.5])stamp(rope,wood,[x,.95,z],[1,11,1],[Math.PI/2,0,0]);
  // The modern interpretive camp is labelled as a teaching setting in the text.
  const campX=-31,campZ=52;
  for(const x of [campX-6,campX+6])for(const z of [campZ-5,campZ+5]){stamp(cylinder,wood,[x,2.3,z],[.16,4.6,.16]);roundSolid(x,z,.2,4.6);}
  const canopyGeo=geo(new T.PlaneGeometry(12.8,10.8,18,14));canopyGeo.rotateX(-Math.PI/2);
  const cp=canopyGeo.attributes.position;
  for(let i=0;i<cp.count;i++){const x=cp.getX(i),z=cp.getZ(i);cp.setY(i,-.6*Math.sin(Math.PI*(x+6.4)/12.8)*Math.sin(Math.PI*(z+5.4)/10.8));}
  canopyGeo.computeVertexNormals();
  const clothMat=linen.clone();own(clothMat);
  clothMat.onBeforeCompile=shader=>{shader.uniforms.egyptTime=clock;shader.vertexShader='uniform float egyptTime;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.y+=sin(position.x*.7+egyptTime*.9)*sin(position.z*.4+egyptTime*.6)*.09;');};
  mesh(canopyGeo,clothMat,[campX,4.65,campZ]);
  for(const x of [campX-5.8,campX+5.8])stamp(box,teal,[x,4.62,campZ],[.33,.08,10.8]);
  stamp(box,wood,[campX,1.2,campZ-1.4],[6,.25,2.5]);solid(campX,campZ-1.4,3,1.25,1.35);
  for(const x of [campX-2.5,campX+2.5])for(const z of [campZ-2.3,campZ-.5])stamp(box,wood,[x,.6,z],[.2,1.2,.2]);
  stamp(box,linen,[campX-.8,1.34,campZ-1.4],[2.3,.035,1.5]);
  for(const x of [campX-1.95,campX+.35])stamp(cylinder,linen,[x,1.45,campZ-1.4],[.14,1.7,.14],[Math.PI/2,0,0]);
  for(let i=0;i<6;i++)stamp(box,ink,[campX-.8,1.365,campZ-1.9+i*.18],[1.55,.008,.018]);
  for(let i=0;i<5;i++)stamp(sphere,darkStone,[campX+1.3+(i%2)*.4,1.45,campZ-1.8+Math.floor(i/2)*.35],[.14,.11,.14]);
  for(let i=0;i<5;i++) {
    const x=campX-5+Math.floor(i/3)*1.8,z=campZ+1.8+(i%3)*1.15;
    stamp(box,warmStone,[x,.65,z],[1.45,1.3,.9],[0,.04*i,0]);solid(x,z,.8,.52,1.3);
    stamp(box,wood,[x,.65,z+.46],[1.46,.1,.04]);
  }
  const potG=geo(new T.LatheGeometry([[0,0],[.45,0],[.7,.3],[.75,.8],[.5,1.2],[.35,1.32],[.4,1.4]].map(p=>new T.Vector2(...p)),20));
  for(const [x,z,s] of [[-24,48,1],[-25,50,.75],[-36,57,1.1],[-38,55,.8]]){stamp(potG,material('#ae7d57'),[x,0,z],[s,s,s]);roundSolid(x,z,.76*s,1.4*s);}
  // Turquoise oasis, a deliberately relocated interpretive landscape feature.
  const ox=57,oz=47,rx=13,rz=9;
  const shoreG=geo(new T.CircleGeometry(1,72));shoreG.rotateX(-Math.PI/2);
  const shore=mesh(shoreG,waterline,[ox,.01,oz]);shore.scale.set(rx+1.3,1,rz+1.1);shore.castShadow=false;
  const waterMat=own(new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{egyptTime:clock},vertexShader:'varying vec2 vWater;void main(){vWater=position.xz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec2 vWater;uniform float egyptTime;void main(){float waves=sin(vWater.x*55.0+egyptTime*.6)+sin(vWater.y*49.0+egyptTime*.45);float glow=pow(max(0.0,sin(vWater.x*23.0+egyptTime*.35)*sin(vWater.y*27.0-egyptTime*.28)),12.0);float edge=1.0-smoothstep(.88,1.0,length(vWater));vec3 c=mix(vec3(.16,.43,.41),vec3(.37,.68,.60),.6+waves*.08);c+=glow*.26;gl_FragColor=vec4(c,edge*.96);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'}));
  const water=mesh(shoreG,waterMat,[ox,.04,oz]);water.scale.set(rx,1,rz);water.castShadow=false;
  // Conservative ellipsoidal shore collision from circles, matching the water.
  for(let i=-3;i<=3;i++){const x=ox+i*3.1;roundSolid(x,oz,Math.sqrt(Math.max(0,1-(i/4.1)**2))*rz,.6,-.25);}
  function wind(m,factor) {
    m.onBeforeCompile=shader=>{shader.uniforms.egyptTime=clock;shader.vertexShader='uniform float egyptTime;\n'+shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>\nvec3 wp=(modelMatrix*instanceMatrix*vec4(position,1.0)).xyz;transformed.x+=sin(wp.x*.1+wp.z*.13+egyptTime*.9)*max(position.y,0.0)*${factor};`);};return m;
  }
  // Each frond contains a central arch and many slender leaflets in one geometry.
  function palmFrondGeometry() {
    const v=[],idx=[];
    function triangle(a,b,c){const n=v.length/3;v.push(...a,...b,...c);idx.push(n,n+1,n+2);}
    const spine=t=>[0,Math.sin(t*Math.PI)*1.55-t*.3,t*5.4];
    for(let i=0;i<19;i++) {
      const t=i/19,tt=(i+1)/19,a=spine(t),b=spine(tt),w=(1-t)*.06+.008;
      triangle([a[0]-w,a[1],a[2]],[a[0]+w,a[1],a[2]],[b[0]+w,b[1],b[2]]);triangle([a[0]-w,a[1],a[2]],[b[0]+w,b[1],b[2]],[b[0]-w,b[1],b[2]]);
      const len=Math.sin(Math.PI*t)*1.1+.12;
      for(const sign of [-1,1])triangle(a,[sign*len,a[1]-.15-len*.18,a[2]+.5],[sign*.08,b[1]-.02,b[2]]);
    }
    const g=geo(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(idx);g.computeVertexNormals();return g;
  }
  const frondG=palmFrondGeometry(),palmMat=wind(green,.025);
  const palms=[[44,53,8.8],[47,60,10.1],[57,61,9],[67,55,10.8],[72,46,8.7],[67,34,9.2],[53,33,8.5],[-41,48,8.8],[-24,60,8.4],[-65,31,7.7]];
  for(const [x,z,h] of palms) {
    const lean=(random()-.5)*.9;
    for(let i=0;i<12;i++) {
      const t=(i+.5)/12,xx=x+Math.sin(t*1.5)*lean;
      stamp(cylinder,wood,[xx,h*t,z],[.31*(1-t*.4),h/12+.02,.31*(1-t*.4)],[0,0,-lean/h]);
      if(i%2===0)stamp(cylinder,darkStone,[xx,h*t,z],[.335*(1-t*.4),.085,.335*(1-t*.4)]);
    }
    roundSolid(x+lean*.45,z,.62,h);
    for(let j=0;j<10;j++)stamp(frondG,palmMat,[x+Math.sin(1.5)*lean,h,z],[.9+random()*.18,.85+random()*.2,.9+random()*.18],[.15+(j%2)*.17,j*Math.PI*.2,0],j%3?'#c0cf94':'#779a62');
    for(let j=0;j<4;j++)stamp(sphere,warmStone,[x+lean+(j%2-.5)*.35,h-.3,z+(Math.floor(j/2)-.5)*.35],[.2,.29,.2]);
  }
  const reedGeometry=geo(new T.ConeGeometry(.05,1,3));reedGeometry.translate(0,.5,0);const reedMat=wind(material('#8e9f64'),.10);
  for(let i=0;i<370;i++) {
    const a=random()*Math.PI*2,r=1.02+random()*.14,x=ox+Math.cos(a)*rx*r,z=oz+Math.sin(a)*rz*r;
    if(x<45&&z<48)continue;
    stamp(reedGeometry,reedMat,[x,.03,z],[1, .55+random()*1.2,1],[0,a,(random()-.5)*.14]);
  }
  // Scatter low rocks outside paths. Geometry and materials are shared.
  const rockG=geo(new T.DodecahedronGeometry(1,0));
  for(let i=0;i<95;i++) {
    const x=(random()-.5)*200,z=(random()-.5)*180+10;
    if(Math.abs(x)<12||eraDefinition.stations.some(s=>Math.hypot(s.x-x,s.z-z)<9)||Math.hypot(x-ox,(z-oz)*1.4)<20||x<-23&&x>-63&&z>2&&z<64||z<-6&&Math.abs(x)<38||x>20&&x<39&&z>3&&z<30)continue;
    const s=.3+random()*1.0;
    stamp(rockG,warmStone,[x,s*.35,z],[s*1.2,s*.65,s],[.1,random()*6,.1]);roundSolid(x,z,s*1.3,s*1.1);
  }
  // Low distant mastabas add a plausible Old Kingdom silhouette, not later temples.
  for(const [x,z,w,d] of [[-89,13,13,8],[-85,42,9,6],[82,-17,12,7],[93,17,8,6],[-51,-93,15,10]]) {
    stamp(box,warmStone,[x,2.1,z],[w,4.2,d]);solid(x,z,w/2,d/2,4.2);
    stamp(box,paleStone,[x,4.3,z],[w+.3,.2,d+.3]);
    stamp(box,darkStone,[x,.95,z+d/2+.02],[1.2,1.9,.04]);
  }
  flush();
  // A few distant birds and drifting dust give quiet motion to the wide view.
  const birdG=geo(new T.BufferGeometry());birdG.setAttribute('position',new T.Float32BufferAttribute([-.9,0,.1,0,.12,0,-.18,0,-.08,0,.12,0,.9,0,.1,.18,0,-.08],3));birdG.computeVertexNormals();
  for(let i=0;i<4;i++){const b=mesh(birdG,material('#7d806a',{side:T.DoubleSide}));b.castShadow=false;motionObjects.push({kind:'bird',o:b,phase:i*1.7});}
  const dustG=geo(new T.BufferGeometry()),dust=[];
  for(let i=0;i<140;i++)dust.push((random()-.5)*150,random()*5+.5,(random()-.5)*140+20);
  dustG.setAttribute('position',new T.Float32BufferAttribute(dust,3));
  const dustMat=own(new T.PointsMaterial({color:'#fff0c8',size:.055,transparent:true,opacity:.34,depthWrite:false}));
  const dustCloud=new T.Points(dustG,dustMat);root.add(dustCloud);
  function setQuality(value){low=value==='low';dustCloud.visible=!low;motionObjects.forEach(v=>v.o.visible=!low);}
  setQuality(quality);
  return {
    ground,obstacles,
    update(dt,time,player,reduced=false) {
      if(disposed)return;clock.value=reduced?0:time;
      dustCloud.visible=!low&&!reduced;
      if(reduced)return;
      dustCloud.position.x=Math.sin(time*.045)*3;dustCloud.position.y=Math.sin(time*.17)*.2;
      for(const b of motionObjects){const a=time*.026+b.phase;b.o.position.set(Math.sin(a)*53,26+Math.sin(a*2)*3,-26+Math.cos(a)*34);b.o.rotation.set(Math.sin(time*2+b.phase)*.12,-a,Math.sin(a)*.1);}
    },
    setQuality,
    dispose(){if(disposed)return;disposed=true;scene.remove(root);root.traverse(o=>{if(o.isInstancedMesh)o.dispose();});for(const r of resources)r.dispose();resources.clear();buckets.clear();}
  };
}
