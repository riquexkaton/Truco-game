import { describe, expect, it } from 'vitest';

import type { GameStore } from '@application/store/game-store';
import { createHarness, startedHarness } from '@application/testing/game-harness';
import { matchRandom } from '@application/testing/match-script';

const HAND = {
  lead: 'player',
  vira: 'lirio',
  player: ['garin', 'saul', 'ines'],
  rival: ['teo', 'paula', 'lucia'],
} as const;

const snapshot = (store: GameStore) => ({
  phase: store.phase.value,
  canPlayCard: store.canPlayCard.value,
  canChallenge: store.canChallenge.value,
  challenge: store.challenge.value,
  canCallPact: store.canCallPact.value,
  canSingRitual: store.canSingRitual.value,
  ritualReady: store.ritualReady.value,
  ritualSung: store.ritualSung.value,
  canFold: store.canFold.value,
  canUseGolpe: store.canUseEffect('golpe'),
  pendingPactAmount: store.pendingPactAmount.value,
  playerEffects: store.playerEffects.value,
  rivalEffectCount: store.rivalEffectCount.value,
  curse: store.curse.value,
  seal: store.seal.value,
  duelResults: store.duelResults.value,
  lives: store.lives.value,
  turnSide: store.turnSide.value,
  isTurnLow: store.isTurnLow.value,
  turnSeconds: store.turnSeconds,
});

const IDLE_VIEW = {
  phase: 'idle',
  canPlayCard: false,
  canChallenge: false,
  challenge: { level: 0, holder: null, stake: 2 },
  canCallPact: false,
  canSingRitual: false,
  ritualReady: false,
  ritualSung: false,
  canFold: false,
  canUseGolpe: false,
  pendingPactAmount: null,
  playerEffects: [],
  rivalEffectCount: 0,
  curse: { player: false, rival: false },
  seal: { player: false, rival: false },
  duelResults: [],
  lives: { player: 20, rival: 20 },
  turnSide: null,
  isTurnLow: false,
  turnSeconds: 20,
};

describe('the game store', () => {
  it('exposes a neutral view before the match starts', () => {
    const { store } = createHarness(matchRandom({ round: HAND }));
    expect(snapshot(store)).toEqual(IDLE_VIEW);
  });

  it('opens the player actions on the player turn', async () => {
    const { store } = await startedHarness({ round: HAND });
    expect(snapshot(store)).toEqual({
      ...IDLE_VIEW,
      phase: 'player',
      canPlayCard: true,
      canChallenge: true,
      canCallPact: true,
      canFold: true,
      turnSide: 'player',
    });
  });

  it('shows the rival turn while the rival thinks', async () => {
    const harness = await startedHarness({ round: HAND });
    harness.commands.playCard('garin');
    await harness.until(() => harness.store.phase.value === 'rival');
    expect(harness.store.turnSide.value).toBe('rival');
    expect(harness.store.canPlayCard.value).toBe(false);
  });

  it('ignores commands that are not allowed', async () => {
    const harness = createHarness(matchRandom({ round: HAND }));
    harness.commands.restart();
    harness.commands.callChallenge();
    harness.commands.start();
    harness.commands.start();
    await harness.untilPlayerTurn();
    harness.commands.singRitual();
    harness.commands.useEffect('golpe');
    harness.commands.restart();
    expect(harness.store.busy.value).toBe(false);
    expect(harness.table.callsTo('dealRound')).toHaveLength(1);
    expect(harness.hud.events.map((event) => event.type)).toEqual(['roundStarted', 'turnStarted']);
  });
});
