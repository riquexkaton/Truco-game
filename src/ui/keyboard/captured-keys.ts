import { useLayoutEffect } from 'preact/hooks';

type Action = () => void;

export type KeyPick = (event: KeyboardEvent) => Action | null;

const isTyping = (target: EventTarget | null): boolean =>
  target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

const isPlainKey = (event: KeyboardEvent): boolean =>
  !event.ctrlKey && !event.metaKey && !event.altKey && !isTyping(event.target);

export const answerIndexFor = (event: KeyboardEvent): number =>
  isPlainKey(event) && /^[1-9]$/.test(event.key) ? Number(event.key) - 1 : -1;

export const isContinueKey = (event: KeyboardEvent): boolean =>
  isPlainKey(event) && (event.key === ' ' || event.key === 'Enter');

export const useCapturedKey = (pick: KeyPick): void => {
  useLayoutEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const action = pick(event);
      if (action === null) return;
      event.preventDefault();
      event.stopPropagation();
      action();
    };
    globalThis.addEventListener('keydown', onKey, { capture: true });
    return () => {
      globalThis.removeEventListener('keydown', onKey, { capture: true });
    };
  }, [pick]);
};
