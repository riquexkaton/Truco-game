import { Vector3 } from 'three';

import { itemAt } from '@domain/shared/random';

import { addBlob, jitter } from '@infrastructure/three/coins/coin-instances';
import { coinLevelY, isLootSpotUsed, lootSlot } from '@infrastructure/three/coins/coin-layout';
import type { CoinPile, CoinTable } from '@infrastructure/three/coins/coin-table';

export const refreshLootBlobs = (
  table: CoinTable,
  pile: CoinPile,
  lootCount: number = pile.loot.length,
): void => {
  const { lootSpots, lootBase } = pile.placement;
  for (const [index, spot] of lootSpots.entries()) {
    const blob = pile.lootBlobs[index] ?? addBlob(table);
    pile.lootBlobs[index] = blob;
    blob.position.set(spot.x + 0.06, lootBase + 0.002, spot.z + 0.07);
    blob.visible = isLootSpotUsed(index, lootCount);
  }
};

export const nextLootPosition = (table: CoinTable, pile: CoinPile): Vector3 => {
  const { lootSpots, lootBase } = pile.placement;
  const slot = lootSlot(pile.loot.length, lootSpots.length);
  const spot = itemAt(lootSpots, slot.spot);
  refreshLootBlobs(table, pile, pile.loot.length + 1);
  return new Vector3(
    spot.x + jitter(0.014),
    coinLevelY(lootBase, slot.level),
    spot.z + jitter(0.014),
  );
};
