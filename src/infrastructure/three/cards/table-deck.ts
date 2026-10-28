import type { Texture } from 'three';

import type { CardId } from '@domain/cards/card';
import { CARD_IDS, cardById } from '@domain/cards/deck';
import type { FactionId } from '@domain/cards/faction';

import type { CardKit, TableCard } from '@infrastructure/three/cards/table-card';
import { createTableCard } from '@infrastructure/three/cards/table-card';
import { cardFace, faceKey } from '@infrastructure/three/textures/card-face';
import {
  cardFrontTexture,
  effectBackTexture,
  gameBackTexture,
  viraFrontTexture,
} from '@infrastructure/three/textures/card-textures';
import type { TextureKit } from '@infrastructure/three/textures/canvas-texture';

export interface DeckKit extends CardKit, TextureKit {}

export interface CardBacks {
  readonly game: Texture;
  readonly effect: Texture;
}

export interface TableDeck {
  readonly kit: TextureKit;
  readonly cards: ReadonlyMap<CardId, TableCard>;
  readonly viras: Readonly<Record<FactionId, TableCard>>;
  readonly effectCard: TableCard;
  readonly everyCard: readonly TableCard[];
  readonly backs: CardBacks;
  readonly faces: Map<string, Texture>;
}

export interface FaceRequest {
  readonly cardId: CardId;
  readonly vira: FactionId;
  readonly art: ImageBitmap | undefined;
}

const viraCards = (kit: DeckKit, back: Texture): Record<FactionId, TableCard> => {
  const vira = (faction: FactionId) =>
    createTableCard(kit, { back, front: viraFrontTexture(kit, faction) });
  return {
    carnero: vira('carnero'),
    cayado: vira('cayado'),
    velo: vira('velo'),
    lirio: vira('lirio'),
  };
};

export const createTableDeck = (kit: DeckKit): TableDeck => {
  const backs: CardBacks = { game: gameBackTexture(kit), effect: effectBackTexture(kit) };
  const cards = new Map(
    CARD_IDS.map((id): [CardId, TableCard] => [
      id,
      createTableCard(kit, { back: backs.game, front: null }),
    ]),
  );
  const viras = viraCards(kit, backs.game);
  const effectCard = createTableCard(kit, { back: backs.effect, front: backs.effect });
  const everyCard = [...cards.values(), ...Object.values(viras), effectCard];
  return { kit, cards, viras, effectCard, everyCard, backs, faces: new Map() };
};

export const tableCardOf = (deck: TableDeck, cardId: CardId): TableCard => {
  const card = deck.cards.get(cardId);
  if (card === undefined) {
    throw new RangeError(`No table card for ${cardId}`);
  }
  return card;
};

const faceTexture = (deck: TableDeck, request: FaceRequest): Texture => {
  const face = cardFace(cardById(request.cardId), request.vira);
  const key = faceKey(request.cardId, face.isActive);
  const cached = deck.faces.get(key);
  if (cached !== undefined) return cached;
  const texture = cardFrontTexture(deck.kit, { face, art: request.art });
  deck.faces.set(key, texture);
  return texture;
};

export const showCardFace = (deck: TableDeck, request: FaceRequest): void => {
  const { frontMaterial } = tableCardOf(deck, request.cardId);
  frontMaterial.map = faceTexture(deck, request);
  frontMaterial.needsUpdate = true;
};
