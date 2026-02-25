import { initGSAP, gsap } from "../../motion/engine/gsap-core";
import { createScrollAnimation } from "../../motion/engine/scroll-engine";
import { DURATION, EASE, STAGGER } from "../../motion/presets";

/**
 * Split text content of an element into individual <span> per character.
 * Spaces become non-breaking to preserve whitespace width.
 */
function splitChars(el: HTMLElement): HTMLSpanElement[] {
  const text = el.textContent ?? "";
  const chars: HTMLSpanElement[] = [];

  el.textContent = "";

  for (const ch of text) {
    const span = document.createElement("span");
    span.style.display = "inline-block";
    span.style.visibility = "hidden";
    span.textContent = ch === " " ? "\u00A0" : ch;
    el.appendChild(span);
    chars.push(span);
  }

  return chars;
}

export function setupHero(): void {
  initGSAP();

  const section = document.querySelector<HTMLElement>(
    "[data-motion-cursor-follow]",
  );
  const title = document.querySelector<HTMLElement>("[data-hero-title]");
  const sphere = document.querySelector<HTMLElement>("[data-cursor-target]");
  const header = document.querySelector<HTMLElement>("[data-hero-header]");
  const scrollHint = document.querySelector<HTMLElement>(
    "[data-hero-scroll-hint]",
  );

  if (!section || !title || !sphere) return;

  // --- Prepare title: split text segments into chars, collect animation order ---
  const typeTexts = title.querySelectorAll<HTMLElement>("[data-type-text]");
  const typeWords = title.querySelectorAll<HTMLElement>("[data-type-word]");

  // Collect all child nodes of title in DOM order to build the timeline sequentially
  const allChars: HTMLSpanElement[] = [];
  typeTexts.forEach((el) => {
    allChars.push(...splitChars(el));
  });

  // Hide italic words initially (inline-block needed for transform)
  typeWords.forEach((el) => {
    gsap.set(el, { display: "inline-block", autoAlpha: 0, scale: 0 });
  });

  // Make title visible (chars/words are individually hidden)
  gsap.set(title, { autoAlpha: 1 });

  // --- Dismiss loader, then intro sequence ---
  const loader = document.getElementById("page-loader");
  const intro = gsap.timeline({ delay: 0.3 });

  if (loader) {
    intro.to(loader, {
      autoAlpha: 0,
      duration: 0.4,
      ease: EASE.smooth,
      onComplete: () => loader.remove(),
    });
  }

  // --- Typewriter: DOM order, each word bounce-in at its natural position ---
  for (const node of Array.from(title.childNodes)) {
    if (node instanceof HTMLElement && node.hasAttribute("data-type-text")) {
      const chars = Array.from(node.querySelectorAll("span"));
      if (chars.length) {
        intro.to(chars, {
          visibility: "visible",
          duration: 0.01,
          stagger: 0.03,
        });
      }
    } else if (
      node instanceof HTMLElement &&
      node.hasAttribute("data-type-word")
    ) {
      intro.to(node, {
        autoAlpha: 1,
        scale: 1,
        duration: DURATION.fast,
        ease: EASE.bounce,
      });
    }
  }

  // --- Sphere bounce-in after title ---
  intro.fromTo(
    sphere,
    { autoAlpha: 0, scale: 0 },
    { autoAlpha: 1, scale: 1, duration: DURATION.hero, ease: EASE.bounce },
    "-=0.3",
  );

  if (header) {
    intro.fromTo(
      header,
      { autoAlpha: 0, y: -20 },
      { autoAlpha: 1, y: 0, duration: DURATION.fast, ease: EASE.smooth },
      "-=0.8",
    );
  }

  if (scrollHint) {
    intro.fromTo(
      scrollHint,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: DURATION.fast, ease: EASE.smooth },
    );
  }

  // --- Scroll-driven: sphere fades out as section exits ---
  const scrollTl = gsap.timeline();
  scrollTl.to(sphere, { autoAlpha: 0, duration: 1 });

  createScrollAnimation({
    trigger: section,
    animation: scrollTl,
    start: "bottom bottom",
    end: "bottom top",
    scrub: 1,
    pin: false,
  });
}
