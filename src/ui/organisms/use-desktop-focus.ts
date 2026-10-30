import { useEffect, useRef } from 'preact/hooks';

import { isTallScreen } from '@ui/organisms/hud-slots';

const FOCUS_DELAY_MS = 30;

export const useDesktopFocus = <T extends HTMLElement>(selector: string) => {
  const ref = useRef<T>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isTallScreen()) return;
      ref.current?.querySelector<HTMLElement>(selector)?.focus();
    }, FOCUS_DELAY_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [selector]);
  return ref;
};
