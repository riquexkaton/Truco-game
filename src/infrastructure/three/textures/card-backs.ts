import type { FactionId } from '@domain/cards/faction';
import { FACTIONS } from '@domain/cards/faction';

import { paintMedallion } from '@infrastructure/three/textures/back-medallion';
import { paintFrameOrnaments } from '@infrastructure/three/textures/back-ornaments';
import type { BackPanel } from '@infrastructure/three/textures/back-panel';
import { paintBackPanel } from '@infrastructure/three/textures/back-panel';
import { paintRite } from '@infrastructure/three/textures/back-rite';
import type { Rect } from '@infrastructure/three/textures/canvas-geometry';
import { paintFactionLogo } from '@infrastructure/three/textures/faction-logos';
import { EFFECT_BACK, GAME_BACK, INK, cardFont } from '@infrastructure/three/textures/palette';
import { paintPaper, strokeBox } from '@infrastructure/three/textures/paint-tools';

const VIRA_OUTER: Rect = { x: 12.75, y: 12.75, width: 254.5, height: 374.5 };
const VIRA_INNER: Rect = { x: 17.5, y: 17.5, width: 245, height: 365 };

const GAME_PANEL: BackPanel = {
  base: GAME_BACK,
  focus: { x: 0.5, y: 0.5 },
  stops: [
    [0, '#2E2216'],
    [0.62, '#160F0A'],
    [1, '#100B07'],
  ],
};

const EFFECT_PANEL: BackPanel = {
  base: EFFECT_BACK,
  focus: { x: 0.5, y: 0.46 },
  stops: [
    [0, '#2E1C0E'],
    [0.58, '#140E09'],
    [1, '#0B0806'],
  ],
};

export const paintGameBack = (context: CanvasRenderingContext2D): void => {
  paintBackPanel(context, GAME_PANEL);
  paintFrameOrnaments(context);
  paintMedallion(context);
};

export const paintEffectBack = (context: CanvasRenderingContext2D): void => {
  paintBackPanel(context, EFFECT_PANEL);
  paintRite(context);
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
