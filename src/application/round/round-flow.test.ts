import { describe, expect, it } from 'vitest';

import { startedHarness } from '@application/testing/game-harness';

const STRONG_HAND = {
  lead: 'player',
  vira: 'lirio',
  player: ['garin', 'saul', 'ines'],
  rival: ['teo', 'paula', 'lucia'],
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
    expect(harness.table.callsTo('markDuel')).toEqual([{ duel: 0, winner: 'player' }]);
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
