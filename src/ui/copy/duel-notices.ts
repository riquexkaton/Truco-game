import type { DuelResult } from '@domain/duel/duel';

import type { GameEventOf } from '@application/ports/game-event';

import type { NoticeBuilders, ToastCopy } from '@ui/copy/notice';
import { bannerCopy, bannerNotice, toastNotice } from '@ui/copy/notice';
import { bySide, cardName, num } from '@ui/copy/text';

type DuelNotices = Pick<
  NoticeBuilders,
  'duelResolved' | 'effectEarned' | 'ritualSung' | 'ritualLost' | 'turnTimedOut'
>;

type DuelEvent = GameEventOf<'duelResolved'>;

interface DuelNames {
  readonly mine: string;
  readonly theirs: string;
  readonly attack: string;
  readonly rivalAttack: string;
}

const DUEL_TOASTS: Readonly<
  Record<DuelResult, (event: DuelEvent, names: DuelNames) => Omit<ToastCopy, 'tag' | 'seal'>>
> = {
  player: ({ wins }, { mine, theirs, attack, rivalAttack }) => ({
    title: 'DUELO GANADO',
    body: `${mine} (${attack}) vence a ${theirs} (${rivalAttack}).`,
    result: `LLEVAS ${num(wins.player)} DE 3`,
    tone: 'win',
  }),
  rival: ({ wins }, { mine, theirs, attack, rivalAttack }) => ({
    title: 'DUELO PERDIDO',
    body: `${mine} (${attack}) cae ante ${theirs} (${rivalAttack}).`,
    result: `EL RIVAL LLEVA ${num(wins.rival)}`,
    tone: 'lose',
  }),
  tie: ({ duel }, { mine, theirs, attack }) => ({
    title: 'EMPATE',
    body: `${mine} y ${theirs} se anulan (${attack}).`,
    result: duel === 0 ? 'DECIDE EL SIGUIENTE DUELO' : 'DECIDE EL PRIMER DUELO',
    tone: 'tie',
  }),
};

const duelNotice = (event: DuelEvent) => {
  const names: DuelNames = {
    mine: cardName(event.player.cardId),
    theirs: cardName(event.rival.cardId),
    attack: num(event.player.attack),
    rivalAttack: num(event.rival.attack),
  };
  return toastNotice({
    ...DUEL_TOASTS[event.result](event, names),
    tag: `DUELO ${num(event.duel + 1)}`,
    seal: names.attack,
  });
};

export const DUEL_NOTICES: DuelNotices = {
  duelResolved: duelNotice,
  effectEarned: ({ side, cardId }) =>
    toastNotice({
      title: 'SELLO',
      tag: 'EFECTO',
      body: `${cardName(cardId)} lleva sello.`,
      result: bySide(side, 'GANAS UN EFECTO', 'EL RIVAL GANA UN EFECTO'),
      tone: bySide(side, 'win', 'lose'),
      seal: '★',
    }),
  ritualSung: ({ side }) =>
    bannerNotice(
      bannerCopy(
        'RITUAL',
        bySide(
          side,
          'CANTAS RITUAL · EL RIVAL RECIBE 3 Y TOMAS UN EFECTO',
          'EL RIVAL CANTA RITUAL · RECIBES 3 Y TOMA UN EFECTO',
        ),
        { duration: 1600 },
      ),
    ),
  ritualLost: () =>
    toastNotice({
      title: 'RITUAL PERDIDO',
      tag: 'RITUAL',
      body: 'No lo cantaste antes de jugar.',
      result: '',
      tone: 'rule',
      seal: '×',
    }),
  turnTimedOut: ({ cardId }) =>
    toastNotice({
      title: 'SE ACABÓ EL TIEMPO',
      tag: '',
      body: `Se jugó ${cardName(cardId)}, tu carta más baja.`,
      result: '',
      tone: 'lose',
      seal: '0',
    }),
};
