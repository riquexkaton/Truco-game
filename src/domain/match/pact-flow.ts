import type { Card } from '@domain/cards/card';
import { cardById } from '@domain/cards/deck';
import { canSingRitual } from '@domain/match/gates';
import { changeLife } from '@domain/match/life-change';
import type { MatchState } from '@domain/match/match-state';
import { handCards, slotOf } from '@domain/match/queries';
import type { Bet, WagerRange } from '@domain/pact/bet';
import { rejectDamage, wagerRange } from '@domain/pact/bet';
import type { PactNegotiation } from '@domain/pact/negotiation';
import { responderOf } from '@domain/pact/negotiation';
import { pactValue, pactWinner } from '@domain/pact/pact-value';
import type { Side } from '@domain/shared/side';
import { opponent } from '@domain/shared/side';

export const pactHand = (state: MatchState, side: Side): Card[] => {
  const slot = state.duel === 0 ? slotOf(state, side) : null;
  const hand = handCards(state, side);
  return slot === null ? hand : [...hand, cardById(slot.cardId)];
};

export const pactValueOf = (state: MatchState, side: Side): number =>
  pactValue(pactHand(state, side));

export const pactWagerRange = (
  state: MatchState,
  { raiser, current }: { raiser: Side; current: Bet | null },
): WagerRange => wagerRange(state.lives[opponent(raiser)], current);

export const openPact = (state: MatchState): MatchState => ({
  ...state,
  pact: { ...state.pact, done: true },
});

export const canAnswerPactWithRitual = (state: MatchState, negotiation: PactNegotiation): boolean =>
  negotiation.first && canSingRitual(state, responderOf(negotiation));

export const acceptPact = (state: MatchState, bet: Bet): MatchState => {
  const playerValue = pactValueOf(state, 'player');
  const rivalValue = pactValueOf(state, 'rival');
  const winner = pactWinner({ playerValue, rivalValue, roundLead: state.roundLead });
  return {
    ...state,
    pact: { done: true, pending: { winner, amount: bet.amount, playerValue, rivalValue } },
  };
};

export const rejectPact = (state: MatchState, negotiation: PactNegotiation): MatchState =>
  changeLife(state, {
    side: responderOf(negotiation),
    amount: -rejectDamage(negotiation.previous),
  });
