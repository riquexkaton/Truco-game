export interface HudTiming {
  readonly banner: (ms: number) => number;
  readonly reveal: number;
}

export const REVEAL_EXIT_MS = 300;

export const HIT_MS = 900;

export const PROMPT_TICK_MS = 100;

export const MARK_MS = 2800;

export const NOTICE_MIN_MS = 1200;

export const STRIP_MS = 1250;

const MS_PER_SECOND = 1000;

export const toSeconds = (ms: number): number => ms / MS_PER_SECOND;

export const toMilliseconds = (seconds: number): number => seconds * MS_PER_SECOND;

export const hudTiming = (isReducedMotion: boolean): HudTiming =>
  isReducedMotion ? { banner: () => 700, reveal: 900 } : { banner: (ms) => ms, reveal: 1700 };
