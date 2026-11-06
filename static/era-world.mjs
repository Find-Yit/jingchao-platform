import {createWorldPet} from './pet-companion.mjs?v=9.2';

import * as T from './vendor/three/three.module.min.js';
import {distance,clamp} from './meadow-math.mjs?v=6.0';
const terrainHeight=()=>0;
import {createMotion,stepMotion,queueJump,cameraSafeDistance,overlaps,angleDelta,damp,RUN_SPEED} from './meadow-motion.mjs?v=10.1';
import {createExplorer} from './meadow-character.mjs?v=6.0';


export function createEraWorld(host,options={}){
 const definition=options.definition;const scene=new T.Scene();scene.background=new T.Color(definition.sky);scene.fog=new T.Fog(definition.fog||definition.sky,definition.fogNear??90,definition.fogFar??320);
 const camera=new T.PerspectiveCamera(53,1,.1,750),renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
 const touch=matchMedia('(pointer: coarse)').matches;let low=options.quality==='low';
 renderer.setPixelRatio(Math.min(devicePixelRatio,low?1:touch?1.35:1.7));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=definition.exposure||1.04;
 renderer.shadowMap.enabled=!low;renderer.shadowMap.type=T.PCFSoftShadowMap;
 const canvas=renderer.domElement;canvas.setAttribute('aria-label','时空探索场景。WASD 或方向键行走，连续空格跳跃飞起，长按空格滑翔，Shift 跑步，拖动转动视角，E 与老师交流。');canvas.tabIndex=0;host.appendChild(canvas);
 const ambient=new T.HemisphereLight('#edf5fa',definition.groundLight||'#8f8b70',definition.ambient??1.65);scene.add(ambient);
 const sun=new T.DirectionalLight(definition.sun||'#fff2d4',2.4);sun.position.set(-48,80,30);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-48,right:48,top:48,bottom:-48,near:1,far:190});sun.shadow.bias=-.0003;sun.shadow.normalBias=.035;scene.add(sun,sun.target);
 const rim=new T.DirectionalLight('#c4e5f0',.75);rim.position.set(35,20,-80);scene.add(rim);
 const environment=options.buildEra(scene,{quality:options.quality}),player=createExplorer({color:'#89b8af',accent:'#e4c986'});scene.add(player.root);
 environment.obstacles=environment.obstacles.map(o=>({...o,base:o.base??0,r:o.r??Math.hypot(o.hx||0,o.hz||0)}));
 const bound=definition.bounds||110;for(const o of [{x:bound+3,z:0,hx:3,hz:bound+6},{x:-bound-3,z:0,hx:3,hz:bound+6},{x:0,z:bound+3,hx:bound+6,hz:3},{x:0,z:-bound-3,hx:bound+6,hz:3}])environment.obstacles.push({...o,r:Math.hypot(o.hx,o.hz),base:-1,height:180});
 // 镜头防穿模用的障碍物：实体障碍物 + 场景提供的“只给镜头用”的体积（如看得见的树冠外缘）
 const cameraObstacles=environment.cameraObstacles?.length?environment.obstacles.concat(environment.cameraObstacles.map(o=>({...o,base:o.base??0,r:o.r??Math.hypot(o.hx||0,o.hz||0),cam:true}))):environment.obstacles;
 const restored=options.position&&Number.isFinite(options.position.x)&&Number.isFinite(options.position.z)&&Math.abs(options.position.x)<200&&Math.abs(options.position.z)<200?options.position:definition.spawn;
 let motion={...createMotion(restored),y:Number.isFinite(restored.y)&&restored.y>0?Math.min(restored.y,60):0},time=0,last=0,raf=0,alive=true,near=null,lastNear=null,autopath=[],destination=null,joystick={x:0,y:0},running=false,jumpHeld=false,drag=null,manualOrbitUntil=0,lastNotify=0,lastRender=0;
 let yaw=.11,targetYaw=.11,pitch=.015,targetPitch=.015,zoom=13.5,targetZoom=13.5,camDistance=14,wasPaused=false;
 let petCompanion=null,lift=0;
 const probe=new T.Vector3();
 const held=new Set(),listeners=[],resources=new Set(),npcs=[],labels=[],reducedQuery=matchMedia('(prefers-reduced-motion: reduce)');let reduced=reducedQuery.matches;
 const on=(el,event,fn,opts)=>{el.addEventListener(event,fn,opts);listeners.push(()=>el.removeEventListener(event,fn,opts));};
 function textureLabel(title,subtitle){const c=document.createElement('canvas');c.width=512;c.height=160;const ctx=c.getContext('2d');ctx.fillStyle='#fff7df';ctx.shadowColor='#354e42';ctx.shadowBlur=8;ctx.font='500 35px "PingFang SC","Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText(title,256,65);ctx.font='19px "PingFang SC","Microsoft YaHei",sans-serif';ctx.fillStyle='#eaf1dc';ctx.fillText(subtitle,256,103);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;resources.add(tex);const mat=new T.SpriteMaterial({map:tex,transparent:true,depthTest:true,depthWrite:false,opacity:.9});resources.add(mat);const sprite=new T.Sprite(mat);sprite.scale.set(6,1.9,1);return sprite;}
 for(const c of options.stations){
  const model=createExplorer({npc:true,color:c.color,accent:'#e7cf9b'}),x=c.x,z=c.z,y=terrainHeight(x,z);model.root.position.set(x,y,z);model.root.rotation.y=.05;scene.add(model.root);
  const label=textureLabel(c.title,c.teacher);label.position.set(x,y+3.1,z);scene.add(label);labels.push(label);npcs.push({c,model,x,z,label});
 }
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const sctx=shadowCanvas.getContext('2d'),gradient=sctx.createRadialGradient(64,64,8,64,64,62);gradient.addColorStop(0,'rgba(31,54,38,.38)');gradient.addColorStop(1,'rgba(31,54,38,0)');sctx.fillStyle=gradient;sctx.fillRect(0,0,128,128);const shadowTexture=new T.CanvasTexture(shadowCanvas);resources.add(shadowTexture);
 const sg=new T.PlaneGeometry(2.6,2.6);sg.rotateX(-Math.PI/2);resources.add(sg);const sm=new T.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false});resources.add(sm);const shadow=new T.Mesh(sg,sm);scene.add(shadow);
 const ringG=new T.RingGeometry(.4,.47,40);ringG.rotateX(-Math.PI/2);resources.add(ringG);const ringM=new T.MeshBasicMaterial({color:'#fff2c3',transparent:true,opacity:.8,side:T.DoubleSide,depthWrite:false});resources.add(ringM);const marker=new T.Mesh(ringG,ringM);marker.visible=false;scene.add(marker);
 const anchor=new T.Vector3(motion.x,motion.y+1.32,motion.z),desired=new T.Vector3(),delta=new T.Vector3(),raycaster=new T.Raycaster(),pointer=new T.Vector2();
 const paused=()=>document.hidden||!!document.querySelector('#modal-root .modal')||options.isPaused?.()||!!document.querySelector('.companion-panel:not([hidden])');
 function clearInput(){held.clear();joystick={x:0,y:0};jumpHeld=false;drag=null;motion.jumpBuffer=0;options.onInputReset?.();}
 function endAuto(){const had=autopath.length||destination;autopath=[];destination=null;marker.visible=false;if(had)options.onNavigation?.(null);}
 function navigatePoint(point,id=null){if(!safeSpot(point)){options.onNotice?.('这里有建筑或障碍，换一个落脚点试试。');return false;}autopath=[point];destination=id;marker.position.set(point.x,.13,point.z);marker.visible=true;options.onNavigation?.(id);return true;}
 function safeSpot(p){return Math.abs(p.x)<bound-1&&Math.abs(p.z)<bound-1&&!environment.obstacles.some(o=>overlaps(p.x,p.z,o,.65)&&o.base<2&&o.base+o.height>0);}
 function landingSpot(p){for(let r=0;r<12;r+=.8)for(let i=0;i<(r?24:1);i++){const q={x:p.x+Math.cos(i*Math.PI/12)*r,z:p.z+Math.sin(i*Math.PI/12)*r};if(safeSpot(q))return q;}return null;}
 let travelTimer=0,blockedTime=0;
 function teleport(point,id=null){const target=landingSpot(point,environment.obstacles);if(!target){options.onNotice?.('这附近没有安全的落脚点，试试旁边的草地。');return false;}endAuto();clearInput();motion={...createMotion(target),y:0};motion.heading=Math.PI;petCompanion?.reset(motion);cameraUpdate(0,true);host.classList.remove('meadow-warp');void host.offsetWidth;host.classList.add('meadow-warp');clearTimeout(travelTimer);travelTimer=setTimeout(()=>host.classList.remove('meadow-warp'),800);options.onNotice?.(id?'已到达学习点，靠近导览员即可交流。':'已闪现到安全落脚点。');options.onNavigation?.(null);return true;}
 function travel(id){const n=npcs.find(n=>n.c.id===id);return n?teleport({x:n.x,z:n.z+3.3},id):false;}
 function navigate(id){const n=npcs.find(n=>n.c.id===id);if(n)return navigatePoint({x:n.x,z:n.z+3.3},id);return false;}
 function jump(){if(!paused()){queueJump(motion);jumpHeld=true;endAuto();}}
 const movementKeys=['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowLeft','ArrowDown','ArrowRight','ShiftLeft','ShiftRight'];
 on(window,'keydown',e=>{
  if(paused()||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
  if(movementKeys.includes(e.code)){e.preventDefault();held.add(e.code);if(!e.code.startsWith('Shift'))endAuto();}
  if(e.code==='Space'&&e.target.tagName!=='BUTTON'){e.preventDefault();if(!e.repeat)jump();}
  if(e.code==='KeyE'&&!e.repeat&&near)options.onInteract?.(near.c.id);
 });
 on(window,'keyup',e=>{held.delete(e.code);if(e.code==='Space')jumpHeld=false;});on(window,'blur',clearInput);on(document,'visibilitychange',()=>{clearInput();last=0;});on(reducedQuery,'change',()=>reduced=reducedQuery.matches);
 on(canvas,'pointerdown',e=>{if(paused()||e.button!==0||drag)return;canvas.focus({preventScroll:true});drag={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);});
 on(canvas,'pointermove',e=>{if(!drag||e.pointerId!==drag.id||paused())return;const dx=e.clientX-drag.lastX,dy=e.clientY-drag.lastY;drag.moved ||= Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>5;if(drag.moved){const scale=clamp(720/host.clientWidth,.65,1.35);targetYaw-=dx*.004*scale;targetPitch=clamp(targetPitch+dy*.003*scale,-.15,1.05);manualOrbitUntil=time+3;}drag.lastX=e.clientX;drag.lastY=e.clientY;});
 on(canvas,'pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const click=!drag.moved;drag=null;if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);if(click&&!paused()){const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObject(environment.ground)[0];if(hit&&distance(motion,hit.point)<150)navigatePoint({x:hit.point.x,z:hit.point.z});}});
 on(canvas,'pointercancel',()=>drag=null);on(canvas,'lostpointercapture',()=>drag=null);on(canvas,'contextmenu',e=>e.preventDefault());
 on(canvas,'wheel',e=>{if(!paused()){e.preventDefault();targetZoom=clamp(targetZoom+e.deltaY*.009,5,17);}},{passive:false});
 const resize=()=>{const {width,height}=host.getBoundingClientRect();if(width&&height){renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();}};
 const observer=new ResizeObserver(resize);observer.observe(host);resize();
 on(canvas,'webglcontextlost',e=>{e.preventDefault();options.onError?.('场景显示暂时中断，可以刷新重试，也可以从地图继续学习。');});
 function cameraUpdate(dt,initial=false){
  if(autopath.length&&motion.speed>.3&&!drag&&time>manualOrbitUntil)targetYaw+=angleDelta(targetYaw,motion.heading+Math.PI)*(1-Math.exp(-1.5*dt));
  yaw+=angleDelta(yaw,targetYaw)*(1-Math.exp(-20*dt));pitch=damp(pitch,targetPitch,18,dt);zoom=damp(zoom,targetZoom+(motion.speed>6?.65:0),5,dt);
  const ground=terrainHeight(motion.x,motion.z),jumpHeight=Math.max(0,motion.y-ground);
  const x=motion.x+motion.vx*.045,z=motion.z+motion.vz*.045,y=ground+1.34+jumpHeight*.96;
  if(initial)anchor.set(x,y,z);else{anchor.x=damp(anchor.x,x,16,dt);anchor.z=damp(anchor.z,z,16,dt);anchor.y=damp(anchor.y,y,motion.grounded?10:12,dt);}
  // 屋顶或石阶挡住视线时先抬高镜头越过去，实在不行才拉近
  const orbit=(target,p)=>target.set(anchor.x+Math.sin(yaw)*Math.cos(p)*zoom,Math.max(anchor.y+Math.sin(p)*zoom+.6,terrainHeight(anchor.x,anchor.z)+.7),anchor.z+Math.cos(yaw)*Math.cos(p)*zoom);
  let wantLift=0;const clear=zoom*.72;
  // 依次试不抬和抬高 0.25–1.0：取第一个视线通畅的；都不通畅时取看得最远的（不再停在最高角度，免得头顶有树冠时镜头贴到脸上）
  const now=cameraSafeDistance(anchor,orbit(probe,pitch+lift),cameraObstacles,terrainHeight);
  if(now<clear){let best=lift,bestD=now;for(const extra of [0,.25,.5,.75,1.0]){const p=Math.min(1.25,pitch+extra);if(Math.abs(p-pitch-lift)<1e-6)continue;const d=cameraSafeDistance(anchor,orbit(probe,p),cameraObstacles,terrainHeight);if(d>=clear){best=p-pitch;break;}if(d>bestD+.5){best=p-pitch;bestD=d;}}wantLift=best;}
  else if(lift>0&&cameraSafeDistance(anchor,orbit(probe,pitch+Math.max(0,lift-.25)),cameraObstacles,terrainHeight)>=clear)wantLift=Math.max(0,lift-.25);else wantLift=lift;
  lift=initial?wantLift:damp(lift,wantLift,wantLift>lift?7:1.6,dt);
  orbit(desired,pitch+lift);
  const safe=cameraSafeDistance(anchor,desired,cameraObstacles,terrainHeight);camDistance=initial?safe:damp(camDistance,safe,safe<camDistance?28:4.5,dt);
  delta.copy(desired).sub(anchor).normalize().multiplyScalar(camDistance);camera.position.copy(anchor).add(delta);camera.lookAt(anchor);
  const nextFov=damp(camera.fov,motion.speed>6?56:53,2.5,dt);if(Math.abs(nextFov-camera.fov)>.005){camera.fov=nextFov;camera.updateProjectionMatrix();}
  player.root.visible=camDistance>1.6;
 }
 cameraUpdate(0,true);
 function frame(ms){
  if(!alive)return;raf=requestAnimationFrame(frame);if(document.hidden){last=0;return;}const dt=Math.min(last?(ms-last)/1000:0,.05);last=ms;time+=dt;
  const stop=!!paused();if(stop&&!wasPaused){clearInput();motion.vx=0;motion.vz=0;motion.speed=0;}wasPaused=stop;
  let x=0,z=0,run=running||held.has('ShiftLeft')||held.has('ShiftRight');
  if(!stop){
   const strafe=(held.has('KeyD')||held.has('ArrowRight')?1:0)-(held.has('KeyA')||held.has('ArrowLeft')?1:0)+joystick.x;
   const forward=(held.has('KeyW')||held.has('ArrowUp')?1:0)-(held.has('KeyS')||held.has('ArrowDown')?1:0)-joystick.y;
   if(Math.hypot(strafe,forward)>.04){endAuto();x=strafe*Math.cos(yaw)-forward*Math.sin(yaw);z=-strafe*Math.sin(yaw)-forward*Math.cos(yaw);}
   else if(autopath.length){const target=autopath[0],d=distance(motion,target);if(d<.7){autopath.shift();if(!autopath.length)endAuto();}else{x=(target.x-motion.x)/d;z=(target.z-motion.z)/d;if(autopath.length===1&&d<2){const slow=clamp(d/2,.25,1);x*=slow;z*=slow;run=false;}}}
   stepMotion(motion,{x,z,run,jumpHeld},dt,environment.obstacles,terrainHeight);
   if(autopath.length&&Math.hypot(x,z)>.1&&motion.speed<.03){blockedTime+=dt;if(blockedTime>1){endAuto();options.onNotice?.('前面有障碍，请绕行或打开地图传送。');blockedTime=0;}}else blockedTime=0;
  }
  petCompanion?.update(stop?0:dt,motion,reduced);
  player.root.position.set(motion.x,motion.y,motion.z);player.root.rotation.y=motion.heading;
  player.update(stop?0:dt,{time,speed:motion.speed,maxSpeed:RUN_SPEED,grounded:motion.grounded,verticalVelocity:motion.vy,turn:motion.turn,landing:motion.landing,reducedMotion:reduced});
  const altitude=Math.max(0,motion.y-terrainHeight(motion.x,motion.z));shadow.position.set(motion.x,terrainHeight(motion.x,motion.z)+.08,motion.z);shadow.scale.setScalar(1+altitude*.15);sm.opacity=clamp(1-altitude*.24,.15,1);
  cameraUpdate(dt);
  near=motion.grounded?npcs.reduce((best,n)=>distance(motion,n)<5.5&&(!best||distance(motion,n)<distance(motion,best))?n:best,null):null;
  if(near?.c.id!==lastNear){lastNear=near?.c.id;options.onNear?.(lastNear||null);if(near)options.onVisit?.(near.c.id);}
  for(const n of npcs){const d=distance(motion,n);n.model.root.visible=d<(low?55:75);n.label.visible=d<45;n.label.material.opacity=clamp((45-d)/14,0,.95);if(n.model.root.visible){n.model.root.rotation.y=damp(n.model.root.rotation.y,n===near?Math.atan2(motion.x-n.x,motion.z-n.z):.1,3,dt);n.model.update(dt,{time,speed:0,grounded:true,wave:n===near?1:0,reducedMotion:reduced});}}
  environment.update(dt,time,motion,reduced);
  if(ms-lastNotify>140){lastNotify=ms;host.dataset.position=[motion.x,motion.y,motion.z].map(x=>x.toFixed(2)).join(',');if(petCompanion){const p=petCompanion.state;host.dataset.petPosition=[p.x,p.y,p.z].map(x=>x.toFixed(2)).join(',');host.dataset.petMode=p.mode;host.dataset.petSpecies=petCompanion.species;host.dataset.petRecalls=p.recalls;}const nearest=npcs.reduce((a,b)=>distance(motion,a)<distance(motion,b)?a:b);host.dataset.position=`${motion.x.toFixed(1)},${motion.y.toFixed(1)},${motion.z.toFixed(1)}`;host.dataset.drawCalls=String(renderer.info.render.calls);options.onMove?.({x:motion.x,z:motion.z,yaw,nearest:nearest.c.id,distance:Math.round(distance(motion,nearest)),destination,movement:!motion.grounded?(motion.vy>0?'乘风上升':jumpHeld?'滑翔':'落下'):motion.speed>6?'奔跑':motion.speed>.2?'漫步':'驻足'});}
  if(low&&ms-lastRender<31)return;lastRender=ms;const sx=Math.round(motion.x*20)/20,sz=Math.round(motion.z*20)/20;sun.position.set(sx-48,80,sz+30);sun.target.position.set(sx,0,sz);renderer.render(scene,camera);
 }
 raf=requestAnimationFrame(frame);options.onReady?.();
 return {
  setPet(pet){if(!alive)return;petCompanion?.dispose();petCompanion=pet?createWorldPet(scene,pet,{height:terrainHeight,obstacles:environment.obstacles,bound:bound,leader:motion}):null;},
  navigate,travel,teleport,jump,releaseJump(){jumpHeld=false;},setRunning(v){running=!!v;},stop(){endAuto();motion.vx=0;motion.vz=0;},
  setJoystick(x,y){joystick={x,y};if(Math.hypot(x,y)>.05)endAuto();},
  setQuality(value){low=value==='low';renderer.setPixelRatio(low?1:Math.min(devicePixelRatio,touch?1.35:1.7));renderer.shadowMap.enabled=!low;environment.setQuality(value);resize();},
  reset(){motion={...createMotion(definition.spawn),y:0};yaw=targetYaw=.11;pitch=targetPitch=.015;endAuto();clearInput();petCompanion?.reset(motion);cameraUpdate(0,true);},
  snapshot(){const ratio=renderer.getPixelRatio();try{renderer.setPixelRatio(Math.min(2,4096/Math.max(host.clientWidth,host.clientHeight)));renderer.render(scene,camera);return renderer.domElement.toDataURL('image/png');}finally{renderer.setPixelRatio(ratio);renderer.render(scene,camera);}},
  getPosition:()=>({x:motion.x,z:motion.z}),
  dispose(){if(!alive)return;alive=false;clearTimeout(travelTimer);cancelAnimationFrame(raf);observer.disconnect();listeners.forEach(fn=>fn());petCompanion?.dispose();petCompanion=null;environment.dispose();player.dispose();npcs.forEach(n=>n.model.dispose());resources.forEach(r=>r.dispose());renderer.dispose();renderer.forceContextLoss();canvas.remove();}
 };
}
