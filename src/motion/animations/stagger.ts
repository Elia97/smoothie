import { gsap } from '../engine/gsap-core';
import { DURATION, EASE, STAGGER } from '../presets';

interface StaggerOptions {
  duration?: number;
  ease?: string;
  y?: number;
  stagger?: number;
  delay?: number;
}

/**
 * Stagger fade-in: anima un gruppo di elementi in sequenza.
 * Restituisce una timeline pausata per composizione con orchestrators.
 */
export function staggerFadeIn(
  targets: gsap.TweenTarget,
  overrides?: StaggerOptions
): gsap.core.Timeline {
  const {
    duration = DURATION.normal,
    ease = EASE.smooth,
    y = 20,
    stagger = STAGGER.normal,
    delay = 0,
  } = overrides ?? {};

  return gsap
    .timeline({ paused: true, delay })
    .fromTo(
      targets,
      { autoAlpha: 0, y },
      { autoAlpha: 1, y: 0, duration, ease, stagger }
    );
}

/**
 * Stagger slide-up: slide + fade in sequenza.
 */
export function staggerSlideUp(
  targets: gsap.TweenTarget,
  overrides?: StaggerOptions
): gsap.core.Timeline {
  const {
    duration = DURATION.normal,
    ease = EASE.snap,
    y = 40,
    stagger = STAGGER.normal,
    delay = 0,
  } = overrides ?? {};

  return gsap
    .timeline({ paused: true, delay })
    .fromTo(
      targets,
      { autoAlpha: 0, y },
      { autoAlpha: 1, y: 0, duration, ease, stagger }
    );
}

/**
 * Stagger scale-in: scale + fade in sequenza.
 */
export function staggerScaleIn(
  targets: gsap.TweenTarget,
  overrides?: StaggerOptions & { from?: number }
): gsap.core.Timeline {
  const {
    duration = DURATION.fast,
    ease = EASE.bounce,
    stagger = STAGGER.normal,
    from = 0.85,
    delay = 0,
  } = overrides ?? {};

  return gsap
    .timeline({ paused: true, delay })
    .fromTo(
      targets,
      { autoAlpha: 0, scale: from },
      { autoAlpha: 1, scale: 1, duration, ease, stagger }
    );
}
