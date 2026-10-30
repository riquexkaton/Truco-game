import { hasSeal } from '@domain/cards/attack';
import type { CardId } from '@domain/cards/card';
import { cardById } from '@domain/cards/deck';
import { FACTIONS } from '@domain/cards/faction';
import type { DuelResult } from '@domain/duel/duel';
import type { MatchState } from '@domain/match/match-state';
import { playedAttack } from '@domain/match/queries';
import type { Side } from '@domain/shared/side';

import { bySide, num } from '@ui/copy/text';
import type { CloseUpView } from '@ui/hud/table-watch';

export interface CloseUpCard {
  readonly side: Side;
  readonly cardId: CardId;
  readonly owner: string;
  readonly name: string;
  readonly faction: string;
  readonly attack: string;
  readonly isSealed: boolean;
}

export type ResultTone = 'win' | 'lose' | 'tie';

export interface CloseUpResult {
  readonly text: string;
  readonly tone: ResultTone;
}

export interface CloseUpModel {
  readonly duel: string;
  readonly label: string;
  readonly picked: Side;
  readonly shown: Side;
  readonly cards: readonly CloseUpCard[];
  readonly result: CloseUpResult | null;
}

export const CLOSE_UP_COPY = {
  close: 'Cerrar',
  versus: 'VS',
  seal: 'CON SELLO',
  sealRule: 'Si ganas el duelo con esta carta, tomas un efecto.',
  touch: 'TOCA FUERA PARA CERRAR',
  click: 'CLIC FUERA O',
  key: 'ESC',
  after: 'PARA CERRAR',
};

const RESULTS: Readonly<Record<DuelResult, CloseUpResult>> = {
  player: { text: 'GANAS', tone: 'win' },
  rival: { text: 'PIERDES', tone: 'lose' },
  tie: { text: 'EMPATE', tone: 'tie' },
};

const DUEL_SIDES: readonly Side[] = ['rival', 'player'];

const cardOnTable = (state: MatchState, side: Side, duel: number): CloseUpCard[] => {
  const played = state.played[side][duel];
  if (played === undefined) return [];
  const card = cardById(played.cardId);
  return [
    {
      side,
      cardId: played.cardId,
      owner: bySide(side, 'TÚ', 'RIVAL'),
      name: card.name,
      faction: FACTIONS[card.faction].name,
      attack: num(playedAttack(state, played)),
      isSealed: hasSeal(card, state.vira),
    },
  ];
};

export const closeUpTab = (card: CloseUpCard): string => `${card.owner} · ${card.attack}`;

export const closeUpModel = (
  state: MatchState | null,
  view: CloseUpView | null,
): CloseUpModel | null => {
  if (state === null || view === null || state.over) return null;
  const { pick } = view;
  const cards = DUEL_SIDES.flatMap((side) => cardOnTable(state, side, pick.duel));
  if (cards.every((card) => card.cardId !== pick.cardId)) return null;
  const outcome = state.results[pick.duel];
  return {
    duel: `DUELO ${num(pick.duel + 1)}`,
    label: `Duelo ${num(pick.duel + 1)} de cerca`,
    picked: pick.side,
    shown: cards.some((card) => card.side === view.shown) ? view.shown : pick.side,
    cards,
    result: outcome === undefined ? null : RESULTS[outcome],
  };
};
