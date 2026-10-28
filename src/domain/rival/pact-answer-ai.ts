import type { MatchState } from '@domain/match/match-state';
import { pactValueOf, pactWagerRange } from '@domain/match/pact-flow';
import type { Bet } from '@domain/pact/bet';
import { canRaiseToRepact, canRaiseToWager, clampWager, REPACT_BET, wager } from '@domain/pact/bet';
import type { PactAnswer, PactNegotiation } from '@domain/pact/negotiation';
import { REPACT_PACT, WAGER_PACT } from '@domain/rival/pact-call-ai';
import type { Random } from '@domain/shared/random';
import { willHappen } from '@domain/shared/random';

interface AnswerContext {
  readonly state: MatchState;
  readonly bet: Bet;
  readonly value: number;
}

export const acceptThreshold = (amount: number): number => {
  if (amount <= 2) return 24;
  if (amount <= 4) return 27;
  return Math.min(32, 27 + (amount - 4) * 0.6);
};

const wagerRaise = ({ state, bet, value }: AnswerContext, random: Random): PactAnswer | null => {
  if (!canRaiseToWager(bet) || value < WAGER_PACT || !willHappen(random, 0.5)) return null;
  const range = pactWagerRange(state, { raiser: 'rival', current: bet });
  return { kind: 'raise', bet: wager(clampWager(bet.amount + 3, range)) };
};

const repactRaise = ({ bet, value }: AnswerContext, random: Random): PactAnswer | null =>
  canRaiseToRepact(bet) && value >= REPACT_PACT && willHappen(random, 0.5)
    ? { kind: 'raise', bet: REPACT_BET }
    : null;

const acceptOrReject = ({ bet, value }: AnswerContext, random: Random): PactAnswer =>
  value >= acceptThreshold(bet.amount) || willHappen(random, 0.12)
    ? { kind: 'accept' }
    : { kind: 'reject' };

const ritualReply = (
  state: MatchState,
  negotiation: PactNegotiation,
  random: Random,
): PactAnswer | null =>
  negotiation.first && state.ritual.available.rival && willHappen(random, 0.9)
    ? { kind: 'ritual' }
    : null;

export const rivalPactAnswer = (
  state: MatchState,
  negotiation: PactNegotiation,
  random: Random,
): PactAnswer => {
  const context = { state, bet: negotiation.bet, value: pactValueOf(state, 'rival') };
  return (
    ritualReply(state, negotiation, random) ??
    wagerRaise(context, random) ??
    repactRaise(context, random) ??
    acceptOrReject(context, random)
  );
};
