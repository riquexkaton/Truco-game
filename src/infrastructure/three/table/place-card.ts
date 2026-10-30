import { Vector3 } from 'three';

import type { CardId } from '@domain/cards/card';
import type { PerSide } from '@domain/shared/side';

import type { CardPlacement } from '@application/ports/table-port';

import { calmCard } from '@infrastructure/three/cards/card-motion';
import { addCurseMark } from '@infrastructure/three/cards/curse-marks';
import { tableCardOf } from '@infrastructure/three/cards/table-deck';
import { CARD_Y, FACE_UP, slotPoint } from '@infrastructure/three/layout/table-points';
import type { Stage } from '@infrastructure/three/stage';
import { refreshSealMarks } from '@infrastructure/three/table/seal-marking';
import { arrangeSide, glide } from '@infrastructure/three/table/stage-motion';

const PLACE_MOTION: PerSide<{ readonly duration: number; readonly rz: number }> = {
  player: { duration: 0.6, rz: 0 },
  rival: { duration: 0.75, rz: Math.PI },
};

const SLOT_RISE_PER_DUEL = 0.002;
const PLACE_LIFT = 0.4;

const removeCard = (hand: CardId[], cardId: CardId): void => {
  const index = hand.indexOf(cardId);
  if (index !== -1) hand.splice(index, 1);
};

export const placeOnTable = async (stage: Stage, placement: CardPlacement): Promise<void> => {
  const { side, cardId, duel } = placement;
  const card = tableCardOf(stage.deck, cardId);
  removeCard(stage.hands[side], cardId);
  stage.played.push({ side, cardId, duel });
  refreshSealMarks(stage);
  calmCard(card);
  void arrangeSide(stage, side);
  const slot = slotPoint(side, duel);
  await glide(stage, card, {
    pose: {
      position: new Vector3(slot.x, CARD_Y + SLOT_RISE_PER_DUEL * duel, slot.z),
      rx: FACE_UP,
      rz: PLACE_MOTION[side].rz,
    },
    duration: PLACE_MOTION[side].duration,
    lift: PLACE_LIFT,
  });
  stage.sounds.play('cardPlaced');
  if (placement.cursed) addCurseMark(stage.scene, stage.marks, slot);
};
