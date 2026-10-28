import { Euler, InstancedMesh, Quaternion, Vector3 } from 'three';

import { itemAt } from '@domain/shared/random';

import {
  FULL_TURN,
  addBlob,
  coinMatrix,
  jitter,
  randomVariant,
} from '@infrastructure/three/coins/coin-instances';
import type { StackSpec } from '@infrastructure/three/coins/coin-layout';
import {
  PILE_CAPACITY,
  STACKS,
  coinLevelY,
  stackFill,
  stackPoint,
} from '@infrastructure/three/coins/coin-layout';
import type { CoinPile, CoinTable, PileCoin } from '@infrastructure/three/coins/coin-table';

interface StackSlot {
  readonly stack: StackSpec;
  readonly level: number;
}

export const createInstancedMeshes = (table: CoinTable): InstancedMesh[] =>
  table.protos.map((proto) => {
    const mesh = new InstancedMesh(proto.geometry, proto.material, PILE_CAPACITY);
    mesh.count = 0;
    mesh.receiveShadow = false;
    mesh.frustumCulled = false;
    table.scene.add(mesh);
    return mesh;
  });

const stackCoin = (table: CoinTable, pile: CoinPile, slot: StackSlot): PileCoin => {
  const variant = randomVariant(table);
  const mesh = itemAt(pile.meshes, variant);
  const index = mesh.count;
  mesh.count += 1;
  const point = stackPoint(pile.placement, slot.stack);
  const position = new Vector3(
    point.x + jitter(0.018),
    coinLevelY(pile.placement.base, slot.level),
    point.z + jitter(0.018),
  );
  const tilt = new Euler(jitter(0.04), Math.random() * FULL_TURN, jitter(0.04));
  const quaternion = new Quaternion().setFromEuler(tilt);
  mesh.setMatrixAt(index, coinMatrix(position, quaternion));
  return { variant, index, position, quaternion };
};

const placeStackBlob = (table: CoinTable, pile: CoinPile, stack: StackSpec): void => {
  const point = stackPoint(pile.placement, stack);
  const blob = addBlob(table);
  blob.position.set(point.x + 0.06, pile.placement.base + 0.002, point.z + 0.07);
  pile.blobs.push(blob);
};

export const buildStacks = (table: CoinTable, pile: CoinPile, count: number): void => {
  const fills = stackFill(count);
  pile.stacks = STACKS.map((stack, stackIndex) => {
    placeStackBlob(table, pile, stack);
    return Array.from({ length: fills[stackIndex] ?? 0 }, (_, level) =>
      stackCoin(table, pile, { stack, level }),
    );
  });
  for (const mesh of pile.meshes) {
    mesh.instanceMatrix.needsUpdate = true;
  }
};
