import { Vector3 } from 'three';

import type { Side } from '@domain/shared/side';

import { placeCardAt } from '@infrastructure/three/cards/card-motion';
import { pointAlongView } from '@infrastructure/three/layout/hand-poses';
import { CARD_Y, EFFECT_DECK_POINT, FACE_DOWN } from '@infrastructure/three/layout/table-points';
import type { Stage } from '@infrastructure/three/stage';
import { glide } from '@infrastructure/three/table/stage-motion';

const PLAYER_TARGET = { x: -0.8, y: -0.85, distance: 2.2 };
const RIVAL_TARGET = { x: 0.9, rise: 0.6, z: -2.7 };

const flightTarget = (stage: Stage, side: Side): Vector3 =>
  side === 'player'
    ? pointAlongView(stage.camera, PLAYER_TARGET)
    : new Vector3(RIVAL_TARGET.x, CARD_Y + RIVAL_TARGET.rise, RIVAL_TARGET.z);

export const flyEffect = async (stage: Stage, side: Side): Promise<void> => {
  const card = stage.deck.effectCard;
  card.group.visible = true;
  placeCardAt(card, {
    position: new Vector3(EFFECT_DECK_POINT.x, CARD_Y + 0.17, EFFECT_DECK_POINT.z),
    rx: FACE_DOWN,
    rz: 0,
  });
  stage.sounds.play('effectTaken');
  await glide(stage, card, {
    pose: { position: flightTarget(stage, side), rx: FACE_DOWN, rz: 0.3 },
    duration: 0.6,
    lift: 0.5,
  });
  card.group.visible = false;
  stage.shadowsDirty = true;
};
