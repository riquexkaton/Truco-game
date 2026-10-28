import { describe, expect, it } from 'vitest';

import { startedHarness } from '@application/testing/game-harness';
import { ALWAYS } from '@application/testing/match-script';

const RITUAL_HAND = {
  lead: 'player',
  vira: 'lirio',
  player: ['ferran', 'morgana', 'osric'],
  rival: ['saul', 'ines', 'elena'],
} as const;

const BOTH_RITUALS = { ...RITUAL_HAND, rival: ['saul', 'tobias', 'nilo'] } as const;

const SEALED_HAND = {
  lead: 'player',
  vira: 'carnero',
  player: ['baltasar', 'gaspar', 'brunilda'],
  rival: ['paula', 'lucia', 'amaia'],
} as const;

describe('effects', () => {
  it('strikes the rival with Golpe once per turn', async () => {
    const harness = await startedHarness({ round: RITUAL_HAND, draws: ['golpe'] });
    const { commands, store, hud } = harness;
    commands.singRitual();
    await harness.untilIdle();
    expect(store.canUseEffect('golpe')).toBe(true);
    commands.useEffect('golpe');
    await harness.untilIdle();
    expect(hud.eventsOf('effectUsed')).toEqual([
      { type: 'effectUsed', side: 'player', effect: 'golpe' },
    ]);
    expect(store.lives.value.rival).toBe(15);
    expect(store.playerEffects.value).toEqual([]);
    expect(store.canUseEffect('golpe')).toBe(false);
  });

  it('annuls the next rival effect with a Sello', async () => {
    const harness = await startedHarness({
      round: BOTH_RITUALS,
      draws: ['sello', 'golpe'],
      rolls: [ALWAYS, ALWAYS],
    });
    const { commands, store, hud } = harness;
    commands.singRitual();
    await harness.untilIdle();
    commands.useEffect('sello');
    await harness.untilIdle();
    expect(store.seal.value).toEqual({ player: false, rival: true });
    commands.playCard('ferran');
    await harness.until(() => hud.eventsOf('effectAnnulled').length === 1);
    expect(hud.eventsOf('effectUsed').at(-1)).toEqual({
      type: 'effectUsed',
      side: 'rival',
      effect: 'golpe',
    });
    expect(hud.eventsOf('effectAnnulled')).toEqual([{ type: 'effectAnnulled', side: 'rival' }]);
    expect(store.seal.value.rival).toBe(false);
    expect(store.lives.value.player).toBe(17);
    expect(store.rivalEffectCount.value).toBe(0);
  });

  it('lets the player choose the card it gives in a Saqueo', async () => {
    const harness = await startedHarness({
      round: RITUAL_HAND,
      draws: ['saqueo'],
      rolls: [ALWAYS],
    });
    const { commands, store, hud, table } = harness;
    commands.singRitual();
    await harness.untilIdle();
    commands.useEffect('saqueo');
    await harness.until(() => store.phase.value === 'give');
    expect(store.canPlayCard.value).toBe(true);
    commands.playCard('elena');
    commands.playCard('osric');
    await harness.untilIdle();
    const hands = { player: ['ferran', 'morgana', 'saul'], rival: ['osric', 'ines', 'elena'] };
    expect(store.match.value?.hands).toEqual(hands);
    expect(table.callsTo('arrangeHands')).toEqual([hands]);
    expect(hud.eventsOf('plundered')).toEqual([{ type: 'plundered', side: 'player' }]);
    expect(store.phase.value).toBe('player');
  });

  it('asks the player to discard when a third effect arrives', async () => {
    const harness = await startedHarness(
      { round: SEALED_HAND, draws: ['golpe', 'sanacion', 'sello'] },
      (hud) => {
        hud.script('discardEffect', 0);
      },
    );
    const { commands, store, hud } = harness;
    commands.singRitual();
    await harness.untilIdle();
    commands.playCard('gaspar');
    await harness.untilPlayerTurn();
    commands.playCard('brunilda');
    await harness.until(() => store.duelResults.value.length === 2);
    await harness.until(() => store.phase.value === 'end');
    expect(hud.eventsOf('effectEarned').map((event) => event.cardId)).toEqual([
      'gaspar',
      'brunilda',
    ]);
    expect(hud.questions).toEqual([
      { kind: 'discardEffect', effects: ['golpe', 'sanacion', 'sello'] },
    ]);
    expect(store.playerEffects.value).toEqual(['sanacion', 'sello']);
  });

  it('lets the rival discard its least valued effect on its own', async () => {
    const harness = await startedHarness({
      round: {
        lead: 'rival',
        vira: 'carnero',
        player: ['paula', 'lucia', 'amaia'],
        rival: ['baltasar', 'gaspar', 'brunilda'],
      },
      draws: ['golpe', 'sanacion', 'sello'],
      rolls: [ALWAYS],
    });
    const { commands, store, hud } = harness;
    commands.playCard('paula');
    await harness.untilPlayerTurn();
    commands.playCard('lucia');
    await harness.until(() => store.phase.value === 'end');
    expect(hud.eventsOf('effectEarned').map((event) => event.side)).toEqual(['rival', 'rival']);
    expect(hud.questions).toEqual([]);
    expect(store.rivalEffectCount.value).toBe(2);
    expect(store.match.value?.effects.stored.rival).toEqual(['golpe', 'sanacion']);
  });
});
