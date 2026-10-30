import type { EffectId } from '@domain/effects/effect';
import type { Side } from '@domain/shared/side';

import type { GameEventOf, GameEventType } from '@application/ports/game-event';

import type { HeadlineCopy, MarkCopy, SheetFields } from '@ui/copy/headline';
import { sheet, spoken } from '@ui/copy/headline';

export type BannerKind = 'plain' | 'win' | 'lose';

interface SealCopy {
  readonly value: string;
  readonly caption: string;
}

export interface BannerCopy {
  readonly title: string;
  readonly subtitle: string;
  readonly kind: BannerKind;
  readonly seal: SealCopy | null;
  readonly duration: number;
}

export interface GameOverCopy {
  readonly winner: Side;
  readonly title: string;
  readonly subtitle: string;
}

export type Notice =
  | { readonly kind: 'banner'; readonly banner: BannerCopy; readonly announcement: string }
  | { readonly kind: 'headline'; readonly headline: HeadlineCopy; readonly announcement: string }
  | { readonly kind: 'mark'; readonly mark: MarkCopy; readonly announcement: string }
  | { readonly kind: 'strip'; readonly side: Side }
  | {
      readonly kind: 'reveal';
      readonly side: Side;
      readonly effect: EffectId;
      readonly announcement: string;
    }
  | {
      readonly kind: 'life';
      readonly side: Side;
      readonly delta: number;
      readonly announcement: string;
    }
  | { readonly kind: 'announce'; readonly announcement: string }
  | { readonly kind: 'gameOver'; readonly gameOver: GameOverCopy; readonly announcement: string }
  | { readonly kind: 'silent' };

export type NoticeKind = Notice['kind'];

export type NoticeOf<K extends NoticeKind> = Extract<Notice, { readonly kind: K }>;

export type NoticeBuilders = {
  readonly [T in GameEventType]: (event: GameEventOf<T>) => Notice;
};

const BANNER_MS = 1150;

type BannerStyle = Partial<Pick<BannerCopy, 'kind' | 'seal' | 'duration'>>;

export const bannerCopy = (
  title: string,
  subtitle: string,
  style: BannerStyle = {},
): BannerCopy => ({
  title,
  subtitle,
  kind: 'plain',
  seal: null,
  duration: BANNER_MS,
  ...style,
});

export const bannerNotice = (banner: BannerCopy, preface = ''): Notice => ({
  kind: 'banner',
  banner,
  announcement: `${preface}${banner.title}${banner.subtitle === '' ? '' : `. ${banner.subtitle}`}`,
});

export const headlineNotice = (headline: HeadlineCopy): Notice => ({
  kind: 'headline',
  headline,
  announcement: spoken(headline.title, headline.body, headline.result),
});

export const sheetNotice = (fields: SheetFields): Notice => headlineNotice(sheet(fields));

export const markNotice = (mark: MarkCopy): Notice => ({
  kind: 'mark',
  mark,
  announcement: spoken(mark.title, mark.detail),
});

export const announceNotice = (announcement: string): Notice => ({
  kind: 'announce',
  announcement,
});

export const SILENT: Notice = { kind: 'silent' };
