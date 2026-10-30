import { afterEach, describe, expect, it, vi } from 'vitest';

import { createSfxEngine } from '@infrastructure/browser/sfx-engine';

interface Played {
  readonly buffer: unknown;
  readonly gain: number;
  readonly offset: number | undefined;
}

interface GainNodeFake {
  readonly gain: { value: number };
  readonly connect: (next: unknown) => unknown;
}

const BANK = {
  coin: { src: '/coin.mp3', gain: 0.3, offset: 0 },
  call: { src: '/call.mp3', gain: 0.7, offset: 0.2 },
  broken: { src: '/broken.mp3', gain: 1, offset: 0 },
};

const installAudio = () => {
  const contexts: unknown[] = [];
  const played: Played[] = [];
  class FakeContext {
    state = 'suspended';
    readonly destination = {};
    constructor() {
      contexts.push(this);
    }
    resume() {
      this.state = 'running';
      return Promise.resolve();
    }
    suspend() {
      this.state = 'suspended';
      return Promise.resolve();
    }
    decodeAudioData(data: ArrayBuffer) {
      const text = new TextDecoder().decode(data);
      return text === '/broken.mp3'
        ? Promise.reject(new Error('EncodingError'))
        : Promise.resolve({ text });
    }
    createGain(): GainNodeFake {
      return { gain: { value: 1 }, connect: (next) => next };
    }
    createBufferSource() {
      let volume: GainNodeFake | null = null;
      const source = {
        buffer: null,
        connect: (next: GainNodeFake) => {
          volume = next;
          return next;
        },
        start: (_when?: number, offset?: number) => {
          played.push({ buffer: source.buffer, gain: volume?.gain.value ?? 0, offset });
        },
      };
      return source;
    }
  }
  const fetch = vi.fn((src: string) =>
    Promise.resolve({ arrayBuffer: () => Promise.resolve(new TextEncoder().encode(src).buffer) }),
  );
  vi.stubGlobal('AudioContext', FakeContext);
  vi.stubGlobal('fetch', fetch);
  return { contexts, played, fetch };
};

const settle = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

const awakeEngine = async () => {
  const audio = installAudio();
  const engine = createSfxEngine(BANK);
  await engine.wake();
  await settle();
  return { ...audio, engine };
};

describe('the sound effects engine', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads nothing and stays silent until it is woken', () => {
    const { contexts, played, fetch } = installAudio();
    createSfxEngine(BANK).play('coin');
    expect(contexts).toHaveLength(0);
    expect(fetch).not.toHaveBeenCalled();
    expect(played).toEqual([]);
  });

  it('decodes every sound once and overlaps plays with their own gain and offset', async () => {
    const { contexts, played, fetch, engine } = await awakeEngine();
    await engine.wake();
    engine.play('coin');
    engine.play('coin');
    engine.play('call');
    expect(contexts).toHaveLength(1);
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(played).toEqual([
      { buffer: { text: '/coin.mp3' }, gain: 0.3, offset: 0 },
      { buffer: { text: '/coin.mp3' }, gain: 0.3, offset: 0 },
      { buffer: { text: '/call.mp3' }, gain: 0.7, offset: 0.2 },
    ]);
  });

  it('skips a sound that could not be decoded', async () => {
    const { played, engine } = await awakeEngine();
    expect(() => {
      engine.play('broken');
    }).not.toThrow();
    expect(played).toEqual([]);
  });

  it('stays silent while asleep and plays again once woken', async () => {
    const { played, engine } = await awakeEngine();
    engine.sleep();
    engine.play('coin');
    expect(played).toEqual([]);
    await engine.wake();
    engine.play('coin');
    expect(played).toHaveLength(1);
  });

  it('refuses to wake before the page had a user gesture', async () => {
    const { contexts, fetch } = installAudio();
    vi.stubGlobal('navigator', { userActivation: { hasBeenActive: false } });
    await expect(createSfxEngine(BANK).wake()).rejects.toThrow('NotAllowedError');
    expect(contexts).toHaveLength(0);
    expect(fetch).not.toHaveBeenCalled();
  });
});
