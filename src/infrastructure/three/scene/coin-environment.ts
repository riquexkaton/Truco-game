import type { WebGLRenderer, WebGLRenderTarget } from 'three';
import { Color, Mesh, MeshBasicMaterial, PMREMGenerator, Scene, SphereGeometry } from 'three';

import type { Triple } from '@infrastructure/three/layout/layouts';

interface LightSpot {
  readonly position: Triple;
  readonly radius: number;
  readonly color: Triple;
}

const LIGHT_SPOTS: readonly LightSpot[] = [
  { position: [-3, 1.2, -1.6], radius: 0.45, color: [7, 3.6, 1.4] },
  { position: [3, 0.7, -2], radius: 0.3, color: [4, 2.2, 0.9] },
  { position: [0, 7, 0], radius: 3.5, color: [0.32, 0.2, 0.11] },
  { position: [0, -4, 0], radius: 4, color: [0.1, 0.06, 0.035] },
  { position: [-4.4, 1.6, -3.4], radius: 0.4, color: [3, 1.6, 0.6] },
];

const ENVIRONMENT_BLUR = 0.03;

const spotMesh = (spot: LightSpot): Mesh<SphereGeometry, MeshBasicMaterial> => {
  const mesh = new Mesh(
    new SphereGeometry(spot.radius, 16, 8),
    new MeshBasicMaterial({ color: new Color(...spot.color) }),
  );
  mesh.position.set(...spot.position);
  return mesh;
};

export const createCoinEnvironment = (renderer: WebGLRenderer): WebGLRenderTarget => {
  const scene = new Scene();
  scene.background = new Color(0x07_04_03);
  const meshes = LIGHT_SPOTS.map((spot) => spotMesh(spot));
  scene.add(...meshes);
  const generator = new PMREMGenerator(renderer);
  const target = generator.fromScene(scene, ENVIRONMENT_BLUR);
  generator.dispose();
  for (const mesh of meshes) {
    mesh.geometry.dispose();
    mesh.material.dispose();
  }
  return target;
};
