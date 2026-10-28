import { CanvasTexture, SRGBColorSpace } from 'three';

export type Painter = (context: CanvasRenderingContext2D) => void;

export interface CanvasPaint {
  readonly width: number;
  readonly height: number;
  readonly scale: number;
  readonly paint: Painter;
}

export interface TextureKit {
  readonly anisotropy: number;
}

export const paintCanvas = ({ width, height, scale, paint }: CanvasPaint): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error('2D canvas is not available');
  }
  context.scale(scale, scale);
  paint(context);
  return canvas;
};

export const paintedTexture = (kit: TextureKit, paint: CanvasPaint): CanvasTexture => {
  const texture = new CanvasTexture(paintCanvas(paint));
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = kit.anisotropy;
  return texture;
};
