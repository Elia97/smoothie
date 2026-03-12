// ============================================================
// GSAP Core — Wrapper centralizzato su GSAP
// Nessun altro file deve importare direttamente da 'gsap'
// ============================================================

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let initialized = false;
let _reducedMotion = false;

/**
 * Inizializza GSAP e registra i plugin.
 * Idempotente: chiamate multiple sono no-op.
 */
export function initGSAP(): void {
  if (initialized) return;
  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  _reducedMotion = prefersReducedMotion.matches;

  if (_reducedMotion) {
    console.warn(
      '[motion] prefers-reduced-motion: reduce is active.',
      'Decorative animations will be skipped.',
      'Functional animations will run with reduced duration.'
    );
  }

  prefersReducedMotion.addEventListener('change', (e) => {
    _reducedMotion = e.matches;
  });

  initialized = true;
}

/**
 * Controlla se l'utente preferisce reduced motion.
 *
 * Usare nel codice per decidere il comportamento:
 * - Animazioni decorative (reveal, parallax): skippare completamente
 * - Animazioni funzionali (posizionamento, layout): ridurre durata
 */
export function prefersReducedMotion(): boolean {
  return _reducedMotion;
}

/**
 * Crea un GSAP context con scope.
 * Il context gestisce automaticamente il cleanup di tutte le animazioni
 * create al suo interno quando si chiama ctx.revert().
 */
export function createContext(
  scope: string | Element,
  fn: (self: gsap.Context) => void
): gsap.Context {
  return gsap.context(fn, scope);
}

export { gsap, ScrollTrigger };
