import { revealPact, settleRound } from '@domain/match/round-end';

import type { GameContext } from '@application/game-context';
import { announce, matchOf, pause } from '@application/game-context';
import { beforeLifeChange, commit } from '@application/match/commit';
import { NEXT_ROUND_MS, PACT_REVEAL_MS, ROUND_END_MS } from '@application/timings';

const revealPendingPact = async (game: GameContext): Promise<void> => {
  const state = matchOf(game);
  const { pending } = state.pact;
  if (pending === null) return;
  const revealed = revealPact(state);
  await commit(game, beforeLifeChange(revealed, state));
  await announce(game, { type: 'pactRevealed', ...pending });
  await pause(game, PACT_REVEAL_MS);
  await commit(game, revealed);
  await pause(game, PACT_REVEAL_MS);
};

const settleStake = async (game: GameContext): Promise<void> => {
  const state = matchOf(game);
  if (state.retired) return;
  await announce(game, { type: 'roundEnded', winner: state.roundWinner, stake: state.stake });
  await commit(game, settleRound(state));
};

export const finishRound = async (game: GameContext): Promise<void> => {
  game.signals.phase.value = 'end';
  await revealPendingPact(game);
  if (matchOf(game).over) return;
  await settleStake(game);
  await pause(game, ROUND_END_MS);
  if (matchOf(game).over) return;
  await game.ports.table.clearTable();
  await pause(game, NEXT_ROUND_MS);
};
