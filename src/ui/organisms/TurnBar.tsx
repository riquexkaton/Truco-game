import { Hanko } from '@ui/atoms/Hanko';
import { Incense } from '@ui/atoms/Incense';
import { PaperTag } from '@ui/atoms/PaperTag';
import { HUD_LABELS } from '@ui/copy/hud-copy';

interface TurnBarProps {
  readonly isActive: boolean;
  readonly isConcealed: boolean;
  readonly isPaused: boolean;
  readonly isLow: boolean;
  readonly secondsLeft: number;
  readonly totalSeconds: number;
}

const visibility = ({ isActive, isConcealed, isPaused }: TurnBarProps): string => {
  if (!isActive) return 'translate-y-2 opacity-0';
  if (isConcealed) return 'opacity-0';
  return isPaused ? 'opacity-60' : 'opacity-100';
};

const PauseGlyph = ({ class: className }: { readonly class: string }) => (
  <span class={`gap-[3px] ${className}`}>
    <i class="block h-[9px] w-[2.5px] bg-current" />
    <i class="block h-[9px] w-[2.5px] bg-current" />
  </span>
);

const TurnTag = ({ isPaused }: Pick<TurnBarProps, 'isPaused'>) =>
  isPaused ? (
    <PaperTag dot={null} size="sm" class="narrow:hidden">
      <PauseGlyph class="flex" />
      {HUD_LABELS.paused}
    </PaperTag>
  ) : (
    <PaperTag dot="bg-green" size="sm" class="narrow:hidden">
      {HUD_LABELS.yourTurn}
    </PaperTag>
  );

export const TurnBar = (props: TurnBarProps) => (
  <div
    aria-hidden="true"
    class={`pointer-events-none fixed bottom-[calc(98px+env(safe-area-inset-bottom,0px))] left-1/2 flex -translate-x-1/2 items-center gap-3.5 transition-[opacity,translate] duration-300 narrow:left-[min(50%,calc(100%-226px))] narrow:gap-2.5 ${visibility(props)}`}
  >
    <TurnTag isPaused={props.isPaused} />
    <Incense
      fraction={props.secondsLeft / props.totalSeconds}
      isLow={props.isLow}
      tone="washi"
      class="w-[260px] narrow:w-[120px]"
    />
    {props.isPaused ? <PauseGlyph class="hidden text-washi narrow:flex" /> : null}
    <Hanko
      class={`size-[34px] rounded-[6px] shadow-[0_0_0_2px_var(--color-washi),2px_3px_0_2px_rgb(0_0_0/0.3)] narrow:size-8 ${props.isLow ? 'animate-sec-pulse bg-red motion-reduce:animate-none' : 'bg-ink'}`}
    >
      <b class="text-[13px] tabular-nums narrow:text-[12px]">{Math.ceil(props.secondsLeft)}</b>
    </Hanko>
  </div>
);
