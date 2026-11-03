/* A reversible scroll timeline. No DOM or timers, shared by the page and checks. */
var JingChaoIntroMotion = (() => {
  'use strict';
  const clamp = value => Math.max(0, Math.min(1, value));
  // Zero slope and acceleration at the ends avoids a visible change of pace at cuts.
  const ease = value => { const x = clamp(value); return x * x * x * (x * (x * 6 - 15) + 10); };
  function at(progress, count = 5, compact = false) {
    const travel = clamp(progress) * count;
    const active = Math.min(count - 1, Math.floor(travel + .02));
    const scenes = Array.from({ length: count }, (_, index) => {
      const local = travel - index, first = index === 0, last = index === count - 1;
      const arrive = first ? 1 : ease((local + .16) / .28);
      const depart = last ? 1 : 1 - ease((local - .84) / .28);
      const opacity = arrive * depart;
      const start = first ? 0 : -.16, end = last ? 1 : 1.12;
      const phase = ease((local - start) / (end - start));
      const titleIn = first ? 1 : ease((local + .13) / .25);
      const titleOut = last ? 1 : 1 - ease((local - .70) / .28);
      const noteIn = ease((local - .12) / .26);
      const noteOut = last ? 1 : 1 - ease((local - .73) / .31);
      return {
        opacity, phase,
        // The frame advances throughout the scene, including the reading interval.
        scale: compact ? .90 + phase * .10 : .92 + phase * .115,
        depth: compact ? -28 * (1 - phase) : -55 + phase * 100,
        lift: (compact ? 12 : 20) * (1 - phase) - phase * (compact ? 8 : 18),
        tilt: (compact ? 1.8 : 3) * (1 - phase),
        titleOpacity: titleIn * titleOut,
        titleY: 22 * (1 - titleIn) - 24 * (1 - titleOut),
        noteOpacity: noteIn * noteOut * opacity,
        noteY: 18 * (1 - noteIn) - 12 * (1 - noteOut)
      };
    });
    return { active, scenes };
  }
  function follow(current, target, seconds, response = .095) {
    return current + (target - current) * (1 - Math.exp(-Math.max(0, seconds) / response));
  }
  function chapterProgress(index, count = 5) {
    return (Math.max(0, Math.min(count - 1, index)) + .43) / count;
  }
  return Object.freeze({ at, follow, chapterProgress });
})();
if (typeof module === 'object' && module.exports) module.exports = JingChaoIntroMotion;
