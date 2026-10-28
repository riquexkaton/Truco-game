import type { Side } from '@domain/shared/side';

import type { LayoutKey } from '@infrastructure/three/layout/layouts';
import type { TablePoint } from '@infrastructure/three/layout/table-points';

export const COIN_SCALE = 1.3;
export const COIN_HEIGHT = 0.025 * COIN_SCALE;
export const PILE_CAPACITY = 20;
const LOOT_PER_SPOT = 10;

export interface StackSpec {
  readonly dx: number;
  readonly dz: number;
  readonly size: number;
}

export interface PilePlacement {
  readonly center: TablePoint;
  readonly base: number;
  readonly sign: number;
  readonly lootSpots: readonly TablePoint[];
  readonly lootBase: number;
}

export interface LootSlot {
  readonly spot: number;
  readonly level: number;
}

export const STACKS: readonly StackSpec[] = [
  { dx: 0, dz: 0, size: 9 },
  { dx: 0.39, dz: 0.12, size: 7 },
  { dx: -0.06, dz: 0.4, size: 4 },
];

const PLAYER_WIDE: PilePlacement = {
  center: { x: -2.35, z: 1.45 },
  base: 0.09,
  sign: 1,
  lootSpots: [
    { x: -2.15, z: 0.86 },
    { x: -1.8, z: 0.98 },
  ],
  lootBase: 0.097,
};

const PLAYER_TALL: PilePlacement = {
  ...PLAYER_WIDE,
  center: { x: -2, z: 0.95 },
  lootSpots: [
    { x: -1.45, z: 0.62 },
    { x: -1.15, z: 0.8 },
  ],
};

const RIVAL: PilePlacement = {
  center: { x: 2.35, z: -1.45 },
  base: 0.104,
  sign: -1,
  lootSpots: [
    { x: 1.5, z: -2.2 },
    { x: 1.6, z: -2.58 },
  ],
  lootBase: 0.104,
};

export const pilePlacement = (side: Side, layout: LayoutKey): PilePlacement => {
  if (side === 'rival') return RIVAL;
  return layout === 'tall' ? PLAYER_TALL : PLAYER_WIDE;
};

export const stackFill = (count: number): number[] => {
  let left = Math.max(0, count);
  return STACKS.map(({ size }) => {
    const taken = Math.min(size, left);
    left -= taken;
    return taken;
  });
};

export const coinLevelY = (base: number, level: number): number =>
  base + COIN_HEIGHT / 2 + level * COIN_HEIGHT;

export const stackPoint = (placement: PilePlacement, stack: StackSpec): TablePoint => ({
  x: placement.center.x + stack.dx * placement.sign,
  z: placement.center.z + stack.dz * placement.sign,
});

export const lootSlot = (lootCount: number, spotCount: number): LootSlot => {
  const spot = Math.min(Math.floor(lootCount / LOOT_PER_SPOT), spotCount - 1);
  return { spot, level: lootCount - spot * LOOT_PER_SPOT };
};

export const isLootSpotUsed = (spot: number, lootCount: number): boolean =>
  lootCount > spot * LOOT_PER_SPOT;

type Preference = (candidate: number, best: number) => boolean;

const pickIndex = (lengths: readonly number[], isBetter: Preference): number => {
  let best = 0;
  for (const [index, length] of lengths.entries()) {
    if (isBetter(length, lengths[best] ?? 0)) best = index;
  }
  return best;
};

export const fullestStack = (lengths: readonly number[]): number =>
  pickIndex(lengths, (candidate, best) => candidate > best);

export const emptiestStack = (lengths: readonly number[]): number =>
  pickIndex(lengths, (candidate, best) => candidate < best);
