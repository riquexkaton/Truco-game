import type { CardId } from '@domain/cards/card';

import { requireUrl, urlsByStem } from '@infrastructure/browser/asset-catalog';

const cardArt = urlsByStem(
  import.meta.glob<string>('/src/assets/cards/c_*.jpg', {
    eager: true,
    import: 'default',
    query: { format: 'webp', quality: '80' },
  }),
  'c_',
);

export const cardArtUrl = (id: CardId): string => requireUrl(cardArt, id);
