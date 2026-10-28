import { STAKES } from '@domain/challenge/challenge';

import type { NoticeBuilders } from '@ui/copy/notice';
import { bannerCopy, bannerNotice } from '@ui/copy/notice';
import { bySide, num } from '@ui/copy/text';

type ChallengeNotices = Pick<NoticeBuilders, 'challengeCalled' | 'challengeAccepted'>;

export const CHALLENGE_NOTICES: ChallengeNotices = {
  challengeCalled: ({ level }) =>
    bannerNotice(
      bannerCopy(
        level === 1 ? 'DESAFÍO' : 'CONTRA-DESAFÍO',
        `LA RONDA PASARÍA A VALER ${num(STAKES[level])}`,
      ),
    ),
  challengeAccepted: ({ by, stake, holder }) =>
    bannerNotice(
      bannerCopy(
        bySide(by, 'ACEPTAS', 'EL RIVAL ACEPTA'),
        `LA RONDA VALE ${num(stake)}${by === 'player' && holder === 'player' ? ' · TIENES LA PALABRA' : ''}`,
      ),
    ),
};
