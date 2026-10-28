import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createBrowserScheduler } from '@infrastructure/browser/scheduler';

const isSettledAfter = async (ms: number, waiting: Promise<void>): Promise<boolean> => {
  let isSettled = false;
  void waiting.then(() => {
    isSettled = true;
  });
  await vi.advanceTimersByTimeAsync(ms);
  return isSettled;
};

describe('createBrowserScheduler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('waits the full time when motion is allowed', async () => {
    const scheduler = createBrowserScheduler({ reducedMotion: false });
    const waiting = scheduler.wait(900);
    expect(await isSettledAfter(899, waiting)).toBe(false);
    expect(await isSettledAfter(1, waiting)).toBe(true);
  });

  it('caps long waits at 250 ms under reduced motion', async () => {
    const scheduler = createBrowserScheduler({ reducedMotion: true });
    const waiting = scheduler.wait(1300);
    expect(await isSettledAfter(249, waiting)).toBe(false);
    expect(await isSettledAfter(1, waiting)).toBe(true);
  });

  it('keeps short waits untouched under reduced motion', async () => {
    const scheduler = createBrowserScheduler({ reducedMotion: true });
    const waiting = scheduler.wait(90);
    expect(await isSettledAfter(89, waiting)).toBe(false);
    expect(await isSettledAfter(1, waiting)).toBe(true);
  });
});
