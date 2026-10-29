import { useEffect, useState } from 'preact/hooks';

interface Fullscreen {
  readonly isAvailable: boolean;
  readonly isActive: boolean;
  readonly toggle: () => void;
}

const isFullscreen = (): boolean => document.fullscreenElement !== null;

const ignoreRefusal = (): null => null;

export const useFullscreen = (): Fullscreen => {
  const [isActive, setActive] = useState(isFullscreen);
  useEffect(() => {
    const sync = () => {
      setActive(isFullscreen());
    };
    document.addEventListener('fullscreenchange', sync);
    return () => {
      document.removeEventListener('fullscreenchange', sync);
    };
  }, []);
  const toggle = () => {
    const request = isFullscreen()
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();
    void request.catch(ignoreRefusal);
  };
  return { isAvailable: document.fullscreenEnabled, isActive, toggle };
};
