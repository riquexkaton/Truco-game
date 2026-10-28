import { Vector2, Vector3 } from 'three';

import { FACE_DOWN } from '@infrastructure/three/layout/table-points';

export interface CardPose {
  readonly position: Vector3;
  readonly rx: number;
  readonly rz: number;
}

interface CardTween {
  readonly from: CardPose;
  readonly to: CardPose;
  readonly duration: number;
  readonly lift: number;
  readonly resolve: () => void;
  progress: number;
}

export interface CardMotionState {
  readonly position: Vector3;
  rx: number;
  rz: number;
  tween: CardTween | null;
  hover: number;
  hoverTarget: number;
  readonly tilt: Vector2;
  readonly tiltTarget: Vector2;
}

export const restingMotion = (): CardMotionState => ({
  position: new Vector3(),
  rx: FACE_DOWN,
  rz: 0,
  tween: null,
  hover: 0,
  hoverTarget: 0,
  tilt: new Vector2(),
  tiltTarget: new Vector2(),
});
