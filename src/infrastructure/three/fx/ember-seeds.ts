import { lerp } from '@infrastructure/three/cards/tween-math';

export interface EmberSeeds {
  readonly positions: Float32Array;
  readonly motions: Float32Array;
}

interface Ember {
  readonly position: readonly number[];
  readonly motion: readonly number[];
}

export const EMBER_COUNT = 20;

const EMBER_TIMING = { stagger: 1.3, life: 1.1, lifeSpread: 0.4 } as const;

const SPAWN = { halfWidth: 0.26, near: -0.08, far: -0.4 };
const DRIFT = 0.05;

const emberAt = (index: number, random: () => number): Ember => ({
  position: [
    lerp(-SPAWN.halfWidth, SPAWN.halfWidth, random()),
    0,
    lerp(SPAWN.near, SPAWN.far, random()),
  ],
  motion: [
    ((index + random()) / EMBER_COUNT) * EMBER_TIMING.stagger,
    EMBER_TIMING.life + random() * EMBER_TIMING.lifeSpread,
    (random() * 2 - 1) * DRIFT,
    random() * Math.PI * 2,
  ],
});

export const emberSeeds = (random: () => number): EmberSeeds => {
  const embers = Array.from({ length: EMBER_COUNT }, (_, index) => emberAt(index, random));
  return {
    positions: new Float32Array(embers.flatMap(({ position }) => position)),
    motions: new Float32Array(embers.flatMap(({ motion }) => motion)),
  };
};
