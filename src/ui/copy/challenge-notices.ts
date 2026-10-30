import { STAKES } from '@domain/challenge/challenge';

import type { GameEventOf } from '@application/ports/game-event';

import { sheet } from '@ui/copy/headline';
import type { NoticeBuilders } from '@ui/copy/notice';
import { headlineNotice, markNotice } from '@ui/copy/notice';
import { num } from '@ui/copy/text';

type ChallengeNotices = Pick<NoticeBuilders, 'challengeCalled' | 'challengeAccepted'>;

const acceptedNotice = ({ by, stake, holder }: GameEventOf<'challengeAccepted'>) => {
  const worth = `LA RONDA VALE ${num(stake)}`;
  if (by === 'rival') {
    return headlineNotice(
      sheet({
        isRival: true,
        seal: num(stake),
        tone: 'lose',
        title: 'EL RIVAL ACEPTA',
        result: worth,
      }),
    );
  }
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
