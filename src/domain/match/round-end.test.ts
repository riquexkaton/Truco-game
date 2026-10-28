import { describe, expect, it } from 'vitest';

import { fold } from '@domain/match/challenge-flow';
import { matchFixture, played, playedOf } from '@domain/match/match-fixture';
import { currentTurn, isDuelReady, matchWinner } from '@domain/match/queries';
import type { MatchState } from '@domain/match/match-state';
import { finishRound, revealPact, settleRound } from '@domain/match/round-end';
import type { Side } from '@domain/shared/side';

const won = matchFixture({ roundOver: true, roundWinner: 'player', stake: 4 });

const withPact = (winner: Side, amount: number): MatchState =>
  matchFixture({
    roundOver: true,
    roundWinner: 'player',
    pact: { done: true, pending: { winner, amount, playerValue: 27, rivalValue: 31 } },
  });

describe('finishRound', () => {
  it('charges the round stake to the loser', () => {
    expect(finishRound(won).lives).toEqual({ player: 20, rival: 16 });
  });

  it('charges nothing for a tied round', () => {
    const tied = matchFixture({ roundOver: true, roundWinner: null });
    expect(finishRound(tied).lives).toEqual({ player: 20, rival: 20 });
  });

  it('reveals an accepted pact before the round stake', () => {
    const state = finishRound(withPact('rival', 5));
    expect(state.lives).toEqual({ player: 15, rival: 18 });
    expect(state.pact.pending).toBeNull();
  });

  it('skips the stake when the pact already ended the match', () => {
    const lethal = { ...withPact('rival', 6), lives: { player: 5, rival: 1 } };
    const state = finishRound(lethal);
    expect(state.lives).toEqual({ player: 0, rival: 1 });
    expect(matchWinner(state)).toBe('rival');
  });

  it('still reveals the pact after a fold but adds no stake', () => {
    const folded = fold(withPact('player', 3), 'player');
    expect(finishRound(folded).lives).toEqual({ player: 19, rival: 17 });
  });

  it('leaves a finished match untouched', () => {
    const over = { ...won, over: true };
    expect(finishRound(over)).toBe(over);
  });

  it('exposes the two steps separately', () => {
    expect(revealPact(won)).toBe(won);
    expect(settleRound(matchFixture()).lives).toEqual({ player: 20, rival: 20 });
  });
});

describe('turn queries', () => {
  it('starts with the lead and then the other side', () => {
    const rivalLeads = matchFixture({ lead: 'rival' });
    expect(currentTurn(rivalLeads)).toBe('rival');
    const answered = { ...rivalLeads, played: playedOf([], [played('ada')]) };
    expect(currentTurn(answered)).toBe('player');
  });

  it('has no turn once both cards are down or the round is over', () => {
    const ready = matchFixture({ played: playedOf([played('saul')], [played('ada')]) });
    expect(isDuelReady(ready)).toBe(true);
    expect(currentTurn(ready)).toBeNull();
    expect(currentTurn(won)).toBeNull();
    expect(matchWinner(won)).toBeNull();
  });
});
