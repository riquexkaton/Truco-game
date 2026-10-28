import type { CardId } from '@domain/cards/card';

import type { GameStore } from '@application/store/game-store';

import { tableCardOf } from '@infrastructure/three/cards/table-deck';
import type { PickCandidate } from '@infrastructure/three/interaction/picking';
import { attachPicking } from '@infrastructure/three/interaction/picking';
import { disposeStage } from '@infrastructure/three/loop/dispose-stage';
import { startRenderLoop } from '@infrastructure/three/loop/render-loop';
import { resizeStage } from '@infrastructure/three/loop/resize';
import type { Stage } from '@infrastructure/three/stage';

export interface StageControls {
  readonly canvas: HTMLCanvasElement;
  readonly onPickCard: (cardId: CardId) => void;
}

const isPickable = (store: GameStore): boolean =>
  store.canPlayCard.value || store.phase.value === 'give';

const handCandidates = (stage: Stage): PickCandidate[] =>
  stage.hands.player.map((cardId) => ({ cardId, card: tableCardOf(stage.deck, cardId) }));

export const startStage = (stage: Stage, controls: StageControls): (() => void) => {
  const resize = (): void => {
    resizeStage(stage);
  };
  resize();
  globalThis.addEventListener('resize', resize);
  const stopLoop = startRenderLoop(stage);
  const picking = attachPicking({
    canvas: controls.canvas,
    camera: stage.camera,
    reducedMotion: stage.reducedMotion,
    candidates: () => handCandidates(stage),
    isActive: () => isPickable(stage.store),
    onPick: controls.onPickCard,
  });
  const unsubscribe = stage.store.canPlayCard.subscribe((canPlay) => {
    if (!canPlay) picking.release();
  });
  return () => {
    unsubscribe();
    picking.detach();
    stopLoop();
    globalThis.removeEventListener('resize', resize);
    disposeStage(stage);
  };
};
