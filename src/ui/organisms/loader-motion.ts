export const READY_PERCENT = 100;

const WAITING_CAP = 99;
const EASE_MS = 320;
const MIN_PERCENT_PER_MS = 0.03;
const CYCLE_STRIDE = 5;

export const targetPercent = (fraction: number, isReady: boolean): number =>
  isReady ? READY_PERCENT : Math.min(WAITING_CAP, Math.max(0, fraction * 100));

export const easePercent = (shown: number, target: number, elapsedMs: number): number => {
  if (shown >= target) return shown;
  const eased = (target - shown) * (1 - Math.exp(-elapsedMs / EASE_MS));
  return Math.min(target, shown + Math.max(eased, MIN_PERCENT_PER_MS * elapsedMs));
};

export const cycleDelay = (percent: number, isReducedMotion: boolean): number => {
  if (isReducedMotion) return 1620;
  if (percent < 75) return 810;
  return percent < 95 ? 1080 : 1440;
};

export const nextCardIndex = (index: number, count: number): number =>
  (index + CYCLE_STRIDE) % count;
