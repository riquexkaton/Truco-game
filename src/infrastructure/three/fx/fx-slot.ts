import type { Object3D } from 'three';

import { STILL_BURNING } from '@infrastructure/three/fx/fx-plan';

export interface NumberUniform {
  value: number;
}

export interface FxSlot {
  readonly object: Object3D;
  readonly start: NumberUniform;
  readonly end: NumberUniform;
  active: boolean;
}

export const parkedSlot = (object: Object3D, start: NumberUniform, end?: NumberUniform): FxSlot => {
  object.visible = false;
  object.frustumCulled = false;
  return { object, start, end: end ?? { value: STILL_BURNING }, active: false };
};
