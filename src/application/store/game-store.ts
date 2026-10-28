import type { ReadonlySignal } from '@preact/signals-core';

import type { MatchState } from '@domain/match/match-state';

import type { ActionModels } from '@application/store/action-models';
import { createActionModels } from '@application/store/action-models';
import type { GameSignals, Phase } from '@application/store/game-signals';
import type { MatchModels } from '@application/store/match-models';
import { createMatchModels } from '@application/store/match-models';
import { TURN_SECONDS } from '@application/timings';

export interface GameStore extends ActionModels, MatchModels {
  readonly match: ReadonlySignal<MatchState | null>;
  readonly phase: ReadonlySignal<Phase>;
  readonly busy: ReadonlySignal<boolean>;
  readonly prompting: ReadonlySignal<boolean>;
  readonly turnSeconds: number;
  readonly turnSecondsLeft: ReadonlySignal<number>;
  readonly showPlayHint: ReadonlySignal<boolean>;
}

export const createStore = (signals: GameSignals): GameStore => ({
  ...signals,
  turnSeconds: TURN_SECONDS,
  ...createMatchModels(signals),
  ...createActionModels(signals),
});
