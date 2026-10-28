import { describe, expect, it } from 'vitest';

import type { DuelResult } from '@domain/duel/duel';
import { compareAttacks, isRoundDecided, nextLead, roundWinnerOf, winsOf } from '@domain/duel/duel';
import type { Side } from '@domain/shared/side';

describe('compareAttacks', () => {
  it('lets the higher attack win and ties equal attacks', () => {
    expect(compareAttacks({ player: 9, rival: 4 })).toBe('player');
    expect(compareAttacks({ player: 2, rival: 15 })).toBe('rival');
    expect(compareAttacks({ player: 7, rival: 7 })).toBe('tie');
  });
});

describe('round outcome', () => {
  const decided: readonly (readonly [readonly DuelResult[], Side | null])[] = [
    [['player', 'player'], 'player'],
    [['rival', 'player', 'rival'], 'rival'],
    [['player', 'tie', 'tie'], 'player'],
    [['tie', 'tie', 'rival'], 'rival'],
    [['tie', 'player', 'rival'], null],
    [['tie', 'tie', 'tie'], null],
  ];

  it.each(decided)('ends %j with winner %s', (results, winner) => {
    expect(isRoundDecided(results)).toBe(true);
    expect(roundWinnerOf(results)).toBe(winner);
  });

  it('keeps playing until someone wins twice or three duels are played', () => {
    expect(isRoundDecided(['player', 'rival'])).toBe(false);
    expect(isRoundDecided(['tie', 'player'])).toBe(false);
    expect(isRoundDecided([])).toBe(false);
  });

  it('counts wins per side', () => {
    expect(winsOf(['player', 'tie', 'rival', 'player'])).toEqual({ player: 2, rival: 1 });
  });
});

describe('nextLead', () => {
  it('gives the lead to the duel winner', () => {
    expect(nextLead('rival', 'player')).toBe('rival');
    expect(nextLead('player', 'rival')).toBe('player');
  });

  it('keeps the lead after a tie', () => {
    expect(nextLead('tie', 'rival')).toBe('rival');
  });
});
