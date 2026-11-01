import type { Camera, WebGLRenderer } from 'three';

import type { DuelFx } from '@infrastructure/three/fx/duel-fx';

export interface FxView {
  readonly renderer: WebGLRenderer;
  readonly camera: Camera;
}

const showAll = (fx: DuelFx, isVisible: boolean): void => {
  for (const slot of fx.every) {
    slot.object.visible = isVisible;
  }
};

export const warmDuelFx = (fx: DuelFx, { renderer, camera }: FxView): void => {
  for (const map of Object.values(fx.vines.maps)) {
    renderer.initTexture(map);
  }
  showAll(fx, true);
  renderer.render(fx.group, camera);
  showAll(fx, false);
};
