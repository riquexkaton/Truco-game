import type { Scheduler } from '@application/ports/scheduler';

const REDUCED_MOTION_CAP_MS = 250;

export interface MotionPreference {
  readonly reducedMotion: boolean;
}

const cappedDelay = (ms: number, { reducedMotion }: MotionPreference): number =>
  reducedMotion ? Math.min(ms, REDUCED_MOTION_CAP_MS) : ms;

export const createBrowserScheduler = (preference: MotionPreference): Scheduler => ({
  wait: (ms) =>
    new Promise<void>((resolve) => {
      setTimeout(resolve, cappedDelay(ms, preference));
    }),
});
