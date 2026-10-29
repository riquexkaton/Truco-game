import type { CardId } from '@domain/cards/card';

import { cardArtUrl } from '@ui/art/art-urls';
import type { TitleCardCopy, TitleCardId } from '@ui/copy/menu-copy';
import { TITLE_CARDS } from '@ui/copy/menu-copy';

export interface TitleCard extends TitleCardCopy {
  readonly slot: number;
  readonly art: string;
  readonly isPlayable: boolean;
}

export const PLAY_CARD_ID: CardId = 'morgana';

const TITLE_ART: Readonly<Record<TitleCardId, CardId>> = {
  play: PLAY_CARD_ID,
  rules: 'isolda',
  deck: 'oriana',
  settings: 'saul',
};

export const TITLE_DECK: readonly TitleCard[] = TITLE_CARDS.map((card, slot) => ({
  ...card,
  slot,
  art: cardArtUrl(TITLE_ART[card.id]),
  isPlayable: card.id === 'play',
}));
