import type { CardId } from '@domain/cards/card';
import type { EffectId } from '@domain/effects/effect';

export type Tone = 'win' | 'lose' | 'tie' | 'ink' | 'rule';

export interface CardFace {
  readonly cardId: CardId;
  readonly name: string;
  readonly attack: string;
}

export interface SheetHeadline {
  readonly look: 'sheet';
  readonly isRival: boolean;
  readonly seal: string;
  readonly effect: EffectId | null;
  readonly tone: Tone;
  readonly title: string;
  readonly body: string;
  readonly result: string;
}

export interface DuelHeadline {
  readonly look: 'duel';
  readonly tag: string;
  readonly tone: Tone;
  readonly title: string;
  readonly body: string;
  readonly result: string;
  readonly player: CardFace;
  readonly rival: CardFace;
}

export type HeadlineCopy = SheetHeadline | DuelHeadline;

export interface MarkCopy {
  readonly title: string;
  readonly detail: string;
  readonly tone: Tone;
}

export type SheetFields = Pick<SheetHeadline, 'seal' | 'tone' | 'title'> &
  Partial<Pick<SheetHeadline, 'isRival' | 'effect' | 'body' | 'result'>>;

export const sheet = (fields: SheetFields): SheetHeadline => ({
  look: 'sheet',
  isRival: false,
  effect: null,
  body: '',
  result: '',
  ...fields,
});

const sentence = (text: string): string => (/[.!?»]$/.test(text) ? text : `${text}.`);

export const spoken = (...parts: readonly string[]): string =>
  parts
    .filter((part) => part !== '')
    .map((part) => sentence(part))
    .join(' ');
