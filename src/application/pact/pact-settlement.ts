import { acceptPact, rejectPact } from '@domain/match/pact-flow';
import { rejectDamage } from '@domain/pact/bet';
import type { PactAnswer, PactNegotiation } from '@domain/pact/negotiation';
import { responderOf } from '@domain/pact/negotiation';

import type { GameContext } from '@application/game-context';
import { announce, matchOf } from '@application/game-context';
import { commit } from '@application/match/commit';
import { singRitualFlow } from '@application/ritual/ritual-flow';

export interface PactClosing {
  readonly negotiation: PactNegotiation;
  readonly answer: Exclude<PactAnswer, { readonly kind: 'raise' }>;
}

const annulWithRitual = (game: GameContext, negotiation: PactNegotiation) =>
  singRitualFlow(game, responderOf(negotiation), true);

const rejectFlow = async (game: GameContext, negotiation: PactNegotiation) => {
  const by = responderOf(negotiation);
  await announce(game, { type: 'pactRejected', by, damage: rejectDamage(negotiation.previous) });
  await commit(game, rejectPact(matchOf(game), negotiation));
};

const acceptFlow = async (game: GameContext, negotiation: PactNegotiation) => {
  const { bet } = negotiation;
  await commit(game, acceptPact(matchOf(game), bet));
  await announce(game, { type: 'pactAccepted', by: responderOf(negotiation), amount: bet.amount });
};

export const settlePact = (game: GameContext, { negotiation, answer }: PactClosing) => {
  if (answer.kind === 'ritual') return annulWithRitual(game, negotiation);
  return answer.kind === 'reject' ? rejectFlow(game, negotiation) : acceptFlow(game, negotiation);
};
