import type { PointerControls } from '@infrastructure/three/interaction/table-pointer';
import { attachTablePointer } from '@infrastructure/three/interaction/table-pointer';
import { disposeStage } from '@infrastructure/three/loop/dispose-stage';
import { startRenderLoop } from '@infrastructure/three/loop/render-loop';
import { resizeStage } from '@infrastructure/three/loop/resize';
import type { Stage } from '@infrastructure/three/stage';

export const startStage = (stage: Stage, controls: PointerControls): (() => void) => {
  const resize = (): void => {
    resizeStage(stage);
  };
  resize();
  globalThis.addEventListener('resize', resize);
  const stopLoop = startRenderLoop(stage);
  const pointer = attachTablePointer(stage, controls);
  const unsubscribe = stage.store.canPlayCard.subscribe((canPlay) => {
    if (!canPlay) pointer.release();
  });
  return () => {
    unsubscribe();
    pointer.detach();
    stopLoop();
    globalThis.removeEventListener('resize', resize);
    disposeStage(stage);
  };
};
