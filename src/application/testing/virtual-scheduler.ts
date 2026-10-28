import type { Scheduler } from '@application/ports/scheduler';

export interface VirtualScheduler extends Scheduler {
  readonly now: () => number;
  readonly advance: (ms: number) => Promise<void>;
  readonly runUntil: (isDone: () => boolean, limitMs?: number) => Promise<void>;
}

interface Timer {
  readonly due: number;
  readonly resolve: () => void;
}

interface Clock {
  now: number;
  readonly timers: Timer[];
}

const DEFAULT_LIMIT_MS = 120_000;

const FLUSH_TICKS = 1000;

const flushTasks = async (): Promise<void> => {
  for (let tick = 0; tick < FLUSH_TICKS; tick += 1) {
    await Promise.resolve();
  }
};

const schedule = (clock: Clock, ms: number): Promise<void> =>
  new Promise((resolve) => {
    const due = clock.now + ms;
    const index = clock.timers.findIndex((timer) => timer.due > due);
    clock.timers.splice(index === -1 ? clock.timers.length : index, 0, { due, resolve });
  });

const takeDue = (clock: Clock, limit: number): Timer | undefined => {
  const [next] = clock.timers;
  return next !== undefined && next.due <= limit ? clock.timers.shift() : undefined;
};

const fire = async (clock: Clock, timer: Timer): Promise<void> => {
  clock.now = timer.due;
  timer.resolve();
  await flushTasks();
};

const advance = async (clock: Clock, ms: number): Promise<void> => {
  const target = clock.now + ms;
  await flushTasks();
  for (let timer = takeDue(clock, target); timer !== undefined; timer = takeDue(clock, target)) {
    await fire(clock, timer);
  }
  clock.now = target;
};

const runUntil = async (clock: Clock, isDone: () => boolean, limitMs: number) => {
  const deadline = clock.now + limitMs;
  await flushTasks();
  while (!isDone()) {
    const timer = takeDue(clock, deadline);
    if (timer === undefined) throw new Error(`Stalled at ${String(clock.now)} ms`);
    await fire(clock, timer);
  }
};

export const createVirtualScheduler = (): VirtualScheduler => {
  const clock: Clock = { now: 0, timers: [] };
  return {
    now: () => clock.now,
    wait: (ms) => schedule(clock, ms),
    advance: (ms) => advance(clock, ms),
    runUntil: (isDone, limitMs = DEFAULT_LIMIT_MS) => runUntil(clock, isDone, limitMs),
  };
};
