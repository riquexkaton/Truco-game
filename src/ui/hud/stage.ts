export type Stage = (show: () => Promise<void>) => Promise<void>;

const after = async (previous: Promise<void>, show: () => Promise<void>): Promise<void> => {
  await previous;
  await show();
};

export const createStage = (): Stage => {
  let queue = Promise.resolve();
  return (show) => {
    queue = after(queue, show);
    return queue;
  };
};
