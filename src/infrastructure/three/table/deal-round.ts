import { Vector3 } from 'three';

import type { CardId } from '@domain/cards/card';
import type { FactionId } from '@domain/cards/faction';
import type { PerSide, Side } from '@domain/shared/side';

import type { RoundDeal } from '@application/ports/table-port';

import { resetGlows } from '@infrastructure/three/cards/duel-glows';
import { calmCard, placeCardAt } from '@infrastructure/three/cards/card-motion';
import { showCardFace, tableCardOf } from '@infrastructure/three/cards/table-deck';
import type { HandSlot } from '@infrastructure/three/layout/hand-poses';
import { CARD_Y, FACE_UP, VIRA_POINT } from '@infrastructure/three/layout/table-points';
import type { Stage } from '@infrastructure/three/stage';
import { refreshSealMarks } from '@infrastructure/three/table/seal-marking';
import { deckPose, glide, handPose } from '@infrastructure/three/table/stage-motion';

interface DealtCard {
  readonly cardId: CardId;
  readonly side: Side;
  readonly slot: HandSlot;
}

const DEAL_MOTION: PerSide<{ readonly duration: number; readonly lift: number }> = {
  player: { duration: 0.7, lift: 0.35 },
  rival: { duration: 0.55, lift: 0.25 },
};

const DEAL_STAGGER_MS: PerSide<number> = { player: 140, rival: 90 };

const revealVira = (stage: Stage, vira: FactionId): Promise<void> => {
  for (const card of Object.values(stage.deck.viras)) {
    card.group.visible = false;
  }
  const card = stage.deck.viras[vira];
  card.group.visible = true;
  stage.vira = vira;
  placeCardAt(card, deckPose());
  return glide(stage, card, {
    pose: { position: new Vector3(VIRA_POINT.x, CARD_Y, VIRA_POINT.z), rx: FACE_UP, rz: -0.05 },
    duration: 0.9,
    lift: 0.5,
  });
};

const stackDealtCards = (stage: Stage, deal: RoundDeal): void => {
  for (const cardId of [...deal.player, ...deal.rival]) {
    showCardFace(stage.deck, { cardId, vira: deal.vira, art: stage.art.get(cardId) });
    const card = tableCardOf(stage.deck, cardId);
    card.group.visible = true;
    calmCard(card);
    placeCardAt(card, deckPose());
  }
  stage.shadowsDirty = true;
};

const landInHand = async (stage: Stage, dealt: DealtCard): Promise<void> => {
  await glide(stage, tableCardOf(stage.deck, dealt.cardId), {
    pose: handPose(stage, dealt.side, dealt.slot),
    ...DEAL_MOTION[dealt.side],
  });
  stage.sounds.play('cardDealt');
};

const dealCard = async (stage: Stage, dealt: DealtCard): Promise<void> => {
  void landInHand(stage, dealt);
  await stage.scheduler.wait(DEAL_STAGGER_MS[dealt.side]);
};

const dealToHands = async (stage: Stage, deal: RoundDeal): Promise<void> => {
  for (const [index, cardId] of deal.player.entries()) {
    const rivalId = deal.rival[index];
    if (rivalId !== undefined) {
      await dealCard(stage, {
        cardId: rivalId,
        side: 'rival',
        slot: { index, count: deal.rival.length },
      });
    }
    await dealCard(stage, { cardId, side: 'player', slot: { index, count: deal.player.length } });
  }
};

export const dealRound = async (stage: Stage, deal: RoundDeal): Promise<void> => {
  resetGlows(stage.glows);
  const artReady = stage.art.ensure([...deal.player, ...deal.rival]);
  await revealVira(stage, deal.vira);
  await artReady;
  stage.hands.player = [...deal.player];
  stage.hands.rival = [...deal.rival];
  stackDealtCards(stage, deal);
  refreshSealMarks(stage);
  await dealToHands(stage, deal);
  stage.art.prefetchRest();
};
