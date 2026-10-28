import type { Signal } from '@preact/signals-core';
import { signal } from '@preact/signals-core';

import type { MatchState } from '@domain/match/match-state';

import { TURN_SECONDS } from '@application/timings';

export type Phase = 'idle' | 'deal' | 'player' | 'rival' | 'wait' | 'give' | 'end' | 'over';

export interface GameSignals {
  readonly match: Signal<MatchState | null>;
  readonly phase: Signal<Phase>;
  readonly busy: Signal<boolean>;
  readonly prompting: Signal<boolean>;
  readonly turnSecondsLeft: Signal<number>;
  readonly showPlayHint: Signal<boolean>;
}

export const createSignals = (): GameSignals => ({
  match: signal<MatchState | null>(null),
  phase: signal<Phase>('idle'),
  busy: signal(true),
  prompting: signal(false),
  turnSecondsLeft: signal(TURN_SECONDS),
  showPlayHint: signal(true),
});

export const canPlayerAct = (signals: GameSignals): boolean => {
  const state = signals.match.value;
  return (
    state !== null &&
    signals.phase.value === 'player' &&
    !signals.busy.value &&
    !state.over &&
    !state.roundOver
  );
};
