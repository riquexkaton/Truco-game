const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const isReducedMotionPreferred = (): boolean =>
  globalThis.matchMedia(REDUCED_MOTION_QUERY).matches;
