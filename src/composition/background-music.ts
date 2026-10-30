import tavernWaltzUrl from '@assets/audio/tavern-waltz.mp3';

import { isMusicPreferred, saveMusicPreference } from '@infrastructure/browser/music-preference';
import { createMusicTrack } from '@infrastructure/browser/music-track';
import { createPageActivity } from '@infrastructure/browser/page-activity';

import type { MusicControl } from '@ui/containers/music-control';

import { createMusicControl } from './music-control';

const MUSIC_VOLUME = 0.35;
const FADE_IN_MS = 1500;

export const createBackgroundMusic = (): MusicControl =>
  createMusicControl({
    track: createMusicTrack({ src: tavernWaltzUrl, volume: MUSIC_VOLUME, fadeMs: FADE_IN_MS }),
    preference: { isEnabled: isMusicPreferred, save: saveMusicPreference },
    page: createPageActivity(globalThis, document),
  });
