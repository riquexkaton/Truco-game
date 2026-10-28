import type { CanvasTexture } from 'three';

import type { FactionId } from '@domain/cards/faction';

import {
  paintEffectBack,
  paintGameBack,
  paintViraFront,
} from '@infrastructure/three/textures/card-backs';
import type { FrontPaint } from '@infrastructure/three/textures/card-front';
import { paintCardFront } from '@infrastructure/three/textures/card-front';
import type { Painter, TextureKit } from '@infrastructure/three/textures/canvas-texture';
import { paintedTexture } from '@infrastructure/three/textures/canvas-texture';

const CARD_CANVAS = { width: 560, height: 800, scale: 2 };

const cardTexture = (kit: TextureKit, paint: Painter): CanvasTexture =>
  paintedTexture(kit, { ...CARD_CANVAS, paint });

export const gameBackTexture = (kit: TextureKit): CanvasTexture => cardTexture(kit, paintGameBack);

export const effectBackTexture = (kit: TextureKit): CanvasTexture =>
  cardTexture(kit, paintEffectBack);

export const viraFrontTexture = (kit: TextureKit, faction: FactionId): CanvasTexture =>
  cardTexture(kit, (context) => {
    paintViraFront(context, faction);
  });

export const cardFrontTexture = (kit: TextureKit, paint: FrontPaint): CanvasTexture =>
  cardTexture(kit, (context) => {
    paintCardFront(context, paint);
  });
