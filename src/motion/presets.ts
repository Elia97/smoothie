// ============================================================
// Motion Presets — Single source of truth per timing e easing
// ============================================================

export const DURATION = {
  instant: 0.2,
  fast: 0.6,
  normal: 1.0,
  slow: 1.2,
  hero: 1.6,
} as const;

export const EASE = {
  smooth: 'power2.out',
  snap: 'power3.out',
  bounce: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.5)',
  inOut: 'power2.inOut',
  linear: 'none',
} as const;

export const STAGGER = {
  tight: 0.08,
  normal: 0.15,
  loose: 0.25,
} as const;

export type MotionPreset = {
  duration: number;
  ease: string;
};

export const PRESETS: Record<string, MotionPreset> = {
  'fade-in': { duration: DURATION.normal, ease: EASE.smooth },
  'slide-up': { duration: DURATION.normal, ease: EASE.snap },
  'slide-left': { duration: DURATION.normal, ease: EASE.snap },
  'slide-right': { duration: DURATION.normal, ease: EASE.snap },
  'scale-in': { duration: DURATION.fast, ease: EASE.bounce },
  'hero-enter': { duration: DURATION.hero, ease: EASE.inOut },
  'parallax': { duration: DURATION.slow, ease: EASE.linear },
};
