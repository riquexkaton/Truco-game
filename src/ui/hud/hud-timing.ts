export interface HudTiming {
  readonly banner: (ms: number) => number;
  readonly toast: number;
  readonly reveal: number;
}

export const TOAST_EXIT_MS = 300;

export const REVEAL_EXIT_MS = 300;

export const HIT_MS = 900;

export const PROMPT_TICK_MS = 100;

export const MAX_TOASTS = 3;

const MS_PER_SECOND = 1000;

export const toSeconds = (ms: number): number => ms / MS_PER_SECOND;

export const toMilliseconds = (seconds: number): number => seconds * MS_PER_SECOND;

export const hudTiming = (isReducedMotion: boolean): HudTiming =>
  isReducedMotion
    ? { banner: () => 700, toast: 2500, reveal: 900 }
    : { banner: (ms) => ms, toast: 3500, reveal: 1700 };

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
