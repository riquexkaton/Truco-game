import { describe, expect, it } from 'vitest';

import { discardEffect, drawEffect, requiresDiscard } from '@domain/match/effect-store';
import { matchFixture } from '@domain/match/match-fixture';
import { scriptedRandom } from '@domain/shared/scripted-random';

const full = matchFixture({
  effects: {
    stored: { player: ['golpe', 'sello'], rival: [] },
    deck: ['maldicion', 'saqueo'],
    discard: [],
  },
});

describe('storing effects', () => {
  it('draws the top effect into the side store', () => {
    const state = drawEffect(full, 'rival', scriptedRandom());
    expect(state.effects.stored.rival).toEqual(['saqueo']);
    expect(state.effects.deck).toEqual(['maldicion']);
  });

  it('asks for a discard when a third effect arrives', () => {
    expect(requiresDiscard(full, 'player')).toBe(false);
    const state = drawEffect(full, 'player', scriptedRandom());
    expect(state.effects.stored.player).toEqual(['golpe', 'sello', 'saqueo']);
    expect(requiresDiscard(state, 'player')).toBe(true);
  });

  it('moves the chosen effect to the discards', () => {
    const state = discardEffect(drawEffect(full, 'player', scriptedRandom()), {
      side: 'player',
      index: 1,
    });
    expect(state.effects.stored.player).toEqual(['golpe', 'saqueo']);
    expect(state.effects.discard).toEqual(['sello']);
  });

  it('reshuffles the discards when the deck is empty', () => {
    const empty = matchFixture({
      effects: { stored: { player: [], rival: [] }, deck: [], discard: ['sanacion', 'golpe'] },
    });
    const state = drawEffect(empty, 'player', scriptedRandom(0.99));
    expect(state.effects.stored.player).toEqual(['golpe']);
    expect(state.effects).toMatchObject({ deck: ['sanacion'], discard: [] });
  });

  it('draws nothing when every effect is already stored', () => {
    const drained = matchFixture();
    expect(drawEffect(drained, 'player', scriptedRandom()).effects).toEqual(drained.effects);
  });

  it('rejects discarding an effect that is not stored', () => {
    expect(() => discardEffect(full, { side: 'rival', index: 0 })).toThrow(RangeError);
  });
});
