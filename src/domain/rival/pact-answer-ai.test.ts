import { describe, expect, it } from 'vitest';

import type { CardId } from '@domain/cards/card';
import { handsOf, matchFixture } from '@domain/match/match-fixture';
import type { MatchState } from '@domain/match/match-state';
import type { Bet } from '@domain/pact/bet';
import { PACT_BET, REPACT_BET, wager } from '@domain/pact/bet';
import type { PactNegotiation } from '@domain/pact/negotiation';
import { openNegotiation, raiseNegotiation } from '@domain/pact/negotiation';
import { acceptThreshold, rivalPactAnswer } from '@domain/rival/pact-answer-ai';
import { scriptedRandom } from '@domain/shared/scripted-random';

const holding = (rival: readonly CardId[]): MatchState =>
  matchFixture({ hands: handsOf([], rival) });

const called = (bet: Bet): PactNegotiation => openNegotiation('player', bet);

const raisedTo = (bet: Bet): PactNegotiation => {
  const reraised = raiseNegotiation(called(PACT_BET), REPACT_BET);
  return raiseNegotiation(reraised, bet);
};

const answerKind = (rival: readonly CardId[], bet: Bet, roll: number): string =>
  rivalPactAnswer(holding(rival), called(bet), scriptedRandom(roll)).kind;

describe('rivalPactAnswer with a Ritual', () => {
  const ritualHand = {
    ...holding(['ferran', 'morgana', 'osric']),
    ritual: { sung: false, available: { player: false, rival: true } },
  };

  it('answers the first call with the Ritual on a roll under 0.9', () => {
    expect(rivalPactAnswer(ritualHand, called(PACT_BET), scriptedRandom(0.89))).toEqual({
      kind: 'ritual',
    });
  });

  it('does not use the Ritual on a raise', () => {
    const random = scriptedRandom(0);
    const raised = raisedTo(wager(9));
    expect(rivalPactAnswer(ritualHand, raised, random).kind).toBe('accept');
    expect(random.consumed()).toBe(0);
  });
});

describe('rivalPactAnswer raising', () => {
  it('raises to a wager of the current bet + 3 from 31 on a roll under 0.5', () => {
    const answer = rivalPactAnswer(
      holding(['ferran', 'osric', 'alba']),
      called(PACT_BET),
      scriptedRandom(0.4),
    );
    expect(answer).toEqual({ kind: 'raise', bet: wager(5) });
  });

  it('raises a Pacto to Re-pacto from 28 on a roll under 0.5', () => {
    const answer = rivalPactAnswer(
      holding(['gaspar', 'vidal', 'alba']),
      called(PACT_BET),
      scriptedRandom(0.49),
    );
    expect(answer).toEqual({ kind: 'raise', bet: REPACT_BET });
  });

  it('tries the wager first and the Re-pacto second', () => {
    const random = scriptedRandom(0.5, 0.49);
    const answer = rivalPactAnswer(holding(['ferran', 'osric', 'alba']), called(PACT_BET), random);
    expect(answer).toEqual({ kind: 'raise', bet: REPACT_BET });
    expect(random.consumed()).toBe(2);
  });

  it('never raises a wager', () => {
    const answer = rivalPactAnswer(
      holding(['isolda', 'elvira', 'alba']),
      called(wager(10)),
      scriptedRandom(0),
    );
    expect(answer).toEqual({ kind: 'accept' });
  });
});

describe('rivalPactAnswer accepting', () => {
  it('needs 24 against a Pacto', () => {
    expect(answerKind(['vidal', 'teo', 'alba'], PACT_BET, 0.99)).toBe('accept');
    expect(answerKind(['rui', 'teo', 'alba'], PACT_BET, 0.12)).toBe('reject');
  });

  it('needs 27 against a Re-pacto', () => {
    expect(answerKind(['osric', 'rui', 'alba'], REPACT_BET, 0.99)).toBe('accept');
    expect(answerKind(['osric', 'teo', 'alba'], REPACT_BET, 0.12)).toBe('reject');
  });

  it('accepts a weak hand on a roll under 0.12', () => {
    expect(answerKind(['teo', 'paula', 'alba'], REPACT_BET, 0.11)).toBe('accept');
  });

  it('scales the threshold with the wager up to 32', () => {
    expect(acceptThreshold(2)).toBe(24);
    expect(acceptThreshold(4)).toBe(27);
    expect(acceptThreshold(10)).toBeCloseTo(30.6);
    expect(acceptThreshold(20)).toBe(32);
    expect(answerKind(['ferran', 'vidal', 'alba'], wager(20), 0.5)).toBe('reject');
    expect(answerKind(['morgana', 'osric', 'alba'], wager(20), 0.5)).toBe('accept');
  });
});
