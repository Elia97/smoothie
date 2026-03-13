import {
  initGSAP,
  gsap,
  createContext,
  prefersReducedMotion,
} from "../../motion/engine/gsap-core";
import { createScrollAnimation } from "../../motion/engine/scroll-engine";
import { DURATION, EASE } from "../../motion/presets";

export function setupShowcase(): void {
  initGSAP();

  const section = document.querySelector<HTMLElement>("#showcase");
  if (!section) return;

  // Su mobile le animazioni sono dichiarative (data-motion) — niente script
  const isMd = window.matchMedia("(min-width: 768px)").matches;
  if (!isMd) return;

  const reduced = prefersReducedMotion();

  // Reduced-motion: collassa l'altezza extra (no scroll runway)
  if (reduced) {
    section.style.height = 'auto';
    const desktop = section.querySelector<HTMLElement>('[data-showcase-desktop]');
    if (desktop) desktop.style.position = 'relative';
  }

  const images = section.querySelectorAll<HTMLElement>("[data-showcase-image]");
  const slider = section.querySelector<HTMLElement>("[data-showcase-slider]");
  const content = section.querySelector<HTMLElement>("[data-showcase-content]");
  const finalText = section.querySelector<HTMLElement>("[data-showcase-final]");

  createContext(section, () => {
    const dur = reduced ? 0.15 : DURATION.normal;
    const ease = reduced ? EASE.linear : EASE.bounce;
    const tl = gsap.timeline();

    // Stato iniziale
    gsap.set(images, { opacity: 0, scale: 0.8 });
    if (slider) gsap.set(slider, { opacity: 0, scale: 0.8 });
    if (finalText) gsap.set(finalText, { opacity: 0, x: 40 });

    // ── Fase 1: Reveal immagini, slider per ultimo ──
    images.forEach((img, i) => {
      tl.fromTo(
        img,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: dur, ease },
        i === 0 ? 0 : `<0.15`,
      );
    });

    if (slider) {
      tl.fromTo(
        slider,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: dur, ease },
        `<0.15`,
      );
    }

    const phase1End = tl.duration();

    // ── Fase 2: Fade out contenuto iniziale, slider nella grid, testo finale ──
    tl.to(
      [...images, content].filter(Boolean),
      {
        opacity: 0,
        duration: dur,
        ease: reduced ? EASE.linear : EASE.smooth,
        onComplete: () => content?.setAttribute("aria-hidden", "true"),
        onReverseComplete: () => content?.setAttribute("aria-hidden", "false"),
      },
      phase1End,
    );

    // Slider: si sposta nella colonna sinistra della grid
    if (slider) {
      const container = slider.offsetParent as HTMLElement;
      const viewW = container.clientWidth;
      const viewH = container.clientHeight;

      const origCenterX = slider.offsetLeft + slider.offsetWidth / 2;
      const origCenterY = slider.offsetTop + slider.offsetHeight / 2;

      const targetX = viewW * 0.25;
      const targetY = viewH * 0.5;

      tl.to(
        slider,
        {
          x: targetX - origCenterX,
          y: targetY - origCenterY,
          scale: 2,
          duration: dur * 2,
          ease: reduced ? EASE.linear : EASE.inOut,
        },
        phase1End,
      );
    }

    // Testo finale: appare
    if (finalText) {
      tl.fromTo(
        finalText,
        { opacity: 0 },
        {
          opacity: 1,
          duration: dur,
          ease: reduced ? EASE.linear : EASE.smooth,
          onComplete: () => finalText.setAttribute("aria-hidden", "false"),
          onReverseComplete: () => finalText.setAttribute("aria-hidden", "true"),
        },
        `>${-dur * 0.5}`,
      );
    }

    createScrollAnimation({
      trigger: section,
      animation: tl,
      start: reduced ? "top 10%" : "top top",
      end: "bottom bottom",
      scrub: reduced ? false : 1,
      pin: false,
    });
  });
}
