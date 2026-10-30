import { timerLabel, timerText } from '@ui/copy/hud-copy';
import type { PromptTimerView } from '@ui/hud/hud-view';

interface CallTimerProps {
  readonly timer: PromptTimerView;
  readonly lead: string;
  readonly isAlarm: boolean;
}

const TONES = {
  alarm: { track: 'bg-red/18', fill: 'bg-red', text: 'text-red' },
  calm: { track: 'bg-ink/15', fill: 'bg-ink', text: 'text-ink' },
};

export const CallTimer = ({ timer, lead, isAlarm }: CallTimerProps) => {
  const seconds = Math.ceil(timer.left);
  const tone = isAlarm ? TONES.alarm : TONES.calm;
  return (
    <div role="timer" aria-label={timerLabel(seconds)} class="flex items-center gap-2.5">
      <span aria-hidden="true" class={`block h-[2px] flex-1 ${tone.track}`}>
        <span
          class={`block h-full ${tone.fill}`}
          style={{ width: `${String((timer.left / timer.total) * 100)}%` }}
        />
      </span>
      <span
        aria-hidden="true"
        class={`flex shrink-0 items-center gap-[5px] text-[11px] font-extrabold tracking-[1.5px] tall:text-[10px] ${tone.text}`}
      >
        <i class="block size-[7px] rounded-full bg-ember shadow-[0_0_6px_#ff8c3c]" />
        {lead}
        {timerText(seconds)}
      </span>
    </div>
  );
};
