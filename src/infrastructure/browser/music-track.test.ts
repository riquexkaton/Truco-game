import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createMusicTrack } from '@infrastructure/browser/music-track';

interface FakeAudio {
  readonly src: string;
  loop: boolean;
  volume: number;
  paused: boolean;
}

const installAudio = (isRefused = false) => {
  const created: FakeAudio[] = [];
  class Audio implements FakeAudio {
    loop = false;
    volume = 1;
    paused = true;
    constructor(readonly src: string) {
      created.push(this);
    }
    play(): Promise<void> {
      if (isRefused) return Promise.reject(new Error('NotAllowedError'));
      this.paused = false;
      return Promise.resolve();
    }
    pause(): void {
      this.paused = true;
    }
  }
  vi.stubGlobal('Audio', Audio);
  return created;
};

const OPTIONS = { src: '/tavern-waltz.mp3', volume: 0.35, fadeMs: 1500 };

describe('the music track', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('does not create the audio until it is played', async () => {
    const created = installAudio();
    const track = createMusicTrack(OPTIONS);
    expect(created).toHaveLength(0);
    await track.play();
    expect(created).toHaveLength(1);
    expect(created[0]).toMatchObject({ src: OPTIONS.src, loop: true, paused: false });
  });

  it('fades in from silence to the target volume', async () => {
    const created = installAudio();
    await createMusicTrack(OPTIONS).play();
    expect(created[0]?.volume).toBe(0);
    vi.advanceTimersByTime(750);
    expect(created[0]?.volume).toBeCloseTo(0.175);
    vi.advanceTimersByTime(750);
    expect(created[0]?.volume).toBeCloseTo(0.35);
    vi.advanceTimersByTime(1000);
    expect(created[0]?.volume).toBeCloseTo(0.35);
  });

  it('pauses and resumes the same looping element', async () => {
    const created = installAudio();
    const track = createMusicTrack(OPTIONS);
    await track.play();
    track.pause();
    expect(created[0]?.paused).toBe(true);
    await track.play();
    expect(created).toHaveLength(1);
    expect(created[0]?.paused).toBe(false);
  });

  it('keeps playing untouched when asked to play again', async () => {
    const created = installAudio();
    const track = createMusicTrack(OPTIONS);
    await track.play();
    vi.advanceTimersByTime(1500);
    await track.play();
    expect(created[0]?.volume).toBeCloseTo(0.35);
  });

  it('ignores a pause before anything was played', () => {
    const created = installAudio();
    createMusicTrack(OPTIONS).pause();
    expect(created).toHaveLength(0);
  });

  it('passes on a refused play', async () => {
    installAudio(true);
    await expect(createMusicTrack(OPTIONS).play()).rejects.toThrow('NotAllowedError');
  });
});
