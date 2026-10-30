import { afterEach, describe, expect, it, vi } from 'vitest';

import { isMusicPreferred, saveMusicPreference } from '@infrastructure/browser/music-preference';

const installStorage = () => {
  const entries = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => {
      entries.set(key, value);
    },
  });
};

const refuse = () => {
  throw new Error('SecurityError');
};

describe('the music preference', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is on when nothing was saved', () => {
    installStorage();
    expect(isMusicPreferred()).toBe(true);
  });

  it('remembers turning the music off and on again', () => {
    installStorage();
    saveMusicPreference(false);
    expect(isMusicPreferred()).toBe(false);
    saveMusicPreference(true);
    expect(isMusicPreferred()).toBe(true);
  });

  it('falls back to on when the storage is blocked', () => {
    vi.stubGlobal('localStorage', { getItem: refuse, setItem: refuse });
    expect(() => {
      saveMusicPreference(false);
    }).not.toThrow();
    expect(isMusicPreferred()).toBe(true);
  });
});
