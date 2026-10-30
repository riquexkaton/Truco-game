import { STAKES } from '@domain/challenge/challenge';

import type { GameEventOf } from '@application/ports/game-event';

import type { NoticeBuilders } from '@ui/copy/notice';
import { markNotice } from '@ui/copy/notice';
import { num } from '@ui/copy/text';

type ChallengeNotices = Pick<NoticeBuilders, 'challengeCalled' | 'challengeAccepted'>;

const acceptedNotice = ({ by, stake, holder }: GameEventOf<'challengeAccepted'>) => {
  if (by === 'rival') {
    return markNotice({
      title: 'EL RIVAL ACEPTA',
      detail: `La ronda vale ${num(stake)}.`,
      tone: 'lose',
      isRival: true,
    });
  }
  const worth = `LA RONDA VALE ${num(stake)}`;
  return markNotice({
    title: 'ACEPTAS',
    detail: holder === 'player' ? `${worth} · TIENES LA PALABRA` : worth,
    tone: 'ink',
  });
};

export const CHALLENGE_NOTICES: ChallengeNotices = {
  challengeCalled: ({ level }) =>
    markNotice({
      title: level === 1 ? 'DESAFÍO' : 'CONTRA-DESAFÍO',
      detail: `LA RONDA PASARÍA A VALER ${num(STAKES[level])}`,
      tone: 'lose',
    }),
  challengeAccepted: acceptedNotice,
};
