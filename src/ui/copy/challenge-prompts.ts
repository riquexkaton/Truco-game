import type { ChallengeAnswer } from '@domain/challenge/challenge';
import { STAKES } from '@domain/challenge/challenge';

import type { CounterAnswer } from '@application/ports/hud-port';

import type { PromptBuilders, PromptOption } from '@ui/copy/prompt';
import { alarm, option, say, strike } from '@ui/copy/prompt';
import { MINUS, num } from '@ui/copy/text';

type ChallengePrompts = Pick<PromptBuilders, 'challengeResponse' | 'counterResponse'>;

const RETIRE_LEAD = 'TE RETIRAS EN ';

const worth = (stake: number): string => `VALE ${num(stake)}`;

const retireOption = (damage: number) =>
  option('RETIRARSE', 'retire', { detail: `${MINUS}${num(damage)}` });

export const CHALLENGE_PROMPTS: ChallengePrompts = {
  challengeResponse: ({ stake, counterStake, retireDamage, timeout }) => {
    const options: PromptOption<ChallengeAnswer>[] = [
      option('ACEPTAR', 'accept', { variant: 'main', detail: worth(stake) }),
      option('CONTRA', 'counter', { variant: 'warn', detail: worth(counterStake) }),
      retireOption(retireDamage),
    ];
    return {
      voice: 'desafio',
      seal: 'DESAFÍO',
      message: [say('El rival quiere que la ronda valga '), alarm(num(stake)), say('.')],
      options,
      raise: null,
      aside: null,
      timeout,
      timeoutLead: RETIRE_LEAD,
    };
  },
  counterResponse: ({ stake, retireDamage, timeout }) => {
    const options: PromptOption<CounterAnswer>[] = [
      option('ACEPTAR', 'accept', { variant: 'main', detail: worth(stake) }),
      retireOption(retireDamage),
    ];
    return {
      voice: 'contra',
      seal: 'CONTRA-DESAFÍO',
      message: [
        say('El rival sube la ronda de '),
        strike(num(STAKES[1])),
        say(' a '),
        alarm(num(stake)),
        say('.'),
      ],
      options,
      raise: null,
      aside: null,
      timeout,
      timeoutLead: RETIRE_LEAD,
    };
  },
};
