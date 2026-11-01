import { describe, expect, it } from 'vitest';

import { backgroundFlicker, candleNoise } from '@infrastructure/three/scene/pulses';

describe('candleNoise', () => {
  it('stays within the sum of its three waves', () => {
    for (let step = 0; step < 200; step += 1) {
      expect(Math.abs(candleNoise(step * 0.037, 12.5))).toBeLessThanOrEqual(0.145);
    }
  });

  it('differs between candles with different seeds', () => {
    expect(candleNoise(1, 3)).not.toBeCloseTo(candleNoise(1, 40));
  });
});

describe('backgroundFlicker', () => {
  it('leaves the background untouched without noise', () => {
    expect(backgroundFlicker(0)).toEqual({ base: 1, left: 1 });
  });

  it('flickers the candle side of the background more strongly', () => {
    const flicker = backgroundFlicker(0.1);
    expect(flicker.base).toBeCloseTo(1.012);
    expect(flicker.left).toBeCloseTo(1.045);
  });
});
