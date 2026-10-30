import { describe, expect, it } from 'vitest';

import { startedHarness } from '@application/testing/game-harness';
import { DUEL_BEAT_MS, DUEL_REVEAL_MS } from '@application/timings';

const STRONG_HAND = {
  lead: 'player',
  vira: 'lirio',
  player: ['garin', 'saul', 'ines'],
  rival: ['teo', 'paula', 'lucia'],
} as const;

const TIED_HAND = {
  lead: 'rival',
  vira: 'velo',
  player: ['garin', 'saul', 'ines'],
  rival: ['paula', 'rafael', 'elio'],
} as const;

describe('a round', () => {
  it('deals, plays two duels and makes the rival pay the stake', async () => {
    const harness = await startedHarness({ round: STRONG_HAND });
    const { commands, store, hud, table } = harness;
    expect(table.callsTo('dealRound')).toEqual([
      { vira: 'lirio', player: STRONG_HAND.player, rival: STRONG_HAND.rival },
    ]);
    expect(hud.eventsOf('roundStarted')).toEqual([
      { type: 'roundStarted', round: 1, lead: 'player', vira: 'lirio' },
    ]);
    commands.playCard('garin');
    await harness.untilPlayerTurn();
    commands.playCard('saul');
    await harness.until(() => store.lives.value.rival === 18);
    expect(store.duelResults.value).toEqual(['player', 'player']);
    expect(hud.eventsOf('roundEnded')).toEqual([
      { type: 'roundEnded', winner: 'player', stake: 2 },
    ]);
    expect(table.callsTo('moveCoins')).toEqual([{ side: 'rival', delta: -2 }]);
  });

  it('reports each duel with both cards, attacks and running wins', async () => {
    const harness = await startedHarness({ round: STRONG_HAND });
    harness.commands.playCard('garin');
    await harness.untilPlayerTurn();
    expect(harness.hud.eventsOf('duelResolved')).toEqual([
      {
        type: 'duelResolved',
        duel: 0,
        result: 'player',
        player: { cardId: 'garin', attack: 10 },
        rival: { cardId: 'teo', attack: 1 },
        wins: { player: 1, rival: 0 },
      },
    ]);
    expect(harness.table.callsTo('markDuel')).toEqual([
      { duel: 0, result: 'player', attacks: { player: 10, rival: 1 } },
    ]);
  });

  it('marks a tied duel on the table as a tie', async () => {
    const harness = await startedHarness({ round: TIED_HAND });
    harness.commands.playCard('garin');
    await harness.until(() => harness.table.callsTo('markDuel').length === 1);
    expect(harness.table.callsTo('markDuel')).toEqual([
      { duel: 0, result: 'tie', attacks: { player: 10, rival: 10 } },
    ]);
  });

  it('gives each duel one short beat before the next turn', async () => {
    const harness = await startedHarness({ round: STRONG_HAND });
    harness.commands.playCard('garin');
    await harness.until(() => harness.table.callsTo('placeCard').length === 2);
    const landed = harness.clock.now();
    await harness.untilPlayerTurn();
    expect(harness.clock.now() - landed).toBe(DUEL_REVEAL_MS + DUEL_BEAT_MS);
  });

  it('moves life and coins when the round notice appears, not after it', async () => {
    const harness = await startedHarness({ round: STRONG_HAND }, (hud) => {
      hud.holdEvent('roundEnded');
    });
    harness.commands.playCard('garin');
    await harness.untilPlayerTurn();
    harness.commands.playCard('saul');
    await harness.until(() => harness.hud.eventsOf('roundEnded').length === 1);
    expect(harness.store.lives.value.rival).toBe(20);
    expect(harness.table.callsTo('moveCoins')).toEqual([]);
    harness.hud.releaseEvent('roundEnded');
    await harness.clock.advance(0);
    expect(harness.store.lives.value.rival).toBe(18);
    expect(harness.table.callsTo('moveCoins')).toEqual([{ side: 'rival', delta: -2 }]);
  });

  it('clears the table and deals the next round led by the other side', async () => {
    const harness = await startedHarness({ round: STRONG_HAND });
    harness.commands.playCard('garin');
    await harness.untilPlayerTurn();
    harness.commands.playCard('saul');
    await harness.until(() => harness.hud.eventsOf('roundStarted').length === 2);
    expect(harness.table.callsTo('clearTable')).toHaveLength(1);
    expect(harness.hud.eventsOf('roundStarted')[1]).toMatchObject({ round: 2, lead: 'rival' });
    expect(harness.store.match.value?.round).toBe(2);
  });

  it('ignores cards that are not in the hand or played out of turn', async () => {
    const harness = await startedHarness({ round: STRONG_HAND });
    harness.commands.playCard('teo');
    expect(harness.store.busy.value).toBe(false);
    harness.commands.playCard('garin');
    harness.commands.playCard('saul');
    await harness.untilPlayerTurn();
    expect(harness.store.match.value?.hands.player).toEqual(['saul', 'ines']);
  });

  it('shows the play hint until the first card is played', async () => {
    const harness = await startedHarness({ round: STRONG_HAND });
    expect(harness.store.showPlayHint.value).toBe(true);
    harness.commands.playCard('garin');
    expect(harness.store.showPlayHint.value).toBe(false);
  });
});
