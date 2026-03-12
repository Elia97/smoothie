import {
  initGSAP,
  gsap,
  createContext,
  prefersReducedMotion,
} from "../../motion/engine/gsap-core";
import { createScrollAnimation } from "../../motion/engine/scroll-engine";
import { DURATION, EASE } from "../../motion/presets";

export function setupDark(): void {
  initGSAP();

  const section = document.querySelector<HTMLElement>("#dark-section");
  if (!section) return;

  const reduced = prefersReducedMotion();
  const bg = section.querySelector<HTMLElement>("[data-dark-bg]");
  const text = section.querySelector<HTMLElement>("[data-dark-text]");
  if (!bg || !text) return;

  createContext(section, () => {
    const dur = reduced ? 0.15 : DURATION.instant;

    // Testo sempre visibile — parte nero, diventa bianco
    gsap.set(text, { autoAlpha: 1 });

    const tl = gsap.timeline();

    // Fase 1: sfondo nero, testo da nero a bianco, bottone si inverte
    tl.to(
      bg,
      {
        opacity: 1,
        duration: dur,
        ease: EASE.smooth,
      },
      0,
    );

    tl.to(
      text,
      {
        color: "#ffffff",
        duration: dur,
        ease: EASE.smooth,
      },
      0,
    );

    // Fase 2: tutto torna normale
    const holdEnd = tl.duration() + 0.5;

    tl.to(
      bg,
      {
        opacity: 0,
        duration: dur,
        ease: EASE.smooth,
      },
      holdEnd,
    );

    tl.to(
      text,
      {
        color: "#000000",
        duration: dur,
        ease: EASE.smooth,
      },
      holdEnd,
    );

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
