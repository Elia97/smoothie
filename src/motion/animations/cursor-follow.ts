// ============================================================
// Cursor Follow — Smooth mouse-tracking via GSAP quickTo
// ============================================================

import { gsap } from "../engine/gsap-core";
import { EASE } from "../presets";

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
  options: CursorFollowOptions = {},
): () => void {
  const { speed = 0.6, ease = EASE.smooth } = options;

  const xTo = gsap.quickTo(target, "x", { duration: speed, ease });
  const yTo = gsap.quickTo(target, "y", { duration: speed, ease });

  let lastClientX = 0;
  let lastClientY = 0;
  let hasPosition = false;

  function updatePosition(): void {
    if (!hasPosition) return;
    const rect = container.getBoundingClientRect();
    xTo(lastClientX - rect.left - rect.width / 2);
    yTo(lastClientY - rect.top - rect.height / 2);
  }

  function onMouseMove(e: MouseEvent): void {
    lastClientX = e.clientX;
    lastClientY = e.clientY;
    hasPosition = true;
    updatePosition();
  }

  // Ricalcola quando la sezione si sposta durante lo scroll
  // (clientX/Y sono congelati ma rect.top cambia → senza questo si crea uno scatto)
  function onScroll(): void {
    updatePosition();
  }

  container.addEventListener("mousemove", onMouseMove);
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    container.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("scroll", onScroll);
  };
}
