import { timeoutCard } from '@domain/rival/card-pick';

import type { GameContext } from '@application/game-context';
import { announce, matchOf, pause } from '@application/game-context';
import type { Deferred } from '@application/shared/deferred';
import { canPlayerAct } from '@application/store/game-signals';
import { MS_PER_SECOND, TURN_SECONDS, TURN_TICK_MS } from '@application/timings';
import { tryPlayCard } from '@application/turn/player-play';
import { isTurnOpen } from '@application/turn/turn-gate';

const isTicking = (game: GameContext): boolean =>
  canPlayerAct(game.signals) && !game.signals.prompting.value;

const tick = (game: GameContext, left: number): number => {
  if (!isTicking(game)) return left;
  const next = Math.max(0, left - TURN_TICK_MS);
  game.signals.turnSecondsLeft.value = next / MS_PER_SECOND;
  return next;
};

const playOnTimeout = async (game: GameContext): Promise<void> => {
  const state = matchOf(game);
  if (state.hands.player.length === 0) return;
  const cardId = timeoutCard(state, 'player');
  await announce(game, { type: 'turnTimedOut', cardId });
  await tryPlayCard(game, cardId);
};

export const runTurnTimer = async (game: GameContext, turn: Deferred<void>): Promise<void> => {
  let left = TURN_SECONDS * MS_PER_SECOND;
  while (left > 0 && isTurnOpen(game, turn)) {
    await pause(game, TURN_TICK_MS);
    left = tick(game, left);
  }
  if (isTurnOpen(game, turn)) await playOnTimeout(game);
};
