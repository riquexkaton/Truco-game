import { EFFECT_COPY } from '@ui/copy/effect-copy';
import type { PromptBuilders } from '@ui/copy/prompt';
import { option } from '@ui/copy/prompt';
import { MINUS } from '@ui/copy/text';

type ChoicePrompts = Pick<PromptBuilders, 'foldConfirm' | 'discardEffect'>;

export const CHOICE_PROMPTS: ChoicePrompts = {
  foldConfirm: () => ({
    tone: 'plain',
    title: '¿TE VAS?',
    subtitle: 'Abandonas la ronda: el rival la gana y tú pierdes 1 de vida.',
    options: [option(`ME VOY · ${MINUS}1`, true, 'warn'), option('SEGUIR', false, 'main')],
    wager: null,
    timeout: null,
  }),
  discardEffect: ({ effects }) => ({
    tone: 'plain',
    title: 'DESCARTA UNO',
    subtitle: 'Solo puedes guardar 2 efectos.',
    options: effects.map((effect, index) => ({
      label: EFFECT_COPY[effect].name,
      variant: 'pick',
      answer: index,
      effect,
    })),
    wager: null,
    timeout: null,
  }),
};
