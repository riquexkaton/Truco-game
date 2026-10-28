import type { BackgroundKey } from '@infrastructure/browser/table-asset-urls';
import { CARD_Y } from '@infrastructure/three/layout/table-points';

export type LayoutKey = BackgroundKey;

export type Triple = readonly [number, number, number];

interface HandLayout {
  readonly distance: number;
  readonly screenY: number;
  readonly spacing: number;
}

export interface Layout {
  readonly key: LayoutKey;
  readonly aspect: number;
  readonly camera: Triple;
  readonly look: Triple;
  readonly fov: number;
  readonly hand: HandLayout;
}

export interface ViewWindow {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface RivalHandPoint {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly rz: number;
}

const TALL_BELOW_ASPECT = 0.8;
const RIVAL_HAND = { spacing: 0.5, rise: 0.004, z: -2.15, roll: 0.1 };

export const LAYOUTS: Readonly<Record<LayoutKey, Layout>> = {
  wide: {
    key: 'wide',
    aspect: 2560 / 1600,
    camera: [0, 5.2, 3.9],
    look: [0, 0, 0.25],
    fov: 42,
    hand: { distance: 3.8, screenY: -0.36, spacing: 0.74 },
  },
  tall: {
    key: 'tall',
    aspect: 1200 / 2600,
    camera: [0, 9, 4.2],
    look: [0, 0, 0.2],
    fov: 62,
    hand: { distance: 4.3, screenY: -0.47, spacing: 0.66 },
  },
};

export const layoutFor = (screenAspect: number): Layout =>
  screenAspect < TALL_BELOW_ASPECT ? LAYOUTS.tall : LAYOUTS.wide;

export const viewWindow = (layoutAspect: number, screenAspect: number): ViewWindow => {
  if (screenAspect > layoutAspect) {
    const height = layoutAspect / screenAspect;
    return { x: 0, y: (1 - height) / 2, width: layoutAspect, height };
  }
  return { x: (layoutAspect - screenAspect) / 2, y: 0, width: screenAspect, height: 1 };
};

export const backgroundUvRect = (
  layoutAspect: number,
  view: ViewWindow,
): readonly [number, number, number, number] => [
  view.x / layoutAspect,
  1 - (view.y + view.height),
  view.width / layoutAspect,
  view.height,
];

export const handSpread = (index: number, count: number, spacing: number): number =>
  (index - (count - 1) / 2) * spacing;

export const rivalHandPoint = (index: number, count: number): RivalHandPoint => {
  const x = handSpread(index, count, RIVAL_HAND.spacing);
  return { x, y: CARD_Y + RIVAL_HAND.rise * index, z: RIVAL_HAND.z, rz: x * RIVAL_HAND.roll };
};
