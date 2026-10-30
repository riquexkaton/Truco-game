import type { Answer, HudPort, Question } from '@application/ports/hud-port';
import type { TableListener } from '@application/ports/table-listener';

import { noticeFor } from '@ui/copy/event-copy';
import { promptFor } from '@ui/copy/question-copy';
import { hudTiming, NOTICE_MIN_MS } from '@ui/hud/hud-timing';
import type { HudSignals, HudView } from '@ui/hud/hud-view';
import { createHudSignals } from '@ui/hud/hud-view';
import { createNoticeHandlers, dispatchNotice } from '@ui/hud/notice-handlers';
import { createNoticeQueue } from '@ui/hud/notice-queue';
import { createPromptSession } from '@ui/hud/prompt-session';
import { createTableWatch } from '@ui/hud/table-watch';
import { createVoice } from '@ui/hud/voice';

export interface HudOptions {
  readonly reducedMotion: boolean;
}

export interface Hud {
  readonly port: HudPort;
  readonly view: HudView;
  readonly table: TableListener;
}

const createNotices = (signals: HudSignals, isReducedMotion: boolean) => {
  const queue = createNoticeQueue(NOTICE_MIN_MS);
  const clearNotices = () => {
    queue.clear();
    signals.headline.value = null;
  };
  const voice = createVoice(signals.announcement);
  const timing = hudTiming(isReducedMotion);
  return {
    clearNotices,
    handlers: createNoticeHandlers({ signals, timing, queue, voice, clearNotices }),
  };
};

export const createHud = ({ reducedMotion }: HudOptions): Hud => {
  const signals = createHudSignals();
  const { handlers, clearNotices } = createNotices(signals, reducedMotion);
  const askPrompt = createPromptSession(signals, clearNotices);
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
      dismissHeadline: () => {
        signals.headline.value = null;
      },
      closeGameOver: () => {
        signals.gameOver.value = null;
      },
    },
    table: table.listener,
  };
};
