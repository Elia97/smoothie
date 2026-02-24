import { gsap } from '../engine/gsap-core';
import { DURATION, EASE } from '../presets';

interface ScaleOptions {
  duration?: number;
  ease?: string;
  from?: number;
  delay?: number;
}

export function scaleIn(
  targets: gsap.TweenTarget,
  overrides?: ScaleOptions
): gsap.core.Tween {
  const {
    duration = DURATION.fast,
    ease = EASE.bounce,
    from = 0.85,
    delay = 0,
  } = overrides ?? {};

  return gsap.fromTo(
    targets,
    { autoAlpha: 0, scale: from },
    {
      autoAlpha: 1,
      scale: 1,
      duration,
      ease,
      delay,
      paused: true,
      immediateRender: false,
    }
  );
}

export function scaleOut(
  targets: gsap.TweenTarget,
  overrides?: ScaleOptions
): gsap.core.Tween {
  const {
    duration = DURATION.fast,
    ease = EASE.smooth,
    from = 0.85,
    delay = 0,
  } = overrides ?? {};

  return gsap.to(targets, {
    autoAlpha: 0,
    scale: from,
    duration,
    ease,
    delay,
    paused: true,
  });
}
