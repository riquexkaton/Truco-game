import type { FactionId } from '@domain/cards/faction';

export type CardId = string;

export type WildcardKind = 'perico' | 'perica';

interface Wildcard {
  readonly kind: WildcardKind;
  readonly activeAttack: number;
}

export interface Card {
  readonly id: CardId;
  readonly name: string;
  readonly faction: FactionId;
  readonly attack: number;
  readonly legendary: boolean;
  readonly wildcard: Wildcard | null;
}
