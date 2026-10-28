import type { PerspectiveCamera } from 'three';
import { Vector3 } from 'three';

import type { CardPose } from '@infrastructure/three/cards/card-state';
import type { Layout } from '@infrastructure/three/layout/layouts';
import { handSpread, rivalHandPoint } from '@infrastructure/three/layout/layouts';
import { FACE_DOWN } from '@infrastructure/three/layout/table-points';

export interface ViewPoint {
  readonly x: number;
  readonly y: number;
  readonly distance: number;
}

export interface HandSlot {
  readonly index: number;
  readonly count: number;
}

const RIGHT = new Vector3(1, 0, 0);
const HAND_CURVE = 0.05;
const HAND_ROLL = 0.14;

export const cameraUp = (camera: PerspectiveCamera): Vector3 =>
  new Vector3(0, 1, 0).applyQuaternion(camera.quaternion);

export const cameraForward = (camera: PerspectiveCamera): Vector3 =>
  new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);

export const pointAlongView = (camera: PerspectiveCamera, point: ViewPoint): Vector3 => {
  const direction = new Vector3(point.x, point.y, 0.5)
    .unproject(camera)
    .sub(camera.position)
    .normalize();
  return camera.position.clone().addScaledVector(direction, point.distance);
};

export const playerHandPose = (
  camera: PerspectiveCamera,
  layout: Layout,
  slot: HandSlot,
): CardPose => {
  const x = handSpread(slot.index, slot.count, layout.hand.spacing);
  const curve = Math.abs(x) * HAND_CURVE;
  const forward = cameraForward(camera);
  const position = pointAlongView(camera, {
    x: 0,
    y: layout.hand.screenY,
    distance: layout.hand.distance,
  })
    .addScaledVector(RIGHT, x)
    .addScaledVector(cameraUp(camera), -curve)
    .addScaledVector(forward, curve);
  return { position, rx: -Math.asin(-forward.y), rz: -x * HAND_ROLL };
};

export const rivalHandPose = (slot: HandSlot): CardPose => {
  const point = rivalHandPoint(slot.index, slot.count);
  return { position: new Vector3(point.x, point.y, point.z), rx: FACE_DOWN, rz: point.rz };
};
