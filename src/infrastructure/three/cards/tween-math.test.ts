import { describe, expect, it } from 'vitest';

import {
  advanceProgress,
  approach,
  arcHeight,
  easeInOutCubic,
  easeOutCubic,
  lerp,
  motionSeconds,
} from '@infrastructure/three/cards/tween-math';

describe('easing', () => {
  it('eases in and out symmetrically', () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(0.5)).toBe(0.5);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.25)).toBeCloseTo(1 - easeInOutCubic(0.75));
    expect(easeInOutCubic(0.25)).toBeCloseTo(0.0625);
  });

  it('eases out fast then settles', () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(0.5)).toBe(0.875);
    expect(easeOutCubic(1)).toBe(1);
  });
});

describe('tween progress', () => {
  it('advances by the elapsed share of the duration and stops at 1', () => {
    expect(advanceProgress(0, 0.15, 0.6)).toBeCloseTo(0.25);
    expect(advanceProgress(0.9, 0.5, 0.6)).toBe(1);
  });

  it('interpolates between two values', () => {
    expect(lerp(2, 6, 0.25)).toBe(3);
  });

  it('approaches a target without overshooting', () => {
    expect(approach(0, 1, 0.5)).toBe(0.5);
    expect(approach(0, 1, 3)).toBe(1);
  });

  it('lifts cards in an arc that lands back on the table', () => {
    expect(arcHeight(0, 0.4)).toBe(0);
    expect(arcHeight(0.5, 0.4)).toBeCloseTo(0.4);
    expect(arcHeight(1, 0.4)).toBeCloseTo(0);
  });
});

describe('motionSeconds', () => {
  it('keeps the duration when motion is allowed', () => {
    expect(motionSeconds(0.9, false)).toBe(0.9);
  });

  it('caps animations at a quarter second under reduced motion', () => {
    expect(motionSeconds(0.9, true)).toBe(0.25);
    expect(motionSeconds(0.2, true)).toBe(0.2);
  });
});
