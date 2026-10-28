import type { ReadonlySignal } from '@preact/signals-core';
import { computed } from '@preact/signals-core';

import type { DuelResult } from '@domain/duel/duel';
import type { EffectId } from '@domain/effects/effect';
import type { Lives } from '@domain/life/life';
import { fullLives } from '@domain/life/life';
import type { MatchState } from '@domain/match/match-state';
import type { PerSide, Side } from '@domain/shared/side';
import { bothSides } from '@domain/shared/side';

import type { GameSignals } from '@application/store/game-signals';
import { LOW_TURN_SECONDS } from '@application/timings';

export interface MatchModels {
  readonly lives: ReadonlySignal<Lives>;
  readonly duelResults: ReadonlySignal<readonly DuelResult[]>;
  readonly playerEffects: ReadonlySignal<readonly EffectId[]>;
  readonly rivalEffectCount: ReadonlySignal<number>;
  readonly curse: ReadonlySignal<PerSide<boolean>>;
  readonly seal: ReadonlySignal<PerSide<boolean>>;
  readonly pendingPactAmount: ReadonlySignal<number | null>;
  readonly ritualSung: ReadonlySignal<boolean>;
  readonly turnSide: ReadonlySignal<Side | null>;
  readonly isTurnLow: ReadonlySignal<boolean>;
}

const NO_MARKS = bothSides(false);

const fromMatch = <T>(signals: GameSignals, read: (state: MatchState) => T, fallback: T) =>
  computed(() => {
    const state = signals.match.value;
    return state === null ? fallback : read(state);
  });

const turnSideOf = (signals: GameSignals): Side | null => {
  const state = signals.match.value;
  if (state === null || state.over) return null;
  const phase = signals.phase.value;
  if (phase === 'rival') return 'rival';
  return phase === 'player' && !state.roundOver ? 'player' : null;
};

export const createMatchModels = (signals: GameSignals): MatchModels => ({
  lives: fromMatch(signals, (state) => state.lives, fullLives()),
  duelResults: fromMatch<readonly DuelResult[]>(signals, (state) => state.results, []),
  playerEffects: fromMatch<readonly EffectId[]>(
    signals,
    (state) => state.effects.stored.player,
    [],
  ),
  rivalEffectCount: fromMatch(signals, (state) => state.effects.stored.rival.length, 0),
  curse: fromMatch(signals, (state) => state.curse, NO_MARKS),
  seal: fromMatch(signals, (state) => state.seal, NO_MARKS),
  pendingPactAmount: fromMatch(signals, (state) => state.pact.pending?.amount ?? null, null),
  ritualSung: fromMatch(signals, (state) => state.ritual.sung, false),
  turnSide: computed(() => turnSideOf(signals)),
  isTurnLow: computed(() => signals.turnSecondsLeft.value <= LOW_TURN_SECONDS),
});
