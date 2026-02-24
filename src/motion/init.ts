// ============================================================
// Motion Init — Entry point unico per il motion system
// Importato una sola volta nel Layout.astro
// ============================================================

import { initPageMotion } from './orchestrators/page-orchestrator';

let ctx: gsap.Context | null = null;

function boot(): void {
  // Cleanup precedente (supporto Astro View Transitions)
  if (ctx) {
    ctx.revert();
    ctx = null;
  }

  ctx = initPageMotion();
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
