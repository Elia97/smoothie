import {
  initGSAP,
  gsap,
  createContext,
  prefersReducedMotion,
} from "../../motion/engine/gsap-core";
import { createScrollAnimation } from "../../motion/engine/scroll-engine";
import { DURATION, EASE } from "../../motion/presets";

// ─── Costanti configurabili ────────────────────────────────────────────────────

/** Quanta sfera è visibile all'ingresso/uscita, espressa come frazione di vh.
 *  0.5 = metà viewport → bordo opaco della sfera ben visibile. */
const ORB_PEEK_VH = 0.5;

/** Gradi di rotazione per ogni titolo che appare nella fase 1. */
const ROTATION_PER_TITLE = 120;

// ─── Setup principale ─────────────────────────────────────────────────────────

export function setupSphere(): void {
  initGSAP();

  const section = document.querySelector<HTMLElement>("#sphere-section");
  if (!section) return;

  const reduced = prefersReducedMotion();
  const titlesWrap = section.querySelector<HTMLElement>("[data-sphere-titles]");
  const badge = section.querySelector<HTMLElement>("[data-sphere-badge]");
  const titles = section.querySelectorAll<HTMLElement>("[data-sphere-keyword]");
  const orb = section.querySelector<HTMLElement>("[data-sphere-orb]");
  const inner = section.querySelector<HTMLElement>("[data-sphere-inner]");
  const cta = section.querySelector<HTMLElement>("[data-sphere-cta]");

  if (!titlesWrap || !badge || !titles.length || !orb || !inner || !cta) return;

  createContext(section, () => {
    const dur = reduced ? 0.15 : DURATION.normal;
    const ease = reduced ? EASE.linear : EASE.smooth;

    // Posizioni verticali della sfera.
    // orbStartY: sfera bassa, solo ORB_PEEK_VH del viewport è visible dal basso.
    // orbEndY:   speculare — uscita verso l'alto con la stessa quantità visibile.
    const vh = window.innerHeight;
    const orbRadius = orb.offsetHeight / 2;
    const orbStartY = vh / 2 + orbRadius - vh * ORB_PEEK_VH;
    const orbEndY = -orbStartY;

    // ── Stato iniziale ──────────────────────────────────────────────────────────
    gsap.set(badge, { autoAlpha: 1 });
    gsap.set(titles, { autoAlpha: 0, y: 40 });
    gsap.set(orb, { y: orbStartY, rotation: 0 });
    gsap.set(inner, { autoAlpha: 0, y: 30 });
    gsap.set(cta, { autoAlpha: 0, y: 30 });

    const tl = gsap.timeline();

    // ── Fase 1: titoli in entrata — sfera ferma, ruota ROTATION_PER_TITLE per titolo ─
    const titleStagger = dur * 2;
    const titlePhaseDur = (titles.length - 1) * titleStagger + dur;

    titles.forEach((title, i) => {
      const offset = i * titleStagger;
      tl.to(
        title,
        { autoAlpha: 1, y: 0, duration: dur, ease: EASE.snap },
        offset,
      );
      tl.to(
        orb,
        {
          rotation: (i + 1) * ROTATION_PER_TITLE,
          duration: dur,
          ease: EASE.smooth,
        },
        offset,
      );
    });

    // Titoli svaniscono dopo l'ultimo
    const fadeOutAt = titlePhaseDur + dur * 0.5;
    tl.to(titlesWrap, { autoAlpha: 0, y: -40, duration: dur, ease }, fadeOutAt);

    // ── Fase 2: sfera sale al centro — contenuto interno entra ed esce ──────────
    const riseAt = fadeOutAt + dur * 0.5;
    const innerAt = riseAt + dur * 3; // inner appare quando la sfera è quasi centrata
    const innerOut = innerAt + dur * 2.5; // inner esce

    tl.to(
      orb,
      { y: 0, rotation: 540, duration: dur * 4, ease: EASE.inOut },
      riseAt,
    );
    tl.to(inner, { autoAlpha: 1, y: 0, duration: dur, ease }, innerAt);
    tl.to(inner, { autoAlpha: 0, y: -30, duration: dur, ease }, innerOut);

    // ── Fase 3: sfera esce verso l'alto — CTA appare ────────────────────────────
    tl.to(
      orb,
      { y: orbEndY, rotation: 660, duration: dur * 4, ease: EASE.inOut },
      innerOut,
    );
    tl.to(cta, { autoAlpha: 1, y: 0, duration: dur, ease }, innerOut + dur * 3);

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
