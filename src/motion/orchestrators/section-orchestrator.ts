// ============================================================
// Section Orchestrator — Timeline orchestrate cross-sezione
//
// Per animazioni FUNZIONALI che posizionano elementi nel layout.
// Queste NON vengono skippate con reduced-motion, ma ridotte.
//
// Pattern:
//   1. Creare una funzione per ogni sezione complessa
//   2. Usare prefersReducedMotion() per ridurre (non eliminare)
//   3. Il container è lo scope per gsap.context()
// ============================================================

import {
  gsap,
  createContext,
  prefersReducedMotion,
} from '../engine/gsap-core';
import { createScrollAnimation } from '../engine/scroll-engine';
import { DURATION, EASE } from '../presets';

// Durata ridotta per reduced-motion: abbastanza per percepire
// il cambio di stato, non abbastanza per causare disagio.
const REDUCED_DURATION = 0.15;

/**
 * Esempio: immagini che si spostano e si fermano in punti precisi.
 *
 * Animazione FUNZIONALE: necessaria per il layout/comprensione.
 * Con reduced-motion: stessa animazione, durata minima.
 */
export function initImagePositioning(container: HTMLElement): gsap.Context {
  const reduced = prefersReducedMotion();

  return createContext(container, () => {
    const images = container.querySelectorAll<HTMLElement>(
      '[data-position-target]'
    );

    images.forEach((img) => {
      const x = parseFloat(img.dataset.positionX ?? '0');
      const y = parseFloat(img.dataset.positionY ?? '0');
      const scale = parseFloat(img.dataset.positionScale ?? '1');

      const duration = reduced ? REDUCED_DURATION : DURATION.slow;

      const tween = gsap.to(img, {
        x,
        y,
        scale,
        duration,
        ease: reduced ? EASE.linear : EASE.inOut,
        paused: true,
      });

      createScrollAnimation({
        trigger: container,
        animation: tween,
        scrub: reduced ? false : 1,
        start: 'top center',
        end: 'bottom center',
      });
    });
  });
}

/**
 * Timeline cross-sezione con scroll scrub.
 *
 * Animazione FUNZIONALE: storytelling verticale.
 * Con reduced-motion: scrub disabilitato, timeline ridotta.
 */
export function initScrollSequence(
  container: HTMLElement,
  buildTimeline: (
    tl: gsap.core.Timeline,
    scope: HTMLElement,
    reduced: boolean
  ) => void
): gsap.Context {
  const reduced = prefersReducedMotion();

  return createContext(container, () => {
    const tl = gsap.timeline();
    buildTimeline(tl, container, reduced);

    createScrollAnimation({
      trigger: container,
      animation: tl,
      start: 'top top',
      end: 'bottom bottom',
      scrub: reduced ? false : 1,
      pin: true,
    });
  });
}
