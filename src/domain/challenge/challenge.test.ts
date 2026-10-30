import { describe, expect, it } from 'vitest';

import {
  acceptedChallenge,
  canRaise,
  declineDamage,
  foldDamage,
  nextLevel,
  NO_CHALLENGE,
  STAKES,
} from '@domain/challenge/challenge';

describe('challenge levels', () => {
  it('makes the round worth 2, 4 and 6', () => {
    expect([STAKES[0], STAKES[1], STAKES[2]]).toEqual([2, 4, 6]);
  });

  it('lets anyone raise an unchallenged round', () => {
    expect(canRaise(NO_CHALLENGE, 'player')).toBe(true);
    expect(canRaise(NO_CHALLENGE, 'rival')).toBe(true);
  });

  it('lets only the holder raise a Desafío into a Contra', () => {
    const challenge = acceptedChallenge(NO_CHALLENGE, 'rival');
    expect(challenge).toEqual({ level: 1, holder: 'rival' });
    expect(canRaise(challenge, 'rival')).toBe(true);
    expect(canRaise(challenge, 'player')).toBe(false);
  });

  it('stops at the Contra and leaves nobody holding the word', () => {
    const contra = acceptedChallenge({ level: 1, holder: 'player' }, 'rival');
    expect(contra).toEqual({ level: 2, holder: null });
    expect(canRaise(contra, 'player')).toBe(false);
    expect(canRaise(contra, 'rival')).toBe(false);
    expect(nextLevel(contra)).toBe(2);
  });

  it('charges 1 for declining a Desafío and 4 for declining a Contra', () => {
    expect(declineDamage(1)).toBe(1);
    expect(declineDamage(2)).toBe(4);
  });

  it('charges 1 for folding an unchallenged round and what it is worth otherwise', () => {
    expect(foldDamage(NO_CHALLENGE)).toBe(1);
    expect(foldDamage({ level: 1, holder: 'rival' })).toBe(4);
    expect(foldDamage({ level: 2, holder: null })).toBe(6);
  });
});
