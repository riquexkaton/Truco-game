import { describe, expect, it } from 'vitest';

import { startedHarness } from '@application/testing/game-harness';

const HAND = {
  lead: 'player',
  vira: 'lirio',
  player: ['garin', 'saul', 'ines'],
  rival: ['teo', 'paula', 'lucia'],
} as const;

describe('the turn timer', () => {
  it('plays the lowest card when the 20 seconds run out', async () => {
    const { clock, store, hud, table } = await startedHarness({ round: HAND });
    expect(store.turnSecondsLeft.value).toBe(20);
    await clock.advance(14_900);
    expect(store.isTurnLow.value).toBe(false);
    await clock.advance(5000);
    expect(store.turnSecondsLeft.value).toBeCloseTo(0.1);
    expect(store.isTurnLow.value).toBe(true);
    expect(hud.eventsOf('turnTimedOut')).toEqual([]);
    await clock.advance(100);
    expect(hud.eventsOf('turnTimedOut')).toEqual([{ type: 'turnTimedOut', cardId: 'ines' }]);
    expect(table.callsTo('placeCard')[0]).toEqual({
      side: 'player',
      cardId: 'ines',
      duel: 0,
      cursed: false,
    });
  });

  it('pauses while a question is open', async () => {
    const { clock, store, hud, commands } = await startedHarness({ round: HAND });
    await clock.advance(5000);
    hud.hold('pactCall');
    commands.callPact();
    await clock.advance(30_000);
    expect(store.prompting.value).toBe(true);
    expect(store.isTurnPaused.value).toBe(true);
    expect(store.turnSecondsLeft.value).toBe(15);
    expect(hud.eventsOf('turnTimedOut')).toEqual([]);
    hud.release('pactCall', null);
    await clock.advance(14_900);
    expect(store.prompting.value).toBe(false);
    expect(hud.eventsOf('turnTimedOut')).toEqual([]);
    await clock.advance(100);
    expect(hud.eventsOf('turnTimedOut')).toHaveLength(1);
  });

  it('pauses while an announcement is still on screen', async () => {
    const { clock, store, hud } = await startedHarness({ round: HAND }, (fake) => {
      fake.holdEvent('turnStarted');
    });
    await clock.advance(30_000);
    expect(store.turnSecondsLeft.value).toBe(20);
    expect(store.isTurnPaused.value).toBe(true);
    hud.releaseEvent('turnStarted');
    await clock.advance(5000);
    expect(store.isTurnPaused.value).toBe(false);
    expect(store.turnSecondsLeft.value).toBe(15);
  });

  it('restarts at 20 seconds on the next turn', async () => {
    const harness = await startedHarness({ round: HAND });
    await harness.clock.advance(10_000);
    expect(harness.store.turnSecondsLeft.value).toBe(10);
    harness.commands.playCard('garin');
    await harness.untilPlayerTurn();
    expect(harness.store.turnSecondsLeft.value).toBe(20);
    expect(harness.hud.eventsOf('turnTimedOut')).toEqual([]);
  });
});
