import type { MusicControl } from '@ui/containers/music-control';

import type { AudioOutput, AudioToggleDependencies } from './audio-toggle';
import { createAudioToggle } from './audio-toggle';

interface MusicDependencies extends Omit<AudioToggleDependencies, 'output'> {
  readonly track: AudioOutput;
}

export const createMusicControl = ({ track, ...rest }: MusicDependencies): MusicControl =>
  createAudioToggle({ output: track, ...rest });
