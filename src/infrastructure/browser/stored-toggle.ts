const ON = 'on';
const OFF = 'off';

interface StoredToggle {
  readonly isEnabled: () => boolean;
  readonly save: (isEnabled: boolean) => void;
}

export const createStoredToggle = (key: string): StoredToggle => ({
  isEnabled: () => {
    try {
      return localStorage.getItem(key) !== OFF;
    } catch {
      return true;
    }
  },
  save: (isEnabled) => {
    try {
      localStorage.setItem(key, isEnabled ? ON : OFF);
    } catch {
      return;
    }
  },
});
