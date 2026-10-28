import { useEffect } from 'preact/hooks';

import type { HandKeyTarget } from '@ui/keyboard/hand-keys';
import { handleHandKey } from '@ui/keyboard/hand-keys';

export const useHandKeys = (target: HandKeyTarget): void => {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      handleHandKey(target, event.key);
    };
    globalThis.addEventListener('keydown', onKey);
    return () => {
      globalThis.removeEventListener('keydown', onKey);
    };
  }, [target]);
};
