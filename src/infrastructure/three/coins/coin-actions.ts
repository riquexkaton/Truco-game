import { SIDES } from '@domain/shared/side';

import type { CoinMove } from '@application/ports/table-port';

import { gainCoins } from '@infrastructure/three/coins/coin-gains';
import { PILE_CAPACITY, pilePlacement } from '@infrastructure/three/coins/coin-layout';
import { refreshLootBlobs } from '@infrastructure/three/coins/coin-loot';
import { loseCoins } from '@infrastructure/three/coins/coin-moves';
import { buildPile } from '@infrastructure/three/coins/coin-pile';
import type { CoinTable } from '@infrastructure/three/coins/coin-table';
import type { LayoutKey } from '@infrastructure/three/layout/layouts';

export const moveCoins = (table: CoinTable, { side, delta }: CoinMove): void => {
  if (delta < 0) {
    loseCoins(table, side, -delta);
    return;
  }
  gainCoins(table, side, delta);
};

export const resetCoins = (table: CoinTable): void => {
  for (const side of SIDES) {
    buildPile(table, side, { count: PILE_CAPACITY, resetLoot: true });
  }
};

export const relayoutCoins = (table: CoinTable, layout: LayoutKey): void => {
  const pile = table.piles.player;
  const placement = pilePlacement('player', layout);
  if (placement === pile.placement) return;
  pile.placement = placement;
  refreshLootBlobs(table, pile);
  buildPile(table, 'player', { count: pile.count, resetLoot: false });
};
