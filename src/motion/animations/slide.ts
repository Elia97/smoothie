import { gsap } from '../engine/gsap-core';
import { DURATION, EASE } from '../presets';

interface SlideOptions {
  duration?: number;
  ease?: string;
  distance?: number;
  delay?: number;
}

export function slideUp(
  targets: gsap.TweenTarget,
  overrides?: SlideOptions
): gsap.core.Tween {
  const {
    duration = DURATION.normal,
    ease = EASE.snap,
    distance = 40,
    delay = 0,
  } = overrides ?? {};

  return gsap.fromTo(
    targets,
    { autoAlpha: 0, y: distance },
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

export function slideDown(
  targets: gsap.TweenTarget,
  overrides?: SlideOptions
): gsap.core.Tween {
  const {
    duration = DURATION.normal,
    ease = EASE.snap,
    distance = 40,
    delay = 0,
  } = overrides ?? {};

  return gsap.fromTo(
    targets,
    { autoAlpha: 0, y: -distance },
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

export function slideLeft(
  targets: gsap.TweenTarget,
  overrides?: SlideOptions
): gsap.core.Tween {
  const {
    duration = DURATION.normal,
    ease = EASE.snap,
    distance = 60,
    delay = 0,
  } = overrides ?? {};

  return gsap.fromTo(
    targets,
    { autoAlpha: 0, x: distance },
    {
      autoAlpha: 1,
      x: 0,
      duration,
      ease,
      delay,
      paused: true,
      immediateRender: false,
    }
  );
}

export function slideRight(
  targets: gsap.TweenTarget,
  overrides?: SlideOptions
): gsap.core.Tween {
  const {
    duration = DURATION.normal,
    ease = EASE.snap,
    distance = 60,
    delay = 0,
  } = overrides ?? {};

  return gsap.fromTo(
    targets,
    { autoAlpha: 0, x: -distance },
    {
      autoAlpha: 1,
      x: 0,
      duration,
      ease,
      delay,
      paused: true,
      immediateRender: false,
    }
  );
}
