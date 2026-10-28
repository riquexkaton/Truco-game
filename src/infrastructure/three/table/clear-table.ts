import { clearCurseMarks } from '@infrastructure/three/cards/curse-marks';
import type { TableCard } from '@infrastructure/three/cards/table-card';
import { tableCardOf } from '@infrastructure/three/cards/table-deck';
import type { Stage } from '@infrastructure/three/stage';
import { deckPose, glide } from '@infrastructure/three/table/stage-motion';

const CLEAR_STAGGER_MS = 40;

const cardsOnTable = (stage: Stage): TableCard[] => {
  const ids = [...stage.played, ...stage.hands.player, ...stage.hands.rival];
  const cards = ids.map((cardId) => tableCardOf(stage.deck, cardId));
  return stage.vira === null ? cards : [...cards, stage.deck.viras[stage.vira]];
};

const sendToDeck = async (stage: Stage, card: TableCard, order: number): Promise<void> => {
  await stage.scheduler.wait(order * CLEAR_STAGGER_MS);
  await glide(stage, card, { pose: deckPose(), duration: 0.6, lift: 0.4 });
};

const forgetTable = (stage: Stage): void => {
  stage.played.length = 0;
  stage.hands.player = [];
  stage.hands.rival = [];
  stage.vira = null;
};

export const clearTable = async (stage: Stage): Promise<void> => {
  clearCurseMarks(stage.marks);
  const cards = cardsOnTable(stage);
  stage.isClearing = true;
  await Promise.all(cards.map((card, order) => sendToDeck(stage, card, order)));
  for (const card of cards) {
    card.group.visible = false;
  }
  forgetTable(stage);
  stage.isClearing = false;
  stage.shadowsDirty = true;
};
