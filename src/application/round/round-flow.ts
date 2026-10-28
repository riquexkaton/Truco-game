import { batch } from '@preact/signals-core';

import type { MatchState } from '@domain/match/match-state';
import { currentTurn } from '@domain/match/queries';

import type { GameContext } from '@application/game-context';
import { announce, isRoundLive, matchOf, pause, replaceMatch } from '@application/game-context';
import { resolveDuelFlow } from '@application/round/duel-resolution';
import { finishRound } from '@application/round/round-end';
import { DEAL_SETTLE_MS } from '@application/timings';
import { playerTurn } from '@application/turn/player-turn';
import { rivalTurn } from '@application/turn/rival-turn';

const dealRound = async (game: GameContext, state: MatchState): Promise<void> => {
  batch(() => {
    game.signals.phase.value = 'deal';
    game.signals.busy.value = true;
    replaceMatch(game, state);
  });
  const { vira, hands, round, lead } = state;
  await game.ports.table.dealRound({ vira, player: hands.player, rival: hands.rival });
  await pause(game, DEAL_SETTLE_MS);
  await announce(game, { type: 'roundStarted', round, lead, vira });
};

const playStep = (game: GameContext): Promise<void> => {
  const side = currentTurn(matchOf(game));
  if (side === 'player') return playerTurn(game);
  return side === 'rival' ? rivalTurn(game) : resolveDuelFlow(game);
};

const playDuels = async (game: GameContext): Promise<void> => {
  while (isRoundLive(matchOf(game))) {
    await playStep(game);
  }
};

export const playRound = async (game: GameContext, state: MatchState): Promise<void> => {
  await dealRound(game, state);
  await playDuels(game);
  if (!matchOf(game).over) await finishRound(game);
};
