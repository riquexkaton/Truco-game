import callUrl from '@assets/audio/sfx/call.mp3';
import cardDealUrl from '@assets/audio/sfx/card-deal.mp3';
import cardPlaceUrl from '@assets/audio/sfx/card-place.mp3';
import cardTakeUrl from '@assets/audio/sfx/card-take.mp3';
import cardsCollectUrl from '@assets/audio/sfx/cards-collect.mp3';
import coinUrl from '@assets/audio/sfx/coin.mp3';
import roundUrl from '@assets/audio/sfx/round.mp3';

import { createPageActivity } from '@infrastructure/browser/page-activity';
import type { SoundSpec } from '@infrastructure/browser/sfx-engine';
import { createSfxEngine } from '@infrastructure/browser/sfx-engine';
import { isSfxPreferred, saveSfxPreference } from '@infrastructure/browser/sfx-preference';
import type { TableSound } from '@infrastructure/three/table/table-sounds';

import type { SfxControl } from '@ui/containers/sfx-control';

import { createAudioToggle } from './audio-toggle';
import type { HudSound } from './hud-sounds';

type SoundId = TableSound | HudSound;

export type PlaySound = (sound: SoundId) => void;

interface SoundEffects {
  readonly control: SfxControl;
  readonly play: PlaySound;
}

interface SoundMix {
  readonly measuredLufs: number;
  readonly targetLufs: number;
  readonly leadingSilence?: number;
}

const TARGET_LUFS = { announcement: -21, landing: -23, handling: -24, repeated: -25.5 };

const mixed = (src: string, mix: SoundMix): SoundSpec => ({
  src,
  gain: 10 ** ((mix.targetLufs - mix.measuredLufs) / 20),
  offset: mix.leadingSilence ?? 0,
});

const SOUND_BANK: Readonly<Record<SoundId, SoundSpec>> = {
  call: mixed(callUrl, { measuredLufs: -17.7, targetLufs: TARGET_LUFS.announcement }),
  round: mixed(roundUrl, { measuredLufs: -23.2, targetLufs: TARGET_LUFS.announcement }),
  cardPlaced: mixed(cardPlaceUrl, {
    measuredLufs: -22.9,
    targetLufs: TARGET_LUFS.landing,
    leadingSilence: 0.19,
  }),
  effectTaken: mixed(cardTakeUrl, { measuredLufs: -24, targetLufs: TARGET_LUFS.handling }),
  tableCleared: mixed(cardsCollectUrl, {
    measuredLufs: -26.7,
    targetLufs: TARGET_LUFS.handling,
    leadingSilence: 0.42,
  }),
  cardDealt: mixed(cardDealUrl, { measuredLufs: -23.7, targetLufs: TARGET_LUFS.repeated }),
  coinLanded: mixed(coinUrl, { measuredLufs: -15.2, targetLufs: TARGET_LUFS.repeated }),
};

export const createSoundEffects = (): SoundEffects => {
  const engine = createSfxEngine(SOUND_BANK);
  const control = createAudioToggle({
    output: { play: engine.wake, pause: engine.sleep },
    preference: { isEnabled: isSfxPreferred, save: saveSfxPreference },
    page: createPageActivity(globalThis, document),
  });
  return { control, play: engine.play };
};
