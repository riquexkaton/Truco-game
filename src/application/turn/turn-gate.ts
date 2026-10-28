import type { GameContext } from '@application/game-context';
import type { Deferred } from '@application/shared/deferred';
import { deferred } from '@application/shared/deferred';

export const openPlayerTurn = (game: GameContext): Deferred<void> => {
  const turn: Deferred<void> = deferred();
  game.pending.turn = turn;
  return turn;
};

export const isTurnOpen = (game: GameContext, turn: Deferred<void>): boolean =>
  game.pending.turn === turn;

export const endPlayerTurn = (game: GameContext): void => {
  const { turn } = game.pending;
  game.pending.turn = null;
  turn?.resolve();
};
