import type { Answer, HudPort, Question } from '@application/ports/hud-port';

import { noticeFor } from '@ui/copy/event-copy';
import { promptFor } from '@ui/copy/question-copy';
import { createBannerQueue } from '@ui/hud/banner-queue';
import { hudTiming } from '@ui/hud/hud-timing';
import type { HudView } from '@ui/hud/hud-view';
import { createHudSignals } from '@ui/hud/hud-view';
import { createNoticeHandlers, dispatchNotice } from '@ui/hud/notice-handlers';
import { createPromptSession } from '@ui/hud/prompt-session';
import { createToastStack } from '@ui/hud/toast-stack';

export interface HudOptions {
  readonly reducedMotion: boolean;
}

export interface Hud {
  readonly port: HudPort;
  readonly view: HudView;
}

export const createHud = ({ reducedMotion }: HudOptions): Hud => {
  const signals = createHudSignals();
  const timing = hudTiming(reducedMotion);
  const toasts = createToastStack(signals, timing.toast);
  const banner = createBannerQueue(signals, timing);
  const handlers = createNoticeHandlers({ signals, timing }, { banner, toast: toasts.push });
  const askPrompt = createPromptSession(signals);
  return {
    port: {
      notify: (event) => dispatchNotice(handlers, noticeFor(event)),
      ask: <Q extends Question>(question: Q) =>
        askPrompt(promptFor(question)) as Promise<Answer<Q['kind']>>,
    },
    view: {
      ...signals,
      dismissToast: toasts.dismiss,
      closeGameOver: () => {
        signals.gameOver.value = null;
      },
    },
  };
};
