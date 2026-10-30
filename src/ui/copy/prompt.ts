import type { EffectId } from '@domain/effects/effect';

import type { Answer, Question, QuestionKind, Timeout } from '@application/ports/hud-port';

export type PromptVoice = 'plain' | 'pacto' | 'desafio' | 'contra';

export type OptionVariant = 'main' | 'warn' | 'plain' | 'pick';

type Emphasis = 'none' | 'strong' | 'alarm' | 'struck';

export interface Phrase {
  readonly text: string;
  readonly emphasis: Emphasis;
}

export interface PromptOption<A> {
  readonly label: string;
  readonly detail: string;
  readonly variant: OptionVariant;
  readonly answer: A;
  readonly effect: EffectId | null;
}

export interface RaiseSpec<A> {
  readonly toggle: string;
  readonly min: number;
  readonly max: number;
  readonly go: (amount: number) => string;
  readonly summary: (amount: number) => readonly Phrase[];
  readonly make: (amount: number) => A;
}

export interface PromptSpec<A> {
  readonly voice: PromptVoice;
  readonly seal: string;
  readonly message: readonly Phrase[];
  readonly options: readonly PromptOption<A>[];
  readonly raise: RaiseSpec<A> | null;
  readonly aside: PromptOption<A> | null;
  readonly timeout: Timeout<A> | null;
  readonly timeoutLead: string;
}

type QuestionOf<K extends QuestionKind> = Extract<Question, { readonly kind: K }>;

export type PromptBuilders = {
  readonly [K in QuestionKind]: (question: QuestionOf<K>) => PromptSpec<Answer<K>>;
};

interface OptionLook {
  readonly variant?: OptionVariant;
  readonly detail?: string;
}

export const option = <const A>(
  label: string,
  answer: A,
  { variant = 'plain', detail = '' }: OptionLook = {},
): PromptOption<A> => ({ label, detail, answer, variant, effect: null });

export const say = (text: string): Phrase => ({ text, emphasis: 'none' });

export const stress = (text: string): Phrase => ({ text, emphasis: 'strong' });

export const alarm = (text: string): Phrase => ({ text, emphasis: 'alarm' });

export const strike = (text: string): Phrase => ({ text, emphasis: 'struck' });

export const phrasesText = (phrases: readonly Phrase[]): string =>
  phrases.map((phrase) => phrase.text).join('');

export const optionName = ({ label, detail }: PromptOption<unknown>): string =>
  detail === '' ? label : `${label} · ${detail}`;

export const promptAnnouncement = ({ seal, message }: PromptSpec<unknown>): string =>
  `${seal}. ${phrasesText(message)}`;
