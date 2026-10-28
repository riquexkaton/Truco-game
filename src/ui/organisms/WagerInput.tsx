import { useState } from 'preact/hooks';

import { clampWager } from '@domain/pact/bet';

import { PaperButton } from '@ui/atoms/PaperButton';
import { faltaLabel } from '@ui/copy/hud-copy';
import type { WagerSpec } from '@ui/copy/prompt';
import { Stepper } from '@ui/molecules/Stepper';

interface WagerInputProps {
  readonly wager: WagerSpec<unknown>;
  readonly onChoose: (answer: unknown) => void;
}

const typedAmount = (text: string, wager: WagerSpec<unknown>): number => Number(text) || wager.min;

const clampedText = (amount: number, wager: WagerSpec<unknown>): string =>
  String(clampWager(Math.round(amount), wager));

const useWager = ({ wager, onChoose }: WagerInputProps) => {
  const [text, setText] = useState(String(wager.min));
  const commit = () => {
    const clamped = clampedText(typedAmount(text, wager), wager);
    setText(clamped);
    return Number(clamped);
  };
  return {
    text,
    setText,
    commit,
    step: (step: number) => {
      setText(clampedText(typedAmount(text, wager) + step, wager));
    },
    fill: () => {
      setText(String(wager.max));
    },
    submit: () => {
      onChoose(wager.make(commit()));
    },
  };
};

export const WagerInput = (props: WagerInputProps) => {
  const { wager } = props;
  const state = useWager(props);
  return (
    <div class="flex flex-wrap items-center justify-center gap-2">
      <span class="w-full text-center text-[10px] font-extrabold tracking-[0.3em] text-ink/60">
        {wager.label}
      </span>
      <Stepper
        value={state.text}
        min={wager.min}
        max={wager.max}
        onInput={state.setText}
        onStep={state.step}
        onCommit={state.commit}
        onSubmit={state.submit}
      />
      <PaperButton variant="chip" onClick={state.fill}>
        {faltaLabel(wager.max)}
      </PaperButton>
      <PaperButton variant="main" onClick={state.submit}>
        {wager.go}
      </PaperButton>
    </div>
  );
};
