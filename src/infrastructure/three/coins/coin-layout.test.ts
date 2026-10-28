import { describe, expect, it } from 'vitest';

import {
  COIN_HEIGHT,
  STACKS,
  coinLevelY,
  emptiestStack,
  fullestStack,
  isLootSpotUsed,
  lootSlot,
  pilePlacement,
  stackFill,
  stackPoint,
} from '@infrastructure/three/coins/coin-layout';

describe('stackFill', () => {
  it('fills a full pile of 20 as 9, 7 and 4 coins', () => {
    expect(stackFill(20)).toEqual([9, 7, 4]);
  });

  it('fills the stacks in order when life is lower', () => {
    expect(stackFill(12)).toEqual([9, 3, 0]);
    expect(stackFill(0)).toEqual([0, 0, 0]);
  });
});

describe('pile placement', () => {
  it('moves the player pile closer on tall screens', () => {
    expect(pilePlacement('player', 'wide').center).toEqual({ x: -2.35, z: 1.45 });
    expect(pilePlacement('player', 'tall').center).toEqual({ x: -2, z: 0.95 });
  });

  it('keeps the rival pile mirrored and fixed', () => {
    const rival = pilePlacement('rival', 'tall');
    expect(rival).toBe(pilePlacement('rival', 'wide'));
    expect(stackPoint(rival, STACKS[1] ?? { dx: 0, dz: 0, size: 0 })).toEqual({
      x: 2.35 - 0.39,
      z: -1.45 - 0.12,
    });
  });

  it('stacks coins one thickness above the other', () => {
    expect(coinLevelY(0.09, 0)).toBeCloseTo(0.09 + COIN_HEIGHT / 2);
    expect(coinLevelY(0.09, 3) - coinLevelY(0.09, 2)).toBeCloseTo(COIN_HEIGHT);
  });
});

describe('loot', () => {
  it('fills a spot with ten coins before moving to the next one', () => {
    expect(lootSlot(0, 2)).toEqual({ spot: 0, level: 0 });
    expect(lootSlot(9, 2)).toEqual({ spot: 0, level: 9 });
    expect(lootSlot(10, 2)).toEqual({ spot: 1, level: 0 });
  });

  it('keeps piling on the last spot once every spot is full', () => {
    expect(lootSlot(23, 2)).toEqual({ spot: 1, level: 13 });
  });

  it('shows a spot shadow only once a coin lands there', () => {
    expect(isLootSpotUsed(0, 0)).toBe(false);
    expect(isLootSpotUsed(0, 1)).toBe(true);
    expect(isLootSpotUsed(1, 10)).toBe(false);
    expect(isLootSpotUsed(1, 11)).toBe(true);
  });
});

describe('stack choice', () => {
  it('takes lost coins from the tallest stack, first one on ties', () => {
    expect(fullestStack([9, 7, 4])).toBe(0);
    expect(fullestStack([6, 7, 7])).toBe(1);
  });

  it('returns healed coins to the shortest stack, first one on ties', () => {
    expect(emptiestStack([9, 7, 4])).toBe(2);
    expect(emptiestStack([3, 3, 4])).toBe(0);
  });
});
