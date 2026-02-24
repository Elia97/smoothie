// ============================================================
// Page Orchestrator — Sistema dichiarativo via data-attributes
//
// Gestisce il 90% delle animazioni tramite scansione DOM:
//   data-motion="fade-in|slide-up|slide-left|slide-right|scale-in"
//   data-motion-delay="0.2"
//   data-motion-scrub         (abilita scrub scroll)
//   data-motion-stagger="fade-in"  (sul container)
//   data-motion-item                (sui figli)
//   data-motion-parallax="0.3"      (parallax con speed)
// ============================================================

import {
  initGSAP,
  createContext,
  gsap,
  ScrollTrigger,
  prefersReducedMotion,
} from '../engine/gsap-core';
import { createScrollAnimation, setupResizeRefresh } from '../engine/scroll-engine';
import { parallaxY } from '../animations/parallax';
import { cursorFollow } from '../animations/cursor-follow';
import { DURATION, EASE, STAGGER } from '../presets';

// Definizioni delle animazioni per tipo.
const MOTION_DEFS: Record<
  string,
  { from: gsap.TweenVars; to: gsap.TweenVars }
> = {
  'fade-in': {
    from: { autoAlpha: 0, y: 30 },
    to: { autoAlpha: 1, y: 0, duration: DURATION.normal, ease: EASE.smooth },
  },
  'slide-up': {
    from: { autoAlpha: 0, y: 60 },
    to: { autoAlpha: 1, y: 0, duration: DURATION.normal, ease: EASE.snap },
  },
  'slide-down': {
    from: { autoAlpha: 0, y: -60 },
    to: { autoAlpha: 1, y: 0, duration: DURATION.normal, ease: EASE.snap },
  },
  'slide-left': {
    from: { autoAlpha: 0, x: 80 },
    to: { autoAlpha: 1, x: 0, duration: DURATION.normal, ease: EASE.snap },
  },
  'slide-right': {
    from: { autoAlpha: 0, x: -80 },
    to: { autoAlpha: 1, x: 0, duration: DURATION.normal, ease: EASE.snap },
  },
  'scale-in': {
    from: { autoAlpha: 0, scale: 0.7 },
    to: {
      autoAlpha: 1,
      scale: 1,
      duration: DURATION.normal,
      ease: EASE.bounce,
    },
  },
};

// Cleanup functions per listener non gestiti da GSAP context (es. mousemove)
let _cleanups: Array<() => void> = [];

export function cleanupPageMotion(): void {
  _cleanups.forEach((fn) => fn());
  _cleanups = [];
}

export function initPageMotion(): gsap.Context {
  initGSAP();
  setupResizeRefresh();
  cleanupPageMotion();

  return createContext(document.body, () => {
    const reduced = prefersReducedMotion();

    // ── 1. Elementi singoli con data-motion (decorativi) ──
    const motionElements =
      document.querySelectorAll<HTMLElement>('[data-motion]');

    motionElements.forEach((el) => {
      const type = el.dataset.motion!;
      const def = MOTION_DEFS[type];
      if (!def) return;

      if (reduced) {
        // Reduced motion: mostra direttamente lo stato finale, no animazione
        gsap.set(el, def.to);
        return;
      }

      const delay = parseFloat(el.dataset.motionDelay ?? '0');
      const scrub = el.dataset.motionScrub !== undefined;

      gsap.set(el, def.from);

      if (scrub) {
        const tween = gsap.to(el, {
          ...def.to,
          paused: true,
        });
        createScrollAnimation({
          trigger: el,
          animation: tween,
          scrub: true,
        });
      } else {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(el, { ...def.to, delay });
          },
        });
      }
    });

    // ── 2. Stagger groups (decorativi) ──
    const staggerGroups =
      document.querySelectorAll<HTMLElement>('[data-motion-stagger]');

    staggerGroups.forEach((container) => {
      const type = container.dataset.motionStagger!;
      const def = MOTION_DEFS[type];
      const children = container.querySelectorAll<HTMLElement>(
        '[data-motion-item]'
      );
      if (!children.length || !def) return;

      if (reduced) {
        gsap.set(children, def.to);
        return;
      }

      gsap.set(children, def.from);

      ScrollTrigger.create({
        trigger: container,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(children, {
            ...def.to,
            stagger: STAGGER.normal,
          });
        },
      });
    });

    // ── 3. Parallax (decorativo: skip completo con reduced motion) ──
    if (!reduced) {
      const parallaxElements =
        document.querySelectorAll<HTMLElement>('[data-motion-parallax]');

      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.dataset.motionParallax ?? '0.3');
        parallaxY(el, { speed });
      });
    }

    // ── 4. Cursor follow (decorativo: skip completo con reduced motion) ──
    if (!reduced) {
      const cursorContainers =
        document.querySelectorAll<HTMLElement>('[data-motion-cursor-follow]');

      cursorContainers.forEach((container) => {
        const target = container.querySelector<HTMLElement>('[data-cursor-target]');
        if (!target) return;

        gsap.set(target, { autoAlpha: 1 });
        const cleanup = cursorFollow(container, target);
        _cleanups.push(cleanup);
      });
    }
  });
}
