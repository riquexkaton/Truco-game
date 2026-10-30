import { describe, expect, it } from 'vitest';

import { startedHarness } from '@application/testing/game-harness';
import { ALWAYS } from '@application/testing/match-script';

const RITUAL_HAND = {
  lead: 'player',
  vira: 'lirio',
  player: ['ferran', 'morgana', 'osric'],
  rival: ['saul', 'ines', 'elena'],
} as const;

describe('the Ritual', () => {
  it('deals 3 damage, grants an effect and annuls the Pacto', async () => {
    const harness = await startedHarness({ round: RITUAL_HAND, draws: ['golpe'] });
    const { store, commands, hud, table } = harness;
    expect(store.ritualReady.value).toBe(true);
    expect(store.canSingRitual.value).toBe(true);
    commands.singRitual();
    await harness.untilIdle();
    expect(hud.eventsOf('ritualSung')).toEqual([
      { type: 'ritualSung', side: 'player', annulsPact: false },
    ]);
    expect(store.lives.value.rival).toBe(17);
    expect(table.callsTo('flyEffect')).toEqual(['player']);
    expect(hud.eventsOf('effectGained')).toEqual([
      { type: 'effectGained', side: 'player', effect: 'golpe' },
    ]);
    expect(store.playerEffects.value).toEqual(['golpe']);
    expect(store.ritualSung.value).toBe(true);
    expect(store.canCallPact.value).toBe(false);
    expect(store.ritualReady.value).toBe(false);
  });

  it('can answer a Pacto, annulling it', async () => {
    const { hud, store } = await startedHarness(
      { round: { ...RITUAL_HAND, lead: 'rival' }, draws: ['sanacion'], rolls: [ALWAYS] },
      (prepared) => {
        prepared.script('pactAnswer', { kind: 'ritual' });
      },
    );
    expect(hud.questions[0]).toMatchObject({ kind: 'pactAnswer', canRitual: true });
    expect(hud.eventsOf('ritualSung')).toEqual([
      { type: 'ritualSung', side: 'player', annulsPact: true },
    ]);
    expect(store.lives.value.rival).toBe(17);
    expect(store.playerEffects.value).toEqual(['sanacion']);
    expect(store.pendingPactAmount.value).toBeNull();
  });

  it('is lost when the first card is played without singing it', async () => {
    const harness = await startedHarness({ round: RITUAL_HAND });
    harness.commands.playCard('osric');
    await harness.untilPlayerTurn();
    expect(harness.hud.eventsOf('ritualLost')).toEqual([{ type: 'ritualLost' }]);
    expect(harness.store.ritualReady.value).toBe(false);
    expect(harness.store.lives.value.rival).toBe(20);
  });
});
