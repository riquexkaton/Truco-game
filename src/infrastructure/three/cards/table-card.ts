import type { PlaneGeometry, Scene, Texture } from 'three';
import { AdditiveBlending, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial } from 'three';

import type { CardMotionState } from '@infrastructure/three/cards/card-state';
import { restingMotion } from '@infrastructure/three/cards/card-state';

export interface TableCard extends CardMotionState {
  readonly group: Group;
  readonly front: Mesh;
  readonly back: Mesh;
  readonly frontMaterial: MeshStandardMaterial;
  readonly glareMaterial: MeshBasicMaterial;
  readonly glareMap: Texture;
}

export interface CardKit {
  readonly scene: Scene;
  readonly geometry: PlaneGeometry;
  readonly glareTexture: Texture;
}

export interface CardSkin {
  readonly back: Texture;
  readonly front: Texture | null;
}

interface Glare {
  readonly mesh: Mesh;
  readonly material: MeshBasicMaterial;
  readonly map: Texture;
}

type CardSide = Mesh<PlaneGeometry, MeshStandardMaterial>;

const CARD_ROUGHNESS = 0.62;
const FACE_GAP = 0.0015;

const cardSide = (kit: CardKit, map: Texture | null, depth: number): CardSide => {
  const mesh = new Mesh(kit.geometry, new MeshStandardMaterial({ map, roughness: CARD_ROUGHNESS }));
  mesh.position.z = depth;
  mesh.castShadow = true;
  return mesh;
};

const createGlare = (kit: CardKit): Glare => {
  const map = kit.glareTexture.clone();
  map.needsUpdate = true;
  map.repeat.set(0.5, 0.5);
  const material = new MeshBasicMaterial({
    map,
    transparent: true,
    opacity: 0,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const mesh = new Mesh(kit.geometry, material);
  mesh.position.z = 0.003;
  return { mesh, material, map };
};

export const createTableCard = (kit: CardKit, skin: CardSkin): TableCard => {
  const front = cardSide(kit, skin.front, FACE_GAP);
  const back = cardSide(kit, skin.back, -FACE_GAP);
  back.rotation.y = Math.PI;
  const glare = createGlare(kit);
  const group = new Group();
  group.add(front, back, glare.mesh);
  group.visible = false;
  kit.scene.add(group);
  return {
    ...restingMotion(),
    group,
    front,
    back,
    frontMaterial: front.material,
    glareMaterial: glare.material,
    glareMap: glare.map,
  };
};
