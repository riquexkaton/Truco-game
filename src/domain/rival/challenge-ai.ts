import type { ChallengeAnswer, RaisedLevel } from '@domain/challenge/challenge';
import { canRaiseChallenge } from '@domain/match/gates';
import type { MatchState } from '@domain/match/match-state';
import { rivalScore } from '@domain/rival/score';
import type { Random } from '@domain/shared/random';
import { willHappen } from '@domain/shared/random';

const answerChallenge = (score: number, random: Random): ChallengeAnswer => {
  if (score >= 11 && willHappen(random, 0.55)) return 'counter';
  return score >= 7.5 || willHappen(random, 0.2) ? 'accept' : 'retire';
};

const answerCounter = (score: number, random: Random): ChallengeAnswer =>
  score >= 8.5 || willHappen(random, 0.15) ? 'accept' : 'retire';

export const rivalChallengeAnswer = (
  state: MatchState,
  level: RaisedLevel,
  random: Random,
): ChallengeAnswer => {
  const score = rivalScore(state);
  return level === 1 ? answerChallenge(score, random) : answerCounter(score, random);
};

const RAISE_POLICY = {
  challenge: { minScore: 10, confidence: 0.6, bluff: 0.08 },
  counter: { minScore: 10.5, confidence: 0.6, bluff: 0.05 },
} as const;

const isRaiseTempting = (state: MatchState, random: Random): boolean => {
  const policy = state.challenge.level === 0 ? RAISE_POLICY.challenge : RAISE_POLICY.counter;
  return (
    (rivalScore(state) >= policy.minScore && willHappen(random, policy.confidence)) ||
    willHappen(random, policy.bluff)
  );
};

export const shouldRivalRaise = (state: MatchState, random: Random): boolean =>
  canRaiseChallenge(state, 'rival') && isRaiseTempting(state, random);
