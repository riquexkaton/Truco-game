import { describe, expect, it } from 'vitest';

import { placeCard } from '@domain/match/duel-play';
import { canCallPact } from '@domain/match/gates';
import { handsOf, matchFixture, played, playedOf } from '@domain/match/match-fixture';
import {
  acceptPact,
  canAnswerPactWithRitual,
  openPact,
  pactHand,
  pactValueOf,
  pactWagerRange,
  rejectPact,
} from '@domain/match/pact-flow';
import { PACT_BET, REPACT_BET, wager } from '@domain/pact/bet';
import { openNegotiation, raiseNegotiation } from '@domain/pact/negotiation';

const pactHands = handsOf(['osric', 'vidal', 'alba'], ['isolda', 'teo', 'rafael']);

describe('pact hand', () => {
  it('includes the card already in the slot during the first duel', () => {
    const state = placeCard(matchFixture({ hands: pactHands }), {
      side: 'player',
      cardId: 'osric',
    });
    expect(pactHand(state, 'player').map((card) => card.id)).toEqual(['vidal', 'alba', 'osric']);
    expect(pactValueOf(state, 'player')).toBe(28);
  });

  it('ignores played cards after the first duel', () => {
    const later = matchFixture({ duel: 1, played: playedOf([played('teo')], []) });
    expect(pactHand(later, 'player').map((card) => card.id)).toEqual(['baltasar', 'saul', 'irene']);
  });
});

describe('accepting and rejecting', () => {
  it('seals the result now and reveals it at the end of the round', () => {
    const state = acceptPact(openPact(matchFixture({ hands: pactHands })), REPACT_BET);
    expect(state.pact).toEqual({
      done: true,
      pending: { winner: 'player', amount: 4, playerValue: 28, rivalValue: 9 },
    });
  });

  it('gives a tied pact to the round lead', () => {
    const tied = matchFixture({ roundLead: 'rival', hands: handsOf(['teo'], ['paula']) });
    expect(acceptPact(tied, PACT_BET).pact.pending?.winner).toBe('rival');
  });

  it('charges 1 for rejecting the first call', () => {
    const state = rejectPact(matchFixture(), openNegotiation('player', wager(12)));
    expect(state.lives).toEqual({ player: 20, rival: 19 });
  });

  it('charges the previous bet for rejecting a raise', () => {
    const raised = raiseNegotiation(openNegotiation('player', PACT_BET), REPACT_BET);
    expect(rejectPact(matchFixture(), raised).lives).toEqual({ player: 18, rival: 20 });
  });
});

describe('calling and wagering', () => {
  it('can only be called in the first duel before placing, once, and never after a Ritual', () => {
    const fresh = matchFixture();
    const called = openPact(fresh);
    const afterRitual = matchFixture({
      ritual: { sung: true, available: { player: false, rival: false } },
    });
    const secondDuel = matchFixture({
      duel: 1,
      played: playedOf([played('teo')], [played('ada')]),
    });
    const placed = placeCard(fresh, { side: 'rival', cardId: 'ada' });
    expect(canCallPact(fresh, 'player')).toBe(true);
    expect(canCallPact(called, 'player')).toBe(false);
    expect(canCallPact(afterRitual, 'player')).toBe(false);
    expect(canCallPact(secondDuel, 'player')).toBe(false);
    expect(canCallPact(placed, 'rival')).toBe(false);
  });

  it('caps a wager at the opponent life', () => {
    const state = matchFixture({ lives: { player: 15, rival: 7 } });
    expect(pactWagerRange(state, { raiser: 'player', current: null })).toEqual({ min: 4, max: 7 });
    expect(pactWagerRange(state, { raiser: 'rival', current: REPACT_BET })).toEqual({
      min: 5,
      max: 15,
    });
  });

  it('lets a responder holding a Ritual answer the first call with it', () => {
    const ready = matchFixture({
      ritual: { sung: false, available: { player: false, rival: true } },
    });
    const first = openNegotiation('player', PACT_BET);
    expect(canAnswerPactWithRitual(ready, first)).toBe(true);
    expect(canAnswerPactWithRitual(ready, raiseNegotiation(first, REPACT_BET))).toBe(false);
    expect(canAnswerPactWithRitual(matchFixture(), first)).toBe(false);
  });
});
