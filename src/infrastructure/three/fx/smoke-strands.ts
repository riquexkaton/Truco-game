import { lerp } from '@infrastructure/three/cards/tween-math';

export const STRAND_COUNT = 5;

export interface SmokeStrands {
  readonly shapes: Float32Array;
  readonly motions: Float32Array;
}

interface Strand {
  readonly shape: readonly number[];
  readonly motion: readonly number[];
}

interface Range {
  readonly min: number;
  readonly max: number;
}

const STRAND_RANGES = {
  base: { min: -0.17, max: 0.17 },
  width: { min: 0.006, max: 0.016 },
  top: { min: 0.42, max: 1 },
  start: { min: 0, max: 0.12 },
  speed: { min: 0.75, max: 1.4 },
  curl: { min: 11, max: 20 },
  sway: { min: 0.02, max: 0.045 },
} as const;

const JITTER = 0.6;

const ranked = (index: number, stride: number, random: () => number): number => {
  const rank = (index * stride) % STRAND_COUNT;
  return (rank + (1 - JITTER) / 2 + random() * JITTER) / STRAND_COUNT;
};

const pick = ({ min, max }: Range, amount: number): number => lerp(min, max, amount);

const strandAt = (index: number, random: () => number): Strand => ({
  shape: [
    pick(STRAND_RANGES.base, ranked(index, 1, random)),
    pick(STRAND_RANGES.width, ranked(index, 2, random)),
    pick(STRAND_RANGES.top, ranked(index, 3, random)),
    pick(STRAND_RANGES.start, random()),
  ],
  motion: [
    ranked(index, 3, random) * Math.PI * 2,
    pick(STRAND_RANGES.speed, ranked(index, 4, random)),
    pick(STRAND_RANGES.curl, random()),
    pick(STRAND_RANGES.sway, random()),
  ],
});

export const smokeStrands = (random: () => number): SmokeStrands => {
  const strands = Array.from({ length: STRAND_COUNT }, (_, index) => strandAt(index, random));
  return {
    shapes: new Float32Array(strands.flatMap(({ shape }) => shape)),
    motions: new Float32Array(strands.flatMap(({ motion }) => motion)),
  };
};
