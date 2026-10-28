import type { Timeout } from '@application/ports/hud-port';

import type { PromptSpec } from '@ui/copy/prompt';
import { promptAnnouncement } from '@ui/copy/prompt';
import { PROMPT_TICK_MS, toMilliseconds, toSeconds } from '@ui/hud/hud-timing';
import type { HudSignals } from '@ui/hud/hud-view';

export type AskPrompt = (spec: PromptSpec<unknown>) => Promise<unknown>;

type Finish = (answer: unknown) => void;

const startCountdown = (signals: HudSignals, timeout: Timeout<unknown>, finish: Finish) => {
  const total = timeout.seconds;
  let left = toMilliseconds(total);
  signals.promptTimer.value = { total, left: total };
  return setInterval(() => {
    left = Math.max(0, left - PROMPT_TICK_MS);
    signals.promptTimer.value = { total, left: toSeconds(left) };
    if (left === 0) finish(timeout.answer);
  }, PROMPT_TICK_MS);
};

export const createPromptSession = (signals: HudSignals): AskPrompt => {
  let asked = 0;
  return (spec) =>
    new Promise((resolve) => {
      let countdown: ReturnType<typeof setInterval> | undefined;
      let isOpen = true;
      const finish: Finish = (answer) => {
        if (!isOpen) return;
        isOpen = false;
        clearInterval(countdown);
        signals.prompt.value = null;
        signals.promptTimer.value = null;
        resolve(answer);
      };
      asked += 1;
      signals.prompt.value = { id: asked, spec, choose: finish };
      signals.announcement.value = promptAnnouncement(spec);
      if (spec.timeout !== null) countdown = startCountdown(signals, spec.timeout, finish);
    });
};
