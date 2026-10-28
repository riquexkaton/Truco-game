import type { Random } from '@domain/shared/random';

export interface ScriptedRandom extends Random {
  readonly consumed: () => number;
}

export const scriptedRandom = (...values: number[]): ScriptedRandom => {
  let cursor = 0;
  return {
    next: () => {
      const value = values[Math.min(cursor, values.length - 1)] ?? 0;
      cursor += 1;
      return value;
    },
    consumed: () => cursor,
  };
};
