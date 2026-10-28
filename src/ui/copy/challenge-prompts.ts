import type { ChallengeAnswer } from '@domain/challenge/challenge';

import type { CounterAnswer } from '@application/ports/hud-port';

import type { PromptBuilders, PromptOption } from '@ui/copy/prompt';
import { option } from '@ui/copy/prompt';
import { MINUS, num } from '@ui/copy/text';

type ChallengePrompts = Pick<PromptBuilders, 'challengeResponse' | 'counterResponse'>;

const RETIRE_WARNING = 'Si no respondes a tiempo, te retiras.';

export const CHALLENGE_PROMPTS: ChallengePrompts = {
  challengeResponse: ({ stake, counterStake, retireDamage, timeout }) => {
    const options: PromptOption<ChallengeAnswer>[] = [
      option(`ACEPTAR · VALE ${num(stake)}`, 'accept', 'main'),
      option(`CONTRA · VALE ${num(counterStake)}`, 'counter', 'warn'),
      option(`RETIRARSE · ${MINUS}${num(retireDamage)}`, 'retire'),
    ];
    return {
      tone: 'desafio',
      title: 'DESAFÍO',
      subtitle: `El rival quiere que la ronda valga ${num(stake)}. ${RETIRE_WARNING}`,
      options,
      wager: null,
      timeout,
    };
  },
  counterResponse: ({ stake, retireDamage, timeout }) => {
    const options: PromptOption<CounterAnswer>[] = [
      option(`ACEPTAR · VALE ${num(stake)}`, 'accept', 'main'),
      option(`RETIRARSE · ${MINUS}${num(retireDamage)}`, 'retire'),
    ];
    return {
      tone: 'desafio',
      title: 'CONTRA-DESAFÍO',
      subtitle: `El rival sube la ronda a ${num(stake)}. ${RETIRE_WARNING}`,
      options,
      wager: null,
      timeout,
    };
  },
};
