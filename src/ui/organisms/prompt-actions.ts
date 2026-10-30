import { effectLabel } from '@ui/copy/effect-copy';
import type { PromptOption, PromptSpec } from '@ui/copy/prompt';
import { optionName } from '@ui/copy/prompt';
import type { AnswerAction, RowLayout } from '@ui/molecules/AnswerButton';

type Choose = (answer: unknown) => void;

const STACK_FROM = 4;

const optionAction = (option: PromptOption<unknown>, choose: Choose): AnswerAction => ({
  name: option.effect === null ? optionName(option) : effectLabel(option.effect),
  label: option.label,
  detail: option.detail,
  variant: option.variant,
  effect: option.effect,
  hasArrow: false,
  run: () => {
    choose(option.answer);
  },
});

export const answerActions = (
  spec: PromptSpec<unknown>,
  choose: Choose,
  openRaise: () => void,
): readonly AnswerAction[] => {
  const options = spec.options.map((option) => optionAction(option, choose));
  if (spec.raise === null) return options;
  const { toggle } = spec.raise;
  return [
    ...options,
    {
      name: toggle,
      label: toggle,
      detail: '',
      variant: 'warn',
      effect: null,
      hasArrow: true,
      run: openRaise,
    },
  ];
};

export const rowLayout = (actions: readonly AnswerAction[], isAlarm: boolean): RowLayout => {
  if (actions.length >= STACK_FROM) return 'tight';
  return isAlarm ? 'stack' : 'line';
};
