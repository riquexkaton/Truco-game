import { newMatch, startRound } from '@domain/match/round-start';

import type { GameContext } from '@application/game-context';
import { matchOf } from '@application/game-context';
import { playRound } from '@application/round/round-flow';

const runMatch = async (game: GameContext): Promise<void> => {
  await playRound(game, newMatch(game.ports.random));
  while (!matchOf(game).over) {
    await playRound(game, startRound(matchOf(game), game.ports.random));
  }
  await game.pending.ending;
};

export const startMatch = (game: GameContext): Promise<void> =>
  game.signals.phase.value === 'idle' ? runMatch(game) : Promise.resolve();

const replay = async (game: GameContext): Promise<void> => {
  game.signals.phase.value = 'deal';
  await game.ports.table.clearTable();
  game.ports.table.resetCoins();
  await runMatch(game);
};

export const restartMatch = (game: GameContext): Promise<void> =>
  game.signals.phase.value === 'over' ? replay(game) : Promise.resolve();
