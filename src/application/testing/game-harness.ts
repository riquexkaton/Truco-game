import type { Random } from '@domain/shared/random';

import type { Game } from '@application/create-game';
import { createGame } from '@application/create-game';
import type { FakeHud } from '@application/testing/fake-hud';
import { createFakeHud } from '@application/testing/fake-hud';
import type { FakeTable } from '@application/testing/fake-table';
import { createFakeTable } from '@application/testing/fake-table';
import type { MatchScript } from '@application/testing/match-script';
import { matchRandom } from '@application/testing/match-script';
import type { VirtualScheduler } from '@application/testing/virtual-scheduler';
import { createVirtualScheduler } from '@application/testing/virtual-scheduler';

export interface Harness extends Game {
  readonly table: FakeTable;
  readonly hud: FakeHud;
  readonly clock: VirtualScheduler;
  readonly untilPlayerTurn: () => Promise<void>;
  readonly untilIdle: () => Promise<void>;
  readonly until: (isDone: () => boolean) => Promise<void>;
}

export const createHarness = (random: Random): Harness => {
  const table = createFakeTable();
  const hud = createFakeHud();
  const clock = createVirtualScheduler();
  const game = createGame({ table, hud, scheduler: clock, random });
  const { store } = game;
  return {
    ...game,
    table,
    hud,
    clock,
    untilPlayerTurn: () =>
      clock.runUntil(() => store.phase.value === 'player' && !store.busy.value),
    untilIdle: () => clock.runUntil(() => !store.busy.value),
    until: (isDone) => clock.runUntil(isDone),
  };
};

export const startedHarness = async (
  script: MatchScript,
  prepare?: (hud: FakeHud) => void,
): Promise<Harness> => {
  const harness = createHarness(matchRandom(script));
  prepare?.(harness.hud);
  harness.commands.start();
  await harness.untilPlayerTurn();
  return harness;
};
