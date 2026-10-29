import { describe, expect, it } from 'vitest';

import { cycleDelay, easePercent, nextCardIndex, targetPercent } from '@ui/organisms/loader-motion';

describe('the loader target', () => {
  it('follows the real load but holds below 100 until the table is ready', () => {
    expect(targetPercent(0.42, false)).toBeCloseTo(42, 5);
    expect(targetPercent(1, false)).toBe(99);
    expect(targetPercent(0.42, true)).toBe(100);
  });
});

describe('the eased counter', () => {
  it('counts up towards the target without overshooting it', () => {
    const next = easePercent(0, 50, 16);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(50);
    expect(easePercent(49.9, 50, 500)).toBe(50);
  });

  it('never counts backwards', () => {
    expect(easePercent(60, 40, 16)).toBe(60);
  });

  it('finishes a small gap at a steady pace instead of crawling', () => {
    expect(easePercent(99, 100, 100)).toBeCloseTo(100, 5);
  });
});

describe('the card cycle', () => {
  it('slows down as the load gets close to the end', () => {
    expect(cycleDelay(10, false)).toBe(810);
    expect(cycleDelay(80, false)).toBe(1080);
    expect(cycleDelay(97, false)).toBe(1440);
    expect(cycleDelay(10, true)).toBe(1620);
  });

  it('shows all sixteen cards before repeating one', () => {
    const seen = new Set<number>();
    let index = 3;
    for (let step = 0; step < 16; step += 1) {
      seen.add(index);
      index = nextCardIndex(index, 16);
    }
    expect(seen.size).toBe(16);
    expect(index).toBe(3);
  });
});
