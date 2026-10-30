interface TrackOptions {
  readonly src: string;
  readonly volume: number;
  readonly fadeMs: number;
}

interface MusicTrack {
  readonly play: () => Promise<void>;
  readonly pause: () => void;
}

type StopFade = () => void;

const FADE_STEP_MS = 50;

const createLoopingAudio = (src: string): HTMLAudioElement => {
  const audio = new Audio(src);
  audio.loop = true;
  return audio;
};

const fadeIn = (audio: HTMLAudioElement, { volume, fadeMs }: TrackOptions): StopFade => {
  const steps = Math.max(1, Math.round(fadeMs / FADE_STEP_MS));
  let step = 0;
  const timer = setInterval(() => {
    step += 1;
    audio.volume = (volume * step) / steps;
    if (step >= steps) clearInterval(timer);
  }, FADE_STEP_MS);
  return () => {
    clearInterval(timer);
  };
};

export const createMusicTrack = (options: TrackOptions): MusicTrack => {
  let audio: HTMLAudioElement | null = null;
  let stopFade: StopFade | null = null;
  return {
    play: async () => {
      const element = (audio ??= createLoopingAudio(options.src));
      if (!element.paused) return;
      stopFade?.();
      element.volume = 0;
      await element.play();
      stopFade = fadeIn(element, options);
    },
    pause: () => {
      stopFade?.();
      audio?.pause();
    },
  };
};
