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
  const images = section.querySelectorAll<HTMLElement>(
    "[data-showcase-image]",
  );
  const slider = section.querySelector<HTMLElement>("[data-showcase-slider]");
  const content = section.querySelector<HTMLElement>(
    "[data-showcase-content]",
  );
  const finalText = section.querySelector<HTMLElement>(
    "[data-showcase-final]",
  );

  createContext(section, () => {
    const dur = reduced ? 0.15 : DURATION.normal;
    const ease = reduced ? EASE.linear : EASE.bounce;
    const tl = gsap.timeline();

    // Stato iniziale
    gsap.set(images, { autoAlpha: 0, scale: 0.8 });
    if (slider) gsap.set(slider, { autoAlpha: 0, scale: 0.8 });
    if (finalText) gsap.set(finalText, { autoAlpha: 0, x: 40 });

    // ── Fase 1: Reveal immagini, slider per ultimo ──
    images.forEach((img, i) => {
      tl.fromTo(
        img,
        { autoAlpha: 0, scale: 0.8 },
        { autoAlpha: 1, scale: 1, duration: dur, ease },
        i === 0 ? 0 : `<0.15`,
      );
    });

    if (slider) {
      tl.fromTo(
        slider,
        { autoAlpha: 0, scale: 0.8 },
        { autoAlpha: 1, scale: 1, duration: dur, ease },
        `<0.15`,
      );
    }

    const phase1End = tl.duration();

    // ── Fase 2: Fade out contenuto iniziale, slider nella grid, testo finale ──
    tl.to(
      [...images, content].filter(Boolean),
      {
        autoAlpha: 0,
        duration: dur,
        ease: reduced ? EASE.linear : EASE.smooth,
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
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: dur,
          ease: reduced ? EASE.linear : EASE.smooth,
        },
        `>${-dur * 0.5}`,
      );
    }

    createScrollAnimation({
      trigger: section,
      animation: tl,
      start: "top top",
      end: "bottom bottom",
      scrub: reduced ? false : 1,
      pin: false,
    });
  });
}
