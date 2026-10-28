import type { GameContext } from '@application/game-context';
import { announce, matchOf, pause } from '@application/game-context';
import { MATCH_OVER_DELAY_MS } from '@application/timings';
import { endPlayerTurn } from '@application/turn/turn-gate';

const endMatch = async (game: GameContext): Promise<void> => {
  await pause(game, MATCH_OVER_DELAY_MS);
  const state = matchOf(game);
  game.signals.phase.value = 'over';
  await announce(game, {
    type: 'matchOver',
    winner: state.lives.rival <= 0 ? 'player' : 'rival',
    life: state.lives.player,
    rounds: state.round,
  });
};

export const beginMatchEnd = (game: GameContext): void => {
  game.pending.ending = endMatch(game);
  endPlayerTurn(game);
};
