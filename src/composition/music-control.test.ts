import { describe, expect, it, vi } from 'vitest';

import { createMusicControl } from './music-control';

const createFakePage = () => {
  type Listener = () => void;
  type VisibilityListener = (isVisible: boolean) => void;
  let gestureListeners: Listener[] = [];
  let visibilityListener: VisibilityListener | null = null;
  return {
    onFirstGesture: (listener: Listener) => {
      gestureListeners.push(listener);
    },
    onVisibilityChange: (listener: VisibilityListener) => {
      visibilityListener = listener;
    },
    gesture: () => {
      const pending = gestureListeners;
      gestureListeners = [];
      for (const listener of pending) listener();
    },
    show: (isVisible: boolean) => {
      visibilityListener?.(isVisible);
    },
  };
};

const settle = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

const setup = (isStoredOn = true) => {
  const page = createFakePage();
  const track = { play: vi.fn(() => Promise.resolve()), pause: vi.fn() };
  const saved: boolean[] = [];
  const preference = {
    isEnabled: () => isStoredOn,
    save: (isEnabled: boolean) => {
      saved.push(isEnabled);
    },
  };
  const music = createMusicControl({ track, preference, page });
  return { page, track, saved, music };
};

describe('the background music', () => {
  it('stays silent until the first gesture, then starts', () => {
    const { page, track, music } = setup();
    expect(music.isEnabled.value).toBe(true);
    expect(track.play).not.toHaveBeenCalled();
    page.gesture();
    expect(track.play).toHaveBeenCalledOnce();
  });

  it('never plays when the saved choice is off', () => {
    const { page, track, music } = setup(false);
    page.gesture();
    expect(music.isEnabled.value).toBe(false);
    expect(track.play).not.toHaveBeenCalled();
  });

  it('pauses and remembers when turned off, and resumes when turned on', () => {
    const { page, track, saved, music } = setup();
    page.gesture();
    music.toggle();
    expect(music.isEnabled.value).toBe(false);
    expect(track.pause).toHaveBeenCalledOnce();
    music.toggle();
    expect(music.isEnabled.value).toBe(true);
    expect(track.play).toHaveBeenCalledTimes(2);
    expect(saved).toEqual([false, true]);
  });

  it('starts when turned on after a gesture made while it was off', () => {
    const { page, track, music } = setup(false);
    page.gesture();
    music.toggle();
    expect(track.play).toHaveBeenCalledOnce();
  });

  it('pauses while the page is hidden and resumes when it is visible again', () => {
    const { page, track } = setup();
    page.gesture();
    page.show(false);
    expect(track.pause).toHaveBeenCalledOnce();
    page.show(true);
    expect(track.play).toHaveBeenCalledTimes(2);
  });

  it('does not resume on a visible page before any gesture', () => {
    const { page, track } = setup();
    page.show(true);
    expect(track.play).not.toHaveBeenCalled();
  });

  it('does not resume on a visible page while it is off', () => {
    const { page, track, music } = setup();
    page.gesture();
    music.toggle();
    page.show(true);
    expect(track.play).toHaveBeenCalledOnce();
  });

  it('stays silent after a refused play and tries again on the next gesture', async () => {
    const { page, track } = setup();
    track.play.mockRejectedValueOnce(new Error('NotAllowedError'));
    page.gesture();
    await settle();
    page.show(true);
    expect(track.play).toHaveBeenCalledOnce();
    page.gesture();
    expect(track.play).toHaveBeenCalledTimes(2);
  });
});
