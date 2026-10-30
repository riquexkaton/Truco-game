export interface SoundSpec {
  readonly src: string;
  readonly gain: number;
}

type SoundBank<Id extends string> = Readonly<Record<Id, SoundSpec>>;

interface SfxEngine<Id extends string> {
  readonly wake: () => Promise<void>;
  readonly sleep: () => void;
  readonly play: (id: Id) => void;
}

interface EngineState<Id extends string> {
  context: AudioContext | null;
  isAwake: boolean;
  readonly buffers: Map<Id, AudioBuffer>;
}

const hasUserActivation = (): boolean =>
  !('userActivation' in navigator) || navigator.userActivation.hasBeenActive;

const decode = async (context: AudioContext, src: string): Promise<AudioBuffer | null> => {
  try {
    const response = await fetch(src);
    return await context.decodeAudioData(await response.arrayBuffer());
  } catch {
    return null;
  }
};

const loadBank = <Id extends string>(state: EngineState<Id>, bank: SoundBank<Id>): void => {
  const { context } = state;
  if (context === null) return;
  for (const id of Object.keys(bank) as Id[]) {
    void decode(context, bank[id].src).then((buffer) => {
      if (buffer !== null) state.buffers.set(id, buffer);
    });
  }
};

const startSound = (context: AudioContext, buffer: AudioBuffer, gain: number): void => {
  const source = context.createBufferSource();
  const volume = context.createGain();
  source.buffer = buffer;
  volume.gain.value = gain;
  source.connect(volume).connect(context.destination);
  source.start();
};

const suspend = async (context: AudioContext | null): Promise<void> => {
  try {
    await context?.suspend();
  } catch {
    return;
  }
};

const wakeEngine = async <Id extends string>(
  state: EngineState<Id>,
  bank: SoundBank<Id>,
): Promise<void> => {
  if (!hasUserActivation()) throw new Error('NotAllowedError');
  if (state.context === null) {
    state.context = new AudioContext();
    loadBank(state, bank);
  }
  state.isAwake = true;
  await state.context.resume();
};

export const createSfxEngine = <Id extends string>(bank: SoundBank<Id>): SfxEngine<Id> => {
  const state: EngineState<Id> = { context: null, isAwake: false, buffers: new Map() };
  return {
    wake: () => wakeEngine(state, bank),
    sleep: () => {
      state.isAwake = false;
      void suspend(state.context);
    },
    play: (id) => {
      const { context } = state;
      const buffer = state.buffers.get(id);
      if (buffer === undefined || !state.isAwake || context?.state !== 'running') return;
      startSound(context, buffer, bank[id].gain);
    },
  };
};
