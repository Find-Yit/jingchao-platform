import * as T from './vendor/three/three.module.min.js';

// Original procedural plush companions. No textures, network calls, DOM or renderer ownership.
// Shared immutable resources are retained until the last live companion is disposed.
const TAU=Math.PI*2, sharedGeometry=new Map(), sharedMaterial=new Map();
let liveModels=0;
const palettes={
 dragon:{body:'#9acfc0',light:'#d6eee1',shade:'#69a796',ear:'#72b4aa',accent:'#efcf86'},
 rabbit:{body:'#f1e8df',light:'#fff8ef',shade:'#cfb9b6',ear:'#e8b7bc',accent:'#e3a8b5'},
 dog:{body:'#dcb586',light:'#f7e2bc',shade:'#b78d69',ear:'#9e765c',accent:'#9ec5c2'},
 cat:{body:'#c6bfd8',light:'#eae6f0',shade:'#a094b8',ear:'#d5b2c9',accent:'#ebc879'},
};
const finite=(value,fallback=0)=>Number.isFinite(value)?value:fallback;
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const damp=(a,b,rate,dt)=>b+(a-b)*Math.exp(-rate*dt);
function geometry(key,make){if(!sharedGeometry.has(key))sharedGeometry.set(key,make());return sharedGeometry.get(key);}
function material(color,kind='soft'){
 const key=color+':'+kind;
 if(!sharedMaterial.has(key))sharedMaterial.set(key,new T.MeshStandardMaterial({color,roughness:kind==='eye'?.2:kind==='gold'?.5:.8,metalness:kind==='gold'?.16:0,
  ...(kind==='glow'?{emissive:color,emissiveIntensity:.48}:{}),...(kind==='wing'?{side:T.DoubleSide,emissive:'#cbdedb',emissiveIntensity:.12}:{}),
 }));
 return sharedMaterial.get(key);
}
function releaseShared(){if(liveModels)return;for(const resource of sharedGeometry.values())resource.dispose();for(const resource of sharedMaterial.values())resource.dispose();sharedGeometry.clear();sharedMaterial.clear();}
const sphere=()=>geometry('sphere',()=>new T.SphereGeometry(1,20,14));
function shapeGeometry(key,points,depth=.025){return geometry(key,()=>{const shape=new T.Shape();shape.moveTo(...points[0]);for(const p of points.slice(1))p.length===4?shape.quadraticCurveTo(...p):shape.lineTo(...p);shape.closePath();return new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelThickness:.008,bevelSize:.008,bevelSegments:2,curveSegments:12,steps:1});});}
function starGeometry(){return geometry('star',()=>{const shape=new T.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5,r=i%2?.43:1,x=Math.sin(a)*r,y=Math.cos(a)*r;i?shape.lineTo(x,y):shape.moveTo(x,y);}shape.closePath();return new T.ExtrudeGeometry(shape,{depth:.18,bevelEnabled:true,bevelThickness:.06,bevelSize:.035,bevelSegments:1,steps:1});});}
function tube(key,points,radius=.03,taper=true){return geometry(key,()=>{
 const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),segments=22,sides=8,frames=curve.computeFrenetFrames(segments,false),vertices=[],normals=[],indices=[];
 for(let i=0;i<=segments;i++){const t=i/segments,center=curve.getPoint(t),r=radius*(taper?Math.max(.08,1-Math.pow(t,1.5)*.92):1);for(let j=0;j<=sides;j++){const angle=j/sides*TAU,n=new T.Vector3().copy(frames.normals[i]).multiplyScalar(Math.cos(angle)).addScaledVector(frames.binormals[i],Math.sin(angle));vertices.push(center.x+n.x*r,center.y+n.y*r,center.z+n.z*r);normals.push(n.x,n.y,n.z);if(i<segments&&j<sides){const a=i*(sides+1)+j,b=a+sides+1;indices.push(a,b,a+1,b,b+1,a+1);}}}
 const result=new T.BufferGeometry();result.setAttribute('position',new T.Float32BufferAttribute(vertices,3));result.setAttribute('normal',new T.Float32BufferAttribute(normals,3));result.setIndex(indices);return result;
 });}

/** root feet at y=0, +Z forward. Caller owns root position/rotation/scene and the follow physics. */
export function createPetCompanionModel({species='dragon',stage=1,level=1,nickname='学习伙伴'}={}){
 if(!Object.hasOwn(palettes,species))species='dragon';
 const stageNumber=clamp(Math.round(typeof stage==='string'?({baby:1,growing:2,shining:3}[stage]||Number(stage)||1):finite(stage,1)),1,3);
 level=clamp(Math.floor(finite(level,1)),1,99);nickname=String(nickname??'学习伙伴').slice(0,32);
 const colors=palettes[species],root=new T.Group(),sizing=new T.Group(),rig=new T.Group(),torso=new T.Group();
 root.name=`pet-companion:${species}`;root.add(sizing);sizing.add(rig);rig.add(torso);liveModels++;
 const soft=material(colors.body),light=material(colors.light),shade=material(colors.shade),earMat=material(colors.ear),accent=material(colors.accent,'gold'),eyeMat=material('#293e3d','eye'),shine=material('#fffdf3','glow'),blush=material('#dca5ad'),noseMat=material(species==='dog'?'#584c43':'#997a7c');
 const meshes=[],legs=[],ears=[],wings=[],eyes=[],sparkles=[];let alive=true,clock=0,phase=0,airBlend=0;
 function mesh(g,m,parent=torso,name=''){const result=new T.Mesh(g,m);result.castShadow=true;result.receiveShadow=true;result.name=name;parent.add(result);meshes.push(result);return result;}
 function ball(m,x,y,z,sx,sy,sz,parent=torso,name=''){const result=mesh(sphere(),m,parent,name);result.position.set(x,y,z);result.scale.set(sx,sy,sz);return result;}
 function joint(parent,x,y,z,name){const group=new T.Group();group.name=name;group.position.set(x,y,z);parent.add(group);return group;}
 // Continuous pear body, broad soft forehead and small paws preserve a toy-like silhouette at distance.
 const pear=geometry('pear',()=>new T.LatheGeometry([[0,0],[.12,.015],[.22,.09],[.255,.22],[.225,.37],[.155,.47],[.07,.50],[0,.505]].map(p=>new T.Vector2(...p)),24));
 const body=mesh(pear,soft,torso,'pet:body');body.position.set(0,.13,-.07);body.scale.z=1.05;
 ball(light,0,.365,.165,.17,.19,.032,torso,'pet:belly');
 const head=joint(torso,0,.775,.12,'pet:head');
 ball(soft,0,0,0,.325,.30,.29,head,'pet:face');
 ball(light,0,-.083,.265,.145,.095,.073,head,'pet:muzzle');
 ball(noseMat,0,-.035,.338,.034,.025,.025,head,'pet:nose');
 const smile=tube('smile',[[-.065,-.10,.32],[-.035,-.12,.336],[0,-.095,.34],[.035,-.12,.336],[.065,-.10,.32]],.007,false);
 mesh(smile,material('#8b8178'),head,'pet:smile');
 for(const side of [-1,1]){
  const eyelid=joint(head,side*.137,.039,.264,'pet:eye-rig');
  ball(eyeMat,0,0,0,.052,.068,.032,eyelid,'pet:eye');
  ball(shine,-.014,.025,.026,.014,.016,.009,eyelid,'pet:eye-glint');eyes.push(eyelid);
  const cheek=ball(blush,side*.21,-.07,.219,.047,.026,.014,head,'pet:cheek');cheek.rotation.y=side*.44;
 }
 // Four independent leg pivots; rear legs alternate with the opposite front paw while walking.
 for(const front of [false,true])for(const side of [-1,1]){
  const leg=joint(rig,side*.183,.29,front?.13:-.245,'pet:leg');
  ball(soft,0,-.08,0,.073,.13,.081,leg,'pet:leg-upper');
  ball(shade,0,-.22,.041,.096,.07,.117,leg,'pet:paw');
  legs.push({group:leg,side,front,baseY:.29});
 }
 for(const side of [-1,1]){
  const pivot=joint(head,side*(species==='dog'?.286:.155),species==='dog'?.135:.177,species==='rabbit'?-.025:0,'pet:ear');
  pivot.rotation.z=side*(species==='rabbit'?-.16:species==='cat'?-.14:species==='dog'?.10:-.55);ears.push({group:pivot,side,base:pivot.rotation.z});
  if(species==='rabbit'){
   ball(soft,0,.16,0,.077,.235,.065,pivot,'pet:ear-outer');ball(earMat,0,.165,.056,.041,.172,.013,pivot,'pet:ear-inner');
  }else if(species==='dog'){
   ball(earMat,side*.02,-.13,.015,.114,.225,.075,pivot,'pet:ear-outer');ball(shade,side*.018,-.15,.078,.062,.14,.013,pivot,'pet:ear-inner');
  }else{
   const ear=shapeGeometry('pointed-ear',[[0,0],[-.10,.02],[-.12,.11],[0,.27,.022,.25],[.13,.10,.105,.016],[0,0]],.045);
   const outside=mesh(ear,species==='dragon'?earMat:soft,pivot,'pet:ear-outer');outside.position.z=-.035;outside.scale.set(species==='dragon'?.84:1,species==='dragon'?.65:1,1);
   const inner=mesh(ear,species==='dragon'?light:earMat,pivot,'pet:ear-inner');inner.scale.set(.56,species==='dragon'?.35:.58,.18);inner.position.set(0,.024,.023);
  }
 }
 const tail=joint(rig,0,.30,-.29,'pet:tail');
 if(species==='rabbit'){ball(light,0,.05,-.045,.135,.125,.135,tail,'pet:pom-tail');}
 else{
  const paths={dragon:[[0,0,0],[0,-.005,-.18],[.12,.07,-.35],[.22,.20,-.48]],dog:[[0,0,0],[0,.12,-.17],[.025,.29,-.24],[.055,.36,-.20]],cat:[[0,0,0],[.06,.13,-.22],[.08,.44,-.29],[.02,.61,-.22],[-.09,.60,-.19],[-.13,.49,-.21]]};
  mesh(tube('tail:'+species,paths[species],species==='dragon'?.10:species==='dog'?.065:.052,true),shade,tail,'pet:tail-shape');
  if(species==='dragon'){const tip=mesh(starGeometry(),accent,tail,'pet:tail-star');tip.position.set(.22,.20,-.48);tip.rotation.x=.25;tip.scale.setScalar(.065);}
 }
 const collar=mesh(geometry('collar',()=>new T.TorusGeometry(.205,.025,7,32)),accent,torso,'pet:collar');collar.position.set(0,.565,.045);collar.rotation.x=Math.PI/2;collar.scale.set(1.04,1.12,1);
 const charm=mesh(starGeometry(),shine,torso,'pet:star-charm');charm.position.set(0,.52,.267);charm.scale.set(.045,.045,.04);
 if(species==='dragon'){
  const horn=geometry('horn',()=>new T.ConeGeometry(.041,.16,12));
  for(const side of [-1,1]){const h=mesh(horn,accent,head,'pet:horn');h.position.set(side*.15,.295,-.065);h.rotation.z=side*-.18;}
  for(let i=0;i<3;i++){const spine=mesh(horn,accent,torso,'pet:spine');spine.position.set(0,.57-i*.115,-.205);spine.rotation.x=-1.1;spine.scale.setScalar(.50-i*.08);}
 }
 // Both wing types are solid bevelled forms. Non-dragon companions reveal tiny light wings in flight.
 const wingContainer=joint(rig,0,.48,-.09,'pet:wings');
 const dragonWing=shapeGeometry('dragon-wing',[[0,0],[.20,.26,.48,.29],[.68,.30,.66,.07],[.48,.08,.43,-.065],[.33,.045,.25,-.12],[.15,-.04,0,-.08]],.023);
 const lightWing=shapeGeometry('light-wing',[[0,0],[.18,.19,.43,.25],[.52,.30,.48,.18],[.56,.16,.39,.08],[.46,.04,.30,-.025],[.34,-.085,.19,-.10],[.10,-.16,0,-.07]],.024);
 for(const side of [-1,1]){
  const pivot=joint(wingContainer,side*.20,.015,0,'pet:wing');pivot.scale.x=side;
  mesh(species==='dragon'?dragonWing:lightWing,species==='dragon'?earMat:material('#e8f2ee','wing'),pivot,'pet:wing-membrane');
  if(species==='dragon')mesh(tube('wing-rib',[[0,0,.03],[.20,.12,.04],[.45,.20,.04],[.64,.13,.03]],.012,true),light,pivot,'pet:wing-rib');
  wings.push({group:pivot,side});
 }
 if(species!=='dragon')wingContainer.visible=false;
 const flightDust=joint(rig,0,.35,-.27,'pet:flight-stars');flightDust.visible=false;
 for(let i=0;i<3;i++){const star=mesh(starGeometry(),material(i%2?'#ead6a2':'#d7efdf','glow'),flightDust,'pet:flight-star');star.scale.setScalar(.028+i*.006);star.castShadow=star.receiveShadow=false;sparkles.push(star);}
 if(stageNumber===3){
  const crown=joint(head,0,.315,-.025,'pet:crown');
  const ring=mesh(geometry('crown-ring',()=>new T.TorusGeometry(.095,.012,6,24)),accent,crown,'pet:crown-ring');ring.rotation.x=Math.PI/2;
  for(const side of [-1,0,1]){const jewel=mesh(starGeometry(),accent,crown,'pet:crown-star');jewel.position.set(side*.077,.04+(side===0?.018:0),.035);jewel.scale.setScalar(side===0?.035:.027);}
 }
 // Normalize each species/stage once, without touching caller-controlled root transforms.
 rig.updateMatrixWorld(true);const initialBox=new T.Box3().setFromObject(rig),height=initialBox.max.y-initialBox.min.y;
 const desiredHeight={dragon:1.35,rabbit:1.40,dog:1.25,cat:1.28}[species]*[.88,.94,1][stageNumber-1];
 sizing.scale.setScalar(desiredHeight/height);rig.position.y=-initialBox.min.y;const baseY=rig.position.y;
 root.userData={kind:'learning-companion',species,stage:stageNumber,level,nickname,height:desiredHeight,meshCount:meshes.length};
 const metadata=root.userData;
 function update(dt=0,input={}){
  if(!alive)return;input=input&&typeof input==='object'?input:{};dt=clamp(finite(dt),0,.1);clock=Number.isFinite(input.time)?input.time:clock+dt;
  const speed=clamp(finite(input.speed),0,20),moving=clamp(speed/6,0,1),grounded=input.grounded!==false,airborne=input.flying===true||!grounded,landing=clamp(finite(input.landing),0,1),vy=clamp(finite(input.verticalVelocity),-25,25),reduced=!!input.reducedMotion;
  phase+=dt*(speed>.08?5.5+speed*1.6:0);airBlend=reduced?(airborne?1:0):damp(airBlend,airborne?1:0,10,dt);
  const stride=reduced?0:Math.sin(phase),travel=reduced?0:Math.abs(Math.sin(phase))*moving*.024;
  rig.position.y=baseY+(grounded?travel:reduced?0:Math.sin(clock*2.1)*.012);
  rig.rotation.x=reduced?0:airBlend*-.10+(grounded?moving*.035:clamp(vy*.004,-.055,.055));rig.rotation.z=0;
  rig.scale.set(1+landing*.022,1-landing*.045,1+landing*.022);
  torso.scale.y=reduced?1:1+Math.sin(clock*2.2)*.009*(1-moving);torso.position.y=0;
  head.rotation.x=reduced?0:(grounded?stride*moving*.035:airBlend*-.035);
  head.rotation.y=reduced?0:Math.sin(clock*.63)*.055*(1-moving);head.rotation.z=0;
  for(const leg of legs){const offset=(leg.front?(leg.side>0?0:Math.PI):(leg.side>0?Math.PI:0));const swing=reduced?0:Math.sin(phase+offset);
   leg.group.rotation.x=grounded?swing*moving*.38:-.33-airBlend*.12;leg.group.rotation.z=grounded?0:leg.side*.07;
   leg.group.position.y=leg.baseY+(grounded&&!reduced?Math.max(0,Math.cos(phase+offset))*moving*.035:0);
  }
  for(const ear of ears){ear.group.rotation.z=ear.base+(reduced?0:Math.sin(clock*1.8+ear.side)*.025+stride*moving*.07);ear.group.rotation.x=reduced?0:airBlend*-.10+Math.sin(phase)*moving*.04;}
  tail.rotation.y=reduced?0:Math.sin(clock*(species==='dog'?6.5:3.3))*(species==='dog'?.36:.14);tail.rotation.z=reduced?0:Math.sin(clock*2.1)*.05;
  const blinkPhase=((clock%5.3)+5.3)%5.3,blink=reduced?1:blinkPhase>4.85&&blinkPhase<5.02?Math.max(.08,Math.abs(blinkPhase-4.935)/.085):1;
  eyes.forEach(eye=>eye.scale.y=blink);
  wingContainer.visible=species==='dragon'||airBlend>.02;
  for(const wing of wings){wing.group.rotation.y=(species==='dragon'?1.1*(1-airBlend):.75*(1-airBlend));wing.group.rotation.z=(reduced?.10:Math.sin(clock*(airborne?9:2.3))*(airborne?.42:.035))+(1-airBlend)*-.25;wing.group.scale.y=species==='dragon'?.68+airBlend*.32:airBlend;wing.group.scale.z=1;}
  flightDust.visible=airBlend>.2;
  sparkles.forEach((star,i)=>{const t=reduced?i*TAU/3:clock*1.2+i*TAU/3;star.position.set(Math.sin(t)*(.28+i*.04),.05+Math.cos(t*.7)*.10,-.10-i*.085);star.rotation.z=reduced?.25:clock*.5+i;});
 }
 update(0,{time:0,grounded:true,reducedMotion:true});root.updateMatrixWorld(true);
 return {root,update,metadata,dispose(){if(!alive)return;alive=false;root.removeFromParent();root.clear();liveModels--;releaseShared();}};
}
