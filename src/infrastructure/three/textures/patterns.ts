import type { Point, Rect } from '@infrastructure/three/textures/canvas-geometry';
import { seigaihaCenters, tileOrigins } from '@infrastructure/three/textures/canvas-geometry';

export interface PatternFill {
  readonly rect: Rect;
  readonly line: string;
  readonly background: string;
}

export interface SeigaihaFill extends PatternFill {
  readonly size: number;
}

const SCALLOP_RADII = [1, 13 / 16, 10 / 16, 7 / 16, 4 / 16];

const ASANOHA_PATH =
  'M18 0 L36 10.39 L36 31.18 L18 41.57 L0 31.18 L0 10.39 Z M18 0 L18 20.78 M36 10.39 L18 20.78 ' +
  'M36 31.18 L18 20.78 M18 41.57 L18 20.78 M0 31.18 L18 20.78 M0 10.39 L18 20.78 M18 0 L12 15.59 ' +
  'L0 10.39 M18 0 L24 15.59 L36 10.39 M36 31.18 L24 25.98 L36 10.39 M18 41.57 L24 25.98 ' +
  'M18 41.57 L12 25.98 M0 31.18 L12 25.98 L0 10.39 M0 31.18 L0 52 L18 62.35 M36 31.18 L36 52 ' +
  'L18 62.35 M18 41.57 L18 62.35';

const ASANOHA_TILE = { width: 36, height: 62.35 };

const clipAndFill = (context: CanvasRenderingContext2D, fill: PatternFill): void => {
  const { x, y, width, height } = fill.rect;
  context.beginPath();
  context.rect(x, y, width, height);
  context.clip();
  context.fillStyle = fill.background;
  context.fillRect(x, y, width, height);
};

const paintScallop = (context: CanvasRenderingContext2D, center: Point, fill: SeigaihaFill) => {
  for (const [index, radius] of SCALLOP_RADII.entries()) {
    context.beginPath();
    context.arc(center.x, center.y, fill.size * radius, 0, Math.PI * 2);
    context.fillStyle = index % 2 === 0 ? fill.line : fill.background;
    context.fill();
  }
};

export const paintSeigaiha = (context: CanvasRenderingContext2D, fill: SeigaihaFill): void => {
  context.save();
  clipAndFill(context, fill);
  for (const center of seigaihaCenters(fill.rect, fill.size)) {
    paintScallop(context, center, fill);
  }
  context.restore();
};

export const paintAsanoha = (context: CanvasRenderingContext2D, fill: PatternFill): void => {
  context.save();
  clipAndFill(context, fill);
  context.strokeStyle = fill.line;
  context.lineWidth = 1;
  const tile = new Path2D(ASANOHA_PATH);
  for (const origin of tileOrigins(fill.rect, ASANOHA_TILE)) {
    context.save();
    context.translate(origin.x, origin.y);
    context.stroke(tile);
    context.restore();
  }
  context.restore();
};
