import {
  initGSAP,
  gsap,
  createContext,
  prefersReducedMotion,
} from "../../motion/engine/gsap-core";
import { createScrollAnimation } from "../../motion/engine/scroll-engine";
import { DURATION, EASE } from "../../motion/presets";

export function setupSphere(): void {
  initGSAP();

  const section = document.querySelector<HTMLElement>("#sphere-section");
  if (!section) return;

  const reduced = prefersReducedMotion();
  const titlesWrap = section.querySelector<HTMLElement>(
    "[data-sphere-titles]",
  );
  const badge = section.querySelector<HTMLElement>("[data-sphere-badge]");
  const titles = section.querySelectorAll<HTMLElement>("[data-sphere-keyword]");
  const orb = section.querySelector<HTMLElement>("[data-sphere-orb]");
  const inner = section.querySelector<HTMLElement>("[data-sphere-inner]");
  const cta = section.querySelector<HTMLElement>("[data-sphere-cta]");

  if (!titlesWrap || !badge || !titles.length || !orb || !inner || !cta)
    return;

  createContext(section, () => {
    const dur = reduced ? 0.15 : DURATION.normal;
    const ease = reduced ? EASE.linear : EASE.smooth;

    // Calcolo posizioni sfera basate sul viewport
    const vh = window.innerHeight;
    const orbSize = orb.offsetHeight; // 250vw in px
    const orbRadius = orbSize / 2;

    // Posizione iniziale: solo il polo della sfera visibile in fondo allo schermo
    const peekAmount = orbSize * 0.03;
    const orbStartY = vh / 2 + orbRadius - peekAmount;

    // Posizione centrale: sfera centrata nel viewport
    const orbCenterY = 0;

    // Posizione finale (specchiata): fondo della sfera visibile in cima allo schermo
    const orbEndY = -(vh / 2 + orbRadius - peekAmount);

    // Stato iniziale
    gsap.set(badge, { autoAlpha: 1 }); // badge sempre visibile
    gsap.set(titles, { autoAlpha: 0, y: 40 });
    gsap.set(orb, { y: orbStartY, rotation: 0 });
    gsap.set(inner, { autoAlpha: 0, y: 30 });
    gsap.set(cta, { autoAlpha: 0, y: 30 });

    const tl = gsap.timeline();

    // ═══════════════════════════════════════════
    // PARTE 1: Badge + titoli + cima sfera in basso
    // ═══════════════════════════════════════════

    const titleStagger = dur * 2;
    titles.forEach((title, i) => {
      tl.to(
        title,
        {
          autoAlpha: 1,
          y: 0,
          duration: dur,
          ease: EASE.snap,
        },
        i * titleStagger,
      );
    });

    // Sfera ruota leggermente mentre i titoli appaiono
    const titlePhaseDur = (titles.length - 1) * titleStagger + dur;
    tl.to(
      orb,
      {
        rotation: 45,
        duration: titlePhaseDur,
        ease: EASE.linear,
      },
      0,
    );

    // Titoli e badge svaniscono
    const fadeOutStart = titlePhaseDur + dur * 0.5;
    tl.to(
      titlesWrap,
      {
        autoAlpha: 0,
        y: -40,
        duration: dur,
        ease,
      },
      fadeOutStart,
    );

    // ═══════════════════════════════════════════
    // PARTE 2: Sfera sale al centro, contenuto interno
    // ═══════════════════════════════════════════

    const riseSart = fadeOutStart;
    tl.to(
      orb,
      {
        y: orbCenterY,
        rotation: 180,
        duration: dur * 4,
        ease: EASE.inOut,
      },
      riseSart,
    );

    // Contenuto interno appare quando la sfera è centrata
    const innerStart = riseSart + dur * 3;
    tl.to(
      inner,
      {
        autoAlpha: 1,
        y: 0,
        duration: dur,
        ease,
      },
      innerStart,
    );

    // Contenuto interno svanisce
    const innerEnd = innerStart + dur * 2.5;
    tl.to(
      inner,
      {
        autoAlpha: 0,
        y: -30,
        duration: dur,
        ease,
      },
      innerEnd,
    );

    // ═══════════════════════════════════════════
    // PARTE 3: Sfera esce verso l'alto, CTA
    // ═══════════════════════════════════════════

    tl.to(
      orb,
      {
        y: orbEndY,
        rotation: 360,
        duration: dur * 4,
        ease: EASE.inOut,
      },
      innerEnd,
    );

    // CTA appare quando la sfera raggiunge la posizione finale
    tl.to(
      cta,
      {
        autoAlpha: 1,
        y: 0,
        duration: dur,
        ease,
      },
      innerEnd + dur * 4 - dur,
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
