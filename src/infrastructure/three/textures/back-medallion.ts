import { BACK_CENTER, BACK_SCALE } from '@infrastructure/three/textures/back-panel';
import type { Point } from '@infrastructure/three/textures/canvas-geometry';
import { circlePath } from '@infrastructure/three/textures/canvas-geometry';
import { BACK_GOLD, BACK_GOLD_LIGHT } from '@infrastructure/three/textures/palette';
import type { PathStroke } from '@infrastructure/three/textures/vector-paint';
import { fillPaths, paintPlaced, strokePaths } from '@infrastructure/three/textures/vector-paint';

const HUB: Point = { x: 150, y: 150 };

const RINGS: readonly PathStroke[] = [
  { d: circlePath(HUB, 142), width: 1.4 },
  { d: circlePath(HUB, 134), width: 0.8, alpha: 0.6 },
  { d: circlePath(HUB, 124), width: 3, dash: [0.1, 16.23] },
  { d: circlePath(HUB, 52), width: 1.4 },
  { d: circlePath(HUB, 44), width: 0.8, alpha: 0.7, dash: [3, 4] },
];

const BRANCH: readonly PathStroke[] = [
  { d: 'M150 98 V40', width: 1.2 },
  { d: 'M150 72 C160 68 164 60 164 52 C156 54 151 62 150 72', width: 1.2 },
  { d: 'M150 84 C140 80 136 72 136 64 C144 66 149 74 150 84', width: 1.2 },
  { d: 'M150 40 C150 33 157 31 160 35 C163 39 158 44 154 41', width: 1.2 },
];

const BRANCH_ANGLES = Array.from({ length: 12 }, (_, index) => index * 30);

const STAR_SHADOW = 'M150 124 L155 145 L176 150 L155 155 L150 176 L145 155 L124 150 L145 145 Z';

const STAR = 'M150 120 L156 144 L180 150 L156 156 L150 180 L144 156 L120 150 L144 144 Z';

const turned = (angle: number) => ({ at: HUB, origin: HUB, scale: 1, angle });

const paintBranches = (context: CanvasRenderingContext2D): void => {
  for (const angle of BRANCH_ANGLES) {
    paintPlaced(context, turned(angle), () => {
      strokePaths(context, BACK_GOLD, BRANCH);
    });
  }
};

const paintStar = (context: CanvasRenderingContext2D): void => {
  paintPlaced(context, turned(45), () => {
    fillPaths(context, BACK_GOLD_LIGHT, [{ d: STAR_SHADOW, alpha: 0.55 }]);
  });
  fillPaths(context, BACK_GOLD_LIGHT, [{ d: STAR }]);
};

export const paintMedallion = (context: CanvasRenderingContext2D): void => {
  paintPlaced(context, { at: BACK_CENTER, origin: HUB, scale: BACK_SCALE, angle: 0 }, () => {
    strokePaths(context, BACK_GOLD, RINGS);
    paintBranches(context);
    paintStar(context);
  });
};
