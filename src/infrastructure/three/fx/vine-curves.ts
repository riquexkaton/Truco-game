import { itemAt } from '@domain/shared/random';

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface CurvePoint extends Point {
  readonly along: number;
}

type Cubic = readonly [Point, Point, Point, Point];

type Weights = readonly [number, number, number, number];

const STEPS_PER_CUBIC = 16;

export const pairsOf = (flat: readonly number[]): Point[] =>
  Array.from({ length: flat.length / 2 }, (_, index) => ({
    x: itemAt(flat, index * 2),
    y: itemAt(flat, index * 2 + 1),
  }));

const cubicsOf = (points: readonly Point[]): Cubic[] =>
  Array.from({ length: (points.length - 1) / 3 }, (_, index) => {
    const at = (offset: number): Point => itemAt(points, index * 3 + offset);
    return [at(0), at(1), at(2), at(3)] as const;
  });

const bernstein = (t: number): Weights => {
  const u = 1 - t;
  return [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
};

const cubicAt = ([a, b, c, d]: Cubic, t: number): Point => {
  const [wa, wb, wc, wd] = bernstein(t);
  return {
    x: wa * a.x + wb * b.x + wc * c.x + wd * d.x,
    y: wa * a.y + wb * b.y + wc * c.y + wd * d.y,
  };
};

export const distance = (from: Point, to: Point): number =>
  Math.hypot(from.x - to.x, from.y - to.y);

const runningLengths = (points: readonly Point[]): number[] => {
  let total = 0;
  return points.map((point, index) => {
    total += distance(points[index - 1] ?? point, point);
    return total;
  });
};

export const sampleCurve = (points: readonly Point[]): CurvePoint[] => {
  const samples = [
    itemAt(points, 0),
    ...cubicsOf(points).flatMap((cubic) =>
      Array.from({ length: STEPS_PER_CUBIC }, (_, step) =>
        cubicAt(cubic, (step + 1) / STEPS_PER_CUBIC),
      ),
    ),
  ];
  const lengths = runningLengths(samples);
  const total = lengths.at(-1) ?? 1;
  return samples.map((point, index) => ({ ...point, along: itemAt(lengths, index) / total }));
};
