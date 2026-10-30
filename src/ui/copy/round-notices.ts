import { FACTIONS } from '@domain/cards/faction';
import type { Side } from '@domain/shared/side';

import type { GameEventOf } from '@application/ports/game-event';

import { sheet } from '@ui/copy/headline';
import type { NoticeBuilders } from '@ui/copy/notice';
import { bannerCopy, bannerNotice, headlineNotice } from '@ui/copy/notice';
import { bySide, MINUS, num, plural, roman } from '@ui/copy/text';

type RoundNotices = Pick<
  NoticeBuilders,
  'roundStarted' | 'turnStarted' | 'roundEnded' | 'retired' | 'matchOver'
>;

const roundEndedNotice = ({ winner, stake }: GameEventOf<'roundEnded'>) => {
  if (winner === null) {
    return headlineNotice(
      sheet({ seal: '=', tone: 'tie', title: 'RONDA EMPATADA', result: 'NADIE RECIBE DAÑO' }),
    );
  }
  const amount = num(stake);
  return headlineNotice(
    sheet({
      seal: `${MINUS}${amount}`,
      tone: bySide(winner, 'win', 'lose'),
      title: bySide(winner, 'GANAS LA RONDA', 'PIERDES LA RONDA'),
      result: bySide(winner, `EL RIVAL PIERDE ${amount}`, `PIERDES ${amount} DE VIDA`),
    }),
  );
};

const RETIRED_LINES = {
  fold: {
    title: (side: Side) => bySide(side, 'TE VAS', 'EL RIVAL SE VA'),
    body: (side: Side) => bySide(side, 'Abandonas la ronda.', 'El rival abandona la ronda.'),
  },
  retire: {
    title: (side: Side) => bySide(side, 'TE RETIRAS', 'EL RIVAL SE RETIRA'),
    body: (side: Side) => bySide(side, 'No aceptas el Desafío.', 'El rival no acepta tu Desafío.'),
  },
};

const retiredNotice = ({ side, damage, reason }: GameEventOf<'retired'>) => {
  const amount = num(damage);
  const lines = RETIRED_LINES[reason];
  return headlineNotice(
    sheet({
      isRival: side === 'rival',
      seal: `${MINUS}${amount}`,
      tone: bySide(side, 'lose', 'win'),
      title: lines.title(side),
      body: lines.body(side),
      result: bySide(side, `PIERDES ${amount} DE VIDA`, `EL RIVAL PIERDE ${amount}`),
    }),
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
