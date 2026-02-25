// ============================================================
// Lenis Smooth Scroll — Solo desktop
// Integrato con GSAP ScrollTrigger via lenis.on('scroll')
// ============================================================

import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap-core';

let lenis: Lenis | null = null;

const DESKTOP_MQ = '(min-width: 768px)';

function tick(time: number): void {
  lenis?.raf(time * 1000);
}

export function initLenis(): void {
  destroyLenis();

  if (!window.matchMedia(DESKTOP_MQ).matches) return;

  lenis = new Lenis();

  // Sincronizza Lenis → ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Usa GSAP ticker per il loop (evita rAF manuale)
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

export function destroyLenis(): void {
  if (!lenis) return;
  gsap.ticker.remove(tick);
  lenis.destroy();
  lenis = null;
}
