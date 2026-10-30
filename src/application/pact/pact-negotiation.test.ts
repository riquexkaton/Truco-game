import { describe, expect, it } from 'vitest';

import { PACT_BET, REPACT_BET } from '@domain/pact/bet';

import { startedHarness } from '@application/testing/game-harness';
import { ALWAYS } from '@application/testing/match-script';

const PAIRED_HANDS = {
  vira: 'lirio',
  player: ['saul', 'tobias', 'ines'],
  rival: ['osric', 'vidal', 'elena'],
} as const;

const WEAK_RIVAL = {
  vira: 'lirio',
  player: ['garin', 'saul', 'ines'],
  rival: ['teo', 'paula', 'lucia'],
} as const;

describe('the Pacto', () => {
  it('is sealed when accepted and revealed before the stake at round end', async () => {
    const harness = await startedHarness(
      { round: { ...PAIRED_HANDS, lead: 'rival' }, rolls: [ALWAYS] },
      (hud) => {
        hud.script('pactAnswer', { kind: 'accept' });
      },
    );
    const { hud, store, commands } = harness;
    expect(store.pendingPactAmount.value).toBe(4);
    expect(hud.questions).toEqual([
      {
        kind: 'pactAnswer',
        bet: REPACT_BET,
        previousAmount: 0,
        first: true,
        canRitual: false,
        canRepacto: false,
        range: { min: 5, max: 20 },
        timeout: { seconds: 10, answer: { kind: 'reject' } },
      },
    ]);
    expect(hud.eventsOf('pactAccepted')).toEqual([
      { type: 'pactAccepted', by: 'player', amount: 4 },
    ]);
    commands.playCard('saul');
    await harness.untilPlayerTurn();
    commands.playCard('tobias');
    await harness.until(() => store.lives.value.rival === 14);
    const types = hud.events.map((event) => event.type);
    expect(types.indexOf('pactRevealed')).toBeLessThan(types.indexOf('roundEnded'));
    expect(hud.eventsOf('pactRevealed')).toEqual([
      { type: 'pactRevealed', winner: 'player', amount: 4, playerValue: 36, rivalValue: 28 },
    ]);
    expect(store.pendingPactAmount.value).toBeNull();
  });

  it('costs the rival 1 when it rejects the first call', async () => {
    const harness = await startedHarness({ round: { ...WEAK_RIVAL, lead: 'player' } });
    harness.hud.script('pactCall', PACT_BET);
    harness.commands.callPact();
    await harness.untilIdle();
    expect(harness.hud.eventsOf('pactCalled')).toEqual([
      { type: 'pactCalled', by: 'player', bet: PACT_BET, first: true },
    ]);
    expect(harness.hud.eventsOf('pactRejected')).toEqual([
      { type: 'pactRejected', by: 'rival', damage: 1 },
    ]);
    expect(harness.store.lives.value.rival).toBe(19);
    expect(harness.store.canCallPact.value).toBe(false);
  });

  it('costs the previous bet when a raise is rejected', async () => {
    const harness = await startedHarness(
      { round: { ...WEAK_RIVAL, lead: 'rival' }, rolls: [ALWAYS] },
      (hud) => {
        hud.script('pactAnswer', { kind: 'raise', bet: REPACT_BET });
      },
    );
    expect(harness.store.lives.value.rival).toBe(18);
    expect(harness.hud.eventsOf('pactCalled')).toEqual([
      { type: 'pactCalled', by: 'player', bet: REPACT_BET, first: false },
    ]);
    expect(harness.hud.eventsOf('pactRejected')).toEqual([
      { type: 'pactRejected', by: 'rival', damage: 2 },
    ]);
  });

  it('does nothing when the call is cancelled', async () => {
    const harness = await startedHarness({ round: { ...WEAK_RIVAL, lead: 'player' } });
    harness.commands.callPact();
    await harness.untilIdle();
    expect(harness.hud.eventsOf('pactCalled')).toEqual([]);
    expect(harness.store.canCallPact.value).toBe(true);
  });
});

describe('Me voy', () => {
  it('costs 1 and still reveals an accepted Pacto', async () => {
    const harness = await startedHarness({ round: { ...PAIRED_HANDS, lead: 'player' } });
    harness.hud.script('pactCall', PACT_BET);
    harness.commands.callPact();
    await harness.untilIdle();
    expect(harness.hud.eventsOf('pactAccepted')).toEqual([
      { type: 'pactAccepted', by: 'rival', amount: 2 },
    ]);
    harness.hud.script('foldConfirm', true);
    harness.commands.fold();
    await harness.until(() => harness.store.lives.value.rival === 18);
    expect(harness.store.lives.value.player).toBe(19);
    expect(harness.hud.eventsOf('retired')).toEqual([
      { type: 'retired', side: 'player', damage: 1, reason: 'fold' },
    ]);
    expect(harness.hud.eventsOf('pactRevealed')).toEqual([
      { type: 'pactRevealed', winner: 'player', amount: 2, playerValue: 36, rivalValue: 28 },
    ]);
    expect(harness.hud.eventsOf('roundEnded')).toEqual([]);
  });
});
