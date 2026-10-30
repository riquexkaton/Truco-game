import type { CanvasTexture } from 'three';

import type { TextureKit } from '@infrastructure/three/textures/canvas-texture';
import { paintedTexture } from '@infrastructure/three/textures/canvas-texture';

type ColorStop = readonly [offset: number, color: string];

interface RadialSpec {
  readonly size: number;
  readonly inset: number;
  readonly stops: readonly ColorStop[];
}

export interface RadialTextures {
  readonly halo: CanvasTexture;
  readonly blob: CanvasTexture;
  readonly glare: CanvasTexture;
  readonly glow: CanvasTexture;
}

const HALO: RadialSpec = {
  size: 256,
  inset: 0,
  stops: [
    [0, 'rgba(255,190,110,0.6)'],
    [0.35, 'rgba(255,150,70,0.16)'],
    [1, 'rgba(255,120,40,0)'],
  ],
};

const BLOB: RadialSpec = {
  size: 128,
  inset: 1,
  stops: [
    [0, 'rgba(255,255,255,0.9)'],
    [0.45, 'rgba(255,255,255,0.6)'],
    [1, 'rgba(255,255,255,0)'],
  ],
};

const GLARE: RadialSpec = {
  size: 256,
  inset: 2,
  stops: [
    [0, 'rgba(255,236,200,0.9)'],
    [0.35, 'rgba(255,214,160,0.35)'],
    [1, 'rgba(255,200,140,0)'],
  ],
};

const GLOW: RadialSpec = {
  size: 256,
  inset: 2,
  stops: [
    [0, 'rgba(255,255,255,1)'],
    [0.55, 'rgba(255,255,255,0.37)'],
    [1, 'rgba(255,255,255,0)'],
  ],
};

const paintRadial = (context: CanvasRenderingContext2D, spec: RadialSpec): void => {
  const middle = spec.size / 2;
  const gradient = context.createRadialGradient(
    middle,
    middle,
    0,
    middle,
    middle,
    middle - spec.inset,
  );
  for (const [offset, color] of spec.stops) {
    gradient.addColorStop(offset, color);
  }
  context.fillStyle = gradient;
  context.fillRect(0, 0, spec.size, spec.size);
};

const radialTexture = (kit: TextureKit, spec: RadialSpec): CanvasTexture =>
  paintedTexture(kit, {
    width: spec.size,
    height: spec.size,
    scale: 1,
    paint: (context) => {
      paintRadial(context, spec);
    },
  });

export const createRadialTextures = (kit: TextureKit): RadialTextures => ({
  halo: radialTexture(kit, HALO),
  blob: radialTexture(kit, BLOB),
  glare: radialTexture(kit, GLARE),
  glow: radialTexture(kit, GLOW),
});
