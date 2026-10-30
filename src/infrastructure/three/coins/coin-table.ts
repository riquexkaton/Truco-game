import type { InstancedMesh, Mesh, Quaternion, Scene, Sprite, Texture, Vector3 } from 'three';
import { MeshBasicMaterial, PlaneGeometry } from 'three';

import type { PerSide, Side } from '@domain/shared/side';

import type { PilePlacement } from '@infrastructure/three/coins/coin-layout';
import { pilePlacement } from '@infrastructure/three/coins/coin-layout';
import type { CoinProto } from '@infrastructure/three/coins/coin-protos';
import type { LayoutKey } from '@infrastructure/three/layout/layouts';

export interface PileCoin {
  readonly variant: number;
  readonly index: number;
  readonly position: Vector3;
  readonly quaternion: Quaternion;
}

export interface CoinPile {
  placement: PilePlacement;
  count: number;
  meshes: InstancedMesh[];
  blobs: Mesh[];
  stacks: PileCoin[][];
  free: number[][];
  loot: Mesh[];
  readonly lootBlobs: Mesh[];
}

export interface CoinFlight {
  readonly coin: Mesh;
  readonly from: Vector3;
  readonly to: Vector3;
  readonly flips: number;
  readonly yawFrom: number;
  readonly yawTo: number;
  readonly duration: number;
  readonly apex: number;
  readonly onLand: (() => void) | null;
  progress: number;
  spark: Sprite | null;
}

export interface CoinTable {
  readonly scene: Scene;
  readonly protos: readonly CoinProto[];
  readonly piles: PerSide<CoinPile>;
  readonly flights: CoinFlight[];
  readonly blobGeometry: PlaneGeometry;
  readonly blobMaterial: MeshBasicMaterial;
  readonly sparkTexture: Texture;
  readonly reducedMotion: boolean;
  readonly onCoinLand: () => void;
}

export interface CoinTableOptions {
  readonly scene: Scene;
  readonly protos: readonly CoinProto[];
  readonly blobTexture: Texture;
  readonly sparkTexture: Texture;
  readonly reducedMotion: boolean;
  readonly layout: LayoutKey;
  readonly onCoinLand: () => void;
}

const emptyPile = (side: Side, layout: LayoutKey): CoinPile => ({
  placement: pilePlacement(side, layout),
  count: 0,
  meshes: [],
  blobs: [],
  stacks: [],
  free: [],
  loot: [],
  lootBlobs: [],
});

export const createCoinTable = (options: CoinTableOptions): CoinTable => ({
  scene: options.scene,
  protos: options.protos,
  piles: { player: emptyPile('player', options.layout), rival: emptyPile('rival', options.layout) },
  flights: [],
  blobGeometry: new PlaneGeometry(0.62, 0.62),
  blobMaterial: new MeshBasicMaterial({
    map: options.blobTexture,
    transparent: true,
    depthWrite: false,
    opacity: 0.75,
    color: 0x00_00_00,
  }),
  sparkTexture: options.sparkTexture,
  reducedMotion: options.reducedMotion,
  onCoinLand: options.onCoinLand,
});
