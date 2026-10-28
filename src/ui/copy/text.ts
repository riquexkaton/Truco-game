import type { CardId } from '@domain/cards/card';
import { cardById } from '@domain/cards/deck';
import type { BetKind } from '@domain/pact/bet';
import type { Side } from '@domain/shared/side';

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export const BET_NAMES: Readonly<Record<BetKind, string>> = {
  pacto: 'PACTO',
  repacto: 'RE-PACTO',
  apuesta: 'APUESTA',
};

export const MINUS = '−';

export const num: (value: number) => string = String;

export const roman = (value: number): string => ROMAN[value] ?? num(value);

export const bySide = <T>(side: Side, forPlayer: T, forRival: T): T =>
  side === 'player' ? forPlayer : forRival;

const titleCase = (text: string): string =>
  text.toLowerCase().replaceAll(/(^|\s)\S/g, (initial) => initial.toUpperCase());

export const cardName = (id: CardId): string => titleCase(cardById(id).name);

export const deltaLabel = (delta: number): string =>
  `${delta > 0 ? '+' : MINUS}${num(Math.abs(delta))}`;

export const plural = (count: number, word: string, ending: string): string =>
  `${num(count)} ${word}${count === 1 ? '' : ending}`;
