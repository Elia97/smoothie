// ============================================================
// Scroll Engine — Wrapper centralizzato su ScrollTrigger
// ============================================================

import { ScrollTrigger } from './gsap-core';

export interface ScrollAnimationConfig {
  trigger: string | Element;
  animation: gsap.core.Animation;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
  once?: boolean;
}

/**
 * Crea una ScrollTrigger-driven animation.
 *
 * Quando usare:
 * - Animazioni legate allo scroll (scrub)
 * - Pin di sezioni
 * - Timeline complesse triggerate dallo scroll
 *
 * Per reveal semplici, preferire createBatchReveal().
 */
export function createScrollAnimation(
  config: ScrollAnimationConfig
): ScrollTrigger {
  const {
    trigger,
    animation,
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
    pin = false,
    markers = false,
    once = false,
  } = config;

  return ScrollTrigger.create({
    trigger,
    animation,
    start,
    end,
    scrub,
    pin,
    markers,
    toggleActions: once ? 'play none none none' : 'play none none reverse',
    invalidateOnRefresh: true,
  });
}

/**
 * Batch reveal: raggruppa elementi per performance.
 * Più efficiente di ScrollTrigger individuali per reveal semplici.
 *
 * Quando usare:
 * - Molti elementi con la stessa animazione on-enter
 * - Fade-in semplici al primo scroll
 */
export function createBatchReveal(
  selector: string,
  onEnter: (elements: Element[]) => void
): void {
  ScrollTrigger.batch(selector, {
    onEnter: (batch) => onEnter(batch as Element[]),
    start: 'top 85%',
    once: true,
  });
}

/**
 * Setup resize handler con debounce per ScrollTrigger.refresh().
 * Chiamare una sola volta per pagina.
 */
export function setupResizeRefresh(debounceMs = 200): void {
  let resizeTimeout: ReturnType<typeof setTimeout>;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), debounceMs);
  });
}
