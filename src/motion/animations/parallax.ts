import { gsap } from '../engine/gsap-core';
import { createScrollAnimation } from '../engine/scroll-engine';

interface ParallaxOptions {
  speed?: number;
  start?: string;
  end?: string;
}

/**
 * Parallax verticale: l'elemento si muove a velocità diversa dallo scroll.
 * Crea direttamente lo ScrollTrigger con scrub.
 */
export function parallaxY(
  target: string | Element,
  overrides?: ParallaxOptions
): void {
  const {
    speed = 0.3,
    start = 'top bottom',
    end = 'bottom top',
  } = overrides ?? {};

  const yDistance = speed * 100;

  const animation = gsap.fromTo(
    target,
    { y: -yDistance },
    { y: yDistance, ease: 'none', paused: true, immediateRender: false }
  );

  createScrollAnimation({
    trigger: target,
    animation,
    start,
    end,
    scrub: true,
  });
}

/**
 * Parallax orizzontale.
 */
export function parallaxX(
  target: string | Element,
  overrides?: ParallaxOptions
): void {
  const {
    speed = 0.3,
    start = 'top bottom',
    end = 'bottom top',
  } = overrides ?? {};

  const xDistance = speed * 100;

  const animation = gsap.fromTo(
    target,
    { x: -xDistance },
    { x: xDistance, ease: 'none', paused: true, immediateRender: false }
  );

  createScrollAnimation({
    trigger: target,
    animation,
    start,
    end,
    scrub: true,
  });
}
