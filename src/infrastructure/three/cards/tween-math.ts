const REDUCED_MOTION_MAX_SECONDS = 0.25;

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

export const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

export const advanceProgress = (progress: number, deltaSeconds: number, duration: number): number =>
  Math.min(1, progress + deltaSeconds / duration);

export const lerp = (from: number, to: number, amount: number): number =>
  from + (to - from) * amount;

export const approach = (current: number, target: number, rate: number): number =>
  lerp(current, target, Math.min(1, rate));

export const arcHeight = (eased: number, lift: number): number => Math.sin(Math.PI * eased) * lift;

export const motionSeconds = (seconds: number, isReduced: boolean): number =>
  isReduced ? Math.min(seconds, REDUCED_MOTION_MAX_SECONDS) : seconds;
