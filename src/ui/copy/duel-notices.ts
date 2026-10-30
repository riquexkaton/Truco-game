import { RITUAL_DAMAGE } from '@domain/ritual/ritual';

import type { DuelCard, GameEventOf } from '@application/ports/game-event';

import { spoken } from '@ui/copy/headline';
import type { NoticeBuilders } from '@ui/copy/notice';
import { announceNotice, bannerCopy, bannerNotice, markNotice } from '@ui/copy/notice';
import { bySide, cardName, num } from '@ui/copy/text';

type DuelNotices = Pick<
  NoticeBuilders,
  'duelResolved' | 'effectEarned' | 'ritualSung' | 'ritualLost' | 'turnTimedOut'
>;

type DuelEvent = GameEventOf<'duelResolved'>;

const fighter = ({ cardId, attack }: DuelCard): string => `${cardName(cardId)} (${num(attack)})`;

const decidedLine = ({ result, player, rival, wins, duel }: DuelEvent): string => {
  const tag = `DUELO ${num(duel + 1)}`;
  return result === 'player'
    ? spoken(
        `${tag} GANADO`,
        `${fighter(player)} vence a ${fighter(rival)}.`,
        `LLEVAS ${num(wins.player)} DE 3`,
      )
    : spoken(
        `${tag} PERDIDO`,
        `${fighter(player)} cae ante ${fighter(rival)}.`,
        `EL RIVAL LLEVA ${num(wins.rival)}`,
      );
};

const duelNotice = (event: DuelEvent) => {
  if (event.result !== 'tie') return announceNotice(decidedLine(event));
  const { player, rival } = event;
  return markNotice({
    title: 'EMPATE',
    detail: `${cardName(player.cardId)} y ${cardName(rival.cardId)} se anulan (${num(player.attack)}).`,
    tone: 'tie',
  });
};

const ritualLine = ({ side, annulsPact }: GameEventOf<'ritualSung'>): string => {
  const damage = num(RITUAL_DAMAGE);
  return annulsPact
    ? bySide(
        side,
        `CANTAS RITUAL Y ANULAS SU PACTO · EL RIVAL RECIBE ${damage}`,
        `EL RIVAL CANTA RITUAL Y ANULA TU PACTO · RECIBES ${damage}`,
      )
    : bySide(
        side,
        `CANTAS RITUAL · EL RIVAL RECIBE ${damage} Y TOMAS UN EFECTO`,
        `EL RIVAL CANTA RITUAL · RECIBES ${damage} Y TOMA UN EFECTO`,
      );
};

export const DUEL_NOTICES: DuelNotices = {
  duelResolved: duelNotice,
  effectEarned: ({ side, cardId }) =>
    markNotice({
      title: 'SELLO',
      detail: `${cardName(cardId)} lleva sello: ${bySide(side, 'ganas un efecto', 'el rival gana un efecto')}.`,
      tone: bySide(side, 'win', 'lose'),
    }),
  ritualSung: (event) => bannerNotice(bannerCopy('RITUAL', ritualLine(event), { duration: 1600 })),
  ritualLost: () =>
    markNotice({ title: 'RITUAL PERDIDO', detail: 'No lo cantaste antes de jugar.', tone: 'rule' }),
  turnTimedOut: ({ cardId }) =>
    markNotice({
      title: 'SE ACABÓ EL TIEMPO',
      detail: `Se jugó ${cardName(cardId)}, tu carta más baja.`,
      tone: 'lose',
    }),
};
