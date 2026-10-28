import { PaperTag } from '@ui/atoms/PaperTag';
import { HUD_LABELS } from '@ui/copy/hud-copy';

interface SignalProps {
  readonly isOn: boolean;
}

const DOT_DELAYS = ['0s', '0.2s', '0.4s'];

export const EdgeGlow = ({ isOn }: SignalProps) => (
  <div
    aria-hidden="true"
    class={`pointer-events-none fixed inset-0 shadow-[inset_0_0_140px_rgb(142_42_42/0.6)] transition-opacity duration-400 ${isOn ? 'opacity-100' : 'opacity-0'}`}
  />
);

export const RivalTurnTag = ({ isOn }: SignalProps) => (
  <div
    aria-hidden="true"
    class={`pointer-events-none fixed top-[calc(24px+env(safe-area-inset-top,0px))] right-[calc(50%+150px)] transition-[opacity,translate] duration-300 narrow:top-[calc(90px+env(safe-area-inset-top,0px))] narrow:right-auto narrow:left-1/2 narrow:-translate-x-1/2 ${isOn ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}
  >
    <PaperTag dot="bg-red" size="md">
      {HUD_LABELS.theirTurn}
      <span class="flex gap-1">
        {DOT_DELAYS.map((delay) => (
          <i
            key={delay}
            class="block size-[5px] animate-dots rounded-full bg-red motion-reduce:animate-none"
            style={{ animationDelay: delay }}
          />
        ))}
      </span>
    </PaperTag>
  </div>
);
