import { describe, expect, it } from 'vitest';

import { createLoadProgress, progressAfter } from '@infrastructure/browser/load-progress';

const recorder = () => {
  const reports: number[] = [];
  const listener = (fraction: number): void => {
    reports.push(fraction);
  };
  return { reports, listener };
};

describe('the load progress', () => {
  it('reports each finished step as a fraction of the total', () => {
    const { reports, listener } = recorder();
    const progress = createLoadProgress(4, listener);
    progress.step();
    progress.step();
    expect(reports).toEqual([0.25, 0.5]);
  });

  it('never reports more than the whole load', () => {
    const { reports, listener } = recorder();
    const progress = createLoadProgress(1, listener);
    progress.step();
    progress.step();
    expect(reports).toEqual([1, 1]);
  });

  it('counts a tracked fetch once it settles and keeps its result', async () => {
    const { reports, listener } = recorder();
    const progress = createLoadProgress(2, listener);
    await expect(progress.track(Promise.resolve('coin'))).resolves.toBe('coin');
    expect(reports).toEqual([0.5]);
  });

  it('counts a failed fetch without swallowing the error', async () => {
    const { reports, listener } = recorder();
    const progress = createLoadProgress(2, listener);
    const failure = Promise.reject(new Error('HTTP 404'));
    await expect(progress.track(failure)).rejects.toThrow('HTTP 404');
    expect(reports).toEqual([0.5]);
  });

  it('maps a later phase onto the rest of the bar', () => {
    const { reports, listener } = recorder();
    const rest = progressAfter(0.25, listener);
    rest(0);
    rest(0.5);
    rest(1);
    expect(reports).toEqual([0.25, 0.625, 1]);
  });
});
