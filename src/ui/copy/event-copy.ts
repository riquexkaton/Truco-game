import type { GameEvent } from '@application/ports/game-event';

import { CHALLENGE_NOTICES } from '@ui/copy/challenge-notices';
import { DUEL_NOTICES } from '@ui/copy/duel-notices';
import { EFFECT_NOTICES } from '@ui/copy/effect-notices';
import type { Notice, NoticeBuilders } from '@ui/copy/notice';
import { PACT_NOTICES } from '@ui/copy/pact-notices';
import { ROUND_NOTICES } from '@ui/copy/round-notices';

const NOTICES: NoticeBuilders = {
  ...ROUND_NOTICES,
  ...DUEL_NOTICES,
  ...CHALLENGE_NOTICES,
  ...PACT_NOTICES,
  ...EFFECT_NOTICES,
};

type AnyNoticeBuilder = (event: GameEvent) => Notice;

export const noticeFor = (event: GameEvent): Notice =>
  (NOTICES[event.type] as AnyNoticeBuilder)(event);
