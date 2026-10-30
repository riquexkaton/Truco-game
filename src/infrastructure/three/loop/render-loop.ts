import { Timer } from 'three';

import { isCardMoving, updateCard } from '@infrastructure/three/cards/card-motion';
import type { GlowFrame } from '@infrastructure/three/cards/duel-glows';
import { updateGlows } from '@infrastructure/three/cards/duel-glows';
import type { TableCard } from '@infrastructure/three/cards/table-card';
import { areCoinsFlying, updateCoinFlights } from '@infrastructure/three/coins/coin-flights';
import { trackSealHover } from '@infrastructure/three/interaction/seal-hover';
import { setBackgroundFlicker } from '@infrastructure/three/scene/background';
import { flickerCandles } from '@infrastructure/three/scene/candles';
import { backgroundFlicker } from '@infrastructure/three/scene/pulses';
import type { Stage } from '@infrastructure/three/stage';

const MAX_DELTA_SECONDS = 0.05;

const visibleCards = (cards: readonly TableCard[]): TableCard[] =>
  cards.filter((card) => card.group.visible);

const isTableMoving = (stage: Stage, cards: readonly TableCard[]): boolean =>
  areCoinsFlying(stage.coins) || cards.some((card) => isCardMoving(card));

const animate = (stage: Stage, frame: GlowFrame): void => {
  const noise = flickerCandles(stage.candles, {
    time: frame.time,
    reducedMotion: stage.reducedMotion,
  });
  setBackgroundFlicker(stage.background, backgroundFlicker(noise));
  updateGlows(stage.glows, frame);
  const cards = visibleCards(stage.deck.everyCard);
  if (isTableMoving(stage, cards)) stage.shadowsDirty = true;
  updateCoinFlights(stage.coins, frame.deltaSeconds);
  for (const card of cards) {
    updateCard(card, frame.deltaSeconds);
  }
  trackSealHover(stage);
};

const render = (stage: Stage): void => {
  const { renderer } = stage;
  renderer.clear();
  renderer.render(stage.background.scene, stage.background.camera);
  renderer.clearDepth();
  if (stage.shadowsDirty) {
    renderer.shadowMap.needsUpdate = true;
    stage.shadowsDirty = false;
  }
  renderer.render(stage.scene, stage.camera);
};

export const startRenderLoop = (stage: Stage): (() => void) => {
  const timer = new Timer();
  timer.connect(document);
  const frame = (timestamp: number): void => {
    timer.update(timestamp);
    const deltaSeconds = Math.min(timer.getDelta(), MAX_DELTA_SECONDS);
    animate(stage, { time: timer.getElapsed(), deltaSeconds });
    render(stage);
  };
  const syncVisibility = (): void => {
    stage.renderer.setAnimationLoop(document.hidden ? null : frame);
  };
  document.addEventListener('visibilitychange', syncVisibility);
  syncVisibility();
  return () => {
    document.removeEventListener('visibilitychange', syncVisibility);
    stage.renderer.setAnimationLoop(null);
    timer.dispose();
  };
};
