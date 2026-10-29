import type { Point } from '@infrastructure/three/textures/canvas-geometry';
import { degrees } from '@infrastructure/three/textures/paint-tools';

export interface PathStroke {
  readonly d: string;
  readonly width: number;
  readonly alpha?: number;
  readonly dash?: readonly number[];
}

export interface PathFill {
  readonly d: string;
  readonly alpha?: number;
}

export interface Placement {
  readonly at: Point;
  readonly origin: Point;
  readonly scale: number;
  readonly angle: number;
}

export const strokePaths = (
  context: CanvasRenderingContext2D,
  color: string,
  strokes: readonly PathStroke[],
): void => {
  context.save();
  context.strokeStyle = color;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  for (const stroke of strokes) {
    context.globalAlpha = stroke.alpha ?? 1;
    context.lineWidth = stroke.width;
    context.setLineDash([...(stroke.dash ?? [])]);
    context.stroke(new Path2D(stroke.d));
  }
  context.restore();
};

export const fillPaths = (
  context: CanvasRenderingContext2D,
  color: string,
  fills: readonly PathFill[],
): void => {
  context.save();
  context.fillStyle = color;
  for (const fill of fills) {
    context.globalAlpha = fill.alpha ?? 1;
    context.fill(new Path2D(fill.d));
  }
  context.restore();
};

export const paintPlaced = (
  context: CanvasRenderingContext2D,
  { at, origin, scale, angle }: Placement,
  paint: () => void,
): void => {
  context.save();
  context.translate(at.x, at.y);
  context.rotate(degrees(angle));
  context.scale(scale, scale);
  context.translate(-origin.x, -origin.y);
  paint();
  context.restore();
};
