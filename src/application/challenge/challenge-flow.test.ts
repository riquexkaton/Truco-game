import { describe, expect, it } from 'vitest';

import { startedHarness } from '@application/testing/game-harness';
import { ALWAYS, NEVER } from '@application/testing/match-script';

const PLAYER_LEADS = {
  lead: 'player',
  vira: 'lirio',
  player: ['garin', 'saul', 'ines'],
  rival: ['elio', 'rafael', 'isolda'],
} as const;

const RIVAL_LEADS = {
  lead: 'rival',
  vira: 'lirio',
  player: ['garin', 'saul', 'ines'],
  rival: ['teo', 'paula', 'lucia'],
} as const;

const RIVAL_LEGENDS = { ...PLAYER_LEADS, rival: ['baltasar', 'oriana', 'brigida'] } as const;

const RIVAL_RAISES = [NEVER, ALWAYS];

describe('the Desafío', () => {
  it('raises the round to 4 and hands the word to the rival when it accepts', async () => {
    const harness = await startedHarness({ round: PLAYER_LEADS });
    harness.commands.callChallenge();
    await harness.untilIdle();
    expect(harness.hud.eventsOf('challengeCalled')).toEqual([
      { type: 'challengeCalled', by: 'player', level: 1 },
    ]);
    expect(harness.hud.eventsOf('challengeAccepted')).toEqual([
      { type: 'challengeAccepted', by: 'rival', stake: 4, holder: 'rival' },
    ]);
    expect(harness.store.challenge.value).toEqual({ level: 1, holder: 'rival', stake: 4 });
    expect(harness.store.canChallenge.value).toBe(false);
    expect(harness.store.canPlayCard.value).toBe(true);
  });

  it('costs the player 1 when the rival Desafío times out', async () => {
    const harness = await startedHarness({ round: RIVAL_LEADS, rolls: RIVAL_RAISES });
    await harness.until(() => harness.store.lives.value.player === 19);
    expect(harness.hud.questions).toEqual([
      {
        kind: 'challengeResponse',
        stake: 4,
        counterStake: 6,
        retireDamage: 1,
        timeout: { seconds: 10, answer: 'retire' },
      },
    ]);
    expect(harness.hud.eventsOf('retired')).toEqual([
      { type: 'retired', side: 'player', damage: 1, reason: 'retire' },
    ]);
    expect(harness.hud.eventsOf('roundEnded')).toEqual([]);
  });

  it('costs the player 4 when it retires from an immediate Contra', async () => {
    const harness = await startedHarness({ round: RIVAL_LEGENDS, rolls: [ALWAYS] });
    harness.commands.callChallenge();
    await harness.until(() => harness.store.lives.value.player === 16);
    expect(harness.hud.questions.map((question) => question.kind)).toEqual(['counterResponse']);
    expect(harness.hud.eventsOf('retired')).toEqual([
      { type: 'retired', side: 'player', damage: 4, reason: 'retire' },
    ]);
  });

  it('costs the rival 4 when the player counters and the rival retires', async () => {
    const harness = await startedHarness({ round: RIVAL_LEADS, rolls: RIVAL_RAISES }, (hud) => {
      hud.script('challengeResponse', 'counter');
    });
    expect(harness.store.lives.value.rival).toBe(16);
    expect(harness.hud.eventsOf('challengeCalled')).toEqual([
      { type: 'challengeCalled', by: 'player', level: 2 },
    ]);
  });

  it('lets the holder raise to Contra on a later turn', async () => {
    const harness = await startedHarness({ round: RIVAL_LEADS, rolls: RIVAL_RAISES }, (hud) => {
      hud.script('challengeResponse', 'accept');
    });
    expect(harness.hud.eventsOf('challengeAccepted')).toEqual([
      { type: 'challengeAccepted', by: 'player', stake: 4, holder: 'player' },
    ]);
    expect(harness.store.challenge.value).toEqual({ level: 1, holder: 'player', stake: 4 });
    harness.commands.callChallenge();
    await harness.until(() => harness.store.lives.value.rival === 16);
    expect(harness.hud.eventsOf('retired')).toEqual([
      { type: 'retired', side: 'rival', damage: 4, reason: 'retire' },
    ]);
  });
});

describe('Me voy', () => {
  it('asks for confirmation and keeps playing when declined', async () => {
    const harness = await startedHarness({ round: PLAYER_LEADS });
    harness.hud.script('foldConfirm', false);
    harness.commands.fold();
    await harness.untilIdle();
    expect(harness.store.canFold.value).toBe(true);
    expect(harness.store.lives.value.player).toBe(20);
  });
});
