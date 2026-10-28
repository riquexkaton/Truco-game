import { describe, expect, it } from 'vitest';

import {
  betRank,
  canRaiseToRepact,
  canRaiseToWager,
  clampWager,
  PACT_BET,
  rejectDamage,
  REPACT_BET,
  wager,
  wagerRange,
} from '@domain/pact/bet';
import { openNegotiation, raiseNegotiation, responderOf } from '@domain/pact/negotiation';

describe('bets', () => {
  it('ranks Pacto, Re-pacto and Apuesta', () => {
    expect([PACT_BET, REPACT_BET, wager(9)].map((bet) => betRank(bet))).toEqual([1, 2, 3]);
    expect(PACT_BET.amount).toBe(2);
    expect(REPACT_BET.amount).toBe(4);
  });

  it('allows Re-pacto only over a Pacto and Apuesta over anything but an Apuesta', () => {
    expect(canRaiseToRepact(PACT_BET)).toBe(true);
    expect(canRaiseToRepact(REPACT_BET)).toBe(false);
    expect(canRaiseToWager(REPACT_BET)).toBe(true);
    expect(canRaiseToWager(wager(6))).toBe(false);
  });
});

describe('wagerRange', () => {
  it('opens from 4 up to the opponent life', () => {
    expect(wagerRange(17, null)).toEqual({ min: 4, max: 17 });
  });

  it('starts one above the current bet but never below 4', () => {
    expect(wagerRange(20, PACT_BET)).toEqual({ min: 4, max: 20 });
    expect(wagerRange(20, REPACT_BET)).toEqual({ min: 5, max: 20 });
    expect(wagerRange(20, wager(9))).toEqual({ min: 10, max: 20 });
  });

  it('never lets the maximum fall below the minimum', () => {
    expect(wagerRange(2, null)).toEqual({ min: 4, max: 4 });
    expect(wagerRange(6, wager(9))).toEqual({ min: 10, max: 10 });
  });

  it('clamps an amount inside the range', () => {
    expect(clampWager(30, { min: 4, max: 12 })).toBe(12);
    expect(clampWager(1, { min: 4, max: 12 })).toBe(4);
    expect(clampWager(7, { min: 4, max: 12 })).toBe(7);
  });
});

describe('rejecting', () => {
  it('costs 1 on the first call and the previous bet after a raise', () => {
    expect(rejectDamage(0)).toBe(1);
    expect(rejectDamage(2)).toBe(2);
    expect(rejectDamage(4)).toBe(4);
  });
});

describe('negotiation', () => {
  it('opens with the caller and no previous bet', () => {
    const negotiation = openNegotiation('player', PACT_BET);
    expect(negotiation).toEqual({ caller: 'player', bet: PACT_BET, previous: 0, first: true });
    expect(responderOf(negotiation)).toBe('rival');
  });

  it('hands the word to the responder when raising', () => {
    const raised = raiseNegotiation(openNegotiation('player', PACT_BET), REPACT_BET);
    expect(raised).toEqual({ caller: 'rival', bet: REPACT_BET, previous: 2, first: false });
    expect(responderOf(raised)).toBe('player');
  });
});
