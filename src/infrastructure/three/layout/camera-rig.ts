import type { PerspectiveCamera, PointLight } from 'three';

import { cameraForward, cameraUp, playerHandPose } from '@infrastructure/three/layout/hand-poses';
import type { Layout, ViewWindow } from '@infrastructure/three/layout/layouts';
import { viewWindow } from '@infrastructure/three/layout/layouts';

export interface CameraFit {
  readonly layout: Layout;
  readonly screenAspect: number;
}

const HAND_LIGHT_SHIFT_X = -0.6;

export const fitCamera = (camera: PerspectiveCamera, { layout, screenAspect }: CameraFit) => {
  const view: ViewWindow = viewWindow(layout.aspect, screenAspect);
  camera.fov = layout.fov;
  camera.aspect = layout.aspect;
  camera.setViewOffset(layout.aspect, 1, view.x, view.y, view.width, view.height);
  camera.position.set(...layout.camera);
  camera.lookAt(...layout.look);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  return view;
};

export const placeHandLight = (light: PointLight, camera: PerspectiveCamera, layout: Layout) => {
  const handCenter = playerHandPose(camera, layout, { index: 1, count: 3 }).position;
  light.position
    .copy(handCenter)
    .addScaledVector(cameraUp(camera), 0.9)
    .addScaledVector(cameraForward(camera), -0.7);
  light.position.x += HAND_LIGHT_SHIFT_X;
};
