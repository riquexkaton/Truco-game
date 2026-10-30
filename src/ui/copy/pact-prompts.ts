import type { Bet, WagerRange } from '@domain/pact/bet';
import { PACT_BET, rejectDamage, REPACT_BET, wager } from '@domain/pact/bet';
import type { PactAnswer } from '@domain/pact/negotiation';

import type { Answer, PactAnswerQuestion } from '@application/ports/hud-port';

import type { Phrase, PromptBuilders, PromptOption, RaiseSpec } from '@ui/copy/prompt';
import { alarm, option, say, stress } from '@ui/copy/prompt';
import { BET_NAMES, MINUS, num } from '@ui/copy/text';

type PactPrompts = Pick<PromptBuilders, 'pactCall' | 'pactAnswer'>;

const damage = (amount: number): string => `${num(amount)} de daño`;

interface RaiseWords {
  readonly toggle: string;
  readonly go: string;
  readonly summary: string;
}

const RAISE_WORDS: RaiseWords = { toggle: 'SUBIR', go: 'SUBIR A', summary: 'Subes a' };

const WAGER_WORDS: RaiseWords = { toggle: 'APOSTAR', go: 'APOSTAR', summary: 'Apuestas' };

const raiseSpec = <A>(
  range: WagerRange,
  words: RaiseWords,
  make: (amount: number) => A,
): RaiseSpec<A> => ({
  toggle: words.toggle,
  min: range.min,
  max: range.max,
  go: (amount) => `${words.go} ${num(amount)}`,
  summary: (amount) => [say(`${words.summary} `), alarm(damage(amount)), say('.')],
  make,
});

const answerSeal = ({ bet }: PactAnswerQuestion): string =>
  bet.kind === 'apuesta' ? `${BET_NAMES.apuesta} · ${num(bet.amount)}` : BET_NAMES[bet.kind];

const answerMessage = ({ bet, first }: PactAnswerQuestion): readonly Phrase[] => {
  const who = bet.kind === 'pacto' ? 'Quien tenga menos Pacto' : 'Quien pierda';
  const lead = first ? '' : 'El rival sube. ';
  return [say(`${lead}«${who} recibe `), stress(damage(bet.amount)), say('.»')];
};

const betOption = <A>(bet: Bet, answer: A, variant: 'main' | 'plain') =>
  option(BET_NAMES[bet.kind], answer, { variant, detail: num(bet.amount) });

const answerOptions = (question: PactAnswerQuestion): PromptOption<PactAnswer>[] => [
  option<PactAnswer>('ACEPTAR', { kind: 'accept' }, { variant: 'main' }),
  option<PactAnswer>(
    'RECHAZAR',
    { kind: 'reject' },
    { detail: `${MINUS}${num(rejectDamage(question.previousAmount))}` },
  ),
  ...(question.canRepacto
    ? [betOption<PactAnswer>(REPACT_BET, { kind: 'raise', bet: REPACT_BET }, 'plain')]
    : []),
];

const ritualOption = ({ canRitual }: PactAnswerQuestion): PromptOption<PactAnswer> | null =>
  canRitual ? option<PactAnswer>('RITUAL', { kind: 'ritual' }, { detail: 'LO ANULA' }) : null;

const raiseTo = (amount: number): PactAnswer => ({ kind: 'raise', bet: wager(amount) });

export const PACT_PROMPTS: PactPrompts = {
  pactCall: ({ range, timeout }) => ({
    voice: 'plain',
    seal: 'PACTO',
    message: [say('Quien tenga menos Pacto recibe el daño.')],
    options: [
      betOption<Answer<'pactCall'>>(PACT_BET, PACT_BET, 'main'),
      betOption<Answer<'pactCall'>>(REPACT_BET, REPACT_BET, 'plain'),
    ],
    raise: raiseSpec(range, WAGER_WORDS, (amount) => wager(amount)),
    aside: option<Answer<'pactCall'>>('CANCELAR', null),
    timeout,
    timeoutLead: '',
  }),
  pactAnswer: (question) => ({
    voice: 'pacto',
    seal: answerSeal(question),
    message: answerMessage(question),
    options: answerOptions(question),
    raise: question.range === null ? null : raiseSpec(question.range, RAISE_WORDS, raiseTo),
    aside: ritualOption(question),
    timeout: question.timeout,
    timeoutLead: '',
  }),
};
