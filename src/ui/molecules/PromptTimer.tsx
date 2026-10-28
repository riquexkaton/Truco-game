import { Incense } from '@ui/atoms/Incense';
import { timerLabel, timerText } from '@ui/copy/hud-copy';
import type { PromptTimerView } from '@ui/hud/hud-view';

interface PromptTimerProps {
  readonly timer: PromptTimerView;
}

const LOW_SECONDS = 3;

export const PromptTimer = ({ timer }: PromptTimerProps) => {
  const seconds = Math.ceil(timer.left);
  return (
    <div role="timer" aria-label={timerLabel(seconds)} class="relative mt-1 self-stretch">
      <Incense fraction={timer.left / timer.total} isLow={timer.left <= LOW_SECONDS} tone="ink" />
      <span class="absolute top-[7px] right-0 text-[9px] font-extrabold tracking-[0.3em] text-ink/60">
        {timerText(seconds)}
      </span>
    </div>
  );
};
