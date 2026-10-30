import type { Object3D } from 'three';

export interface NumberUniform {
  value: number;
}

export interface FxSlot {
  readonly object: Object3D;
  readonly start: NumberUniform;
  active: boolean;
}

export const parkedSlot = (object: Object3D, start: NumberUniform): FxSlot => {
  object.visible = false;
  object.frustumCulled = false;
  return { object, start, active: false };
};
