import { BACK_CENTER, BACK_SCALE } from '@infrastructure/three/textures/back-panel';
import type { Point } from '@infrastructure/three/textures/canvas-geometry';
import { circlePath } from '@infrastructure/three/textures/canvas-geometry';
import { CARD_BOUNDS } from '@infrastructure/three/textures/paint-tools';
import { BACK_GOLD, BACK_GOLD_LIGHT, GAME_BACK } from '@infrastructure/three/textures/palette';
import type { PathStroke } from '@infrastructure/three/textures/vector-paint';
import { fillPaths, paintPlaced, strokePaths } from '@infrastructure/three/textures/vector-paint';

interface CornerSpot extends Point {
  readonly angle: number;
}

const CORNER_ORIGIN: Point = { x: 28, y: 28 };

const CORNER_ARCS: readonly PathStroke[] = [
  { d: 'M6 50 V28 A22 22 0 0 1 28 6 H50', width: 1.2 },
  { d: 'M13 50 V30 A17 17 0 0 1 30 13 H50', width: 0.7, alpha: 0.6 },
];

const CORNER_KNOT = circlePath({ x: 17, y: 17 }, 3);

const NEAR = 68 * BACK_SCALE;
const FAR_X = CARD_BOUNDS.width - NEAR;
const FAR_Y = CARD_BOUNDS.height - NEAR;

const CORNERS: readonly CornerSpot[] = [
  { x: NEAR, y: NEAR, angle: 0 },
  { x: FAR_X, y: NEAR, angle: 90 },
  { x: FAR_X, y: FAR_Y, angle: 180 },
  { x: NEAR, y: FAR_Y, angle: 270 },
];

const SPINE = { top: 66 * BACK_SCALE, length: 90 * BACK_SCALE, width: BACK_SCALE };

const DIAMOND_REACH = 63 * BACK_SCALE;

const paintCorners = (context: CanvasRenderingContext2D): void => {
  for (const { angle, ...at } of CORNERS) {
    paintPlaced(context, { at, origin: CORNER_ORIGIN, scale: BACK_SCALE, angle }, () => {
      strokePaths(context, BACK_GOLD, CORNER_ARCS);
      fillPaths(context, BACK_GOLD_LIGHT, [{ d: CORNER_KNOT }]);
    });
  }
};

const paintSpines = (context: CanvasRenderingContext2D): void => {
  const x = BACK_CENTER.x - SPINE.width / 2;
  const bottom = CARD_BOUNDS.height - SPINE.top - SPINE.length;
  context.save();
  context.globalAlpha = 0.7;
  context.fillStyle = BACK_GOLD;
  context.fillRect(x, SPINE.top, SPINE.width, SPINE.length);
  context.fillRect(x, bottom, SPINE.width, SPINE.length);
  context.restore();
};

const paintDiamond = (context: CanvasRenderingContext2D, y: number): void => {
  const at = { x: BACK_CENTER.x, y };
  paintPlaced(context, { at, origin: { x: 0, y: 0 }, scale: BACK_SCALE, angle: 45 }, () => {
    context.fillStyle = GAME_BACK;
    context.fillRect(-5, -5, 10, 10);
    context.strokeStyle = BACK_GOLD_LIGHT;
    context.lineWidth = 1;
    context.strokeRect(-4.5, -4.5, 9, 9);
  });
};

export const paintFrameOrnaments = (context: CanvasRenderingContext2D): void => {
  paintCorners(context);
  paintSpines(context);
  paintDiamond(context, DIAMOND_REACH);
  paintDiamond(context, CARD_BOUNDS.height - DIAMOND_REACH);
};
