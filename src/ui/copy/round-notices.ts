import { FACTIONS } from '@domain/cards/faction';
import type { Side } from '@domain/shared/side';

import type { GameEventOf, RetireReason } from '@application/ports/game-event';

import type { BannerCopy, NoticeBuilders } from '@ui/copy/notice';
import { bannerCopy, bannerNotice } from '@ui/copy/notice';
import { bySide, MINUS, num, plural, roman } from '@ui/copy/text';

type RoundNotices = Pick<
  NoticeBuilders,
  'roundStarted' | 'turnStarted' | 'roundEnded' | 'retired' | 'matchOver'
>;

const OUTCOME_MS = 1400;

const outcomeStrip = (winner: Side, damage: number, title: string): BannerCopy =>
  bannerCopy(
    title,
    bySide(winner, `EL RIVAL PIERDE ${num(damage)}`, `PIERDES ${num(damage)} DE VIDA`),
    {
      kind: bySide(winner, 'win', 'lose'),
      seal: { value: `${MINUS}${num(damage)}`, caption: '' },
      duration: OUTCOME_MS,
    },
  );

const roundEndedNotice = ({ winner, stake }: GameEventOf<'roundEnded'>) =>
  bannerNotice(
    winner === null
      ? bannerCopy('RONDA EMPATADA', 'NADIE RECIBE DAÑO', { duration: OUTCOME_MS })
      : outcomeStrip(winner, stake, bySide(winner, 'GANAS LA RONDA', 'PIERDES LA RONDA')),
  );

const RETIRED_TITLES: Readonly<Record<RetireReason, (side: Side) => string>> = {
  fold: (side) => bySide(side, 'TE VAS', 'EL RIVAL SE VA'),
  retire: (side) => bySide(side, 'TE RETIRAS', 'EL RIVAL SE RETIRA'),
};

const retiredNotice = ({ side, damage, reason }: GameEventOf<'retired'>) =>
  bannerNotice(outcomeStrip(bySide(side, 'rival', 'player'), damage, RETIRED_TITLES[reason](side)));

const roundStartedNotice = ({ round, lead, vira }: GameEventOf<'roundStarted'>) => ({
  ...bannerNotice(
    bannerCopy(
      `RONDA ${num(round)}`,
      bySide(lead, 'SE REPARTEN 3 CARTAS · EMPIEZAS TÚ', 'SE REPARTEN 3 CARTAS · EMPIEZA EL RIVAL'),
      { duration: 1500, seal: { value: roman(round), caption: '' } },
    ),
    `Vira: ${FACTIONS[vira].name}. `,
  ),
  clearsSheet: true,
});

const winnerTitle = (winner: Side): string => bySide(winner, 'VICTORIA', 'DERROTA');

export const ROUND_NOTICES: RoundNotices = {
  roundStarted: roundStartedNotice,
  turnStarted: ({ side }) => ({ kind: 'strip', side }),
  roundEnded: roundEndedNotice,
  retired: retiredNotice,
  matchOver: ({ winner, life, rounds }) => ({
    kind: 'gameOver',
    gameOver: {
      winner,
      title: winnerTitle(winner),
      subtitle: `${num(life)} DE VIDA · ${plural(rounds, 'RONDA', 'S')}`,
    },
    announcement: bySide(winner, 'Victoria', 'Derrota'),
  }),
};
