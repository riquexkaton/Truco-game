import type { NoticeOf } from '@ui/copy/notice';
import type { HudTiming } from '@ui/hud/hud-timing';
import type { HudSignals } from '@ui/hud/hud-view';
import type { Stage } from '@ui/hud/stage';

export interface HeadlineQueue {
  readonly show: (notice: NoticeOf<'headline'>) => Promise<void>;
  readonly dismiss: () => void;
}

const idle = (): void => undefined;

export const createHeadlineQueue = (
  signals: HudSignals,
  timing: HudTiming,
  stage: Stage,
): HeadlineQueue => {
  let shown = 0;
  let close = idle;
  const present = ({ headline, announcement }: NoticeOf<'headline'>) =>
    new Promise<void>((resolve) => {
      shown += 1;
      const id = shown;
      const duration = timing.reading(announcement);
      const finish = () => {
        if (signals.headline.peek()?.id !== id) return;
        close = idle;
        signals.headline.value = null;
        resolve();
      };
      close = finish;
      signals.headline.value = { id, headline, text: announcement, duration };
      signals.announcement.value = announcement;
      setTimeout(finish, duration);
    });
  return {
    show: (notice) => stage(() => present(notice)),
    dismiss: () => {
      close();
    },
  };
};
