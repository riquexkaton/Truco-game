import type { FactionId } from '@domain/cards/faction';
import { FACTIONS } from '@domain/cards/faction';

import type { Rect } from '@infrastructure/three/textures/canvas-geometry';
import { paintFactionLogo } from '@infrastructure/three/textures/faction-logos';
import { EFFECT_BACK, GAME_BACK, INK, cardFont } from '@infrastructure/three/textures/palette';
import { paintPaper, strokeBox } from '@infrastructure/three/textures/paint-tools';
import { paintAsanoha, paintSeigaiha } from '@infrastructure/three/textures/patterns';

const BACK_FIELD: Rect = { x: 14, y: 14, width: 252, height: 372 };
const BACK_INNER: Rect = { x: 22, y: 22, width: 236, height: 356 };
const VIRA_OUTER: Rect = { x: 12.75, y: 12.75, width: 254.5, height: 374.5 };
const VIRA_INNER: Rect = { x: 17.5, y: 17.5, width: 245, height: 365 };

const paintBackFrame = (context: CanvasRenderingContext2D): void => {
  strokeBox(context, BACK_FIELD, { color: INK, width: 1.5 });
  strokeBox(context, BACK_INNER, { color: 'rgba(242,232,213,0.55)', width: 1 });
};

export const paintGameBack = (context: CanvasRenderingContext2D): void => {
  paintPaper(context);
  paintSeigaiha(context, {
    rect: BACK_FIELD,
    size: 22,
    line: 'rgba(242,232,213,0.26)',
    background: GAME_BACK,
  });
  paintBackFrame(context);
};

export const paintEffectBack = (context: CanvasRenderingContext2D): void => {
  paintPaper(context);
  paintAsanoha(context, {
    rect: BACK_FIELD,
    line: 'rgba(242,232,213,0.42)',
    background: EFFECT_BACK,
  });
  paintBackFrame(context);
};

const paintViraName = (context: CanvasRenderingContext2D, name: string): void => {
  context.fillStyle = INK;
  context.font = cardFont(800, 24);
  context.letterSpacing = '5px';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(name, 142.5, 296);
  context.letterSpacing = '0px';
};

export const paintViraFront = (context: CanvasRenderingContext2D, faction: FactionId): void => {
  const { color, name } = FACTIONS[faction];
  paintPaper(context);
  strokeBox(context, VIRA_OUTER, { color: INK, width: 1.5 });
  strokeBox(context, VIRA_INNER, { color, width: 1 });
  paintFactionLogo(context, { faction, x: 56, y: 84, size: 168, ink: color });
  paintViraName(context, name);
};
