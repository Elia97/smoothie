// ============================================================
// Motion Init — Entry point unico per il motion system
// Importato una sola volta nel MarketingLayout.astro
// ============================================================

import { initPageMotion } from './orchestrators/page-orchestrator';

let ctx: gsap.Context | null = null;
let lenisCleanup: (() => void) | null = null;

const DESKTOP_MQ = '(min-width: 768px)';

async function boot(): Promise<void> {
  // Cleanup precedente (supporto Astro View Transitions)
  if (ctx) {
    ctx.revert();
    ctx = null;
  }
  if (lenisCleanup) {
    lenisCleanup();
    lenisCleanup = null;
  }

  ctx = initPageMotion();

  // Lenis: dynamic import, desktop-only, non critico per first paint
  if (window.matchMedia(DESKTOP_MQ).matches) {
    const { initLenis, destroyLenis } = await import('./engine/lenis-smooth');
    destroyLenis();
    initLenis();
    lenisCleanup = destroyLenis;
  }
}

// Defer boot dopo il first paint del browser.
// Doppio rAF garantisce che il browser abbia dipinto lo stato
// iniziale (visibility:hidden) prima di avviare le animazioni.
function deferredBoot(): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      boot();
    });
  });
}

// Boot iniziale
deferredBoot();

// Re-init su navigazione Astro View Transitions
document.addEventListener('astro:page-load', deferredBoot);
