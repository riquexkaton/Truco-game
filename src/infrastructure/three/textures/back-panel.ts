import type { Point, Rect } from '@infrastructure/three/textures/canvas-geometry';
import {
  farthestCornerEllipse,
  insetRect,
  ringDots,
} from '@infrastructure/three/textures/canvas-geometry';
import { CARD_BOUNDS, fillBox } from '@infrastructure/three/textures/paint-tools';
import { BACK_GOLD, hexAlpha } from '@infrastructure/three/textures/palette';

type GradientStop = readonly [offset: number, color: string];

export interface BackPanel {
  readonly base: string;
  readonly focus: Point;
  readonly stops: readonly GradientStop[];
}

export const BACK_SCALE = CARD_BOUNDS.height / 600;

export const BACK_CENTER: Point = { x: CARD_BOUNDS.width / 2, y: CARD_BOUNDS.height / 2 };

const backInset = (mockupInset: number): Rect => insetRect(CARD_BOUNDS, mockupInset * BACK_SCALE);

const BAND = backInset(14);
const INNER = backInset(30);
const INNER_RULE = backInset(37);
const LINE = BACK_SCALE;
const BAND_RADIUS = 4 * BACK_SCALE;
const DOT_SPACING = 11 * BACK_SCALE;
const DOT_RADIUS = 1.6 * BACK_SCALE;
const BAND_DOTS = ringDots(BAND, insetRect(INNER, DOT_RADIUS), DOT_SPACING);

const strokeInside = (context: CanvasRenderingContext2D, rect: Rect, color: string): void => {
  const edge = insetRect(rect, LINE / 2);
  context.strokeStyle = color;
  context.lineWidth = LINE;
  context.strokeRect(edge.x, edge.y, edge.width, edge.height);
};

const traceBand = (context: CanvasRenderingContext2D, rect: Rect): void => {
  context.beginPath();
  context.roundRect(rect.x, rect.y, rect.width, rect.height, BAND_RADIUS);
};

const paintBand = (context: CanvasRenderingContext2D): void => {
  context.save();
  traceBand(context, BAND);
  context.clip();
  context.beginPath();
  for (const dot of BAND_DOTS) {
    context.moveTo(dot.x + DOT_RADIUS, dot.y);
    context.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
  }
  context.fillStyle = BACK_GOLD;
  context.fill();
  context.restore();
  traceBand(context, insetRect(BAND, LINE / 2));
  context.strokeStyle = BACK_GOLD;
  context.lineWidth = LINE;
  context.stroke();
};

const paintPanelGlow = (context: CanvasRenderingContext2D, panel: BackPanel): void => {
  const glow = farthestCornerEllipse(INNER, panel.focus);
  const reach = glow.radiusX;
  context.save();
  context.beginPath();
  context.rect(INNER.x, INNER.y, INNER.width, INNER.height);
  context.clip();
  context.translate(glow.x, glow.y);
  context.scale(1, glow.radiusY / reach);
  const gradient = context.createRadialGradient(0, 0, 0, 0, 0, reach);
  for (const [offset, color] of panel.stops) {
    gradient.addColorStop(offset, color);
  }
  context.fillStyle = gradient;
  context.fillRect(-reach, -reach, 2 * reach, 2 * reach);
  context.restore();
};

export const paintBackPanel = (context: CanvasRenderingContext2D, panel: BackPanel): void => {
  fillBox(context, CARD_BOUNDS, panel.base);
  paintBand(context);
  paintPanelGlow(context, panel);
  strokeInside(context, INNER, BACK_GOLD);
  strokeInside(context, INNER_RULE, hexAlpha(BACK_GOLD, 0.45));
};
