import type { GameEventOf } from '@application/ports/game-event';

import { EFFECT_COPY, RIVAL_EFFECT_COPY } from '@ui/copy/effect-copy';
import { sheet } from '@ui/copy/headline';
import type { Notice, NoticeBuilders } from '@ui/copy/notice';
import { announceNotice, headlineNotice, SILENT } from '@ui/copy/notice';
import { bySide, num } from '@ui/copy/text';

type EffectNotices = Pick<
  NoticeBuilders,
  'effectGained' | 'effectUsed' | 'effectAnnulled' | 'plundered' | 'lifeChanged'
>;

const usedNotice = ({ side, effect }: GameEventOf<'effectUsed'>): Notice => {
  const { name } = EFFECT_COPY[effect];
  if (side === 'player') {
    return { kind: 'reveal', side, effect, announcement: `Usas ${name}` };
  }
  return headlineNotice(
    sheet({
      isRival: true,
      seal: '',
      effect,
      tone: 'ink',
      title: name,
      body: RIVAL_EFFECT_COPY[effect],
    }),
  );
};

export const EFFECT_NOTICES: EffectNotices = {
  effectGained: () => SILENT,
  effectUsed: usedNotice,
  effectAnnulled: ({ side }) =>
    headlineNotice(
      sheet({
        isRival: side === 'player',
        seal: '×',
        tone: 'rule',
        title: bySide(side, 'TU EFECTO, ANULADO', 'EFECTO ANULADO'),
        body: bySide(side, 'El Sello del rival lo anula.', 'Tu Sello anula el efecto del rival.'),
      }),
    ),
  plundered: ({ side }) =>
    announceNotice(
      bySide(
        side,
        'Saqueo: cambiaste una carta con el rival',
        'Saqueo: el rival te quitó una carta',
      ),
    ),
  lifeChanged: ({ side, delta, life }) => ({
    kind: 'life',
    side,
    delta,
    announcement: `${bySide(side, 'Tu vida:', 'Vida del rival:')} ${num(life)}`,
  }),
};
