import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

import type { CardId } from '@domain/cards/card';

import type { TableCard } from '@infrastructure/three/cards/table-card';
import type { LayoutKey } from '@infrastructure/three/layout/layouts';
import { CARD_HEIGHT, CARD_WIDTH } from '@infrastructure/three/layout/table-points';
import type { TextureKit } from '@infrastructure/three/textures/canvas-texture';
import { paintedTexture } from '@infrastructure/three/textures/canvas-texture';
import { CARD_LOGICAL_WIDTH } from '@infrastructure/three/textures/paint-tools';
import { SEAL_MARK_MARGIN, paintSealMark } from '@infrastructure/three/textures/seal-mark-paint';
import { SEAL_MARK_SPECS } from '@infrastructure/three/textures/seal-mark-specs';

export interface SealMarks {
  readonly geometry: PlaneGeometry;
  readonly materials: Readonly<Record<LayoutKey, MeshBasicMaterial>>;
  readonly meshes: Map<CardId, Mesh>;
}

export interface SealMarkRequest {
  readonly sealed: readonly CardId[];
  readonly layout: LayoutKey;
  readonly cardOf: (cardId: CardId) => TableCard;
}

const CARD_LOGICAL_HEIGHT = 400;
const CANVAS_SCALE = 1.5;
const MARK_DEPTH = 0.004;
const MARK_ORDER = 2;

const MARK_LOGICAL = {
  width: CARD_LOGICAL_WIDTH + SEAL_MARK_MARGIN * 2,
  height: CARD_LOGICAL_HEIGHT + SEAL_MARK_MARGIN * 2,
};

const markMaterial = (kit: TextureKit, layout: LayoutKey): MeshBasicMaterial =>
  new MeshBasicMaterial({
    map: paintedTexture(kit, {
      width: MARK_LOGICAL.width * CANVAS_SCALE,
      height: MARK_LOGICAL.height * CANVAS_SCALE,
      scale: CANVAS_SCALE,
      paint: (context) => {
        paintSealMark(context, SEAL_MARK_SPECS[layout], CANVAS_SCALE);
      },
    }),
    transparent: true,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });

export const createSealMarks = (kit: TextureKit): SealMarks => ({
  geometry: new PlaneGeometry(
    (CARD_WIDTH * MARK_LOGICAL.width) / CARD_LOGICAL_WIDTH,
    (CARD_HEIGHT * MARK_LOGICAL.height) / CARD_LOGICAL_HEIGHT,
  ),
  materials: { tall: markMaterial(kit, 'tall'), wide: markMaterial(kit, 'wide') },
  meshes: new Map(),
});

const markOf = (marks: SealMarks, cardId: CardId, card: TableCard): Mesh => {
  const existing = marks.meshes.get(cardId);
  if (existing !== undefined) return existing;
  const mesh = new Mesh(marks.geometry, marks.materials.wide);
  mesh.position.z = MARK_DEPTH;
  mesh.renderOrder = MARK_ORDER;
  card.group.add(mesh);
  marks.meshes.set(cardId, mesh);
  return mesh;
};

export const hideSealMarks = (marks: SealMarks): void => {
  for (const mesh of marks.meshes.values()) {
    mesh.visible = false;
  }
};

export const showSealMarks = (marks: SealMarks, request: SealMarkRequest): void => {
  hideSealMarks(marks);
  for (const cardId of request.sealed) {
    const mesh = markOf(marks, cardId, request.cardOf(cardId));
    mesh.material = marks.materials[request.layout];
    mesh.visible = true;
  }
};

export const disposeSealMarks = (marks: SealMarks): void => {
  for (const material of Object.values(marks.materials)) {
    material.map?.dispose();
    material.dispose();
  }
};
