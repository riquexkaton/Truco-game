import { describe, expect, it } from 'vitest';

import { placeCard } from '@domain/match/duel-play';
import { activateEffect, plunder } from '@domain/match/effect-use';
import { canUseEffect } from '@domain/match/gates';
import { handsOf, matchFixture } from '@domain/match/match-fixture';
import { matchWinner, playedAttack, slotOf } from '@domain/match/queries';
import { scriptedRandom } from '@domain/shared/scripted-random';

const armed = matchFixture({
  effects: {
    stored: {
      player: ['golpe', 'sanacion', 'maldicion', 'sello', 'saqueo'],
      rival: ['golpe', 'sello'],
    },
    deck: [],
    discard: [],
  },
});

describe('golpe and sanacion', () => {
  it('golpe deals 2 to the opponent and goes to the discards', () => {
    const { state, annulled } = activateEffect(armed, { side: 'player', effect: 'golpe' });
    expect(annulled).toBe(false);
    expect(state.lives).toEqual({ player: 20, rival: 18 });
    expect(state.effects.stored.player).not.toContain('golpe');
    expect(state.effects.discard).toEqual(['golpe']);
    expect(state.usedEffectThisTurn).toBe(true);
  });

  it('golpe ends the match at once when it is lethal', () => {
    const dying = { ...armed, lives: { player: 20, rival: 2 } };
    const { state } = activateEffect(dying, { side: 'player', effect: 'golpe' });
    expect(state.over).toBe(true);
    expect(matchWinner(state)).toBe('player');
  });

  it('sanacion heals 2 but never above 20', () => {
    const hurt = { ...armed, lives: { player: 15, rival: 20 } };
    expect(activateEffect(hurt, { side: 'player', effect: 'sanacion' }).state.lives.player).toBe(
      17,
    );
    const scratched = { ...armed, lives: { player: 19, rival: 20 } };
    expect(
      activateEffect(scratched, { side: 'player', effect: 'sanacion' }).state.lives.player,
    ).toBe(20);
  });
});

describe('maldicion', () => {
  it('weakens the next opponent card by 4, never below 0', () => {
    const { state } = activateEffect(armed, { side: 'player', effect: 'maldicion' });
    expect(state.curse).toEqual({ player: false, rival: true });
    const placed = placeCard(state, { side: 'rival', cardId: 'ada' });
    const slot = slotOf(placed, 'rival');
    expect(slot?.cursed).toBe(true);
    expect(slot === null ? -1 : playedAttack(placed, slot)).toBe(0);
  });
});

describe('sello', () => {
  const sealed = activateEffect(armed, { side: 'player', effect: 'sello' }).state;

  it('annuls the next opponent effect and is spent', () => {
    expect(sealed.seal).toEqual({ player: false, rival: true });
    const { state, annulled } = activateEffect(sealed, { side: 'rival', effect: 'golpe' });
    expect(annulled).toBe(true);
    expect(state.lives.player).toBe(20);
    expect(state.seal.rival).toBe(false);
    expect(state.effects.discard).toEqual(['sello', 'golpe']);
  });

  it('cannot annul a sello, and stays in place', () => {
    const { state, annulled } = activateEffect(sealed, { side: 'rival', effect: 'sello' });
    expect(annulled).toBe(false);
    expect(state.seal).toEqual({ player: true, rival: true });
  });
});

describe('canUseEffect', () => {
  it('allows one stored effect per turn before placing a card', () => {
    expect(canUseEffect(armed, { side: 'player', effect: 'golpe' })).toBe(true);
    expect(canUseEffect(armed, { side: 'rival', effect: 'maldicion' })).toBe(false);
    const used = activateEffect(armed, { side: 'player', effect: 'golpe' }).state;
    expect(canUseEffect(used, { side: 'player', effect: 'sello' })).toBe(false);
    const placed = placeCard(armed, { side: 'player', cardId: 'saul' });
    expect(canUseEffect(placed, { side: 'player', effect: 'golpe' })).toBe(false);
  });

  it('allows saqueo only while both hands hold cards', () => {
    expect(canUseEffect(armed, { side: 'player', effect: 'saqueo' })).toBe(true);
    const empty = { ...armed, hands: handsOf(['saul'], []) };
    expect(canUseEffect(empty, { side: 'player', effect: 'saqueo' })).toBe(false);
  });
});

describe('saqueo', () => {
  it('swaps a random opponent card for the chosen one, keeping hand sizes', () => {
    const state = plunder(armed, { side: 'player', give: 'irene' }, scriptedRandom(0.5));
    expect(state.hands).toEqual({
      player: ['baltasar', 'saul', 'ferran'],
      rival: ['oriana', 'irene', 'ada'],
    });
  });

  it('only runs after the effect was not annulled', () => {
    const { annulled } = activateEffect(armed, { side: 'player', effect: 'saqueo' });
    expect(annulled).toBe(false);
  });

  it('does nothing when a hand is empty and rejects cards outside the hand', () => {
    const empty = { ...armed, hands: handsOf(['saul'], []) };
    expect(plunder(empty, { side: 'player', give: 'saul' }, scriptedRandom())).toBe(empty);
    expect(() => plunder(armed, { side: 'player', give: 'ada' }, scriptedRandom())).toThrow();
  });
});
