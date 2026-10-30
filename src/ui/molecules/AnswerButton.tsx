import type { EffectId } from '@domain/effects/effect';

import type { OptionVariant } from '@ui/copy/prompt';
import { EffectCard } from '@ui/molecules/EffectCard';

export interface AnswerAction {
  readonly name: string;
  readonly label: string;
  readonly detail: string;
  readonly variant: OptionVariant;
  readonly effect: EffectId | null;
  readonly hasArrow: boolean;
  readonly run: () => void;
}

export type RowLayout = 'line' | 'stack' | 'tight';

interface AnswerButtonProps {
  readonly action: AnswerAction;
  readonly index: number;
  readonly layout: RowLayout;
}

const LABELS: Readonly<Record<RowLayout, string>> = {
  line: 'text-[13px] tracking-[1.5px] tall:text-[12px] tall:tracking-[1px]',
  stack: 'text-[12px] tracking-[1.5px] tall:tracking-[1px]',
  tight: 'text-[12px] tracking-[1px] tall:text-[11px] tall:tracking-[0.5px]',
};

const VARIANTS: Readonly<Record<OptionVariant, string>> = {
  main: 'bg-ink text-washi',
  warn: 'bg-washi2 text-red shadow-[inset_0_0_0_1.5px_#8e2a2a]',
  plain: 'bg-washi2 text-ink shadow-[inset_0_0_0_1.5px_#1e1a16]',
  pick: 'rounded-[4px] p-0',
};

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

const Arrow = ({ action }: { readonly action: AnswerAction }) =>
  action.hasArrow ? <span aria-hidden="true">{' ▸'}</span> : null;

const KeyHint = ({ index }: { readonly index: number }) => (
  <kbd
    aria-hidden="true"
    class="absolute top-[3px] right-1 rounded-[2px] border border-current px-[3px] font-mincho text-[8px] leading-[11px] opacity-55 tall:hidden"
  >
    {index + 1}
  </kbd>
);

const Label = ({ action, layout }: Omit<AnswerButtonProps, 'index'>) => {
  if (layout === 'line') {
    return (
      <span class={`whitespace-nowrap ${LABELS.line}`}>
        {action.name}
        <Arrow action={action} />
      </span>
    );
  }
  return (
    <>
      <span class={`whitespace-nowrap ${LABELS[layout]}`}>
        {action.label}
        <Arrow action={action} />
      </span>
      {action.detail === '' ? null : (
        <span
          class={`text-[10px] tracking-[1.5px] ${action.variant === 'warn' ? '' : 'opacity-70'}`}
        >
          {action.detail}
        </span>
      )}
    </>
  );
};

export const AnswerButton = ({ action, index, layout }: AnswerButtonProps) => (
  <button
    type="button"
    data-answer=""
    aria-label={action.name}
    onClick={action.run}
    class={`group relative flex min-w-0 cursor-pointer flex-col items-center justify-center gap-[3px] rounded-[2px] font-mincho leading-none font-extrabold transition-transform duration-150 hover:-translate-y-0.5 ${layout === 'line' ? 'flex-auto px-3 tall:px-2' : ''} ${FOCUS} ${VARIANTS[action.variant]}`}
  >
    {action.effect === null ? (
      <Label action={action} layout={layout} />
    ) : (
      <EffectCard effect={action.effect} size="small" />
    )}
    <KeyHint index={index} />
  </button>
);
