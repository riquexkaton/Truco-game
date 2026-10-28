import { batch } from '@preact/signals-core';

import { startTurn } from '@domain/match/duel-play';

import type { GameContext } from '@application/game-context';
import { announce, matchOf, replaceMatch } from '@application/game-context';
import { TURN_SECONDS } from '@application/timings';
import { runTurnTimer } from '@application/turn-timer/turn-timer';
import { openPlayerTurn } from '@application/turn/turn-gate';

export const playerTurn = async (game: GameContext): Promise<void> => {
  const turn = openPlayerTurn(game);
  batch(() => {
    game.signals.phase.value = 'player';
    game.signals.busy.value = false;
    game.signals.turnSecondsLeft.value = TURN_SECONDS;
    replaceMatch(game, startTurn(matchOf(game)));
  });
  void runTurnTimer(game, turn);
  await announce(game, { type: 'turnStarted', side: 'player' });
  await turn.promise;
  game.signals.phase.value = 'wait';
};
