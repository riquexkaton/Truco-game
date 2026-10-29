import { BACK_CENTER, BACK_SCALE } from '@infrastructure/three/textures/back-panel';
import type { Point } from '@infrastructure/three/textures/canvas-geometry';
import { circlePath, diamondPath } from '@infrastructure/three/textures/canvas-geometry';
import {
  BACK_GOLD,
  BACK_GOLD_LIGHT,
  EMBER,
  hexAlpha,
} from '@infrastructure/three/textures/palette';
import type { PathFill, PathStroke } from '@infrastructure/three/textures/vector-paint';
import { fillPaths, paintPlaced, strokePaths } from '@infrastructure/three/textures/vector-paint';

const RITE_ORIGIN: Point = { x: 200, y: 300 };

const EMBER_GLOW = { x: 200, y: 270, radius: 150 };

const EMBER_STOPS: readonly (readonly [number, number])[] = [
  [0, 0.32],
  [0.5, 0.08],
  [1, 0],
];

const FLAME_OUTER =
  'M200 170 C232 214 252 252 238 296 C228 326 172 326 162 296 C148 252 168 214 200 170 Z';

const FLAME_MIDDLE =
  'M200 214 C220 244 228 270 218 296 C212 310 188 310 182 296 C172 270 180 244 200 214 Z';

const FLAME_CORE =
  'M200 252 C209 266 212 280 206 292 C203 298 197 298 194 292 C188 280 191 266 200 252 Z';

const RITE_LINES: readonly PathStroke[] = [
  { d: 'M200 110 L330 300 L200 490 L70 300 Z', width: 1.4 },
  { d: 'M200 128 L317 300 L200 472 L83 300 Z', width: 0.7, alpha: 0.6 },
  { d: circlePath({ x: 200, y: 262 }, 100), width: 12, alpha: 0.7, dash: [1, 38.27] },
  { d: FLAME_OUTER, width: 2 },
  { d: FLAME_MIDDLE, width: 1.4 },
  { d: 'M168 342 H232', width: 1.6 },
  { d: 'M182 354 H218', width: 1.2, alpha: 0.6 },
];

const RHOMBUS_TIPS: readonly Point[] = [
  { x: 200, y: 110 },
  { x: 330, y: 300 },
  { x: 200, y: 490 },
  { x: 70, y: 300 },
];

const SPARKS: readonly Point[] = [
  { x: 110, y: 160 },
  { x: 290, y: 440 },
  { x: 290, y: 160 },
  { x: 110, y: 440 },
];

const RITE_MARKS: readonly PathFill[] = [
  { d: FLAME_CORE, alpha: 0.9 },
  ...RHOMBUS_TIPS.map((tip) => ({ d: diamondPath(tip, 5 * Math.SQRT2) })),
  { d: circlePath({ x: 200, y: 66 }, 2.4) },
  { d: circlePath({ x: 200, y: 534 }, 2.4) },
  ...SPARKS.map((spark) => ({ d: circlePath(spark, 1.8), alpha: 0.7 })),
];

const paintEmberGlow = (context: CanvasRenderingContext2D): void => {
  const { x, y, radius } = EMBER_GLOW;
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
  for (const [offset, alpha] of EMBER_STOPS) {
    gradient.addColorStop(offset, hexAlpha(EMBER, alpha));
  }
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
};

export const paintRite = (context: CanvasRenderingContext2D): void => {
  const placement = { at: BACK_CENTER, origin: RITE_ORIGIN, scale: BACK_SCALE, angle: 0 };
  paintPlaced(context, placement, () => {
    paintEmberGlow(context);
    fillPaths(context, BACK_GOLD_LIGHT, [{ d: FLAME_MIDDLE, alpha: 0.16 }]);
    strokePaths(context, BACK_GOLD, RITE_LINES);
    fillPaths(context, BACK_GOLD_LIGHT, RITE_MARKS);
  });
};
