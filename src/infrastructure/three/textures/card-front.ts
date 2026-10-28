import { FACTIONS } from '@domain/cards/faction';

import type { CardFace } from '@infrastructure/three/textures/card-face';
import {
  paintAttackStamp,
  paintLabel,
  paintSealStar,
} from '@infrastructure/three/textures/card-front-stamps';
import { paintNameStrip } from '@infrastructure/three/textures/card-name-strip';
import type { Rect } from '@infrastructure/three/textures/canvas-geometry';
import { coverCrop } from '@infrastructure/three/textures/canvas-geometry';
import { paintFactionLogo } from '@infrastructure/three/textures/faction-logos';
import { INK, WASHI, WASHI_LIGHT, hexAlpha } from '@infrastructure/three/textures/palette';
import { fillBox, paintPaper, strokeBox } from '@infrastructure/three/textures/paint-tools';
import { paintSeigaiha } from '@infrastructure/three/textures/patterns';

export interface FrontPaint {
  readonly face: CardFace;
  readonly art: ImageBitmap | undefined;
}

const ART_WINDOW: Rect = { x: 14, y: 14, width: 252, height: 330 };
const ART_FOCUS = { x: 0.5, y: 0.3 };
const PATTERN_BAND: Rect = { x: 14, y: 344, width: 252, height: 42 };
const FRAME_STROKE = { color: INK, width: 1.5 };

const paintArt = (context: CanvasRenderingContext2D, { face, art }: FrontPaint): void => {
  context.save();
  context.filter = face.artFilter;
  if (art === undefined) {
    fillBox(context, ART_WINDOW, hexAlpha(FACTIONS[face.card.faction].color, 0.35));
  } else {
    const crop = coverCrop({ source: art, target: ART_WINDOW, focus: ART_FOCUS });
    const { x, y, width, height } = ART_WINDOW;
    context.drawImage(art, crop.x, crop.y, crop.width, crop.height, x, y, width, height);
  }
  context.restore();
};

const paintArtWindow = (context: CanvasRenderingContext2D, paint: FrontPaint): void => {
  paintArt(context, paint);
  context.globalCompositeOperation = 'multiply';
  fillBox(context, ART_WINDOW, 'rgba(242,232,213,0.35)');
  context.globalCompositeOperation = 'source-over';
  strokeBox(context, ART_WINDOW, FRAME_STROKE);
};

const paintPatternBand = (context: CanvasRenderingContext2D, face: CardFace): void => {
  const line = hexAlpha(FACTIONS[face.card.faction].color, face.bandAlpha);
  paintSeigaiha(context, { rect: PATTERN_BAND, size: 16, line, background: WASHI });
  strokeBox(context, PATTERN_BAND, FRAME_STROKE);
};

const paintCrest = (context: CanvasRenderingContext2D, face: CardFace): void => {
  context.fillStyle = WASHI_LIGHT;
  context.beginPath();
  context.arc(45, 45, 25, 0, Math.PI * 2);
  context.fill();
  paintFactionLogo(context, {
    faction: face.card.faction,
    x: 22,
    y: 22,
    size: 46,
    ink: face.accent,
  });
};

export const paintCardFront = (context: CanvasRenderingContext2D, paint: FrontPaint): void => {
  const { face } = paint;
  paintPaper(context);
  paintArtWindow(context, paint);
  paintPatternBand(context, face);
  paintNameStrip(context, face.card.name);
  paintCrest(context, face);
  paintAttackStamp(context, face);
  paintLabel(context, face);
  if (face.isSealed) paintSealStar(context);
};
