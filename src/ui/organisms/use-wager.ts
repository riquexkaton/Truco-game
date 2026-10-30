import { useState } from 'preact/hooks';

import type { WagerRange } from '@domain/pact/bet';
import { clampWager } from '@domain/pact/bet';

import type { RaiseSpec } from '@ui/copy/prompt';

export interface Wager {
  readonly text: string;
  readonly amount: number;
  readonly setText: (text: string) => void;
  readonly commit: () => void;
  readonly step: (step: number) => void;
  readonly fill: () => void;
  readonly submit: () => void;
}

const NO_RANGE: WagerRange = { min: 0, max: 0 };

const clampedAmount = (text: string, range: WagerRange): number =>
  clampWager(Math.round(Number(text) || range.min), range);

export const useWager = (
  raise: RaiseSpec<unknown> | null,
  onChoose: (answer: unknown) => void,
): Wager => {
  const range = raise ?? NO_RANGE;
  const [text, setText] = useState(String(range.min));
  const amount = clampedAmount(text, range);
  return {
    text,
    amount,
    setText,
    commit: () => {
      setText(String(amount));
    },
    step: (step) => {
      setText(String(clampWager(amount + step, range)));
    },
    fill: () => {
      setText(String(range.max));
    },
    submit: () => {
      if (raise !== null) onChoose(raise.make(amount));
    },
  };
};
