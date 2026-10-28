import type { EffectId } from '@domain/effects/effect';

import type { Answer, Question, QuestionKind, Timeout } from '@application/ports/hud-port';

export type PromptTone = 'plain' | 'pacto' | 'desafio';

export type OptionVariant = 'main' | 'warn' | 'plain' | 'pick';

export interface PromptOption<A> {
  readonly label: string;
  readonly variant: OptionVariant;
  readonly answer: A;
  readonly effect: EffectId | null;
}

export interface WagerSpec<A> {
  readonly label: string;
  readonly min: number;
  readonly max: number;
  readonly go: string;
  readonly make: (amount: number) => A;
}

export interface PromptSpec<A> {
  readonly tone: PromptTone;
  readonly title: string;
  readonly subtitle: string;
  readonly options: readonly PromptOption<A>[];
  readonly wager: WagerSpec<A> | null;
  readonly timeout: Timeout<A> | null;
}

type QuestionOf<K extends QuestionKind> = Extract<Question, { readonly kind: K }>;

export type PromptBuilders = {
  readonly [K in QuestionKind]: (question: QuestionOf<K>) => PromptSpec<Answer<K>>;
};

export const option = <const A>(
  label: string,
  answer: A,
  variant: OptionVariant = 'plain',
): PromptOption<A> => ({ label, answer, variant, effect: null });

export const promptAnnouncement = ({ title, subtitle }: PromptSpec<unknown>): string =>
  `${title}. ${subtitle}`;
