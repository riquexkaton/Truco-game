import type { Side } from '@domain/shared/side';

import { dropOrphanFlights } from '@infrastructure/three/coins/coin-flights';
import { buildStacks, createInstancedMeshes } from '@infrastructure/three/coins/coin-stacks';
import type { CoinPile, CoinTable } from '@infrastructure/three/coins/coin-table';

export interface PileBuild {
  readonly count: number;
  readonly resetLoot: boolean;
}

const clearPile = (pile: CoinPile): void => {
  for (const mesh of pile.meshes) {
    mesh.removeFromParent();
    mesh.dispose();
  }
  for (const blob of pile.blobs) {
    blob.removeFromParent();
  }
};

const resetLoot = (table: CoinTable, pile: CoinPile): void => {
  for (const coin of pile.loot) {
    coin.removeFromParent();
  }
  pile.loot = [];
  for (const blob of pile.lootBlobs) {
    blob.visible = false;
  }
  dropOrphanFlights(table);
};

export const buildPile = (table: CoinTable, side: Side, build: PileBuild): void => {
  const pile = table.piles[side];
  clearPile(pile);
  if (build.resetLoot) resetLoot(table, pile);
  pile.count = build.count;
  pile.blobs = [];
  pile.stacks = [];
  pile.free = table.protos.map(() => []);
  pile.meshes = createInstancedMeshes(table);
  if (pile.meshes.length > 0) buildStacks(table, pile, build.count);
};
