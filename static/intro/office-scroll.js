(() => {
  'use strict';
  const track = document.getElementById('office-scroll');
  if (!track) return;
  const scenes = [...track.querySelectorAll('.office-scene')];
  const videos = scenes.map(scene => scene.querySelector('video'));
  const buttons = [...track.querySelectorAll('[data-office-chapter]')];
  const reading = track.querySelector('.office-reading-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const short = matchMedia('(max-height: 599px)');
  const compact = matchMedia('(max-width: 760px)');
  const motion = window.JingChaoIntroMotion;
  const systemPauses = new WeakSet(), manualPauses = new WeakSet();
  let cinematic = false, sequential = false, top = 0, distance = 1, active = -1;
  let target = 0, current = null, lastTime = 0, frame = 0, dirty = true, inside = false;
  const clamp = v => Math.max(0, Math.min(1, v));
  const fullscreen = () => !!document.fullscreenElement || videos.some(video => video.webkitDisplayingFullscreen);
  function pause(video) {
    if (video.paused) return;
    systemPauses.add(video); video.pause();
  }
  function autoPlay(index) {
    const video = videos[index];
    if (index < 0 || !inside || !cinematic || reduced.matches || document.hidden || manualPauses.has(video) || video.ended) return;
    video.muted = true;
    video.play().catch(() => { /* Native play controls remain available when autoplay is blocked. */ });
  }
  function activate(index) {
    if (active === index) return;
    active = index;
    scenes.forEach((scene, i) => {
      const selected = i === index;
      scene.classList.toggle('is-active', selected);
      scene.inert = cinematic && !selected;
      scene.setAttribute('aria-hidden', String(cinematic && !selected));
      scene.style.pointerEvents = !cinematic || selected ? 'auto' : 'none';
      buttons[i].setAttribute('aria-pressed', String(selected));
      if (cinematic && !selected) pause(videos[i]);
    });
    autoPlay(index);
  }
  function readScroll() {
    dirty = false;
    target = clamp((scrollY - top) / distance);
    const wasInside = inside;
    inside = scrollY >= top - innerHeight * .18 && scrollY <= top + distance + innerHeight * .12;
    if (wasInside !== inside) {
      if (!inside) videos.forEach(pause);
      else if (active >= 0) autoPlay(active);
    }
    if (current === null || !inside) current = target;
  }
  function render(progress) {
    const timeline = motion.at(progress, scenes.length, compact.matches);
    activate(timeline.active);
    scenes.forEach((scene, i) => {
      const state = timeline.scenes[i], visible = state.opacity > .0001;
      scene.style.visibility = visible ? 'visible' : 'hidden';
      if (!visible) return;
      const media = scene.querySelector('.office-media');
      media.style.opacity = state.opacity.toFixed(4);
      media.style.transform = `translate3d(0,${state.lift.toFixed(2)}px,${state.depth.toFixed(2)}px) rotateX(${state.tilt.toFixed(2)}deg) scale(${state.scale.toFixed(4)})`;
      const copy = scene.querySelector('.office-scene-copy');
      // Keep the course title readable during the chapter's entire reading interval.
      copy.style.opacity = state.opacity.toFixed(4);
      copy.style.transform = `translateY(${state.titleY.toFixed(2)}px)`;
      scene.querySelector('.office-actions').style.opacity = state.opacity.toFixed(4);
    });
  }
  function update(now) {
    frame = 0;
    if (document.hidden || fullscreen()) return;
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
    if (fullscreen()) return;
    const next = !!motion && !reduced.matches && !short.matches && !sequential;
    if (next !== cinematic) {
      cinematic = next; track.classList.toggle('is-cinematic', next); current = null;
      if (!next) {
        scenes.forEach(scene => {
          scene.inert = false; scene.setAttribute('aria-hidden', 'false'); scene.style.pointerEvents = 'auto'; scene.style.visibility = 'visible';
          for (const part of scene.querySelectorAll('.office-media,.office-scene-copy,.office-actions')) { part.style.opacity = '1'; part.style.transform = 'none'; }
        });
        videos.forEach(pause);
      }
    }
    top = track.getBoundingClientRect().top + scrollY;
    distance = Math.max(1, track.offsetHeight - innerHeight);
    reading.textContent = sequential ? '返回滚动展示' : '顺序阅读';
    reading.setAttribute('aria-pressed', String(sequential));
    if (cinematic) { const previous = active; active = -1; activate(previous < 0 ? 0 : previous); }
    requestUpdate();
  }
  scenes.forEach((scene, index) => {
    const video = videos[index], button = scene.querySelector('.video-play'), status = scene.querySelector('.video-status');
    const name = ['Word', 'Excel', 'PPT'][index];
    function label() {
      const playing = !video.paused && !video.ended;
      button.innerHTML = `${playing ? '暂停演示' : video.ended ? '重新播放' : '播放演示'} <span aria-hidden="true">${playing ? 'Ⅱ' : '▶'}</span>`;
      button.setAttribute('aria-label', `${playing ? '暂停' : '播放'}${name}高清演示`);
    }
    button.addEventListener('click', async () => {
      if (!video.paused) { manualPauses.add(video); video.pause(); return; }
      manualPauses.delete(video); status.textContent = '';
      try { await video.play(); } catch { status.textContent = '暂时无法播放，请使用视频控件重试。'; }
    });
    video.addEventListener('play', () => {
      if ((cinematic && active !== index) || document.hidden) { pause(video); return; }
      manualPauses.delete(video); videos.forEach(other => { if (other !== video) pause(other); }); label();
    });
    video.addEventListener('pause', () => {
      if (systemPauses.has(video)) systemPauses.delete(video);
      else if (!video.ended) manualPauses.add(video);
      label();
    });
    video.addEventListener('ended', label);
    video.addEventListener('error', () => { status.textContent = '视频加载失败，请检查网络后重试。'; });
    scene.querySelector('.office-fullscreen').addEventListener('click', async () => {
      try {
        if (video.requestFullscreen) await video.requestFullscreen();
        else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
        else { status.textContent = '请使用视频右下角的全屏控件。'; return; }
        manualPauses.delete(video); await video.play();
      } catch { status.textContent = '可使用视频控件播放或放大。'; }
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting && !fullscreen()) pause(video);
    }).observe(video);
  });
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    if (cinematic) window.scrollTo({ top: top + distance * motion.chapterProgress(index, scenes.length), behavior: reduced.matches ? 'instant' : 'smooth' });
    else scenes[index].scrollIntoView({ block: 'start', behavior: 'smooth' });
  }));
  reading.addEventListener('click', () => {
    const index = Math.max(0, active); sequential = !sequential; measure();
    requestAnimationFrame(() => {
      if (cinematic) window.scrollTo({ top: top + distance * motion.chapterProgress(index, scenes.length), behavior: 'instant' });
      else scenes[index].scrollIntoView({ block: 'start', behavior: 'instant' });
    });
  });
  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', measure, { passive: true });
  addEventListener('pageshow', measure);
  window.addEventListener('intro-layout-change', measure);
  addEventListener('load', measure, { once: true });
  [reduced, short, compact].forEach(query => query.addEventListener('change', measure));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { videos.forEach(pause); cancelAnimationFrame(frame); frame = 0; }
    else { current = null; measure(); }
  });
  document.addEventListener('fullscreenchange', () => { if (!fullscreen()) measure(); });
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(track);
  measure();
})();
