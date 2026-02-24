import { gsap } from '../engine/gsap-core';
import { DURATION, EASE } from '../presets';

interface FadeOptions {
  duration?: number;
  ease?: string;
  y?: number;
  delay?: number;
}

export function fadeIn(
  targets: gsap.TweenTarget,
  overrides?: FadeOptions
): gsap.core.Tween {
  const {
    duration = DURATION.normal,
    ease = EASE.smooth,
    y = 20,
    delay = 0,
  } = overrides ?? {};

  return gsap.fromTo(
    targets,
    { autoAlpha: 0, y },
    {
      autoAlpha: 1,
      y: 0,
      duration,
      ease,
      delay,
      paused: true,
      immediateRender: false,
    }
  );
}

export function fadeOut(
  targets: gsap.TweenTarget,
  overrides?: Partial<Pick<FadeOptions, 'duration' | 'ease' | 'delay'>>
): gsap.core.Tween {
  const {
    duration = DURATION.fast,
    ease = EASE.smooth,
    delay = 0,
  } = overrides ?? {};

  return gsap.to(targets, {
    autoAlpha: 0,
    duration,
    ease,
    delay,
    paused: true,
  });
}
