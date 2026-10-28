import { FACTIONS } from '@domain/cards/faction';
import type { Side } from '@domain/shared/side';

import type { GameEventOf } from '@application/ports/game-event';

import type { NoticeBuilders } from '@ui/copy/notice';
import { bannerCopy, bannerNotice } from '@ui/copy/notice';
import { bySide, MINUS, num, plural, roman } from '@ui/copy/text';

type RoundNotices = Pick<
  NoticeBuilders,
  'roundStarted' | 'turnStarted' | 'roundEnded' | 'retired' | 'matchOver'
>;

const roundEndedNotice = ({ winner, stake }: GameEventOf<'roundEnded'>) => {
  if (winner === null) {
    return bannerNotice(bannerCopy('RONDA EMPATADA', 'NADIE RECIBE DAÑO', { duration: 1300 }));
  }
  const amount = num(stake);
  return bannerNotice(
    bannerCopy(
      bySide(winner, 'GANAS LA RONDA', 'PIERDES LA RONDA'),
      bySide(winner, `EL RIVAL PIERDE ${amount}`, `PIERDES ${amount} DE VIDA`),
      {
        duration: 1400,
        kind: bySide(winner, 'win', 'lose'),
        seal: { value: amount, caption: 'VALÍA' },
      },
    ),
  );
};

const retiredTitle = ({ side, reason }: GameEventOf<'retired'>): string =>
  reason === 'fold' ? 'TE VAS' : bySide(side, 'TE RETIRAS', 'EL RIVAL SE RETIRA');

const retiredNotice = (event: GameEventOf<'retired'>) => {
  const damage = num(event.damage);
  return bannerNotice(
    bannerCopy(
      retiredTitle(event),
      bySide(event.side, `PIERDES ${damage} DE VIDA`, `EL RIVAL PIERDE ${damage}`),
      {
        kind: bySide(event.side, 'lose', 'win'),
        seal: { value: `${MINUS}${damage}`, caption: '' },
      },
    ),
  );
};

const winnerTitle = (winner: Side): string => bySide(winner, 'VICTORIA', 'DERROTA');

export const ROUND_NOTICES: RoundNotices = {
  roundStarted: ({ round, lead, vira }) =>
    bannerNotice(
      bannerCopy(
        `RONDA ${num(round)}`,
        bySide(
          lead,
          'SE REPARTEN 3 CARTAS · EMPIEZAS TÚ',
          'SE REPARTEN 3 CARTAS · EMPIEZA EL RIVAL',
        ),
        { duration: 1500, seal: { value: roman(round), caption: '' } },
      ),
      `Vira: ${FACTIONS[vira].name}. `,
    ),
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
