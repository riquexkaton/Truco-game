import type { Random } from '@application/ports/random';

export const createBrowserRandom = (): Random => ({
  next: () => Math.random(),
});
