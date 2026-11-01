import { describe, expect, it } from 'vitest';

import { duelLooks } from '@infrastructure/three/cards/duel-look';
import {
  duelFx,
  FX_FADE_OUT,
  isFxOver,
  SMOKE_TIMING,
  STILL_BURNING,
} from '@infrastructure/three/fx/fx-plan';

describe('smoke and vines after a duel', () => {
  it('raises smoke from the loser and grows vines under the winner', () => {
    expect(duelFx(duelLooks('player'), false)).toEqual({ player: 'vines', rival: 'smoke' });
    expect(duelFx(duelLooks('rival'), false)).toEqual({ player: 'smoke', rival: 'vines' });
  });

  it('gives a tie neither smoke nor vines', () => {
    expect(duelFx(duelLooks('tie'), false)).toEqual({ player: null, rival: null });
    expect(duelFx(duelLooks('tie'), true)).toEqual({ player: null, rival: null });
  });

  it('keeps the still vines under reduced motion but drops the moving smoke', () => {
    expect(duelFx(duelLooks('player'), true)).toEqual({ player: 'vines', rival: null });
    expect(duelFx(duelLooks('rival'), true)).toEqual({ player: null, rival: 'vines' });
  });

  it('keeps both effects for as long as the cards stay on the table', () => {
    for (const clock of [0, 2.8, 30, 600]) {
      expect(isFxOver(STILL_BURNING, clock)).toBe(false);
    }
  });

  it('lets both effects fade away softly once the table is cleared', () => {
    const snuffedAt = 42;
    expect(isFxOver(snuffedAt, snuffedAt)).toBe(false);
    expect(isFxOver(snuffedAt, snuffedAt + FX_FADE_OUT * 0.9)).toBe(false);
    expect(isFxOver(snuffedAt, snuffedAt + FX_FADE_OUT * 1.01)).toBe(true);
    expect(SMOKE_TIMING.fadeOut).toBe(FX_FADE_OUT);
    expect(FX_FADE_OUT).toBeGreaterThanOrEqual(1);
    expect(FX_FADE_OUT).toBeLessThanOrEqual(2);
  });

  it('fades the smoke in softly while the column climbs off the card', () => {
    expect(SMOKE_TIMING.fadeIn).toBeGreaterThanOrEqual(0.3);
    expect(SMOKE_TIMING.fadeIn).toBeLessThan(SMOKE_TIMING.fadeOut);
    expect(1 / SMOKE_TIMING.rise).toBeGreaterThan(1);
    expect(1 / SMOKE_TIMING.rise).toBeLessThan(3);
  });
});
