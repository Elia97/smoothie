import { initGSAP, gsap } from "../../motion/engine/gsap-core";
import { createScrollAnimation } from "../../motion/engine/scroll-engine";

export function setupHero(): void {
  initGSAP();

  const section = document.querySelector<HTMLElement>(
    "[data-motion-cursor-follow]",
  );
  const sphere = document.querySelector<HTMLElement>("[data-cursor-target]");

  if (section && sphere) {
    const tl = gsap.timeline();
    tl.to(sphere, { autoAlpha: 0, duration: 1 });

    createScrollAnimation({
      trigger: section,
      animation: tl,
      start: "bottom bottom",
      end: "bottom top",
      scrub: 1,
      pin: false,
    });
  }
}
