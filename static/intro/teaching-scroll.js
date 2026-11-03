(() => {
  'use strict';
  const track = document.getElementById('teaching-scroll');
  if (!track) return;
  const scenes = [...track.querySelectorAll('.teaching-scene')];
  if (!scenes.length) return;
  const layers = scenes.map(scene => ({ scene, copy: scene.querySelector('.teaching-copy'), media: scene.querySelector('.teaching-media'), image: scene.querySelector('.teaching-media img') }));
  if (layers.some(layer => !layer.copy || !layer.media)) return;
  const buttons = [...track.querySelectorAll('[data-teaching-chapter]')];
  const reading = track.querySelector('.teaching-reading-toggle');
  const counter = track.querySelector('.teaching-counter');
  const motion = window.JingChaoIntroMotion;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const short = matchMedia('(max-height: 599px)');
  const compact = matchMedia('(max-width: 1000px)');
  const clamp = value => Math.max(0, Math.min(1, value));
  let cinematic = false, sequential = false, active = -1;
  let top = 0, distance = 1, target = 0, current = null, lastTime = 0;
  let dirty = true, frame = 0, inside = false;

  track.style.setProperty('--teaching-travel', `${(scenes.length + 1) * 105}svh`);
  track.style.setProperty('--teaching-mobile-travel', `${(scenes.length + 1) * 96.25}svh`);

  function prepareImages(index) {
    layers.slice(Math.max(0, index), index + 2).forEach(({ image }) => {
      if (image) image.loading = 'eager';
    });
  }
  function activate(index, force = false) {
    if (active === index && !force) return;
    active = index;
    layers.forEach(({ scene }, i) => {
      const selected = i === index;
      scene.classList.toggle('is-active', selected);
      scene.inert = cinematic && !selected;
      scene.setAttribute('aria-hidden', String(cinematic && !selected));
      scene.style.pointerEvents = !cinematic || selected ? 'auto' : 'none';
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.teachingChapter) === index)));
    if (counter) counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}`;
    prepareImages(index);
  }
  function resetLayers() {
    layers.forEach(({ scene, copy, media }) => {
      scene.inert = false; scene.setAttribute('aria-hidden', 'false');
      scene.style.visibility = 'visible'; scene.style.pointerEvents = 'auto';
      copy.inert = false; copy.removeAttribute('aria-hidden');
      for (const layer of [copy, media]) { layer.style.opacity = '1'; layer.style.transform = 'none'; }
    });
  }
  function readScroll() {
    dirty = false;
    // Other showcases can switch reading modes and shift our document position.
    top = track.getBoundingClientRect().top + scrollY;
    target = clamp((scrollY - top) / distance);
    inside = scrollY > top - innerHeight && scrollY < top + distance + innerHeight;
    if (!cinematic) {
      let nearest = 0;
      scenes.forEach((scene, index) => { if (scene.getBoundingClientRect().top < innerHeight * .56) nearest = index; });
      activate(nearest);
    }
    if (current === null || !inside) current = target;
  }
  function render(progress) {
    const timeline = motion.at(progress, scenes.length, compact.matches);
    activate(timeline.active);
    track.style.setProperty('--teaching-progress', progress.toFixed(5));
    layers.forEach(({ scene, copy, media }, index) => {
      const state = timeline.scenes[index], visible = state.opacity > .0001;
      scene.style.visibility = visible ? 'visible' : 'hidden';
      if (!visible) return;
      media.style.opacity = state.opacity.toFixed(4);
      media.style.transform = `translate3d(0,${state.lift.toFixed(2)}px,${state.depth.toFixed(2)}px) rotateX(${state.tilt.toFixed(2)}deg) scale(${state.scale.toFixed(5)})`;
      copy.style.opacity = state.titleOpacity.toFixed(4);
      copy.style.transform = `translate3d(0,${state.titleY.toFixed(2)}px,0)`;
      const readable = index === timeline.active && state.titleOpacity > .1;
      copy.inert = !readable;
      copy.setAttribute('aria-hidden', String(!readable));
    });
  }
  function update(now) {
    frame = 0;
    if (document.hidden) return;
    if (dirty) readScroll();
    if (!cinematic) return;
    const dt = Math.min(.064, Math.max(0, (now - lastTime) / 1000)); lastTime = now;
    const gap = target - current;
    if (Math.abs(gap) > .13) current = target - Math.sign(gap) * .13;
    current = motion.follow(current, target, dt, compact.matches ? .065 : .095);
    const settled = Math.abs(target - current) < .00012;
    if (settled) current = target;
    render(current);
    if (!settled) frame = requestAnimationFrame(update);
  }
  function requestUpdate() {
    dirty = true;
    if (!frame && !document.hidden) { lastTime = performance.now(); frame = requestAnimationFrame(update); }
  }
  function measure() {
    const next = !!motion && !reduced.matches && !short.matches && !sequential;
    if (next !== cinematic) {
      cinematic = next; track.classList.toggle('is-cinematic', cinematic); current = null;
      if (!cinematic) resetLayers();
    }
    top = track.getBoundingClientRect().top + scrollY;
    distance = Math.max(1, track.offsetHeight - innerHeight);
    if (reading) {
      reading.textContent = sequential ? '返回滚动展示' : '顺序阅读';
      reading.setAttribute('aria-pressed', String(sequential));
      reading.hidden = !motion || reduced.matches || short.matches;
    }
    activate(Math.max(0, active), true);
    requestUpdate();
  }
  function jump(index, behavior = 'smooth') {
    if (index < 0 || index >= scenes.length) return;
    prepareImages(index);
    if (cinematic) window.scrollTo({ top: top + distance * motion.chapterProgress(index, scenes.length), behavior: reduced.matches ? 'instant' : behavior });
    else scenes[index].scrollIntoView({ block: 'start', behavior: reduced.matches ? 'instant' : behavior });
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => jump(Number(button.dataset.teachingChapter)));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      else if (event.key === 'ArrowLeft') next = (index + buttons.length - 1) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else return;
      event.preventDefault(); buttons[next].focus({ preventScroll: true }); jump(Number(buttons[next].dataset.teachingChapter));
    });
  });
  reading?.addEventListener('click', () => {
    const index = Math.max(0, active); sequential = !sequential; measure();
    window.dispatchEvent(new Event('intro-layout-change'));
    requestAnimationFrame(() => jump(index, 'instant'));
  });
  function followHash() {
    const hash = location.hash.slice(1);
    if (!hash) return;
    const index = scenes.findIndex(scene => scene.id === hash);
    if (index !== -1) jump(index, 'instant');
  }
  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', measure, { passive: true });
  addEventListener('pageshow', measure);
  addEventListener('load', () => { measure(); followHash(); }, { once: true });
  addEventListener('hashchange', followHash);
  addEventListener('intro-layout-change', measure);
  [reduced, short, compact].forEach(query => query.addEventListener('change', () => {
    measure(); window.dispatchEvent(new Event('intro-layout-change'));
  }));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else { current = null; measure(); }
  });
  if ('ResizeObserver' in window) {
    // Changes above this section can move its start without changing its own height.
    const observer = new ResizeObserver(measure); observer.observe(document.body);
  }
  measure();
})();
