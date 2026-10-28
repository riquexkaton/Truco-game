import { describe, expect, it } from 'vitest';

import {
  LAYOUTS,
  backgroundUvRect,
  handSpread,
  layoutFor,
  rivalHandPoint,
  viewWindow,
} from '@infrastructure/three/layout/layouts';

describe('layoutFor', () => {
  it('uses the tall layout on portrait screens', () => {
    expect(layoutFor(390 / 844).key).toBe('tall');
    expect(layoutFor(0.79).key).toBe('tall');
  });

  it('uses the wide layout from an aspect of 0.8 upwards', () => {
    expect(layoutFor(0.8).key).toBe('wide');
    expect(layoutFor(16 / 9).key).toBe('wide');
  });
});

describe('viewWindow', () => {
  it('crops top and bottom on screens wider than the layout', () => {
    const view = viewWindow(1.6, 3.2);
    expect(view).toEqual({ x: 0, y: 0.25, width: 1.6, height: 0.5 });
  });

  it('crops the sides on screens narrower than the layout', () => {
    const view = viewWindow(1.6, 1.2);
    expect(view.x).toBeCloseTo(0.2);
    expect(view).toMatchObject({ y: 0, width: 1.2, height: 1 });
  });

  it('shows the whole frame when the aspects match', () => {
    expect(viewWindow(1.6, 1.6)).toEqual({ x: 0, y: 0, width: 1.6, height: 1 });
  });
});

describe('backgroundUvRect', () => {
  it('maps the visible window to texture coordinates with y pointing up', () => {
    const rect = backgroundUvRect(1.6, { x: 0.2, y: 0, width: 1.2, height: 1 });
    expect(rect[0]).toBeCloseTo(0.125);
    expect(rect[1]).toBe(0);
    expect(rect[2]).toBeCloseTo(0.75);
    expect(rect[3]).toBe(1);
  });

  it('keeps the vertical band centred when cropping top and bottom', () => {
    expect(backgroundUvRect(1.6, { x: 0, y: 0.25, width: 1.6, height: 0.5 })).toEqual([
      0, 0.25, 1, 0.5,
    ]);
  });
});

describe('hand positions', () => {
  it('spreads cards symmetrically around the centre', () => {
    expect([0, 1, 2].map((index) => handSpread(index, 3, LAYOUTS.wide.hand.spacing))).toEqual([
      -0.74, 0, 0.74,
    ]);
    expect(handSpread(0, 2, 0.5)).toBe(-0.25);
  });

  it('places the rival hand face down on the far side, slightly stacked and rolled', () => {
    const left = rivalHandPoint(0, 3);
    const right = rivalHandPoint(2, 3);
    expect(left).toEqual({ x: -0.5, y: 0.13, z: -2.15, rz: -0.05 });
    expect(right.x).toBe(0.5);
    expect(right.y).toBeCloseTo(0.138);
    expect(right.rz).toBeCloseTo(0.05);
  });
});
