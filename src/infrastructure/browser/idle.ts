export type IdleTask = () => void;

const FALLBACK_DELAY_MS = 200;

export const runWhenIdle = (task: IdleTask): void => {
  if ('requestIdleCallback' in globalThis) {
    globalThis.requestIdleCallback(() => {
      task();
    });
    return;
  }
  setTimeout(task, FALLBACK_DELAY_MS);
};
