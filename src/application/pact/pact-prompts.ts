import { canAnswerPactWithRitual, pactWagerRange } from '@domain/match/pact-flow';
import type { Bet } from '@domain/pact/bet';
import { canRaiseToRepact, canRaiseToWager } from '@domain/pact/bet';
import type { PactAnswer, PactNegotiation } from '@domain/pact/negotiation';

import type { GameContext } from '@application/game-context';
import { ask, matchOf } from '@application/game-context';
import { PACT_ANSWER_TIMEOUT_SECONDS, PACT_CALL_TIMEOUT_SECONDS } from '@application/timings';

export const askPactCall = (game: GameContext): Promise<Bet | null> =>
  ask(game, {
    kind: 'pactCall',
    range: pactWagerRange(matchOf(game), { raiser: 'player', current: null }),
    timeout: { seconds: PACT_CALL_TIMEOUT_SECONDS, answer: null },
  });

export const askPactAnswer = (
  game: GameContext,
  negotiation: PactNegotiation,
): Promise<PactAnswer> => {
  const state = matchOf(game);
  const { bet } = negotiation;
  return ask(game, {
    kind: 'pactAnswer',
    bet,
    previousAmount: negotiation.previous,
    first: negotiation.first,
    canRitual: canAnswerPactWithRitual(state, negotiation),
    canRepacto: canRaiseToRepact(bet),
    range: canRaiseToWager(bet) ? pactWagerRange(state, { raiser: 'player', current: bet }) : null,
    timeout: { seconds: PACT_ANSWER_TIMEOUT_SECONDS, answer: { kind: 'reject' } },
  });
};
