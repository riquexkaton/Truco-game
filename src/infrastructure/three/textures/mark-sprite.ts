import { CanvasTexture, SRGBColorSpace, Sprite, SpriteMaterial } from 'three';

import { paintCanvas } from '@infrastructure/three/textures/canvas-texture';
import { cardFont } from '@infrastructure/three/textures/palette';

export interface MarkText {
  readonly text: string;
  readonly color: string;
}

const MARK_CANVAS = { width: 128, height: 64, scale: 1 };

const paintMark = (context: CanvasRenderingContext2D, { text, color }: MarkText): void => {
  context.font = cardFont(800, 44);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.lineWidth = 8;
  context.strokeStyle = 'rgba(10,6,14,0.85)';
  context.strokeText(text, 64, 34);
  context.fillStyle = color;
  context.fillText(text, 64, 34);
};

export const createMarkSprite = (mark: MarkText): Sprite => {
  const canvas = paintCanvas({
    ...MARK_CANVAS,
    paint: (context) => {
      paintMark(context, mark);
    },
  });
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  const sprite = new Sprite(
    new SpriteMaterial({ map: texture, transparent: true, depthTest: false }),
  );
  sprite.scale.set(0.42, 0.21, 1);
  sprite.renderOrder = 6;
  return sprite;
};
