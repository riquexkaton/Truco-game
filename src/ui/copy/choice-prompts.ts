import { EFFECT_COPY } from '@ui/copy/effect-copy';
import type { PromptBuilders } from '@ui/copy/prompt';
import { alarm, option, say } from '@ui/copy/prompt';
import { MINUS, num } from '@ui/copy/text';

type ChoicePrompts = Pick<PromptBuilders, 'foldConfirm' | 'discardEffect'>;

export const CHOICE_PROMPTS: ChoicePrompts = {
  foldConfirm: ({ damage }) => ({
    voice: 'plain',
    seal: '¿TE VAS?',
    message: [
      say('Abandonas la ronda: el rival la gana y tú pierdes '),
      alarm(`${num(damage)} de vida`),
      say('.'),
    ],
    options: [
      option('ME VOY', true, { variant: 'warn', detail: `${MINUS}${num(damage)}` }),
      option('SEGUIR', false, { variant: 'main' }),
    ],
    raise: null,
    aside: null,
    timeout: null,
    timeoutLead: '',
  }),
  discardEffect: ({ effects }) => ({
    voice: 'plain',
    seal: 'DESCARTA UNO',
    message: [say('Solo puedes guardar 2 efectos.')],
    options: effects.map((effect, index) => ({
      label: EFFECT_COPY[effect].name,
      detail: '',
      variant: 'pick',
      answer: index,
      effect,
    })),
    raise: null,
    aside: null,
    timeout: null,
    timeoutLead: '',
  }),
};
