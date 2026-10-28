import { itemAt } from '@domain/shared/random';

export interface Deferred<T> {
  readonly promise: Promise<T>;
  readonly resolve: (value: T) => void;
}

export const deferred = <T>(): Deferred<T> => {
  const settlers: ((value: T) => void)[] = [];
  const promise = new Promise<T>((resolve) => {
    settlers.push(resolve);
  });
  return { promise, resolve: itemAt(settlers, 0) };
};
