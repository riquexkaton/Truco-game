import type { Side } from '@domain/shared/side';

export interface Random {
  next(): number;
}

export const itemAt = <T>(items: readonly T[], index: number): T => {
  const item = items[index];
  if (item === undefined) {
    throw new RangeError(`No item at index ${String(index)}`);
  }
  return item;
};

export const pickIndex = (random: Random, length: number): number =>
  Math.floor(random.next() * length);

export const pickOne = <T>(random: Random, items: readonly T[]): T =>
  itemAt(items, pickIndex(random, items.length));

export const willHappen = (random: Random, probability: number): boolean =>
  random.next() < probability;

export const randomSide = (random: Random): Side => (willHappen(random, 0.5) ? 'player' : 'rival');

const swap = <T>(items: readonly T[], first: number, second: number): T[] => {
  const atFirst = itemAt(items, first);
  const atSecond = itemAt(items, second);
  return items.map((item, index) => {
    if (index === first) return atSecond;
    if (index === second) return atFirst;
    return item;
  });
};

export const shuffle = <T>(random: Random, items: readonly T[]): T[] => {
  let result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    result = swap(result, index, pickIndex(random, index + 1));
  }
  return result;
};
