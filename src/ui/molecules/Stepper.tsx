import type { TargetedKeyboardEvent } from 'preact';

import { WAGER_COPY, wagerLabel } from '@ui/copy/hud-copy';

interface StepperProps {
  readonly value: string;
  readonly min: number;
  readonly max: number;
  readonly onInput: (value: string) => void;
  readonly onStep: (step: number) => void;
  readonly onCommit: () => void;
  readonly onSubmit: () => void;
}

interface StepButtonProps {
  readonly label: string;
  readonly step: number;
  readonly onStep: (step: number) => void;
}

const StepButton = ({ label, step, onStep }: StepButtonProps) => (
  <button
    type="button"
    aria-label={label}
    onClick={() => {
      onStep(step);
    }}
    class="h-11 w-10 cursor-pointer bg-transparent font-mincho text-[18px] leading-none font-extrabold text-ink hover:bg-ink/8 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ink"
  >
    {step < 0 ? '−' : '+'}
  </button>
);

const submitOnEnter =
  (onSubmit: () => void) => (event: TargetedKeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    onSubmit();
  };

export const Stepper = ({ value, min, max, onInput, onStep, onCommit, onSubmit }: StepperProps) => (
  <div class="flex h-11 items-center bg-washi2 shadow-[inset_0_0_0_1.5px_var(--color-ink)]">
    <StepButton label={WAGER_COPY.lower} step={-1} onStep={onStep} />
    <input
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      value={value}
      aria-label={wagerLabel(min, max)}
      onInput={(event) => {
        onInput(event.currentTarget.value);
      }}
      onChange={onCommit}
      onKeyDown={submitOnEnter(onSubmit)}
      class="h-11 w-[52px] [appearance:textfield] bg-transparent text-center font-mincho text-[20px] leading-none font-extrabold text-red focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ink [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
    />
    <StepButton label={WAGER_COPY.raise} step={1} onStep={onStep} />
  </div>
);
