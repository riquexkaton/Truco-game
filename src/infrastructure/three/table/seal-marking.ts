import { showSealMarks } from '@infrastructure/three/cards/seal-marks';
import { sealedHandCards } from '@infrastructure/three/cards/sealed-hand';
import { tableCardOf } from '@infrastructure/three/cards/table-deck';
import type { Stage } from '@infrastructure/three/stage';

export const refreshSealMarks = (stage: Stage): void => {
  showSealMarks(stage.seals, {
    sealed: sealedHandCards(stage.hands, stage.vira),
    layout: stage.layout.key,
    cardOf: (cardId) => tableCardOf(stage.deck, cardId),
  });
};
