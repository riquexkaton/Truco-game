import { Euler } from 'three';

import type { Side } from '@domain/shared/side';
import { opponent } from '@domain/shared/side';

import { launchFlight } from '@infrastructure/three/coins/coin-flights';
import {
  FULL_TURN,
  hideInstance,
  looseCoin,
  stackLengths,
} from '@infrastructure/three/coins/coin-instances';
import { fullestStack } from '@infrastructure/three/coins/coin-layout';
import { nextLootPosition } from '@infrastructure/three/coins/coin-loot';
import type { CoinPile, CoinTable, PileCoin } from '@infrastructure/three/coins/coin-table';

interface CoinOrder {
  readonly side: Side;
  readonly order: number;
}

const LOSS_FLIGHT_SECONDS = 1.25;

const takeFromStack = (pile: CoinPile): PileCoin | undefined => {
  const entry = pile.stacks[fullestStack(stackLengths(pile))]?.pop();
  if (entry === undefined) return undefined;
  pile.count -= 1;
  hideInstance(pile, entry);
  pile.free[entry.variant]?.push(entry.index);
  return entry;
};

const didLoseCoin = (table: CoinTable, { side, order }: CoinOrder): boolean => {
  const entry = takeFromStack(table.piles[side]);
  if (entry === undefined) return false;
  const winner = table.piles[opponent(side)];
  const coin = looseCoin(table, entry.variant);
  coin.position.copy(entry.position);
  coin.quaternion.copy(entry.quaternion);
  const to = nextLootPosition(table, winner);
  winner.loot.push(coin);
  launchFlight(table, {
    coin,
    order,
    to,
    flips: (2 + Math.floor(Math.random() * 2)) * FULL_TURN,
    yawFrom: new Euler().setFromQuaternion(entry.quaternion).y,
    yawTo: Math.random() * FULL_TURN,
    seconds: LOSS_FLIGHT_SECONDS,
    onLand: null,
  });
  return true;
};

export const loseCoins = (table: CoinTable, side: Side, amount: number): void => {
  for (let order = 0; order < amount; order += 1) {
    if (!didLoseCoin(table, { side, order })) return;
  }
};
