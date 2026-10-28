import type { CardFace } from '@infrastructure/three/textures/card-face';
import {
  INK,
  SEAL_GOLD,
  WASHI,
  WASHI_LIGHT,
  cardFont,
} from '@infrastructure/three/textures/palette';
import {
  CARD_LOGICAL_WIDTH,
  degrees,
  fillBox,
  fillCircle,
  strokeBox,
  strokeCircle,
  traceRoundedSquare,
} from '@infrastructure/three/textures/paint-tools';

const STAR_PATH = 'M12 2 L14.6 9.4 L22 12 L14.6 14.6 L12 22 L9.4 14.6 L2 12 L9.4 9.4 Z';
const LABEL = { top: 314, height: 18, padding: 8, rightMargin: 22 };

const paintStampSquare = (context: CanvasRenderingContext2D, accent: string): void => {
  context.fillStyle = 'rgba(0,0,0,0.25)';
  traceRoundedSquare(context, { offset: -36, size: 76, radius: 10 });
  context.fill();
  context.fillStyle = accent;
  traceRoundedSquare(context, { offset: -38, size: 76, radius: 10 });
  context.fill();
  context.strokeStyle = WASHI;
  context.lineWidth = 2;
  traceRoundedSquare(context, { offset: -34, size: 68, radius: 7 });
  context.stroke();
};

const paintStampText = (context: CanvasRenderingContext2D, face: CardFace): void => {
  const attack = String(face.attack);
  context.fillStyle = WASHI_LIGHT;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  if (face.stampNote === null) {
    context.font = cardFont(800, 36);
    context.fillText(attack, 0, 2);
    return;
  }
  context.font = cardFont(800, 32);
  context.fillText(attack, 0, -6);
  context.font = cardFont(600, 8);
  context.letterSpacing = '1px';
  context.fillText(face.stampNote, 0, 21);
  context.letterSpacing = '0px';
};

export const paintAttackStamp = (context: CanvasRenderingContext2D, face: CardFace): void => {
  context.save();
  context.translate(62, 324);
  context.rotate(degrees(-4));
  paintStampSquare(context, face.accent);
  paintStampText(context, face);
  context.restore();
};

export const paintLabel = (context: CanvasRenderingContext2D, face: CardFace): void => {
  context.font = cardFont(800, 10);
  context.letterSpacing = '1.4px';
  const width = context.measureText(face.label).width + LABEL.padding * 2;
  const box = {
    x: CARD_LOGICAL_WIDTH - LABEL.rightMargin - width,
    y: LABEL.top,
    width,
    height: LABEL.height,
  };
  fillBox(context, box, WASHI_LIGHT);
  strokeBox(context, box, { color: INK, width: 1.5 });
  context.fillStyle = face.accent;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText(face.label, box.x + LABEL.padding, LABEL.top + LABEL.height / 2 + 0.5);
  context.letterSpacing = '0px';
};

export const paintSealStar = (context: CanvasRenderingContext2D): void => {
  context.save();
  context.translate(236, 365);
  context.rotate(degrees(8));
  fillCircle(context, { radius: 18, color: SEAL_GOLD });
  strokeCircle(context, { radius: 15.5, color: WASHI, width: 2 });
  strokeCircle(context, { radius: 14, color: INK, width: 1 });
  context.translate(-8, -8);
  context.scale(16 / 24, 16 / 24);
  context.fillStyle = INK;
  context.fill(new Path2D(STAR_PATH));
  context.restore();
};
