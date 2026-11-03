(() => {
  'use strict';
  // The pinned introduction changes document height after native fragment positioning.
  // Re-align a direct section link once layout settles, unless the visitor has taken over.
  let untouched = true;
  const initialHash = location.hash;
  for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
    window.addEventListener(event, () => { untouched = false; }, { once: true, passive: true });
  }
  function alignInitialSection() {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!untouched || !initialHash || location.hash !== initialHash) return;
      let id;
      try { id = decodeURIComponent(initialHash.slice(1)); } catch { return; }
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }));
  }
  if (document.readyState === 'complete') alignInitialSection();
  else window.addEventListener('load', alignInitialSection, { once: true });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const story = document.getElementById('question-to-world');
  const motion = document.getElementById('idea-motion-toggle');
  const strips = [...story.querySelectorAll('.idea-strip')];
  const blue = story.querySelector('.idea-blue'), gold = story.querySelector('.idea-gold');
  const diagram = story.querySelector('.idea-fractions');
  const phaseNote = document.getElementById('idea-phase-note');
  const stops = [0, 2.5, 4.8, 7.1, 8.8];
  const phaseText = ['先看两条同样长的纸带：蓝色 1/2，黄色 1/3。', '分成六等份，颜色的长度都没有改变。', '① 蓝色先下来，占结果槽的前 3 格。', '② 蓝色停好，再让黄色落到它的右侧。', '③ 两段靠拢：3 格 + 2 格 = 5 格，还空着 1 格。'];
  // One colored strip per addend: motion changes position, never length or quantity.
  const ideaPose = t => {
    const ease = n => { const x = Math.max(0, Math.min(1, n)); return x*x*(3-2*x); };
    return { blue: ease((t-2.5)/1.9), gold: ease((t-4.8)/1.9), join:ease((t-7.1)/1.3), phase:t<=1.3?0:t<=2.5?1:t<=4.8?2:t<=7.1?3:4 };
  }; // ideaPose:end
  let elapsed = 0, previous = 0, frame = 0, paused = false, visible = false, manualStep = 0, lastPhase = -1;
  let geometry = { blueY: 0, goldY: 0, goldX: 0 };
  function measureIdea() {
    const [a,b,total] = strips.map(strip => strip.getBoundingClientRect());
    geometry = { blueY:total.top-a.top, goldY:total.top-b.top, goldX:total.left-b.left+strips[2].clientWidth*.5, gap:Math.min(14,strips[2].clientWidth/6*.22) };
    drawIdea();
  }
  function drawIdea() {
    const pose = ideaPose(elapsed);
    blue.style.transform = `translate3d(0,${pose.blue*geometry.blueY}px,0)`;
    gold.style.transform = `translate3d(${pose.gold*(geometry.goldX+geometry.gap*(1-pose.join))}px,${pose.gold*geometry.goldY}px,0)`;
    diagram.dataset.phase = String(pose.phase);
    diagram.style.setProperty('--idea-split', pose.phase > 0 ? '1' : '0');
    if (lastPhase !== pose.phase) {
      lastPhase = pose.phase;
      if (phaseNote) phaseNote.textContent = phaseText[pose.phase];
      strips[2].setAttribute('aria-label', pose.phase===4?'结果槽：蓝色三格与黄色两格，共六分之五':pose.phase===3?'蓝色三格已到位，正在移动黄色两格':'结果槽：等待色块按顺序移入');
    }
  }
  function tick(now) {
    frame = 0;
    if (!visible || paused || reduced.matches || document.hidden) return;
    elapsed += Math.min(.08, Math.max(0, (now-previous)/1000)); previous = now;
    if (elapsed >= 12.4) elapsed = 0;
    drawIdea(); frame = requestAnimationFrame(tick);
  }
  function syncIdea() {
    cancelAnimationFrame(frame); frame = 0;
    if (visible && !paused && !reduced.matches && !document.hidden) { previous=performance.now(); frame=requestAnimationFrame(tick); }
    story.classList.toggle('is-paused', paused);
    motion.setAttribute('aria-pressed', String(paused && !reduced.matches));
    motion.textContent = reduced.matches ? '下一步演示' : paused ? '继续动画' : '暂停动画';
  }
  motion.addEventListener('click', () => {
    if (reduced.matches) { manualStep=(manualStep+1)%stops.length; elapsed=stops[manualStep]; drawIdea(); }
    else paused=!paused;
    syncIdea();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible=entries[0].isIntersecting; story.classList.toggle('is-visible',visible); syncIdea(); }, {threshold:.1}).observe(story);
  } else { visible=true; syncIdea(); }
  if ('ResizeObserver' in window) new ResizeObserver(measureIdea).observe(diagram);
  addEventListener('resize',measureIdea,{passive:true});
  document.addEventListener('visibilitychange',syncIdea);
  addEventListener('pagehide',()=>{cancelAnimationFrame(frame);frame=0;});
  reduced.addEventListener('change',()=>{elapsed=0;manualStep=0;paused=false;drawIdea();syncIdea();});
  measureIdea(); syncIdea();
  document.getElementById('try-question-demo').addEventListener('click', () => {
    const tab = document.getElementById('demo-tab-fraction');
    tab.click();
    document.getElementById('creation-lab').scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'start' });
    tab.focus({ preventScroll: true });
  });
})();
