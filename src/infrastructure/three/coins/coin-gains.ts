import type { Mesh } from 'three';
import { Euler, Quaternion, Vector3 } from 'three';

import { itemAt } from '@domain/shared/random';
import type { Side } from '@domain/shared/side';

import { launchFlight } from '@infrastructure/three/coins/coin-flights';
import type { InstanceSlot } from '@infrastructure/three/coins/coin-instances';
import {
  FULL_TURN,
  hideInstance,
  jitter,
  looseCoin,
  showInstance,
  stackLengths,
} from '@infrastructure/three/coins/coin-instances';
import {
  PILE_CAPACITY,
  STACKS,
  coinLevelY,
  emptiestStack,
  stackPoint,
} from '@infrastructure/three/coins/coin-layout';
import { refreshLootBlobs } from '@infrastructure/three/coins/coin-loot';
import type { CoinPile, CoinTable, PileCoin } from '@infrastructure/three/coins/coin-table';

const GAIN_FLIGHT_SECONDS = 1.1;
const DROP_OFFSET = new Vector3(0.1, 1.3, 0.4);

const claimSlot = (pile: CoinPile): InstanceSlot | null => {
  const variants = pile.meshes.length;
  const start = Math.floor(Math.random() * variants);
  for (let tries = 0; tries < variants; tries += 1) {
    const variant = (start + tries) % variants;
    const freed = pile.free[variant]?.pop();
    if (freed !== undefined) return { variant, index: freed };
    const mesh = itemAt(pile.meshes, variant);
    if (mesh.count < PILE_CAPACITY) {
      mesh.count += 1;
      return { variant, index: mesh.count - 1 };
    }
  }
  return null;
};

const stackEntry = (pile: CoinPile, slot: InstanceSlot, yaw: number): PileCoin => {
  const stackIndex = emptiestStack(stackLengths(pile));
  const stack = itemAt(pile.stacks, stackIndex);
  const point = stackPoint(pile.placement, itemAt(STACKS, stackIndex));
  const entry: PileCoin = {
    ...slot,
    position: new Vector3(
      point.x + jitter(0.018),
      coinLevelY(pile.placement.base, stack.length),
      point.z + jitter(0.018),
    ),
    quaternion: new Quaternion().setFromEuler(new Euler(0, yaw, 0)),
  };
  stack.push(entry);
  pile.count += 1;
  return entry;
};

const returningCoin = (table: CoinTable, pile: CoinPile, entry: PileCoin): Mesh => {
  const looted = pile.loot.pop();
  refreshLootBlobs(table, pile);
  if (looted !== undefined) return looted;
  const coin = looseCoin(table, entry.variant);
  coin.position.copy(entry.position).add(DROP_OFFSET);
  return coin;
};

const didGainCoin = (table: CoinTable, pile: CoinPile, order: number): boolean => {
  const slot = claimSlot(pile);
  if (slot === null) return false;
  hideInstance(pile, slot);
  const yaw = Math.random() * FULL_TURN;
  const entry = stackEntry(pile, slot, yaw);
  const coin = returningCoin(table, pile, entry);
  launchFlight(table, {
    coin,
    order,
    to: entry.position,
    flips: 2 * FULL_TURN,
    yawFrom: coin.rotation.y,
    yawTo: yaw,
    seconds: GAIN_FLIGHT_SECONDS,
    onLand: () => {
      coin.removeFromParent();
      showInstance(pile, entry);
    },
  });
  return true;
};

export const gainCoins = (table: CoinTable, side: Side, amount: number): void => {
  const pile = table.piles[side];
  if (pile.meshes.length === 0) return;
  for (let order = 0; order < amount; order += 1) {
    if (!didGainCoin(table, pile, order)) return;
  }
};
