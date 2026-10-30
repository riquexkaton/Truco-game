export interface HudTiming {
  readonly banner: (ms: number) => number;
  readonly reveal: number;
  readonly mark: number;
  readonly reading: (text: string) => number;
}

export const REVEAL_EXIT_MS = 300;

export const HIT_MS = 900;

export const PROMPT_TICK_MS = 100;

const MARK_MS = 2800;

const READING = { base: 2000, perCharacter: 40, min: 3500, max: 5000 };

const MS_PER_SECOND = 1000;

export const toSeconds = (ms: number): number => ms / MS_PER_SECOND;

export const toMilliseconds = (seconds: number): number => seconds * MS_PER_SECOND;

const readingMs = (text: string): number =>
  Math.min(READING.max, Math.max(READING.min, READING.base + text.length * READING.perCharacter));

export const hudTiming = (isReducedMotion: boolean): HudTiming =>
  isReducedMotion
    ? { banner: () => 700, reveal: 900, mark: MARK_MS, reading: readingMs }
    : { banner: (ms) => ms, reveal: 1700, mark: MARK_MS, reading: readingMs };

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
