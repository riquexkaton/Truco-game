import { relayoutCoins } from '@infrastructure/three/coins/coin-actions';
import { fitCamera, placeHandLight } from '@infrastructure/three/layout/camera-rig';
import { backgroundUvRect, layoutFor } from '@infrastructure/three/layout/layouts';
import { setBackgroundView } from '@infrastructure/three/scene/background';
import type { Stage } from '@infrastructure/three/stage';
import { refreshSealMarks } from '@infrastructure/three/table/seal-marking';
import { arrangeSide } from '@infrastructure/three/table/stage-motion';

const shouldRearrangeHand = (stage: Stage): boolean =>
  stage.hands.player.length > 0 && stage.store.phase.value !== 'deal' && !stage.isClearing;

export const resizeStage = (stage: Stage): void => {
  const width = globalThis.innerWidth;
  const height = globalThis.innerHeight;
  const screenAspect = width / height;
  stage.renderer.setSize(width, height, false);
  const layout = layoutFor(screenAspect);
  stage.layout = layout;
  relayoutCoins(stage.coins, layout.key);
  const view = fitCamera(stage.camera, { layout, screenAspect });
  setBackgroundView(stage.background, {
    map: stage.backgrounds[layout.key] ?? stage.backgrounds.wide,
    uvRect: backgroundUvRect(layout.aspect, view),
  });
  placeHandLight(stage.handLight, stage.camera, layout);
  refreshSealMarks(stage);
  if (shouldRearrangeHand(stage)) void arrangeSide(stage, 'player');
  stage.shadowsDirty = true;
};
