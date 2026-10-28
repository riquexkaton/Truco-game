import { describe, expect, it } from 'vitest';

import { applyLifeChange, fullLives, isDefeated, MAX_LIFE, survivorOf } from '@domain/life/life';

describe('applyLifeChange', () => {
  it('starts both champions at 20', () => {
    expect(fullLives()).toEqual({ player: MAX_LIFE, rival: MAX_LIFE });
  });

  it('applies damage and reports the real change', () => {
    expect(applyLifeChange(fullLives(), { side: 'rival', amount: -3 })).toEqual({
      lives: { player: 20, rival: 17 },
      change: -3,
    });
  });

  it('never lifts life above 20', () => {
    const result = applyLifeChange({ player: 19, rival: 8 }, { side: 'player', amount: 2 });
    expect(result).toEqual({ lives: { player: 20, rival: 8 }, change: 1 });
  });

  it('never drops life below 0', () => {
    const result = applyLifeChange({ player: 3, rival: 8 }, { side: 'player', amount: -6 });
    expect(result).toEqual({ lives: { player: 0, rival: 8 }, change: -3 });
  });
});

describe('defeat', () => {
  it('detects a champion at 0', () => {
    expect(isDefeated({ player: 0, rival: 5 })).toBe(true);
    expect(isDefeated({ player: 1, rival: 5 })).toBe(false);
  });

  it('names the surviving champion', () => {
    expect(survivorOf({ player: 4, rival: 0 })).toBe('player');
    expect(survivorOf({ player: 0, rival: 2 })).toBe('rival');
    expect(survivorOf({ player: 4, rival: 2 })).toBeNull();
  });
});
