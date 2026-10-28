import { CARD_IDS } from '@domain/cards/deck';

import type { ArtLibrary } from '@infrastructure/browser/art-library';
import { createArtLibrary } from '@infrastructure/browser/art-library';
import { cardArtUrl } from '@infrastructure/browser/art-urls';
import { runWhenIdle } from '@infrastructure/browser/idle';
import { loadImageBitmap } from '@infrastructure/browser/resource-loading';

export const createCardArtLibrary = (): ArtLibrary<ImageBitmap> =>
  createArtLibrary({
    ids: CARD_IDS,
    load: (cardId) => loadImageBitmap({ url: cardArtUrl(cardId), flipY: false }),
    schedule: runWhenIdle,
  });
