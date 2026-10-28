import { describe, expect, it } from 'vitest';

import { wager } from '@domain/pact/bet';

import type { Harness } from '@application/testing/game-harness';
import { startedHarness } from '@application/testing/game-harness';
import { ALWAYS } from '@application/testing/match-script';

const FIRST_ROUND = {
  lead: 'player',
  vira: 'lirio',
  player: ['saul', 'tobias', 'ines'],
  rival: ['garin', 'elio', 'rafael'],
} as const;

const leaveRivalAtTwo = async (): Promise<Harness> => {
  const harness = await startedHarness(
    { round: FIRST_ROUND, draws: ['golpe'], rolls: [ALWAYS] },
    (hud) => {
      hud.script('pactCall', wager(18));
    },
  );
  harness.commands.callPact();
  await harness.untilIdle();
  harness.commands.playCard('saul');
  await harness.untilPlayerTurn();
  harness.commands.playCard('tobias');
  await harness.untilPlayerTurn();
  return harness;
};

const strikeToZero = async (): Promise<Harness> => {
  const harness = await leaveRivalAtTwo();
  harness.commands.playCard('baltasar');
  await harness.untilPlayerTurn();
  harness.commands.useEffect('golpe');
  await harness.until(() => harness.store.phase.value === 'over');
  return harness;
};

describe('the end of the match', () => {
  it('reaches the second round with the rival on its last 2 lives', async () => {
    const harness = await leaveRivalAtTwo();
    expect(harness.store.lives.value).toEqual({ player: 18, rival: 2 });
    expect(harness.hud.eventsOf('pactAccepted')).toEqual([
      { type: 'pactAccepted', by: 'rival', amount: 18 },
    ]);
    expect(harness.hud.eventsOf('roundEnded')).toEqual([
      { type: 'roundEnded', winner: 'rival', stake: 2 },
    ]);
  });

  it('ends mid-round when a Golpe empties the rival and announces it 1.6 s later', async () => {
    const harness = await leaveRivalAtTwo();
    harness.commands.playCard('baltasar');
    await harness.untilPlayerTurn();
    harness.commands.useEffect('golpe');
    await harness.until(() => harness.store.lives.value.rival === 0);
    const struckAt = harness.clock.now();
    await harness.until(() => harness.store.phase.value === 'over');
    expect(harness.clock.now() - struckAt).toBe(1600);
    expect(harness.hud.eventsOf('matchOver')).toEqual([
      { type: 'matchOver', winner: 'player', life: 18, rounds: 2 },
    ]);
  });

  it('ends without drawing an effect when the Ritual is lethal', async () => {
    const harness = await leaveRivalAtTwo();
    harness.commands.singRitual();
    await harness.until(() => harness.store.phase.value === 'over');
    expect(harness.store.lives.value.rival).toBe(0);
    expect(harness.store.playerEffects.value).toEqual([]);
    expect(harness.table.callsTo('flyEffect')).toEqual([]);
    expect(harness.hud.eventsOf('matchOver')).toHaveLength(1);
  });

  it('stops every flow once the match is over', async () => {
    const harness = await strikeToZero();
    const eventCount = harness.hud.events.length;
    await harness.clock.advance(60_000);
    expect(harness.hud.events).toHaveLength(eventCount);
    expect(harness.hud.eventsOf('roundStarted')).toHaveLength(2);
    expect(harness.store.canPlayCard.value).toBe(false);
  });

  it('restarts with full lives, fresh coins and no stored effects', async () => {
    const harness = await strikeToZero();
    harness.commands.restart();
    await harness.until(() => harness.hud.eventsOf('roundStarted').length === 3);
    expect(harness.store.lives.value).toEqual({ player: 20, rival: 20 });
    expect(harness.store.playerEffects.value).toEqual([]);
    expect(harness.store.match.value?.round).toBe(1);
    expect(harness.table.callsTo('resetCoins')).toHaveLength(1);
    expect(harness.table.callsTo('clearTable')).toHaveLength(2);
  });
});
