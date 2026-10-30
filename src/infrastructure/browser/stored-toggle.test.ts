import { afterEach, describe, expect, it, vi } from 'vitest';

import { createStoredToggle } from '@infrastructure/browser/stored-toggle';

const installStorage = () => {
  const entries = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => {
      entries.set(key, value);
    },
  });
  return entries;
};

const refuse = () => {
  throw new Error('SecurityError');
};

describe('a stored toggle', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is on when nothing was saved', () => {
    installStorage();
    expect(createStoredToggle('mesa:music').isEnabled()).toBe(true);
  });

  it('remembers turning it off and on again under its own key', () => {
    const entries = installStorage();
    const music = createStoredToggle('mesa:music');
    const sfx = createStoredToggle('mesa:sfx');
    music.save(false);
    expect(music.isEnabled()).toBe(false);
    expect(sfx.isEnabled()).toBe(true);
    music.save(true);
    expect(music.isEnabled()).toBe(true);
    expect(entries.get('mesa:music')).toBe('on');
  });

  it('falls back to on when the storage is blocked', () => {
    vi.stubGlobal('localStorage', { getItem: refuse, setItem: refuse });
    const toggle = createStoredToggle('mesa:sfx');
    expect(() => {
      toggle.save(false);
    }).not.toThrow();
    expect(toggle.isEnabled()).toBe(true);
  });
});
