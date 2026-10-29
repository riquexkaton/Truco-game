import { describe, expect, it } from 'vitest';

import {
  circlePath,
  coverCrop,
  diamondPath,
  farthestCornerEllipse,
  insetRect,
  ringDots,
  seigaihaCenters,
} from '@infrastructure/three/textures/canvas-geometry';

describe('coverCrop', () => {
  it('crops the sides of a wide image around the focus', () => {
    const crop = coverCrop({
      source: { width: 1000, height: 500 },
      target: { width: 100, height: 100 },
      focus: { x: 0.5, y: 0.3 },
    });
    expect(crop).toEqual({ x: 250, y: 0, width: 500, height: 500 });
  });

  it('crops the top and bottom of a tall card art with the focus slightly above centre', () => {
    const crop = coverCrop({
      source: { width: 512, height: 768 },
      target: { width: 252, height: 330 },
      focus: { x: 0.5, y: 0.3 },
    });
    expect(crop.x).toBe(0);
    expect(crop.width).toBe(512);
    expect(crop.height).toBeCloseTo(670.48, 2);
    expect(crop.y).toBeCloseTo((768 - 670.476) * 0.3, 2);
  });
});

describe('seigaihaCenters', () => {
  it('fills the band with staggered rows of half the scale height', () => {
    const rect = { x: 0, y: 0, width: 32, height: 16 };
    const centers = seigaihaCenters(rect, 16);
    const rows = [...new Set(centers.map((center) => center.y))];
    expect(rows).toEqual([0, 8, 16, 24, 32]);
    expect(centers.filter((center) => center.y === 0).map((center) => center.x)).toEqual([
      -32, 0, 32, 64,
    ]);
    expect(centers.filter((center) => center.y === 8).map((center) => center.x)).toEqual([
      -16, 16, 48,
    ]);
  });
});

describe('insetRect', () => {
  it('shrinks a rect by the same margin on every side', () => {
    expect(insetRect({ x: 0, y: 0, width: 280, height: 400 }, 20)).toEqual({
      x: 20,
      y: 20,
      width: 240,
      height: 360,
    });
  });
});

describe('ringDots', () => {
  it('lays a grid centred on the band and skips the dots under the inner panel', () => {
    const dots = ringDots(
      { x: 0, y: 0, width: 30, height: 30 },
      { x: 5, y: 5, width: 20, height: 20 },
      10,
    );
    expect(dots).toHaveLength(8);
    expect(dots).not.toContainEqual({ x: 15, y: 15 });
    expect(dots).toContainEqual({ x: 5, y: 5 });
    expect(dots).toContainEqual({ x: 25, y: 15 });
  });
});

describe('farthestCornerEllipse', () => {
  const panel = { x: 20, y: 20, width: 240, height: 360 };

  it('reaches the corners from the centre like a CSS ellipse gradient', () => {
    const ellipse = farthestCornerEllipse(panel, { x: 0.5, y: 0.5 });
    expect(ellipse).toMatchObject({ x: 140, y: 200 });
    expect(ellipse.radiusX).toBeCloseTo(169.71, 2);
    expect(ellipse.radiusY).toBeCloseTo(254.56, 2);
  });

  it('stretches towards the farthest side when the glow sits higher', () => {
    const ellipse = farthestCornerEllipse(panel, { x: 0.5, y: 0.46 });
    expect(ellipse.y).toBeCloseTo(185.6, 5);
    expect(ellipse.radiusY).toBeCloseTo(Math.SQRT2 * 360 * 0.54, 5);
  });
});

describe('vector paths', () => {
  it('traces a circle as two arcs starting at three o’clock', () => {
    expect(circlePath({ x: 0, y: 0 }, 2)).toBe('M2 0 A2 2 0 1 1 -2 0 A2 2 0 1 1 2 0Z');
  });

  it('traces a diamond around its centre', () => {
    expect(diamondPath({ x: 10, y: 10 }, 5)).toBe('M10 5 L15 10 L10 15 L5 10Z');
  });
});
