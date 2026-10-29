import type { Point, Rect } from '@infrastructure/three/textures/canvas-geometry';
import { seigaihaCenters } from '@infrastructure/three/textures/canvas-geometry';

interface SeigaihaFill {
  readonly rect: Rect;
  readonly line: string;
  readonly background: string;
  readonly size: number;
}

const SCALLOP_RADII = [1, 13 / 16, 10 / 16, 7 / 16, 4 / 16];

const clipAndFill = (context: CanvasRenderingContext2D, fill: SeigaihaFill): void => {
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
