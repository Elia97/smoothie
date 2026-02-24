// ============================================================
// Cursor Follow — Smooth mouse-tracking via GSAP quickTo
// ============================================================

import { gsap } from '../engine/gsap-core';
import { EASE } from '../presets';

export interface CursorFollowOptions {
  /** Durata lerp di quickTo (default 0.6) */
  speed?: number;
  /** Easing per il movimento (default EASE.smooth) */
  ease?: string;
}

/**
 * Fa seguire un elemento la posizione del mouse all'interno di un container.
 * Usa gsap.quickTo per performance ottimali (nessun tween creato per frame).
 *
 * @returns Funzione di cleanup che rimuove il listener.
 */
export function cursorFollow(
  container: HTMLElement,
  target: HTMLElement,
  options: CursorFollowOptions = {}
): () => void {
  const { speed = 0.6, ease = EASE.smooth } = options;

  const xTo = gsap.quickTo(target, 'x', { duration: speed, ease });
  const yTo = gsap.quickTo(target, 'y', { duration: speed, ease });

  function onMouseMove(e: MouseEvent): void {
    const rect = container.getBoundingClientRect();
    // Posizione relativa al centro del container
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    xTo(x);
    yTo(y);
  }

  function onMouseLeave(): void {
    xTo(0);
    yTo(0);
  }

  container.addEventListener('mousemove', onMouseMove);
  container.addEventListener('mouseleave', onMouseLeave);

  return () => {
    container.removeEventListener('mousemove', onMouseMove);
    container.removeEventListener('mouseleave', onMouseLeave);
  };
}
