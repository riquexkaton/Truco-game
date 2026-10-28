import type { Scene } from 'three';
import { HemisphereLight, Mesh, PlaneGeometry, PointLight, ShadowMaterial, SpotLight } from 'three';

import { TABLE_Y } from '@infrastructure/three/layout/table-points';

export interface RoomLights {
  readonly handLight: PointLight;
}

const addTopLight = (scene: Scene): void => {
  const topLight = new SpotLight(0xff_b0_70, 26, 16, 0.55, 0.9, 2);
  topLight.position.set(-0.8, 7, -0.6);
  topLight.target.position.set(0, 0, 0.1);
  scene.add(topLight, topLight.target);
};

const addShadowCatcher = (scene: Scene): void => {
  const plane = new Mesh(new PlaneGeometry(14, 10), new ShadowMaterial({ opacity: 0.5 }));
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = TABLE_Y;
  plane.receiveShadow = true;
  scene.add(plane);
};

export const addRoomLights = (scene: Scene): RoomLights => {
  const handLight = new PointLight(0xff_b0_70, 2.4, 5, 2);
  const coinFill = new PointLight(0xff_a8_60, 0.7, 4, 2);
  coinFill.position.set(-2.3, 1.4, 1.1);
  scene.add(new HemisphereLight(0x3a_2c_26, 0x05_03_02, 0.4), handLight, coinFill);
  addShadowCatcher(scene);
  addTopLight(scene);
  return { handLight };
};
