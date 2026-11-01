import { itemAt } from '@domain/shared/random';

import type { Point } from '@infrastructure/three/fx/vine-curves';
import { distance, pairsOf, sampleCurve } from '@infrastructure/three/fx/vine-curves';
import type { LeafMark, VineStroke } from '@infrastructure/three/fx/vine-sketch';
import {
  LEAF_MARKS,
  SKETCH_FRAME,
  SKETCH_LEAF_LENGTH,
  VINE_STROKES,
} from '@infrastructure/three/fx/vine-sketch';
import { degrees } from '@infrastructure/three/textures/paint-tools';

export interface VinePoint extends Point {
  readonly grow: number;
  readonly glint: number;
}

export interface VineLeaf extends VinePoint {
  readonly angle: number;
  readonly length: number;
}

export interface VinePlan {
  readonly threads: readonly (readonly VinePoint[])[];
  readonly leaves: readonly VineLeaf[];
}

export interface VineTurn {
  readonly x: number;
  readonly z: number;
}

export const VINE_TIMING = {
  early: 0.05,
  late: 0.3,
  grow: 0.9,
  leafLag: 0.1,
  unfurl: 0.35,
  span: 2,
  glintFrom: 1.8,
  glintEvery: 5,
  glintRun: 2.1,
  glintEnter: 0.2,
} as const;

export const VINE_FIELD = { halfWidth: 1.04, halfHeight: 0.8 } as const;

const fromSketch = ({ x, y }: Point): Point => ({
  x: (x - SKETCH_FRAME.x) / SKETCH_FRAME.unit,
  y: (y - SKETCH_FRAME.y) / (SKETCH_FRAME.unit * SKETCH_FRAME.squash),
});

const arrival = (stroke: VineStroke, along: number): number =>
  (stroke.isLate ? VINE_TIMING.late : VINE_TIMING.early) +
  VINE_TIMING.grow * (1 - Math.sqrt(1 - along));

const glintPhase = (stroke: VineStroke, along: number): number =>
  (VINE_TIMING.glintEnter + stroke.glintAt + along * VINE_TIMING.glintRun) / VINE_TIMING.glintEvery;

const threadOf = (stroke: VineStroke): VinePoint[] =>
  sampleCurve(pairsOf(stroke.path).map((point) => fromSketch(point))).map(({ x, y, along }) => ({
    x,
    y,
    grow: arrival(stroke, along),
    glint: glintPhase(stroke, along),
  }));

const nearest = (points: readonly VinePoint[], target: Point): VinePoint => {
  let best = itemAt(points, 0);
  for (const point of points) {
    if (distance(point, target) < distance(best, target)) best = point;
  }
  return best;
};

const leafOf = (mark: LeafMark, points: readonly VinePoint[]): VineLeaf => {
  const base = fromSketch(mark);
  const attach = nearest(points, base);
  const turn = degrees(mark.turn);
  return {
    ...base,
    angle: Math.atan2(Math.sin(turn) / SKETCH_FRAME.squash, Math.cos(turn)),
    length: (SKETCH_LEAF_LENGTH * mark.size) / SKETCH_FRAME.unit,
    grow: attach.grow + VINE_TIMING.leafLag,
    glint: attach.glint,
  };
};

export const vinePlan = (): VinePlan => {
  const threads = VINE_STROKES.map((stroke) => threadOf(stroke));
  const points = threads.flat();
  return { threads, leaves: LEAF_MARKS.map((mark) => leafOf(mark, points)) };
};

const flipUnless = (isOdd: boolean): number => (isOdd ? -1 : 1);

export const vineTurn = (slotX: number, count: number): VineTurn => ({
  x: slotX === 0 ? flipUnless(Math.floor(count / 2) % 2 === 1) : Math.sign(slotX),
  z: flipUnless(count % 2 === 1),
});
