import { describe, expect, it } from 'vitest';

import {
  TOUCHDOWN,
  flightApex,
  flightSeconds,
  sampleFlight,
} from '@infrastructure/three/coins/coin-flight-math';

describe('sampleFlight', () => {
  it('starts on the pile without bounce or spark', () => {
    expect(sampleFlight(0, 1)).toEqual({
      travel: 0,
      height: 0,
      bounce: 0,
      wobble: 0,
      spark: 0,
      landed: false,
    });
  });

  it('peaks halfway to the first touchdown', () => {
    const sample = sampleFlight(TOUCHDOWN / 2, 0.9);
    expect(sample.height).toBeCloseTo(0.9);
    expect(sample.travel).toBeCloseTo(0.875);
  });

  it('bounces, wobbles and sparks after touching the table', () => {
    const sample = sampleFlight(TOUCHDOWN + (1 - TOUCHDOWN) / 2, 1);
    expect(sample.landed).toBe(true);
    expect(sample.travel).toBe(1);
    expect(sample.height).toBeCloseTo(0);
    expect(sample.bounce).toBeCloseTo(0.025);
    expect(sample.spark).toBeCloseTo(0.55);
    expect(sample.wobble).toBeCloseTo(-0.06);
  });

  it('settles flat at the end', () => {
    const sample = sampleFlight(1.2, 1);
    expect(sample.travel).toBe(1);
    expect(sample.bounce).toBeCloseTo(0);
    expect(sample.wobble).toBeCloseTo(0);
    expect(sample.spark).toBeCloseTo(0);
  });
});

describe('flight timing and height', () => {
  it('arcs higher for longer flights', () => {
    expect(flightApex(0)).toBe(0.75);
    expect(flightApex(5)).toBeCloseTo(1.35);
  });

  it('shortens every flight under reduced motion', () => {
    expect(flightSeconds(1.25, false)).toBe(1.25);
    expect(flightSeconds(1.25, true)).toBe(0.45);
  });
});
