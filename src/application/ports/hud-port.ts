import type { ChallengeAnswer } from '@domain/challenge/challenge';
import type { EffectId } from '@domain/effects/effect';
import type { Bet, WagerRange } from '@domain/pact/bet';
import type { PactAnswer } from '@domain/pact/negotiation';

import type { GameEvent } from '@application/ports/game-event';

export type CounterAnswer = Exclude<ChallengeAnswer, 'counter'>;

interface Answers {
  readonly challengeResponse: ChallengeAnswer;
  readonly counterResponse: CounterAnswer;
  readonly pactCall: Bet | null;
  readonly pactAnswer: PactAnswer;
  readonly foldConfirm: boolean;
  readonly discardEffect: number;
}

export type QuestionKind = keyof Answers;

export type Answer<K extends QuestionKind> = Answers[K];

export interface Timeout<A> {
  readonly seconds: number;
  readonly answer: A;
}

interface TimedQuestion<K extends QuestionKind> {
  readonly kind: K;
  readonly timeout: Timeout<Answer<K>>;
}

interface ChallengeQuestion extends TimedQuestion<'challengeResponse'> {
  readonly stake: number;
  readonly counterStake: number;
  readonly retireDamage: number;
}

interface CounterQuestion extends TimedQuestion<'counterResponse'> {
  readonly stake: number;
  readonly retireDamage: number;
}

interface PactCallQuestion extends TimedQuestion<'pactCall'> {
  readonly range: WagerRange;
}

export interface PactAnswerQuestion extends TimedQuestion<'pactAnswer'> {
  readonly bet: Bet;
  readonly previousAmount: number;
  readonly first: boolean;
  readonly canRitual: boolean;
  readonly canRepacto: boolean;
  readonly range: WagerRange | null;
}

interface FoldQuestion {
  readonly kind: 'foldConfirm';
  readonly damage: number;
}

interface DiscardQuestion {
  readonly kind: 'discardEffect';
  readonly effects: readonly EffectId[];
}

export type Question =
  | ChallengeQuestion
  | CounterQuestion
  | PactCallQuestion
  | PactAnswerQuestion
  | FoldQuestion
  | DiscardQuestion;

export interface HudPort {
  notify(event: GameEvent): Promise<void>;
  ask<Q extends Question>(question: Q): Promise<Answer<Q['kind']>>;
}
