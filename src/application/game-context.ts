import type { CardId } from '@domain/cards/card';
import type { MatchState } from '@domain/match/match-state';

import type { GameEvent } from '@application/ports/game-event';
import type { GamePorts } from '@application/ports/game-ports';
import type { Answer, Question } from '@application/ports/hud-port';
import type { Deferred } from '@application/shared/deferred';
import type { GameSignals } from '@application/store/game-signals';

interface PendingInputs {
  turn: Deferred<void> | null;
  give: Deferred<CardId> | null;
  ending: Promise<void>;
}

export interface GameContext {
  readonly ports: GamePorts;
  readonly signals: GameSignals;
  readonly pending: PendingInputs;
}

export const matchOf = (game: GameContext): MatchState => {
  const state = game.signals.match.value;
  if (state === null) {
    throw new Error('No match in progress');
  }
  return state;
};

export const replaceMatch = (game: GameContext, state: MatchState): void => {
  game.signals.match.value = state;
};

export const pause = (game: GameContext, ms: number): Promise<void> =>
  game.ports.scheduler.wait(ms);

export const announce = async (game: GameContext, event: GameEvent): Promise<void> => {
  const { announcing } = game.signals;
  announcing.value += 1;
  try {
    await game.ports.hud.notify(event);
  } finally {
    announcing.value -= 1;
  }
};

export const ask = async <Q extends Question>(
  game: GameContext,
  question: Q,
): Promise<Answer<Q['kind']>> => {
  game.signals.prompting.value = true;
  const answer = await game.ports.hud.ask(question);
  game.signals.prompting.value = false;
  return answer;
};

export const isRoundLive = (state: MatchState): boolean => !state.over && !state.roundOver;
