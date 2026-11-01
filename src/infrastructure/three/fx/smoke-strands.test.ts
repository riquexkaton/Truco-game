import { describe, expect, it } from 'vitest';

import { smokeStrands, STRAND_COUNT } from '@infrastructure/three/fx/smoke-strands';
import { CARD_WIDTH } from '@infrastructure/three/layout/table-points';

const FIELDS = 4;
const MIN_GAP = 0.02;

const RANDOMS = [() => 0, () => 0.5, () => 0.999, Math.random];

const fieldOf = (values: Float32Array, field: number): number[] =>
  Array.from({ length: STRAND_COUNT }, (_, index) => values[index * FIELDS + field] ?? NaN);

const gapsOf = (values: readonly number[]): number[] => {
  const sorted = values.toSorted((first, second) => first - second);
  return sorted.slice(1).map((value, index) => value - (sorted[index] ?? value));
};

describe('the smoke rising from a losing card', () => {
  it('rises in several threads instead of a single line', () => {
    expect(STRAND_COUNT).toBeGreaterThanOrEqual(3);
    expect(STRAND_COUNT).toBeLessThanOrEqual(5);
  });

  it('starts every thread on the card, each apart from the others', () => {
    for (const random of RANDOMS) {
      const bases = fieldOf(smokeStrands(random).shapes, 0);
      expect(Math.max(...bases.map((base) => Math.abs(base)))).toBeLessThan(CARD_WIDTH / 2);
      expect(Math.min(...gapsOf(bases))).toBeGreaterThan(MIN_GAP);
    }
  });

  it('gives each thread its own thickness, height, sway phase and speed', () => {
    for (const random of RANDOMS) {
      const { shapes, motions } = smokeStrands(random);
      const traits = [
        fieldOf(shapes, 1),
        fieldOf(shapes, 2),
        fieldOf(motions, 0),
        fieldOf(motions, 1),
      ];
      for (const trait of traits) {
        expect(new Set(trait).size).toBe(STRAND_COUNT);
      }
      const widths = fieldOf(shapes, 1);
      expect(Math.max(...widths)).toBeGreaterThan(Math.min(...widths) * 1.5);
    }
  });

  it('lifts every thread off the card low and fades it out inside the smoke plane', () => {
    for (const random of RANDOMS) {
      const { shapes } = smokeStrands(random);
      const starts = fieldOf(shapes, 3);
      for (const [index, top] of fieldOf(shapes, 2).entries()) {
        expect(top).toBeLessThanOrEqual(1);
        expect(top).toBeGreaterThan((starts[index] ?? 1) + 0.3);
      }
      for (const start of starts) {
        expect(start).toBeGreaterThanOrEqual(0);
        expect(start).toBeLessThan(0.2);
      }
    }
  });

  it('lets some threads die out well below the tallest one', () => {
    for (const random of RANDOMS) {
      const tops = fieldOf(smokeStrands(random).shapes, 2);
      expect(Math.max(...tops) - Math.min(...tops)).toBeGreaterThan(0.25);
    }
  });
});
