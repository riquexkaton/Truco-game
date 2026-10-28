import type { Quaternion } from 'three';
import { Matrix4, Mesh, Vector3 } from 'three';

import { itemAt } from '@domain/shared/random';

import { COIN_SCALE } from '@infrastructure/three/coins/coin-layout';
import type { CoinPile, CoinTable, PileCoin } from '@infrastructure/three/coins/coin-table';

export interface InstanceSlot {
  readonly variant: number;
  readonly index: number;
}

export const FULL_TURN = Math.PI * 2;

const COIN_MATRIX = new Matrix4();
const COIN_SIZE = new Vector3().setScalar(COIN_SCALE);
const HIDDEN_COIN = new Matrix4().makeScale(0, 0, 0);

export const coinMatrix = (position: Vector3, quaternion: Quaternion): Matrix4 =>
  COIN_MATRIX.compose(position, quaternion, COIN_SIZE);

export const jitter = (spread: number): number => (Math.random() - 0.5) * spread;

export const randomVariant = (table: CoinTable): number =>
  Math.floor(Math.random() * table.protos.length);

export const hideInstance = (pile: CoinPile, slot: InstanceSlot): void => {
  const mesh = itemAt(pile.meshes, slot.variant);
  mesh.setMatrixAt(slot.index, HIDDEN_COIN);
  mesh.instanceMatrix.needsUpdate = true;
};

export const showInstance = (pile: CoinPile, coin: PileCoin): void => {
  const mesh = itemAt(pile.meshes, coin.variant);
  mesh.setMatrixAt(coin.index, coinMatrix(coin.position, coin.quaternion));
  mesh.instanceMatrix.needsUpdate = true;
};

export const stackLengths = (pile: CoinPile): number[] => pile.stacks.map((stack) => stack.length);

export const addBlob = (table: CoinTable): Mesh => {
  const blob = new Mesh(table.blobGeometry, table.blobMaterial);
  blob.rotation.x = -Math.PI / 2;
  table.scene.add(blob);
  return blob;
};

export const looseCoin = (table: CoinTable, variant: number): Mesh => {
  const proto = itemAt(table.protos, variant);
  const coin = new Mesh(proto.geometry, proto.material);
  coin.scale.setScalar(COIN_SCALE);
  coin.receiveShadow = false;
  table.scene.add(coin);
  return coin;
};
