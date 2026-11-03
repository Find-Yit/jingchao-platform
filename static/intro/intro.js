(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const nav = $('#site-nav'), toggle = $('#nav-toggle');
  const links = [...document.querySelectorAll('#nav-links a')];
  const surfaces = [...document.querySelectorAll('[data-surface]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const shortScreen = matchMedia('(max-height: 580px)');
  const track = $('#showtime'), shots = [...document.querySelectorAll('.keynote-shot')];
  const chapterButtons = [...document.querySelectorAll('[data-shot]')];
  const dock = $('.chapter-dock'), counter = $('.chapter-counter'), hero = $('.hero-object');
  const motion = window.JingChaoIntroMotion;
  const compact = matchMedia('(max-width: 640px)');
  const touch = matchMedia('(pointer: coarse)');
  const layers = shots.map(shot => ({ shot, media: shot.querySelector('.shot-media'), copy: shot.querySelector('.shot-copy'), note: shot.querySelector('.shot-note'), halo: shot.querySelector('.shot-halo') }));
  let frame = 0, sceneIndex = -1, range = 1, trackTop = 0, cinematic = false;
  let pendingRead = true, targetProgress = 0, renderedProgress = null, previousTime = 0;
  const clamp = value => Math.max(0, Math.min(1, value));

  function closeMenu() {
    nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', '打开导航菜单');
  }
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
  });
  links.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => { if (!nav.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); toggle.focus(); } });

  for (const list of document.querySelectorAll('[role="tablist"]')) {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    function activate(tab) {
      tabs.forEach(item => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1;
        document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
      });
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault(); activate(tabs[next]); tabs[next].focus({ preventScroll: true });
        tabs[next].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
      });
    });
  }
  const dialog = $('#image-dialog'), dialogImage = $('#dialog-image');
  document.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => {
    dialogImage.src = button.dataset.zoom; dialogImage.alt = button.querySelector('img').alt;
    $('#dialog-caption').textContent = button.dataset.caption;
    dialog.showModal(); document.documentElement.classList.add('no-scroll');
  }));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  const imageSize = $('#image-size'), imageViewport = $('#image-viewport');
  imageSize.addEventListener('click', () => {
    const native = dialog.classList.toggle('is-native');
    imageSize.setAttribute('aria-pressed', String(native));
    imageSize.textContent = native ? '适应窗口' : '查看原尺寸';
    imageViewport.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('no-scroll');
    dialog.classList.remove('is-native'); imageSize.setAttribute('aria-pressed', 'false'); imageSize.textContent = '查看原尺寸';
    imageViewport.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  });

  function positionLens(index) {
    const button = chapterButtons[index];
    if (!button) return;
    const padding = parseFloat(getComputedStyle(dock).paddingLeft) || 0;
    dock.style.setProperty('--lens-x', `${button.offsetLeft - padding}px`);
    dock.style.setProperty('--lens-w', `${button.offsetWidth}px`);
  }
  function activateChapter(index) {
    if (sceneIndex === index) return;
    sceneIndex = index;
    shots.forEach((shot, i) => {
      shot.inert = cinematic && i !== index;
      shot.setAttribute('aria-hidden', String(cinematic && i !== index));
      shot.style.pointerEvents = !cinematic || i === index ? 'auto' : 'none';
    });
    chapterButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    counter.textContent = `0${index + 1} / 05`;
    positionLens(index);
    shots.slice(index, index + 2).forEach(shot => { shot.querySelector('img').loading = 'eager'; });
  }
  function measure() {
    const wasCinematic = cinematic;
    cinematic = Boolean(motion) && !reduced.matches && !shortScreen.matches;
    document.documentElement.classList.toggle('scroll-ready', cinematic);
    trackTop = track.getBoundingClientRect().top + scrollY;
    range = Math.max(1, track.offsetHeight - innerHeight);
    sceneIndex = -1;
    if (wasCinematic !== cinematic) renderedProgress = null;
    if (!cinematic) {
      layers.forEach(({ shot, media, copy, note, halo }) => {
        shot.inert = false; shot.setAttribute('aria-hidden', 'false');
        shot.style.opacity = '1'; shot.style.transform = 'none'; shot.style.visibility = 'visible'; shot.style.pointerEvents = 'auto';
        shot.classList.remove('is-showing');
        for (const layer of [media, copy, note, halo]) { layer.style.opacity = '1'; layer.style.transform = 'none'; }
        note.inert = false; note.removeAttribute('aria-hidden'); note.style.pointerEvents = 'auto';
      });
    }
    requestUpdate();
  }
  function readScroll() {
    pendingRead = false;
    // Read layout only when native scrolling/resizing changes it, not on damping frames.
    const y = nav.getBoundingClientRect().bottom + 12;
    const surface = surfaces.find(section => { const box = section.getBoundingClientRect(); return box.top <= y && box.bottom > y; });
    let activeLink = null;
    links.forEach(link => { const section = $(link.hash); if (section && section.getBoundingClientRect().top < 155) activeLink = link; });
    nav.dataset.theme = surface?.dataset.surface || 'light';
    links.forEach(link => {
      link.classList.toggle('is-active', link === activeLink);
      if (link === activeLink) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
    if (reduced.matches) return;
    document.documentElement.style.setProperty('--page-shift', `${Math.min(700, scrollY * .035).toFixed(2)}px`);
    if (scrollY < innerHeight * 2) hero.style.transform = `translate3d(0,${Math.min(55, scrollY * .08).toFixed(2)}px,0)`;
    targetProgress = clamp((scrollY - trackTop) / range);
    // Returning to the page or skipping the presentation should not replay old scenes.
    if (renderedProgress === null || scrollY < trackTop - innerHeight || scrollY > trackTop + range + innerHeight) renderedProgress = targetProgress;
  }
  function render(progress) {
    const timeline = motion.at(progress, shots.length, compact.matches);
    track.style.setProperty('--scene-progress', progress.toFixed(5));
    activateChapter(timeline.active);
    layers.forEach(({ shot, media, copy, note, halo }, index) => {
      const state = timeline.scenes[index], showing = state.opacity > .0001;
      shot.classList.toggle('is-showing', showing);
      shot.style.opacity = '1'; shot.style.transform = 'none'; shot.style.visibility = showing ? 'visible' : 'hidden';
      if (!showing) return;
      media.style.opacity = state.opacity.toFixed(4);
      media.style.transform = `translate3d(0,${state.lift.toFixed(3)}px,${state.depth.toFixed(3)}px) rotateX(${state.tilt.toFixed(3)}deg) scale(${state.scale.toFixed(5)})`;
      copy.style.opacity = state.titleOpacity.toFixed(4);
      copy.style.transform = `translate3d(0,${state.titleY.toFixed(3)}px,0)`;
      note.style.opacity = state.noteOpacity.toFixed(4);
      note.style.transform = `translate3d(0,${state.noteY.toFixed(3)}px,0)`;
      const readable = state.noteOpacity > .1 && index === timeline.active;
      note.inert = !readable; note.setAttribute('aria-hidden', String(!readable)); note.style.pointerEvents = readable ? 'auto' : 'none';
      halo.style.opacity = (state.opacity * (.5 + state.phase * .35)).toFixed(4);
      halo.style.transform = `scale(${(.9 + state.phase * .18).toFixed(4)})`;
    });
  }
  function update(now) {
    frame = 0;
    if (document.hidden) return;
    if (pendingRead) readScroll();
    if (!cinematic || reduced.matches) return;
    const seconds = Math.min(.064, Math.max(0, (now - previousTime) / 1000)); previousTime = now;
    // A light visual catch-up softens wheel notches without intercepting page scrolling.
    const gap = targetProgress - renderedProgress;
    if (Math.abs(gap) > .14) renderedProgress = targetProgress - Math.sign(gap) * .14;
    renderedProgress = motion.follow(renderedProgress, targetProgress, seconds, touch.matches ? .065 : .095);
    const settled = Math.abs(targetProgress - renderedProgress) < .00012;
    if (settled) renderedProgress = targetProgress;
    render(renderedProgress);
    if (!settled) frame = requestAnimationFrame(update);
  }
  function requestUpdate() {
    pendingRead = true;
    if (!frame && !document.hidden) { previousTime = performance.now(); frame = requestAnimationFrame(update); }
  }
  chapterButtons.forEach((button, index) => button.addEventListener('click', () => {
    if (cinematic) window.scrollTo({ top: trackTop + range * motion.chapterProgress(index, shots.length), behavior: reduced.matches ? 'instant' : 'smooth' });
    else shots[index].scrollIntoView({ behavior: 'instant', block: 'start' });
  }));
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', () => { closeMenu(); measure(); }, { passive: true });
  window.addEventListener('pageshow', measure);
  window.addEventListener('intro-layout-change', measure);
  window.addEventListener('load', measure, { once: true });
  reduced.addEventListener('change', measure); shortScreen.addEventListener('change', measure); compact.addEventListener('change', measure);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else { renderedProgress = null; measure(); }
  });
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.querySelector('main'));
  if ('IntersectionObserver' in window && !reduced.matches) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); }
    }), { threshold: .04 });
    document.querySelectorAll('.reveal').forEach(element => reveal.observe(element));
    document.documentElement.classList.add('js');
  }
  measure();
})();
