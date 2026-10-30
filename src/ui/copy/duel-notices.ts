import type { DuelResult } from '@domain/duel/duel';

import type { DuelCard, GameEventOf } from '@application/ports/game-event';

import type { CardFace, DuelHeadline } from '@ui/copy/headline';
import type { NoticeBuilders } from '@ui/copy/notice';
import { bannerCopy, bannerNotice, headlineNotice, markNotice } from '@ui/copy/notice';
import { bySide, cardName, num } from '@ui/copy/text';

type DuelNotices = Pick<
  NoticeBuilders,
  'duelResolved' | 'effectEarned' | 'ritualSung' | 'ritualLost' | 'turnTimedOut'
>;

type DuelEvent = GameEventOf<'duelResolved'>;

type DuelLines = Pick<DuelHeadline, 'title' | 'body' | 'result' | 'tone'>;

const faceOf = ({ cardId, attack }: DuelCard): CardFace => ({
  cardId,
  name: cardName(cardId),
  attack: num(attack),
});

const DUEL_LINES: Readonly<
  Record<DuelResult, (event: DuelEvent, mine: CardFace, theirs: CardFace) => DuelLines>
> = {
  player: ({ wins }, mine, theirs) => ({
    title: 'DUELO GANADO',
    body: `${mine.name} (${mine.attack}) vence a ${theirs.name} (${theirs.attack}).`,
    result: `LLEVAS ${num(wins.player)} DE 3`,
    tone: 'win',
  }),
  rival: ({ wins }, mine, theirs) => ({
    title: 'DUELO PERDIDO',
    body: `${mine.name} (${mine.attack}) cae ante ${theirs.name} (${theirs.attack}).`,
    result: `EL RIVAL LLEVA ${num(wins.rival)}`,
    tone: 'lose',
  }),
  tie: ({ duel }, mine, theirs) => ({
    title: 'DUELO EMPATADO',
    body: `${mine.name} y ${theirs.name} se anulan (${mine.attack}).`,
    result: duel === 0 ? 'DECIDE EL SIGUIENTE DUELO' : 'DECIDE EL PRIMER DUELO',
    tone: 'tie',
  }),
};

const duelNotice = (event: DuelEvent) => {
  const player = faceOf(event.player);
  const rival = faceOf(event.rival);
  return headlineNotice({
    look: 'duel',
    tag: `DUELO ${num(event.duel + 1)}`,
    ...DUEL_LINES[event.result](event, player, rival),
    player,
    rival,
  });
};

export const DUEL_NOTICES: DuelNotices = {
  duelResolved: duelNotice,
  effectEarned: ({ side, cardId }) =>
    markNotice({
      title: 'SELLO',
      detail: `${cardName(cardId)} lleva sello: ${bySide(side, 'ganas un efecto', 'el rival gana un efecto')}.`,
      tone: bySide(side, 'win', 'lose'),
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
    markNotice({ title: 'RITUAL PERDIDO', detail: 'No lo cantaste antes de jugar.', tone: 'rule' }),
  turnTimedOut: ({ cardId }) =>
    markNotice({
      title: 'SE ACABÓ EL TIEMPO',
      detail: `Se jugó ${cardName(cardId)}, tu carta más baja.`,
      tone: 'lose',
    }),
};
