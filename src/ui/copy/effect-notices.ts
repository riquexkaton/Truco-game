import type { GameEventOf } from '@application/ports/game-event';

import { EFFECT_COPY, RIVAL_EFFECT_COPY } from '@ui/copy/effect-copy';
import type { Notice, NoticeBuilders } from '@ui/copy/notice';
import { announceNotice, SILENT } from '@ui/copy/notice';
import { bySide, num } from '@ui/copy/text';

type EffectNotices = Pick<
  NoticeBuilders,
  'effectGained' | 'effectUsed' | 'effectAnnulled' | 'plundered' | 'lifeChanged'
>;

const usedNotice = ({ side, effect }: GameEventOf<'effectUsed'>): Notice => {
  const { name, description } = EFFECT_COPY[effect];
  const line = bySide(side, description, RIVAL_EFFECT_COPY[effect]);
  return {
    kind: 'reveal',
    side,
    effect,
    line,
    announcement: bySide(side, `Usas ${name}`, `El rival usa ${name}. ${line}`),
  };
};

const annulledNotice = ({ side }: GameEventOf<'effectAnnulled'>): Notice => {
  const line = bySide(side, 'El Sello del rival lo anula.', 'Tu Sello lo anula.');
  return { kind: 'annul', side, line, announcement: `ANULADO. ${line}` };
};

export const EFFECT_NOTICES: EffectNotices = {
  effectGained: () => SILENT,
  effectUsed: usedNotice,
  effectAnnulled: annulledNotice,
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
