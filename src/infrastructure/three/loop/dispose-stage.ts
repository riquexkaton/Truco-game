import type { Material, Object3D } from 'three';
import { InstancedMesh, Mesh, Points, Sprite, Texture } from 'three';

import { disposeDuelMarks } from '@infrastructure/three/cards/duel-marks';
import { disposeSealMarks } from '@infrastructure/three/cards/seal-marks';
import type { Stage } from '@infrastructure/three/stage';

const texturesOf = (material: Material): Texture[] =>
  Object.values(material as unknown as Record<string, unknown>).filter(
    (value): value is Texture => value instanceof Texture,
  );

const disposeMaterial = (material: Material): void => {
  for (const texture of texturesOf(material)) {
    texture.dispose();
  }
  material.dispose();
};

const disposeMesh = (mesh: Mesh | Points): void => {
  mesh.geometry.dispose();
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  for (const material of materials) {
    disposeMaterial(material);
  }
};

const disposeObject = (object: Object3D): void => {
  if (object instanceof InstancedMesh) (object as InstancedMesh).dispose();
  if (object instanceof Mesh || object instanceof Points) disposeMesh(object as Mesh | Points);
  if (object instanceof Sprite) disposeMaterial(object.material);
};

export const disposeStage = (stage: Stage): void => {
  for (const scene of [stage.scene, stage.background.scene]) {
    scene.traverse((object) => {
      disposeObject(object);
    });
  }
  for (const texture of [...stage.deck.faces.values(), ...Object.values(stage.backgrounds)]) {
    texture?.dispose();
  }
  disposeSealMarks(stage.seals);
  disposeDuelMarks(stage.duelMarks);
  stage.environment.dispose();
  stage.renderer.dispose();
};
