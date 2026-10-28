import type { Scene, Texture } from 'three';
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';

import type { CardBacks } from '@infrastructure/three/cards/table-deck';
import type { TablePoint } from '@infrastructure/three/layout/table-points';
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  DECK_POINT,
  EFFECT_DECK_POINT,
  TABLE_Y,
} from '@infrastructure/three/layout/table-points';

interface DeckBox {
  readonly point: TablePoint;
  readonly top: Texture;
}

const DECK_THICKNESS = 0.16;

const createBox = (geometry: BoxGeometry, edge: MeshStandardMaterial, box: DeckBox): Mesh => {
  const top = new MeshStandardMaterial({ map: box.top, roughness: 0.62 });
  const mesh = new Mesh(geometry, [edge, edge, top, edge, edge, edge]);
  mesh.position.set(box.point.x, TABLE_Y + 0.09, box.point.z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
};

export const addDeckBoxes = (scene: Scene, backs: CardBacks): void => {
  const geometry = new BoxGeometry(CARD_WIDTH, DECK_THICKNESS, CARD_HEIGHT);
  const edge = new MeshStandardMaterial({ color: 0xd8_cc_b4, roughness: 0.8 });
  const boxes: readonly DeckBox[] = [
    { point: DECK_POINT, top: backs.game },
    { point: EFFECT_DECK_POINT, top: backs.effect },
  ];
  for (const box of boxes) {
    scene.add(createBox(geometry, edge, box));
  }
};
