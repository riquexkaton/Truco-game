import { Vector3 } from 'three';

import type { Side } from '@domain/shared/side';

import type { CardMove } from '@infrastructure/three/cards/card-motion';
import { calmCard, moveCard } from '@infrastructure/three/cards/card-motion';
import type { CardPose } from '@infrastructure/three/cards/card-state';
import type { TableCard } from '@infrastructure/three/cards/table-card';
import { tableCardOf } from '@infrastructure/three/cards/table-deck';
import { motionSeconds } from '@infrastructure/three/cards/tween-math';
import type { HandSlot } from '@infrastructure/three/layout/hand-poses';
import { playerHandPose, rivalHandPose } from '@infrastructure/three/layout/hand-poses';
import { CARD_Y, DECK_POINT, FACE_DOWN } from '@infrastructure/three/layout/table-points';
import type { Stage } from '@infrastructure/three/stage';

const ARRANGE_SECONDS = 0.45;
const ARRANGE_LIFT = 0.05;
const DECK_RISE = 0.16;

export const glide = (stage: Stage, card: TableCard, move: CardMove): Promise<void> => {
  stage.shadowsDirty = true;
  return moveCard(card, { ...move, duration: motionSeconds(move.duration, stage.reducedMotion) });
};

export const deckPose = (): CardPose => ({
  position: new Vector3(DECK_POINT.x, CARD_Y + DECK_RISE, DECK_POINT.z),
  rx: FACE_DOWN,
  rz: 0,
});

export const handPose = (stage: Stage, side: Side, slot: HandSlot): CardPose =>
  side === 'player' ? playerHandPose(stage.camera, stage.layout, slot) : rivalHandPose(slot);

const cardsOf = (stage: Stage, side: Side): TableCard[] =>
  stage.hands[side].map((cardId) => tableCardOf(stage.deck, cardId));

export const arrangeSide = async (stage: Stage, side: Side): Promise<void> => {
  const cards = cardsOf(stage, side);
  await Promise.all(
    cards.map((card, index) =>
      glide(stage, card, {
        pose: handPose(stage, side, { index, count: cards.length }),
        duration: ARRANGE_SECONDS,
        lift: ARRANGE_LIFT,
      }),
    ),
  );
};

export const calmHands = (stage: Stage): void => {
  for (const card of [...cardsOf(stage, 'player'), ...cardsOf(stage, 'rival')]) {
    calmCard(card);
  }
};
