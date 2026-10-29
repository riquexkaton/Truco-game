export type ProgressListener = (fraction: number) => void;

export interface LoadProgress {
  readonly step: () => void;
  readonly track: <T>(work: Promise<T>) => Promise<T>;
}

export const createLoadProgress = (total: number, listener: ProgressListener): LoadProgress => {
  let done = 0;
  const step = (): void => {
    done = Math.min(total, done + 1);
    listener(done / total);
  };
  const track = async <T>(work: Promise<T>): Promise<T> => {
    try {
      return await work;
    } finally {
      step();
    }
  };
  return { step, track };
};

export const progressAfter =
  (start: number, listener: ProgressListener): ProgressListener =>
  (fraction) => {
    listener(start + (1 - start) * fraction);
  };
