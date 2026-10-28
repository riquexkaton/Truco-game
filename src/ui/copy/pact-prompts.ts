import type { Bet, WagerRange } from '@domain/pact/bet';
import { PACT_BET, rejectDamage, REPACT_BET, wager } from '@domain/pact/bet';
import type { PactAnswer } from '@domain/pact/negotiation';

import type { Answer, PactAnswerQuestion } from '@application/ports/hud-port';

import type { PromptBuilders, PromptOption, WagerSpec } from '@ui/copy/prompt';
import { option } from '@ui/copy/prompt';
import { BET_NAMES, MINUS, num } from '@ui/copy/text';

type PactPrompts = Pick<PromptBuilders, 'pactCall' | 'pactAnswer'>;

const betLabel = (bet: Bet): string => `${BET_NAMES[bet.kind]} · ${num(bet.amount)}`;

const wagerSpec = <A>(
  range: WagerRange,
  go: string,
  make: (amount: number) => A,
): WagerSpec<A> => ({
  label: 'O APUESTA',
  min: range.min,
  max: range.max,
  go,
  make,
});

const answerTitle = ({ bet }: PactAnswerQuestion): string =>
  bet.kind === 'apuesta' ? betLabel(bet) : BET_NAMES[bet.kind];

const answerSubtitle = ({ bet, first }: PactAnswerQuestion): string => {
  const amount = num(bet.amount);
  if (bet.kind === 'pacto') {
    return `El rival canta Pacto: quien tenga menos Pacto recibe ${amount} de daño.`;
  }
  if (bet.kind === 'repacto') {
    const lead = first ? 'El rival canta Re-pacto' : 'El rival sube a Re-pacto';
    return `${lead}: quien pierda recibe ${amount} de daño.`;
  }
  const verb = first ? 'apuesta' : 'sube la apuesta a';
  return `El rival ${verb} ${amount}: quien pierda el Pacto recibe ${amount} de daño.`;
};

const answerOptions = (question: PactAnswerQuestion): PromptOption<PactAnswer>[] => [
  option<PactAnswer>('ACEPTAR', { kind: 'accept' }, 'main'),
  option<PactAnswer>(`RECHAZAR · ${MINUS}${num(rejectDamage(question.previousAmount))}`, {
    kind: 'reject',
  }),
  ...(question.canRepacto
    ? [option<PactAnswer>(betLabel(REPACT_BET), { kind: 'raise', bet: REPACT_BET })]
    : []),
  ...(question.canRitual ? [option<PactAnswer>('RITUAL · LO ANULA', { kind: 'ritual' })] : []),
];

const raiseTo = (amount: number): PactAnswer => ({ kind: 'raise', bet: wager(amount) });

export const PACT_PROMPTS: PactPrompts = {
  pactCall: ({ range, timeout }) => ({
    tone: 'pacto',
    title: 'PACTO',
    subtitle: '',
    options: [
      option<Answer<'pactCall'>>(betLabel(PACT_BET), PACT_BET, 'main'),
      option<Answer<'pactCall'>>(betLabel(REPACT_BET), REPACT_BET),
      option<Answer<'pactCall'>>('CANCELAR', null),
    ],
    wager: wagerSpec(range, 'APOSTAR', (amount) => wager(amount)),
    timeout,
  }),
  pactAnswer: (question) => ({
    tone: 'pacto',
    title: answerTitle(question),
    subtitle: answerSubtitle(question),
    options: answerOptions(question),
    wager: question.range === null ? null : wagerSpec(question.range, 'SUBIR', raiseTo),
    timeout: question.timeout,
  }),
};
