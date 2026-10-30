import { describe, expect, it } from 'vitest';

import { duelLooks } from '@infrastructure/three/cards/duel-look';
import { EMBER_COUNT, emberSeeds } from '@infrastructure/three/fx/ember-seeds';
import {
  duelFx,
  FX_SECONDS,
  fxProgress,
  isFxOver,
  SMOKE_TIMING,
} from '@infrastructure/three/fx/fx-plan';

const emberEnds = (random: () => number): number[] => {
  const { motions } = emberSeeds(random);
  return Array.from({ length: EMBER_COUNT }, (_, index) => {
    const [delay = 0, life = 0] = motions.subarray(index * 4, index * 4 + 2);
    return delay + life;
  });
};

describe('smoke and embers after a duel', () => {
  it('raises smoke from the loser and embers from the winner', () => {
    expect(duelFx(duelLooks('player'), false)).toEqual({ player: 'embers', rival: 'smoke' });
    expect(duelFx(duelLooks('rival'), false)).toEqual({ player: 'smoke', rival: 'embers' });
  });

  it('gives a tie neither smoke nor embers', () => {
    expect(duelFx(duelLooks('tie'), false)).toEqual({ player: null, rival: null });
  });

  it('plays nothing under reduced motion', () => {
    expect(duelFx(duelLooks('player'), true)).toEqual({ player: null, rival: null });
    expect(duelFx(duelLooks('rival'), true)).toEqual({ player: null, rival: null });
  });

  it('runs for 2.8 s from the resolution and then stops', () => {
    expect(FX_SECONDS).toBeCloseTo(2.8);
    expect(fxProgress(0)).toBe(0);
    expect(fxProgress(1.4)).toBeCloseTo(0.5);
    expect(fxProgress(-1)).toBe(0);
    expect(isFxOver(2.7)).toBe(false);
    expect(isFxOver(FX_SECONDS)).toBe(true);
    expect(isFxOver(9)).toBe(true);
  });

  it('fades the smoke in fast and out slowly, before the effect ends', () => {
    const fadeOut = FX_SECONDS - SMOKE_TIMING.fadeOutFrom;
    expect(SMOKE_TIMING.fadeIn).toBeLessThan(fadeOut / 4);
    expect(SMOKE_TIMING.emitFor).toBeLessThan(FX_SECONDS);
  });

  it('staggers a burst of embers that all burn out within the effect', () => {
    expect(EMBER_COUNT).toBeGreaterThanOrEqual(16);
    expect(EMBER_COUNT).toBeLessThanOrEqual(24);
    for (const random of [() => 0, () => 0.5, () => 0.999]) {
      for (const end of emberEnds(random)) {
        expect(end).toBeLessThanOrEqual(FX_SECONDS);
      }
    }
    const [first = 0, ...rest] = emberEnds(() => 0.5);
    expect(Math.max(...rest)).toBeGreaterThan(first + 1);
  });
});
