import { canCallPact, canSingRitual } from '@domain/match/gates';
import type { MatchState } from '@domain/match/match-state';
import { pactValueOf, pactWagerRange } from '@domain/match/pact-flow';
import type { Bet } from '@domain/pact/bet';
import { clampWager, PACT_BET, REPACT_BET, wager } from '@domain/pact/bet';
import type { Random } from '@domain/shared/random';
import { willHappen } from '@domain/shared/random';

const STRONG_PACT = 26;
export const REPACT_PACT = 28;
export const WAGER_PACT = 31;
const ALL_IN_PACT = 34;

export const shouldRivalSingRitual = (state: MatchState, random: Random): boolean =>
  canSingRitual(state, 'rival') && willHappen(random, 0.85);

export const shouldRivalCallPact = (state: MatchState, random: Random): boolean =>
  canCallPact(state, 'rival') &&
  willHappen(random, pactValueOf(state, 'rival') >= STRONG_PACT ? 0.8 : 0.08);

const openingWager = (state: MatchState, value: number): Bet => {
  const range = pactWagerRange(state, { raiser: 'rival', current: null });
  return wager(
    value >= ALL_IN_PACT ? range.max : clampWager(4 + Math.round((value - 29) * 1.5), range),
  );
};

export const rivalOpeningBet = (state: MatchState, random: Random): Bet => {
  const value = pactValueOf(state, 'rival');
  if (value >= WAGER_PACT && willHappen(random, 0.5)) return openingWager(state, value);
  return value >= REPACT_PACT ? REPACT_BET : PACT_BET;
};
