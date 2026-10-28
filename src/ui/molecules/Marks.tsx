import { ShieldIcon } from '@ui/atoms/Icon';
import { HUD_LABELS } from '@ui/copy/hud-copy';
import type { HudSize } from '@ui/molecules/LifeCounter';

interface MarksProps {
  readonly isCursed: boolean;
  readonly isSealed: boolean;
  readonly size: HudSize;
}

const PLACEMENT = {
  player: 'left-1/2 top-0.5 -translate-x-1/2',
  rival: 'left-[calc(100%-30px)] top-1/2 -translate-y-1/2',
};

const MARK =
  'grid h-[26px] min-w-[26px] place-items-center rounded-[13px] bg-black/50 px-[5px] text-[12px] leading-none font-extrabold';

export const Marks = ({ isCursed, isSealed, size }: MarksProps) => (
  <div class={`absolute flex gap-1.5 ${PLACEMENT[size]}`}>
    {isCursed ? (
      <span
        class={`${MARK} text-curse shadow-[inset_0_0_0_1.5px_var(--color-curse-ring)]`}
        title={HUD_LABELS.curse}
      >
        {HUD_LABELS.curseMark}
      </span>
    ) : null}
    {isSealed ? (
      <span
        class={`${MARK} text-white shadow-[inset_0_0_0_1.5px_rgb(255_255_255/0.9)]`}
        title={HUD_LABELS.seal}
      >
        <ShieldIcon class="size-[15px] fill-none stroke-white stroke-3 [stroke-linecap:round] [stroke-linejoin:round]" />
      </span>
    ) : null}
  </div>
);
