import { EFFECT_COPY } from '@ui/copy/effect-copy';
import type { NoticeBuilders } from '@ui/copy/notice';
import { announceNotice, bannerCopy, bannerNotice, SILENT } from '@ui/copy/notice';
import { bySide, num } from '@ui/copy/text';

type EffectNotices = Pick<
  NoticeBuilders,
  'effectGained' | 'effectUsed' | 'effectAnnulled' | 'plundered' | 'lifeChanged'
>;

export const EFFECT_NOTICES: EffectNotices = {
  effectGained: () => SILENT,
  effectUsed: ({ side, effect }) => ({
    kind: 'reveal',
    side,
    effect,
    announcement: `${bySide(side, 'Usas', 'El rival usa')} ${EFFECT_COPY[effect].name}`,
  }),
  effectAnnulled: () => bannerNotice(bannerCopy('ANULADO', 'POR UN SELLO')),
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
