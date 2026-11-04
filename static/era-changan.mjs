import * as T from './vendor/three/three.module.min.js';
import {addSurfaceDetail} from './era-atmosphere.mjs?v=9.4';

const silkSource = {title:'中国丝绸博物馆 · 九天阊阖：丝绸之路上的长安',url:'https://www.chinasilkmuseum.com/yz/info_18.aspx?itemid=31379'};
const unescoSource = {title:'联合国教科文组织 · 长安—天山廊道的路网',url:'https://whc.unesco.org/en/list/1442/'};
const buildingSource = {title:'旧金山亚洲艺术博物馆 · 大雁塔与中国建筑',url:'https://education.asianart.org/resources/great-wild-goose-pagoda/'};
export const eraDefinition = {
  id:'changan',title:'盛唐长安',subtitle:'穿过朱红城门，听见远方的回声',
  description:'沿着石板长街，走进灯笼摇曳的坊市，发现建筑、贸易与文化交流。原创唐风学习场景；街区比例、人物和建筑组合经过艺术化设计，并非考古复原。',
  period:'唐代 · 文化交流主题',accent:'#a7503e',sky:'#d9e8e6',fog:'#d9e4dc',sun:'#ffdab0',exposure:1.05,
  spawn:{x:0,z:43},bounds:108,
  atmosphere:{top:'#6c9fc4',horizon:'#efdcc4',haze:'#f6d6ad',bottom:'#c9b79a',sunDir:[-.74,.44,-.5],sunColor:'#ffd8a6',sunIntensity:3.1,hemiSky:'#d3e1ea',hemiGround:'#9c8466',hemiIntensity:.95,rimColor:'#bcd6ee',rimIntensity:.5,fog:'#e9d9c4',fogNear:65,fogFar:310,cloud:.5,cloudColor:'#fff6ea',cloudShade:'#d6c6c0',sunGlow:.42},
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

// Original geometry, instanced by material; no external assets or network requests.
export function buildEra(scene,{quality='normal'}={}) {
  const root=new T.Group();root.name='Changan — original learning city';scene.add(root);
  const owned=new Set(),geometries=new Map(),materials=new Map(),buckets=new Map(),obstacles=[],flags=[],lanterns=[],petals=[];
  const dummy=new T.Object3D();let low=quality==='low',alive=true;
  const palette={stone:'#c8baa2',lightStone:'#ede1c7',stoneEdge:'#b5a48a',road:'#d9cbb1',wall:'#d8be96',red:'#9d4737',redLight:'#bc6445',wood:'#60483b',woodLight:'#a27a51',roof:'#42676a',roofLight:'#668985',gold:'#cda366',cream:'#f7e7c5',pink:'#e2a89e',green:'#769086',leaf:'#91a78a',leafLight:'#b6bd96',water:'#90bab4',cloth:'#af795b',blue:'#6b9098',dark:'#3f5050'};
  const geom=(key,make)=>{if(!geometries.has(key)){const g=make();geometries.set(key,g);owned.add(g);}return geometries.get(key);};
  const mat=(name)=>{if(!materials.has(name)){const m=new T.MeshStandardMaterial({color:palette[name]||name,roughness:name==='gold'?.57:.86,metalness:name==='gold'?.22:0,side:['roof','roofLight','pink','blue'].includes(name)?T.DoubleSide:T.FrontSide});materials.set(name,m);owned.add(m);}return materials.get(name);};
  function add(g,color,p=[0,0,0],s=[1,1,1],r=[0,0,0]) {const m=typeof color==='string'?mat(color):color,key=g.uuid+':'+m.uuid;if(!buckets.has(key))buckets.set(key,{g,m,matrices:[]});dummy.position.set(...p);dummy.scale.set(...s);dummy.rotation.set(...r);dummy.updateMatrix();buckets.get(key).matrices.push(dummy.matrix.clone());}
  const boxG=geom('box',()=>new T.BoxGeometry(1,1,1));
  const cylinderG=geom('cylinder',()=>new T.CylinderGeometry(1,1,1,12));
  const sphereG=geom('sphere',()=>new T.IcosahedronGeometry(1,2));
  const coneG=geom('cone',()=>new T.ConeGeometry(1,1,12));
  const box=(color,p,s,r)=>add(boxG,color,p,s,r);
  const cyl=(color,p,s,r)=>add(cylinderG,color,p,s,r);
  const puff=(color,p,s)=>add(sphereG,color,p,s);
  function obstacle(x,z,hx,hz,height,base=0){obstacles.push({x,z,hx,hz,base,height,walkable:false});}
  function post(x,y,z,h=.7,w=.14,color='gold'){cyl(color,[x,y+h/2,z],[w,h,w]);}
  function beam(a,b,width,color='wood'){const v1=new T.Vector3(...a),v2=new T.Vector3(...b),d=v2.clone().sub(v1),mid=v1.clone().add(v2).multiplyScalar(.5);dummy.position.copy(mid);dummy.scale.set(width,d.length(),width);dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());dummy.updateMatrix();const m=mat(color),key=cylinderG.uuid+':'+m.uuid;if(!buckets.has(key))buckets.set(key,{g:cylinderG,m,matrices:[]});buckets.get(key).matrices.push(dummy.matrix.clone());}
  function roofGeometry(w,d,h) {
    return geom(`roof-${w}-${d}-${h}`,()=>{const nx=28,nz=20,ps=[],uv=[],idx=[];
      for(let iz=0;iz<=nz;iz++)for(let ix=0;ix<=nx;ix++){const x=(ix/nx-.5)*w,z=(iz/nz-.5)*d;const tx=Math.max(0,(Math.abs(x)-w*.2)/(w*.3)),tz=Math.abs(z)/(d*.5),t=Math.min(1,Math.max(tx,tz));const y=h*(1-Math.pow(t,.7))+.38*Math.pow(Math.max(0,(t-.74)/.26),2);ps.push(x,y,z);uv.push(ix/nx,iz/nz);}
      for(let z=0;z<nz;z++)for(let x=0;x<nx;x++){const a=z*(nx+1)+x,b=a+1,c=a+nx+1,e=c+1;idx.push(a,c,b,b,c,e);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(ps,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;});
  }
  // Stepped colliders under each curved roof: anyone who lands or flies over a roof
  // rests on the tiles instead of sinking inside the roof mesh, and the camera sees the roof.
  function roofSolids(x,y,z,w,d,h) {
    if(w<3)return;const bands=[0,.12,.3,.5,.75,1],surface=t=>h*(1-Math.pow(t,.7))+.38*Math.pow(Math.max(0,(t-.74)/.26),2);
    for(let i=1;i<bands.length;i++)obstacles.push({x,z,hx:w*.2+w*.3*bands[i],hz:Math.max(.35,d*.5*bands[i]),base:y-.05,height:surface(bands[i-1]*.6+bands[i]*.4)+.1,walkable:false});
  }
  function roof(x,y,z,w,d,h=2.8,accent='roof') {
    const rg=roofGeometry(w,d,h);add(rg,accent,[x,y,z]);roofSolids(x,y,z,w,d,h);
    box('gold',[x,y+.13,z+d/2],[w,.16,.15]);box('gold',[x,y+.13,z-d/2],[w,.16,.15]);
    box('roofLight',[x,y+h+.08,z],[w*.4,.22,.3]);
    for(const sign of [-1,1]) {
      beam([x+sign*w*.2,y+h+.15,z],[x+sign*w*.29,y+h+.68,z],.15,'gold');
      puff('gold',[x+sign*w*.29,y+h+.68,z],[.25,.25,.16]);
    }
    // Tile ribs follow the curved roof profile, grouped in one instanced material.
    const n=Math.max(8,Math.floor(w/.72));
    for(let i=1;i<n;i++){const rx=-w*.5+w*i/n;for(const side of [-1,1])for(let j=0;j<6;j++){
      const z1=d*.5*j/6,z2=d*.5*(j+1)/6;
      const height=zz=>{const t=Math.min(1,Math.max(Math.max(0,(Math.abs(rx)-w*.2)/(w*.3)),zz/(d*.5)));return h*(1-Math.pow(t,.7))+.38*Math.pow(Math.max(0,(t-.74)/.26),2);};
      beam([x+rx,y+height(z1)+.035,z+side*z1],[x+rx,y+height(z2)+.035,z+side*z2],.045,'roofLight');
    }}
  }
  function house(x,z,w=14,d=10,h=5,roofColor='roof',open=false) {
    box('lightStone',[x,open?-.15:.17,z],[w+.6,.34,d+.6]);
    if(!open){box('wall',[x,h/2,z],[w,h,d]);obstacle(x,z,w/2+.18,d/2+.18,h);}
    box('red',[x,h-.2,z],[w+.3,.4,d+.3]);
    for(const dx of [-w/2+.35,0,w/2-.35])for(const dz of [-d/2-.05,d/2+.05]) {
      cyl('red',[x+dx,h/2,z+dz],[.25,h,.25]);cyl('stone',[x+dx,.25,z+dz],[.4,.5,.4]);
      if(open)obstacles.push({x:x+dx,z:z+dz,r:.42,base:0,height:h});
      box('gold',[x+dx,h-.7,z+dz],[1.15,.22,.6]);box('wood',[x+dx,h-.45,z+dz],[.5,.23,1.1]);
    }
    for(const dx of [-w*.28,w*.28])for(const dz of [-d/2-.025,d/2+.025]) {
      box('wood',[x+dx,h*.51,z+dz],[w*.28,h*.52,.06]);
      for(let i=0;i<5;i++)box('gold',[x+dx-w*.11+i*w*.055,h*.51,z+dz+Math.sign(dz)*.04],[.045,h*.46,.045]);
      box('woodLight',[x+dx,h*.52,z+dz+Math.sign(dz)*.05],[w*.24,.06,.045]);
    }
    roof(x,h,z,w+2.6,d+2.6,Math.max(1.8,w*.15),roofColor);
  }
  function lantern(x,y,z,scale=1) {
    const group=new T.Group();group.position.set(x,y,z);root.add(group);lanterns.push({group,phase:x*.7+z});
    const warm=mat('#e39a55');warm.emissive.set('#e0702c');warm.emissiveIntensity=.85;
    const mesh=new T.Mesh(sphereG,warm);mesh.scale.set(.46*scale,.62*scale,.46*scale);group.add(mesh);
    for(const sy of [-1,1]){const cap=new T.Mesh(cylinderG,mat('gold'));cap.scale.set(.26*scale,.13*scale,.26*scale);cap.position.y=sy*.6*scale;group.add(cap);}
    const cord=new T.Mesh(cylinderG,mat('red'));cord.scale.set(.025*scale,.42*scale,.025*scale);cord.position.y=-.86*scale;group.add(cord);
    post(x,y+.62*scale,z,.65*scale,.025,'wood');
  }
  function stall(x,z,color='pink') {
    box('wood',[x,.8,z],[4.4,1.6,2.7]);obstacle(x,z,2.35,1.45,1.7);
    for(const dx of [-2.25,2.25])for(const dz of [-1.45,1.45]){cyl('wood',[x+dx,1.8,z+dz],[.095,3.6,.095]);obstacles.push({x:x+dx,z:z+dz,r:.13,base:0,height:3.6});}
    const awning=geom('awning',()=>{const g=new T.PlaneGeometry(5.4,4.2,10,1);g.rotateX(-Math.PI/2);const p=g.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,.28*Math.cos(p.getX(i)*1.4));g.computeVertexNormals();return g;});
    add(awning,color,[x,3.55,z]);
    for(let i=0;i<5;i++){
      if(color==='blue'){cyl(['pink','gold','cream'][i%3],[x-1.5+i*.72,1.85,z],[.25,.5,.25],[0,0,Math.PI/2]);}
      else {cyl(i%2?'cream':'cloth',[x-1.5+i*.72,1.98,z],[.27,.58,.27]);puff('gold',[x-1.5+i*.72,2.3,z],[.16,.09,.16]);}
    }
    obstacle(x,z,2.7,2.1,.4,3.35);lantern(x+2.2,2.85,z+1.55,.7);
  }
  function tree(x,z,blossom=false,s=1) {
    const h=6.6*s;cyl('wood',[x,h*.45,z],[.29*s,h*.9,.29*s]);obstacles.push({x,z,r:.4*s,base:0,height:h});
    // Layered crown: one main cluster per branch plus smaller outer and upper puffs.
    const tones=blossom?['pink','#edc3ac','#f3cbc4','#d4958d']:['leaf','leafLight','#7c9776','#a7b487'],jit=k=>{const v=Math.sin(x*12.9898+z*78.233+k*37.719)*43758.5453;return v-Math.floor(v);};
    for(let i=0;i<5;i++){const a=i*2.4+jit(i)*.5,r=(1+i%2*.7)*s,by=h*(.65+i%2*.07),cx=x+Math.cos(a)*r,cz=z+Math.sin(a)*r;beam([x,h*.5,z],[cx,by,cz],.14*s,'wood');
      puff(tones[i%2],[cx,by+.75*s,cz],[1.75*s,1.15*s,1.55*s]);
      puff(tones[3],[cx+Math.cos(a)*.55*s,by+.3*s,cz+Math.sin(a)*.55*s],[1.15*s,.75*s,1.05*s]);
      puff(tones[2],[cx-Math.cos(a)*.3*s+(jit(i+9)-.5)*s,by+1.45*s,cz-Math.sin(a)*.3*s],[1.05*s,.8*s,1*s]);}
    puff(tones[2],[x,h*.95+.9*s,z],[1.45*s,1*s,1.35*s]);
    obstacles.push({x,z,r:2.5*s,base:h*.62,height:h*.38+1.9*s,walkable:false});
    if(blossom)petals.push({x,z,h});
    cyl('stone',[x,.14,z],[1.05*s,.28,1.05*s]);
  }
  function flag(x,z,color='redLight') {
    cyl('wood',[x,4.6,z],[.08,9.2,.08]);obstacles.push({x,z,r:.15,base:0,height:9.2});puff('gold',[x,9.35,z],[.16,.22,.16]);
    const g=new T.PlaneGeometry(1.6,4.7,8,12);g.translate(.86,-2.35,0);owned.add(g);const m=mat(color).clone();m.side=T.DoubleSide;owned.add(m);const cloth=new T.Mesh(g,m);cloth.position.set(x,8.9,z);root.add(cloth);flags.push({mesh:cloth,base:g.attributes.position.array.slice(),phase:x+z});
    box('gold',[x+.8,8.9,z],[1.9,.08,.08]);
  }
  function plaque(text,x,y,z,width=6,height=1.6) {
    box('wood',[x,y,z],[width,height,.16]);box('gold',[x,y+height/2,z+.1],[width+.1,.06,.07]);box('gold',[x,y-height/2,z+.1],[width+.1,.06,.07]);
    if(typeof document==='undefined')return;
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;const ctx=canvas.getContext('2d');if(!ctx)return;ctx.fillStyle='#f2d697';ctx.font='600 128px "Songti SC", "Noto Serif CJK SC", serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,132);const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;owned.add(texture);const material=new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false});owned.add(material);const g=new T.PlaneGeometry(width*.85,height*.84);owned.add(g);const mesh=new T.Mesh(g,material);mesh.position.set(x,y,z+.13);root.add(mesh);
  }
  // Sandy limestone base, long pale processional avenue and a tile mosaic.
  const groundG=geom('ground',()=>new T.PlaneGeometry(260,260));groundG.rotateX(-Math.PI/2);
  const ground=new T.Mesh(groundG,addSurfaceDetail(mat('#c3bb98'),{scale:1,strength:.2,grain:.07,tintA:'#c9d3a2',tintB:'#f3e6cc'}));
  addSurfaceDetail(mat('lightStone'),{scale:1.6,strength:.13,grain:.05,tintA:'#fffaf0',tintB:'#efe2cc'});addSurfaceDetail(mat('stone'),{scale:1.6,strength:.14,grain:.06,tintA:'#fff6ea',tintB:'#e6d6c0'});addSurfaceDetail(mat('road'),{scale:1.2,strength:.16,grain:.06,tintA:'#fff7ea',tintB:'#e3d2b6'});addSurfaceDetail(mat('wall'),{scale:2.2,strength:.1,grain:.03,tintA:'#fff8ec',tintB:'#efdcc2'});ground.receiveShadow=true;root.add(ground);
  box('road',[0,-.005,0],[20,.05,214]);box('road',[0,.005,50],[204,.055,16]);box('road',[0,.005,-50],[194,.055,18]);
  for(const x of [-10.4,10.4])box('lightStone',[x,.04,0],[.45,.08,214]);
  // Running-bond paving: smaller slabs in four weathered tones.
  const paveTones=['lightStone','stone','#e6dac3','#d6c7ab'];for(const t of paveTones.slice(2))addSurfaceDetail(mat(t),{scale:1.6,strength:.14,grain:.06,tintA:'#fffaf0',tintB:'#eadcc4'});
  let paveSeed=91;const paveRand=()=>{paveSeed=(paveSeed*16807)%2147483647;return paveSeed/2147483647;};
  for(let row=0,z=-100.4;z<103;row++,z+=1.62){const offset=row%2?1.05:0;for(let x0=-10.1-offset;x0<10.1;x0+=2.1){const a=Math.max(-10.1,x0),b=Math.min(10.1,x0+2.1);if(b-a<.3)continue;const r=paveRand();box(paveTones[r<.38?0:r<.62?2:r<.84?1:3],[(a+b)/2,.028,z],[b-a-.07,.035+r*.012,1.55]);}}
  for(const z of [33,-2,-48]){cyl('stoneEdge',[0,.05,z],[5.4,.05,5.4]);cyl('lightStone',[0,.085,z],[4.9,.04,4.9]);for(let i=0;i<8;i++){const a=i*Math.PI/4;box('gold',[Math.sin(a)*2.9,.116,z+Math.cos(a)*2.9],[.14,.025,2.5],[0,a,0]);}}
  // Hero city gate: an uninterrupted central passage beneath three glazed roofs.
  for(const x of [-12.5,12.5]) {
    box('stone',[x,3.9,-24],[8,7.8,12]);obstacle(x,-24,4.1,6.1,8.45);
    box('lightStone',[x,.4,-24],[9,.8,13]);box('red',[x,8.15,-24],[8.1,.6,12.2]);
  }
  box('red',[0,7.8,-24],[33,1,13]);obstacle(0,-24,16.5,6.5,1,7.3);
  for(const x of [-14,-9,-4.5,0,4.5,9,14])for(const z of [-29,-19]){cyl('red',[x,10.5,z],[.34,5.2,.34]);box('gold',[x,12.6,z],[1.5,.24,1.4]);}
  box('wall',[0,10.3,-24],[24,4.3,8]);obstacle(0,-24,12,4,4.85,8.15);roof(0,13,-24,36,16,4.4);
  for(const x of [-9,-4.5,0,4.5,9])for(const z of [-27,-21])cyl('red',[x,17.3,z],[.26,3.5,.26]);
  box('red',[0,15.6,-24],[25,.5,11]);obstacle(0,-24,12.5,5.5,.5,15.35);box('wall',[0,17.2,-24],[19,3.2,6]);obstacle(0,-24,9.5,3,3.3,15.6);roof(0,18.9,-24,27,12,3.3);
  roof(0,22.15,-24,14,8,2.5);plaque('长 安',0,10.3,-17.9,6.5,2.1);
  for(const x of [-14,-7,7,14])lantern(x,11.7,-16.4,1.05);
  for(const x of [-20,20])flag(x,-14,'redLight');
  // Walls frame the gate; no invisible collider closes the central passage.
  for(const sign of [-1,1]) {
    box('wall',[sign*62,3,-24],[82,6,5]);obstacle(sign*62,-24,41,2.7,6.3);
    box('stone',[sign*62,.5,-24],[83,1,5.6]);box('lightStone',[sign*62,6.1,-24],[82,.4,5.5]);
    for(let x=22;x<103;x+=3.1){box('wall',[sign*x,6.7,-23],[1.6,1.2,1.1]);obstacle(sign*x,-23,.8,.55,1.2,6.1);}
    for(const z of [-16,0,18,36]){tree(sign*14.3,z,z%36===0,.85);}
    for(const z of [11,28,66]){house(sign*33,z,16,10,5.2);}
    for(const z of [10,26])stall(sign*23,z,sign<0?'pink':'blue');
    for(const z of [7,34,63]){flag(sign*20,z,sign<0?'redLight':'blue');}
    for(const z of [5,22,39,61,82]){house(sign*61,z,17,12,4.9,z%2?'roofLight':'roof');house(sign*89,z,17,12,5.4);}
    for(const x of [31,50,72,93]){house(sign*x,-84,16,13,5.1);tree(sign*x,-64,true,1.1);}
    for(const z of [-40,-62,-91])tree(sign*98,z,false,1.2);
  }
  // Courtyard learning pavilion with an open floor; columns remain solid.
  house(-30,-54,13,10,5.2,'roof',true);plaque('营 造',-30,4,-48.8,4,1.1);
  house(31,-54,18,11,5.7);plaque('书 肆',31,4.8,-48.3,4,1.1);
  for(const x of [-42,-18,18,44]){tree(x,-41,true,1.05);tree(x,-68,false,1.05);}
  // Distant brick tower gives the northern courtyard a recognisable silhouette.
  const towerX=58,towerZ=-77;
  for(let i=0;i<7;i++){const size=13-i*1.24,y=i*3.55;box('stone',[towerX,y+1.65,towerZ],[size,3.3,size]);box('lightStone',[towerX,y+3.36,towerZ],[size+1.1,.32,size+1.1]);box('dark',[towerX,y+1.8,towerZ+size/2+.025],[.85,1.6,.06]);}
  for(let i=0;i<7;i++){const size=13-i*1.24;obstacle(towerX,towerZ,(size+1.1)/2,(size+1.1)/2,3.52,i*3.55);}obstacles.push({x:towerX,z:towerZ,r:.45,base:24.6,height:3.5,walkable:false});cyl('gold',[towerX,26.1,towerZ],[.25,3,.25]);puff('gold',[towerX,27.65,towerZ],[.4,.5,.4]);
  // Quiet willow garden and still water outside the bustle of the avenue.
  const pondX=-58,pondZ=63;
  box('water',[pondX,-.04,pondZ],[19,.06,26]);obstacle(pondX,pondZ,9.5,13,.25,-.1);
  for(const x of [pondX-10,pondX+10])box('lightStone',[x,.12,pondZ],[.7,.3,27]);
  for(const z of [pondZ-13.5,pondZ+13.5])box('lightStone',[pondX,.12,z],[20.5,.3,.7]);
  tree(-72,52,true,1.2);tree(-72,72,true,1.1);tree(-44,77,true,.9);
  for(let i=0;i<11;i++){const x=pondX-7+(i*3.7)%14,z=pondZ-10+(i*4.9)%20;cyl('leaf',[x,.04,z],[.6,.035,.6]);puff('pink',[x,.16,z],[.21,.15,.21]);}
  // Benches, small stone lanterns, banners and flower planters reward wandering.
  for(const sign of [-1,1])for(const z of [46,80,-72]) {
    const x=sign*14;box('wood',[x,.8,z],[3.6,.18,1]);box('stone',[x-1.3,.38,z],[.4,.76,.7]);box('stone',[x+1.3,.38,z],[.4,.76,.7]);obstacle(x,z,1.9,.6,.9);
  }
  for(const sign of [-1,1])for(const z of [49,77,-38,-71]) {
    const x=sign*12.5;cyl('stone',[x,.45,z],[.33,.9,.33]);box('stone',[x,1.14,z],[.8,.6,.8]);roof(x,1.45,z,1.25,1.25,.4);obstacles.push({x,z,r:.5,base:0,height:1.9});
  }
  for(let i=0;i<22;i++){const x=(i%2?-1:1)*(39+(i*7)%48),z=-104+(i*13)%204;if(Math.abs(z+24)<10)continue;tree(x,z,i%3===0,.75+(i%4)*.09);}
  // Soft far hills and ivory cloud banks, outside the walkable city bounds.
  for(let layer=0;layer<3;layer++){const ridge=geom('ridge'+layer,()=>{const v=[],idx=[],n=120;for(let i=0;i<=n;i++){const a=i/n*Math.PI*2,r=175+layer*55,h=(16+layer*13)*(.55+.45*Math.cos(a))+Math.sin(a*6+layer*2)*6+Math.sin(a*13+layer)*3+Math.max(0,Math.sin(a*3.1+1))*8;v.push(Math.sin(a)*r,-6,Math.cos(a)*r,Math.sin(a)*r,Math.max(4,h),Math.cos(a)*r);if(i<n){const b=i*2;idx.push(b,b+1,b+2,b+1,b+3,b+2);}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(idx);g.computeVertexNormals();return g;});const rm=mat(['#8fa69a','#a3b5ae','#b9c6c2'][layer]);rm.side=T.DoubleSide;add(ridge,rm,[0,0,0]);}
  // A small particle field gives cherry blossoms a gentle sense of wind.
  const positions=new Float32Array(120*3);for(let i=0;i<120;i++){const p=petals[i%petals.length];positions[i*3]=p.x+Math.sin(i*2.4)*4;positions[i*3+1]=1+(i*.37)%p.h;positions[i*3+2]=p.z+Math.cos(i*1.7)*4;}
  const petalGeometry=new T.BufferGeometry();petalGeometry.setAttribute('position',new T.BufferAttribute(positions,3));owned.add(petalGeometry);
  const petalMaterial=new T.PointsMaterial({color:'#efc7b9',size:.13,transparent:true,opacity:.8,depthWrite:false});owned.add(petalMaterial);const petalCloud=new T.Points(petalGeometry,petalMaterial);root.add(petalCloud);
  for(const {g,m,matrices} of buckets.values()){const mesh=new T.InstancedMesh(g,m,matrices.length);matrices.forEach((matrix,i)=>mesh.setMatrixAt(i,matrix));mesh.instanceMatrix.needsUpdate=true;mesh.userData.changanRoofDetail=g===cylinderG&&m===materials.get('roofLight');mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}buckets.clear();
  root.traverse(o=>{if(o.isMesh){o.receiveShadow=true;if(o!==ground)o.castShadow=true;}});
  function setQuality(value){low=value==='low';petalCloud.visible=!low;root.traverse(o=>{if(o.isMesh){o.castShadow=!low&&o!==ground;if(o.userData.changanRoofDetail)o.visible=!low;}});}
  setQuality(quality);
  return {ground,obstacles,
    update(dt,time,player,reduced){if(!alive)return;for(const l of lanterns)l.group.rotation.z=reduced?0:Math.sin(time*.8+l.phase)*.045;
      if(!low&&!reduced){for(const f of flags){const p=f.mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const base=i*3,x=f.base[base],y=f.base[base+1];p.setZ(i,Math.sin(time*1.7+x*1.8+y*.7+f.phase)*.12*(x/1.6));}p.needsUpdate=true;}
        const p=petalGeometry.attributes.position;for(let i=0;i<p.count;i++){let y=p.getY(i)-dt*.3;if(y<.3)y=6.5;p.setY(i,y);p.setX(i,p.getX(i)+Math.sin(time*.7+i)*dt*.1);}p.needsUpdate=true;
      }
    },setQuality,
    dispose(){if(!alive)return;alive=false;scene.remove(root);owned.forEach(r=>r.dispose());root.clear();}
  };
}
