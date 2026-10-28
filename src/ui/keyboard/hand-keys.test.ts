import { signal } from '@preact/signals';
import { describe, expect, it, vi } from 'vitest';

import type { MatchState } from '@domain/match/match-state';

import { handleHandKey } from '@ui/keyboard/hand-keys';

const HAND = ['garin', 'saul', 'ines'];

const targetFor = (isPrompting: boolean) => ({
  store: {
    match: signal({ hands: { player: HAND, rival: [] } } as unknown as MatchState | null),
    prompting: signal(isPrompting),
  },
  commands: { playCard: vi.fn() },
});

describe('the hand keys', () => {
  it.each([
    ['1', 'garin'],
    ['2', 'saul'],
    ['3', 'ines'],
  ])('plays the card under key %s', (key, cardId) => {
    const target = targetFor(false);
    handleHandKey(target, key);
    expect(target.commands.playCard).toHaveBeenCalledWith(cardId);
  });

  it('ignores the keys while a question is open', () => {
    const target = targetFor(true);
    handleHandKey(target, '1');
    expect(target.commands.playCard).not.toHaveBeenCalled();
  });

  it('ignores other keys and empty slots', () => {
    const target = targetFor(false);
    target.store.match.value = { hands: { player: ['teo'], rival: [] } } as unknown as MatchState;
    handleHandKey(target, '4');
    handleHandKey(target, '2');
    expect(target.commands.playCard).not.toHaveBeenCalled();
  });
});
