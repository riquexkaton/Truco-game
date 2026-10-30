import type { Answer, HudPort, Question } from '@application/ports/hud-port';
import type { TableListener } from '@application/ports/table-listener';

import { noticeFor } from '@ui/copy/event-copy';
import { promptFor } from '@ui/copy/question-copy';
import { createBannerQueue } from '@ui/hud/banner-queue';
import { createHeadlineQueue } from '@ui/hud/headline-queue';
import { hudTiming } from '@ui/hud/hud-timing';
import type { HudView } from '@ui/hud/hud-view';
import { createHudSignals } from '@ui/hud/hud-view';
import { createNoticeHandlers, dispatchNotice } from '@ui/hud/notice-handlers';
import { createPromptSession } from '@ui/hud/prompt-session';
import { createStage } from '@ui/hud/stage';
import { createTableWatch } from '@ui/hud/table-watch';

export interface HudOptions {
  readonly reducedMotion: boolean;
}

export interface Hud {
  readonly port: HudPort;
  readonly view: HudView;
  readonly table: TableListener;
}

export const createHud = ({ reducedMotion }: HudOptions): Hud => {
  const signals = createHudSignals();
  const timing = hudTiming(reducedMotion);
  const stage = createStage();
  const banner = createBannerQueue(signals, timing, stage);
  const headlines = createHeadlineQueue(signals, timing, stage);
  const handlers = createNoticeHandlers({ signals, timing }, { banner, headline: headlines.show });
  const askPrompt = createPromptSession(signals);
  const table = createTableWatch(signals.prompt);
  return {
    port: {
      notify: (event) => dispatchNotice(handlers, noticeFor(event)),
      ask: <Q extends Question>(question: Q) =>
        askPrompt(promptFor(question)) as Promise<Answer<Q['kind']>>,
    },
    view: {
      ...signals,
      ...table.view,
      dismissHeadline: headlines.dismiss,
      closeGameOver: () => {
        signals.gameOver.value = null;
      },
    },
    table: table.listener,
  };
};
