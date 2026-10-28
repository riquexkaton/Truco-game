import { describe, expect, it } from 'vitest';

import {
  coverCrop,
  seigaihaCenters,
  tileOrigins,
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

describe('tileOrigins', () => {
  it('covers the area with one extra tile before each edge', () => {
    const origins = tileOrigins({ x: 14, y: 14, width: 36, height: 62 }, { width: 36, height: 62 });
    expect(origins).toEqual([
      { x: -22, y: -48 },
      { x: 14, y: -48 },
      { x: -22, y: 14 },
      { x: 14, y: 14 },
    ]);
  });
});
