/* Original optical layer. Only background pixels are refracted; labels stay crisp. */
(() => {
  'use strict';
  const panels = '.meadow-film-media,.meadow-film-chapters,.meadow-film-lesson,.teaching-media,.teaching-chapters,.studio-gallery,.video-showcase,.student-question,.idea-browser,.meadow-glass,.site-nav,.hero-window,.hero-mini,.hero-floating,.shot-media,.shot-note,.chapter-dock,.limits li,.workflow-explorer,.space-item,.dual-note,.evidence-screen,.evidence-notes article,.evidence-footnote,.v6-intro-extras article,.case-figure,.case-outcome,.start-steps li,.faq-list details,.creation-lab,.creation-system-shot,.creation-theater,.image-dialog';
  const controls = '.meadow-film-chapters a,.meadow-film-reading,.teaching-chapters button,.teaching-reading-toggle,.studio-tabs button,.video-tabs button,.video-play,.idea-action-row button,.nav-links a,.nav-button,.nav-toggle,.button,.flow-tabs button,.creation-tabs button,.demo-button,.demo-copy,.demo-expand,.demo-stepper button,.layout-tools button,.binary-lamp,#demo-collapse,.image-dialog button';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const opaque = matchMedia('(prefers-reduced-transparency: reduce)');
  const contrast = matchMedia('(prefers-contrast: more)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const svgNS = 'http://www.w3.org/2000/svg';
  // WebKit currently lacks SVG displacement on a backdrop; it keeps the optical CSS layer.
  const refracts = /Chrome|Chromium|Edg\//.test(navigator.userAgent) && !/CriOS/.test(navigator.userAgent);
  const states = new WeakMap(), live = new Set(), maps = new Map(), filters = new Map(), observed = new Set();
  let frame = 0, previous = 0, hot = [], pressed = null, count = 0, scanQueued = false;
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('aria-hidden', 'true');svg.classList.add('lg-filter-bank');
  const defs = document.createElementNS(svgNS, 'defs');svg.append(defs);document.body.append(svg);
  const spring = (value = 0) => ({value, velocity: 0, target: value});
  function advance(s, dt, stiffness = 245, damping = 29) {
    const step = dt / 2;
    for (let i=0;i<2;i++) {s.velocity += ((s.target-s.value)*stiffness-s.velocity*damping)*step;s.value += s.velocity*step;}
    if (Math.abs(s.target-s.value)<.0006 && Math.abs(s.velocity)<.006) {s.value=s.target;s.velocity=0;return false;}
    return true;
  }
  function state(el) {
    let s=states.get(el);
    if (!s) {s={el,x:spring(.35),y:spring(.15),tailX:spring(.35),tailY:spring(.15),hover:spring(),press:spring(),rect:null};states.set(el,s);}
    return s;
  }
  function wake(s) {live.add(s);if(!frame&&!document.hidden){previous=performance.now();frame=requestAnimationFrame(tick);}}
  function tick(now) {
    frame=0;const dt=Math.min(.032,Math.max(.001,(now-previous)/1000));previous=now;
    for (const s of live) {
      if(!s.el.isConnected){live.delete(s);continue;}
      let moving=false;
      for(const name of ['x','y','hover','press']) moving=advance(s[name],dt)||moving;
      s.tailX.target=s.x.value;s.tailY.target=s.y.value;
      moving=advance(s.tailX,dt,100,22)||moving;moving=advance(s.tailY,dt,100,22)||moving;
      const st=s.el.style,h=s.hover.value,p=s.press.value;
      st.setProperty('--lg-x',`${(s.x.value*100).toFixed(2)}%`);st.setProperty('--lg-y',`${(s.y.value*100).toFixed(2)}%`);
      st.setProperty('--lg-tail-x',`${(s.tailX.value*100).toFixed(2)}%`);st.setProperty('--lg-tail-y',`${(s.tailY.value*100).toFixed(2)}%`);
      st.setProperty('--lg-fluid',Math.min(1,Math.hypot(s.x.value-s.tailX.value,s.y.value-s.tailY.value)*3).toFixed(4));
      st.setProperty('--lg-light',h.toFixed(4));st.setProperty('--lg-press',p.toFixed(4));
      if(s.el.classList.contains('lg-control')&&!s.el.matches('.nav a')) {
        st.setProperty('--lg-move-x',`${((s.x.value-.5)*3*h).toFixed(3)}px`);
        st.setProperty('--lg-move-y',`${((s.y.value-.5)*1.4*h-1.8*h+1.5*p).toFixed(3)}px`);
        const scale=1+.018*h-.032*p;
        st.setProperty('--lg-scale',scale.toFixed(5));
      }
      if(!moving) live.delete(s);
    }
    if(live.size)frame=requestAnimationFrame(tick);
  }

  function opticalMap(w,h,r) {
    const key=`${w},${h},${r}`;if(maps.has(key))return maps.get(key);
    const ratio=Math.min(1,280/Math.max(w,h)),mw=Math.max(2,Math.round(w*ratio)),mh=Math.max(2,Math.round(h*ratio));
    const canvas=document.createElement('canvas');canvas.width=mw;canvas.height=mh;
    const ctx=canvas.getContext('2d'),data=ctx.createImageData(mw,mh),edge=Math.min(18,Math.min(w,h)*.3);
    for(let y=0;y<mh;y++)for(let x=0;x<mw;x++) {
      const px=(x+.5)/mw*w-w/2,py=(y+.5)/mh*h-h/2,ax=Math.abs(px),ay=Math.abs(py);
      const qx=Math.max(0,ax-(w/2-r)),qy=Math.max(0,ay-(h/2-r)),ql=Math.hypot(qx,qy);
      let d,nx,ny;
      if(ql>0){d=r-ql;nx=qx/ql*Math.sign(px);ny=qy/ql*Math.sign(py);}
      else if(w/2-ax<h/2-ay){d=w/2-ax;nx=Math.sign(px);ny=0;}
      else{d=h/2-ay;nx=0;ny=Math.sign(py);}
      const t=Math.max(0,Math.min(1,d/edge)),lens=d>0&&d<edge?Math.sin(t*Math.PI)*.9:0,i=(y*mw+x)*4;
      data.data[i]=Math.round(128+nx*lens*127);data.data[i+1]=Math.round(128+ny*lens*127);data.data[i+2]=128;data.data[i+3]=255;
    }
    ctx.putImageData(data,0,0);const url=canvas.toDataURL();maps.set(key,url);if(maps.size>32)maps.delete(maps.keys().next().value);return url;
  }
  function setFilter(el) {
    if(!refracts||opaque.matches||contrast.matches||!fine.matches||(document.body.classList.contains('world-active')&&!el.matches('.modal')))return;
    if(el.parentElement?.closest('.lg-panel')&&!el.matches('.btn,.companion-launch,.command-trigger'))return;
    const rect=el.getBoundingClientRect();if(rect.width<15||rect.height<15)return;
    const w=el.offsetWidth,h=el.offsetHeight,radius=Math.round(Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius)||22,w/2,h/2));
    let f=filters.get(el);
    if(!f){
      const id=`intro-lens-${++count}`,filter=document.createElementNS(svgNS,'filter');
      filter.id=id;filter.setAttribute('filterUnits','userSpaceOnUse');filter.setAttribute('color-interpolation-filters','sRGB');
      const soft=document.createElementNS(svgNS,'feGaussianBlur');soft.setAttribute('in','SourceGraphic');soft.setAttribute('stdDeviation',el.matches('.creation-theater,.image-dialog')?'15':el.matches('.site-nav,.chapter-dock,.shot-note')?'10':'4');soft.setAttribute('result','soft');
      const img=document.createElementNS(svgNS,'feImage');img.setAttribute('result','lens');img.setAttribute('preserveAspectRatio','none');
      const dis=document.createElementNS(svgNS,'feDisplacementMap');dis.setAttribute('in','soft');dis.setAttribute('in2','lens');dis.setAttribute('xChannelSelector','R');dis.setAttribute('yChannelSelector','G');
      filter.append(soft,img,dis);defs.append(filter);f={filter,img,dis,size:''};filters.set(el,f);el.style.setProperty('--lg-refraction',`url("#${id}")`);
    }
    const size=`${w},${h},${radius}`;if(f.size===size)return;f.size=size;
    for(const n of [f.filter,f.img]) {n.setAttribute('x','0');n.setAttribute('y','0');n.setAttribute('width',w);n.setAttribute('height',h);}
    f.img.setAttribute('href',opticalMap(w,h,radius));f.dis.setAttribute('scale',el.classList.contains('lg-panel')?'25':'14');
    el.classList.add('lg-refracts');
  }
  const sizes=new ResizeObserver(entries=>{for(const e of entries){const r=e.target.getBoundingClientRect();if(r.bottom>-150&&r.top<innerHeight+150)setFilter(e.target);}});
  const nearby=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)setFilter(e.target);},{rootMargin:'150px'});
  function attach(el,type) {
    if(el.classList.contains(type)&&el.querySelector(':scope > glass-optics'))return;
    el.classList.add(type);el.classList.add('lg-host');
    if(!el.querySelector(':scope > glass-optics')){const optical=document.createElement('glass-optics');optical.setAttribute('aria-hidden','true');el.prepend(optical);}
    if(type==='lg-panel'){sizes.observe(el);nearby.observe(el);observed.add(el);}
  }
  function scan() {
    scanQueued=false;
    for(const el of observed)if(!el.isConnected){sizes.unobserve(el);nearby.unobserve(el);observed.delete(el);}
    for(const [el,f] of filters)if(!el.isConnected){f.filter.remove();sizes.unobserve(el);filters.delete(el);}
    document.querySelectorAll(panels).forEach(el=>attach(el,'lg-panel'));
    document.querySelectorAll(controls).forEach(el=>{if(!el.closest('.office-hit-tools,#office-hit-content,.meadow-canvas'))attach(el,'lg-control');});
  }

  function queueScan(){if(!scanQueued){scanQueued=true;queueMicrotask(scan);}}
  new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1&&!['GLASS-OPTICS','GLASS-NAV-LENS'].includes(n.tagName)&&!svg.contains(n))||([...r.removedNodes].some(n=>n.nodeName==='GLASS-OPTICS')&&r.target.matches?.('.lg-host')&&r.target.isConnected)))queueScan();}).observe(document.body,{childList:true,subtree:true});
  function leave(s){s.hover.target=0;s.press.target=0;wake(s);}
  document.addEventListener('pointermove',e=>{
    if(!fine.matches||reduced.matches||e.pointerType==='touch')return;
    const path=e.composedPath(),el=path.find(n=>n instanceof HTMLElement&&n.matches('.lg-control')&&!n.matches(':disabled'));
    const panel=path.find(n=>n instanceof HTMLElement&&n.matches('.lg-panel'));
    const next=[...new Set([el,panel].filter(Boolean))].map(state);
    for(const s of hot)if(!next.includes(s))leave(s);
    for(const s of next){
      const r=s.el.getBoundingClientRect();s.x.target=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));s.y.target=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));s.hover.target=1;wake(s);
      if(!hot.includes(s)&&s.el.matches('.btn,.companion-launch,.command-trigger'))setFilter(s.el);
    }
    hot=next;
  },{passive:true});
  document.addEventListener('pointerdown',e=>{const el=e.target.closest('.lg-control');if(!el||el.matches(':disabled')||reduced.matches)return;pressed=state(el);pressed.press.target=1;wake(pressed);},{passive:true});
  function release(){if(pressed){pressed.press.target=0;wake(pressed);pressed=null;}}
  document.addEventListener('pointerup',release,{passive:true});document.addEventListener('pointercancel',release,{passive:true});
  document.addEventListener('pointerout',e=>{if(!e.relatedTarget){hot.forEach(leave);hot=[];release();}},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(frame)cancelAnimationFrame(frame);frame=0;hot.forEach(leave);hot=[];release();}else if(live.size)wake([...live][0]);});
  window.addEventListener('blur',()=>{hot.forEach(leave);hot=[];release();});
  reduced.addEventListener('change',()=>{hot.forEach(leave);hot=[];});
  scan();
})();
