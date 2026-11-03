(() => {
  'use strict';
  const track = document.getElementById('meadow-scroll');
  if (!track || track.dataset.meadowFilmReady) return;
  const scenes = [...track.querySelectorAll('.meadow-film-scene')];
  const chapters = [...track.querySelectorAll('[data-meadow-film-chapter]')];
  const sticky = track.querySelector('.meadow-film-sticky');
  const controls = track.querySelector('.meadow-film-controls');
  const dock = track.querySelector('.meadow-film-chapters');
  const reading = track.querySelector('.meadow-film-reading');
  const counter = track.querySelector('.meadow-film-counter');
  const hint = track.querySelector('.meadow-film-hint');
  if (!scenes.length || scenes.length !== chapters.length || !sticky || !dock || !reading) return;
  track.dataset.meadowFilmReady = 'true';
  track.style.setProperty('--meadow-film-height',`${scenes.length*110+100}svh`);
  const layers = scenes.map(scene => ({
    scene,
    media: scene.querySelector('.meadow-film-media'),
    stage: scene.querySelector('.meadow-film-stage'),
    caption: scene.querySelector('figcaption'),
    copy: scene.querySelector('.meadow-film-copy'),
    note: scene.querySelector('.meadow-film-note'),
    image: scene.querySelector('img'),
  }));
  const motion = window.JingChaoIntroMotion;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const shortScreen = matchMedia('(max-height: 659px)');
  const compact = matchMedia('(max-width: 760px)');
  const printing = matchMedia('print');
  const imageDialog = document.getElementById('image-dialog');
  const clamp = value => Math.max(0, Math.min(1, value));
  let cinematic = false, sequential = false, active = -1;
  let top = 0, distance = 1, viewport = innerHeight, inside = false;
  let target = 0, current = null, lastTime = 0, frame = 0, measureFrame = 0, dirty = true;

  /* layout-math:start — measured pixels; 1.08 covers the timeline's depth/scale,
     and 40 px reserves its vertical motion inside the stage's own grid row. */
  function fittedMediaWidth(availableWidth, availableHeight, ratio, horizontalChrome, verticalChrome, maxWidth) {
    const frameHeight = Math.max(0, (availableHeight - 40) / 1.08);
    return Math.max(0, Math.min(maxWidth, availableWidth / 1.08,
      horizontalChrome + Math.max(0, frameHeight - verticalChrome) * ratio));
  }
  /* layout-math:end */

  function fitMedia() {
    let readable = true;
    layers.forEach(({scene, stage, media, caption, note, image}) => {
      if (!stage || !media || !image) return;
      const portrait = stage.classList.contains('meadow-film-stage--portrait');
      const stageStyle = getComputedStyle(stage);
      const ratio = (image.naturalWidth || Number(image.getAttribute('width'))) /
        (image.naturalHeight || Number(image.getAttribute('height'))) || 16 / 9;
      let availableWidth = stage.clientWidth, availableHeight = stage.clientHeight;
      if (portrait && note) {
        if (compact.matches) availableHeight -= note.offsetHeight + (parseFloat(stageStyle.rowGap) || 0);
        else availableWidth -= note.offsetWidth + (parseFloat(stageStyle.columnGap) || 0);
      }
      const maxWidth = portrait ? 425 : scene.classList.contains('meadow-film-scene--conversation') ? 990 : 1120;
      media.style.width = `${Math.max(0, Math.min(maxWidth, availableWidth / 1.08))}px`;
      let width = 0;
      // Captions may wrap at the fitted width. A few bounded passes include their
      // real height rather than assuming every capture or footer is 16:9/one line.
      for (let pass = 0; pass < 3; pass++) {
        const style = getComputedStyle(media);
        const horizontalChrome = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0)
          + (parseFloat(style.borderLeftWidth) || 0) + (parseFloat(style.borderRightWidth) || 0);
        const verticalChrome = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0)
          + (parseFloat(style.borderTopWidth) || 0) + (parseFloat(style.borderBottomWidth) || 0)
          + (caption?.offsetHeight || 0);
        width = Math.floor(fittedMediaWidth(availableWidth, availableHeight, ratio, horizontalChrome, verticalChrome, maxWidth));
        media.style.width = `${width}px`;
      }
      // Large text, a narrow viewport, or a very small usable stage should get
      // the full sequential page instead of an illegibly compressed screenshot.
      const minimum = portrait ? Math.min(220, stage.clientWidth * .65) : Math.min(300, stage.clientWidth * .72);
      if (width < minimum || availableHeight < 180) readable = false;
    });
    return readable;
  }

  function revealChapter(index) {
    const link = chapters[index];
    if (!link || dock.scrollWidth <= dock.clientWidth) return;
    const left = link.offsetLeft - 9, right = link.offsetLeft + link.offsetWidth + 9;
    if (left < dock.scrollLeft) dock.scrollTo({left: Math.max(0, left), behavior: 'instant'});
    else if (right > dock.scrollLeft + dock.clientWidth) dock.scrollTo({left: right - dock.clientWidth, behavior: 'instant'});
  }

  function positionLens(index) {
    const link = chapters[index];
    if (!link) return;
    const padding = parseFloat(getComputedStyle(dock).paddingLeft) || 0;
    dock.style.setProperty('--meadow-film-lens-x', `${link.offsetLeft - padding}px`);
    dock.style.setProperty('--meadow-film-lens-width', `${link.offsetWidth}px`);
  }
  function activate(index) {
    index = Math.max(0, Math.min(scenes.length - 1, index));
    if (active === index) return;
    // A focused zoom control must not become trapped inside an inert scene.
    const focusedScene = cinematic && scenes.find(scene => scene.contains(document.activeElement));
    active = index;
    layers.forEach(({scene, image}, i) => {
      const selected = i === index;
      scene.classList.toggle('meadow-film-active', selected);
      scene.inert = cinematic && !selected;
      scene.setAttribute('aria-hidden', String(cinematic && !selected));
      scene.style.pointerEvents = !cinematic || selected ? 'auto' : 'none';
      if (selected) chapters[i].setAttribute('aria-current', 'step');
      else chapters[i].removeAttribute('aria-current');
      // Decode the current and following capture before their next transition.
      if (image && i >= index && i <= index + 1) image.loading = 'eager';
    });
    if (focusedScene && focusedScene !== scenes[index] && !imageDialog?.open) chapters[index].focus({preventScroll: true});
    if (counter) counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}`;
    positionLens(index);
    revealChapter(index);
  }
  function readScroll() {
    dirty = false;
    // Earlier films can expand into reading mode without a viewport resize.
    // One fresh track rectangle also covers images/fonts changing their height.
    const rect = track.getBoundingClientRect();
    top = rect.top + scrollY;
    inside = rect.bottom > 0 && rect.top < innerHeight;
    if (cinematic) {
      target = clamp((scrollY - top) / distance);
      if (current === null || !inside) current = target;
    } else {
      let closest = 0, best = Infinity;
      scenes.forEach((scene, index) => {
        const sceneRect = scene.getBoundingClientRect();
        const delta = Math.abs(sceneRect.top + Math.min(sceneRect.height * .35, innerHeight * .35) - innerHeight * .4);
        if (delta < best) { best = delta; closest = index; }
      });
      activate(closest);
    }
  }
  function render(progress) {
    const timeline = motion.at(progress, scenes.length, compact.matches);
    activate(timeline.active);
    track.style.setProperty('--meadow-film-progress', progress.toFixed(5));
    layers.forEach(({scene, media, copy, note}, index) => {
      const state = timeline.scenes[index];
      const visible = state.opacity > .0001;
      scene.style.visibility = visible ? 'visible' : 'hidden';
      if (!visible) return;
      media.style.opacity = state.opacity.toFixed(4);
      media.style.transform = `translate3d(0,${state.lift.toFixed(2)}px,${state.depth.toFixed(2)}px) rotateX(${state.tilt.toFixed(2)}deg) scale(${state.scale.toFixed(4)})`;
      copy.style.opacity = state.titleOpacity.toFixed(4);
      copy.style.transform = `translateY(${(state.titleY * .65).toFixed(2)}px)`;
      if (note) {
        note.style.opacity = state.noteOpacity.toFixed(4);
        note.style.transform = `translateY(${(state.noteY * .5).toFixed(2)}px)`;
      }
    });
  }
  function update(now) {
    frame = 0;
    if (document.hidden || imageDialog?.open) return;
    if (dirty) readScroll();
    if (!cinematic) return;
    const dt = Math.min(.064, Math.max(0, (now - lastTime) / 1000));
    lastTime = now;
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
    if (!frame && !document.hidden && !imageDialog?.open) {
      lastTime = performance.now();
      frame = requestAnimationFrame(update);
    }
  }
  function restoreReading() {
    layers.forEach(({scene, media, copy, note}) => {
      scene.inert = false;
      scene.setAttribute('aria-hidden', 'false');
      scene.style.visibility = 'visible';
      scene.style.pointerEvents = 'auto';
      for (const part of [media, copy, note]) if (part) {
        part.style.opacity = '1';
        part.style.transform = 'none';
      }
      media.style.removeProperty('width');
    });
    track.style.setProperty('--meadow-film-progress', '0');
  }
  function measure() {
    const wasCinematic = cinematic;
    const next = !!motion && !reduced.matches && !shortScreen.matches && !printing.matches && !sequential;
    cinematic = next;
    track.classList.toggle('is-cinematic', cinematic);
    const readable = !cinematic || fitMedia();
    if (!readable) {
      cinematic = false;
      track.classList.remove('is-cinematic');
      restoreReading();
    }
    const changed = wasCinematic !== cinematic;
    reading.hidden = !motion || reduced.matches || shortScreen.matches || printing.matches || !readable;
    reading.textContent = sequential ? '返回滚动展示' : '顺序阅读';
    reading.setAttribute('aria-pressed', String(sequential));
    if (hint) hint.innerHTML = cinematic ? '<span aria-hidden="true">↓</span> 向下滚动，走进下一处发现' : '按顺序浏览，或选择一个章节';
    if (changed) {
      current = null;
      active = -1;
      if (!cinematic) {
        cancelAnimationFrame(frame); frame = 0;
        restoreReading();
      }
    }
    viewport = cinematic ? sticky.offsetHeight : innerHeight;
    distance = Math.max(1, track.offsetHeight - viewport);
    readScroll();
    if (cinematic && (changed || current === null)) { current = target; render(current); }
    positionLens(Math.max(0, active));
    requestUpdate();
    return changed;
  }
  function requestMeasure() {
    if (!measureFrame) measureFrame = requestAnimationFrame(() => {
      measureFrame = 0;
      if (measure()) announceLayoutChange();
    });
  }
  function announceLayoutChange() {
    // Deliberately outside measure(): sibling films listen to this same event.
    window.dispatchEvent(new Event('intro-layout-change'));
  }
  function chapterFromHash(hash = location.hash) {
    let id;
    try { id = decodeURIComponent(hash.replace(/^#/, '')); } catch { return -1; }
    return scenes.findIndex(scene => scene.id === id);
  }
  function goToChapter(index, behavior = 'smooth') {
    if (index < 0 || index >= scenes.length) return;
    measure();
    if (layers[index].image) layers[index].image.loading = 'eager';
    const scrollBehavior = reduced.matches ? 'instant' : behavior;
    if (cinematic) {
      const progress = motion.chapterProgress(index, scenes.length);
      if (scrollBehavior === 'instant') { current = progress; render(progress); }
      window.scrollTo({top: top + distance * progress, behavior: scrollBehavior});
    } else scenes[index].scrollIntoView({block: 'start', behavior: scrollBehavior});
  }
  // Keep real URL fragments for deep links, back/forward, and no-JavaScript use.
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href^="#meadow-"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const hash = link.getAttribute('href'), index = chapterFromHash(hash);
    if (index < 0) return;
    event.preventDefault();
    if (location.hash !== hash) history.pushState(history.state, '', hash);
    goToChapter(index);
  });
  dock.addEventListener('keydown', event => {
    const index = chapters.indexOf(document.activeElement);
    if (index < 0) return;
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % chapters.length;
    else if (event.key === 'ArrowLeft') next = (index + chapters.length - 1) % chapters.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = chapters.length - 1;
    else return;
    event.preventDefault();
    chapters[next].focus({preventScroll: true});
    revealChapter(next);
  });
  reading.addEventListener('click', () => {
    const index = Math.max(0, active);
    sequential = !sequential;
    measure();
    announceLayoutChange();
    requestAnimationFrame(() => goToChapter(index, 'instant'));
  });
  addEventListener('hashchange', () => {
    const index = chapterFromHash();
    if (index >= 0) goToChapter(index, 'instant');
  });
  addEventListener('scroll', requestUpdate, {passive: true});
  addEventListener('resize', requestMeasure, {passive: true});
  addEventListener('intro-layout-change', requestMeasure);
  addEventListener('pageshow', requestMeasure);
  addEventListener('load', requestMeasure, {once: true});
  [reduced, shortScreen, compact, printing].forEach(query => query.addEventListener('change', () => {
    measure();
    announceLayoutChange();
  }));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else { current = null; requestMeasure(); }
  });
  imageDialog?.addEventListener('close', requestMeasure);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(requestMeasure);
    observer.observe(track);
    if (controls) observer.observe(controls);
  }
  layers.forEach(({image}) => image?.addEventListener('load', requestMeasure));
  document.fonts?.ready.then(requestMeasure);
  measure();
  announceLayoutChange();
  const initialChapter = chapterFromHash();
  if (initialChapter >= 0) requestAnimationFrame(() => goToChapter(initialChapter, 'instant'));
})();
