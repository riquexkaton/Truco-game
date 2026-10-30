import type { NoticeOf } from '@ui/copy/notice';
import type { HudTiming } from '@ui/hud/hud-timing';
import { delay } from '@ui/hud/hud-timing';
import type { HudSignals } from '@ui/hud/hud-view';
import type { Stage } from '@ui/hud/stage';

export type ShowBanner = (notice: NoticeOf<'banner'>) => Promise<void>;

export const createBannerQueue = (
  signals: HudSignals,
  timing: HudTiming,
  stage: Stage,
): ShowBanner => {
  let shown = 0;
  const show = async ({ banner, announcement }: NoticeOf<'banner'>): Promise<void> => {
    shown += 1;
    const duration = timing.banner(banner.duration);
    signals.banner.value = { ...banner, duration, id: shown };
    signals.announcement.value = announcement;
    await delay(duration);
    signals.banner.value = null;
  };
  return (notice) => stage(() => show(notice));
};
