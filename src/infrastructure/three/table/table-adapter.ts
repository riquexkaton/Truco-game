import type { CardId } from '@domain/cards/card';
import type { PerSide } from '@domain/shared/side';

import type { TablePort } from '@application/ports/table-port';

import { moveCoins, resetCoins } from '@infrastructure/three/coins/coin-actions';
import type { Stage } from '@infrastructure/three/stage';
import { clearTable } from '@infrastructure/three/table/clear-table';
import { dealRound } from '@infrastructure/three/table/deal-round';
import { markDuelOnTable } from '@infrastructure/three/table/duel-marking';
import { flyEffect } from '@infrastructure/three/table/effect-flight';
import { placeOnTable } from '@infrastructure/three/table/place-card';
import { refreshSealMarks } from '@infrastructure/three/table/seal-marking';
import { arrangeSide, calmHands } from '@infrastructure/three/table/stage-motion';

const arrangeHands = async (stage: Stage, hands: PerSide<readonly CardId[]>): Promise<void> => {
  stage.hands.player = [...hands.player];
  stage.hands.rival = [...hands.rival];
  refreshSealMarks(stage);
  calmHands(stage);
  await Promise.all([arrangeSide(stage, 'player'), arrangeSide(stage, 'rival')]);
};

export const createTableAdapter = (stage: Stage): TablePort => ({
  dealRound: (deal) => dealRound(stage, deal),
  placeCard: (placement) => placeOnTable(stage, placement),
  arrangeHands: (hands) => arrangeHands(stage, hands),
  markDuel: (mark) => {
    markDuelOnTable(stage, mark);
  },
  flyEffect: (side) => flyEffect(stage, side),
  moveCoins: (move) => {
    moveCoins(stage.coins, move);
  },
  clearTable: () => clearTable(stage),
  resetCoins: () => {
    resetCoins(stage.coins);
  },
});
