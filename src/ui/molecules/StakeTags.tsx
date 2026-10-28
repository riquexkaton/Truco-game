import { Icon } from '@ui/atoms/Icon';
import { pactStakeLabel, roundStakeLabel } from '@ui/copy/action-copy';

interface StakeTagsProps {
  readonly pactAmount: number | null;
  readonly roundStake: number | null;
}

const TAG =
  'flex items-center gap-1.5 bg-washi2 px-2 py-[3px] text-[9px] font-extrabold tracking-[0.16em] whitespace-nowrap text-ink shadow-[inset_0_0_0_1px_var(--color-ink),0_4px_10px_rgb(0_0_0/0.5)]';

export const StakeTags = ({ pactAmount, roundStake }: StakeTagsProps) => (
  <div
    aria-hidden="true"
    class="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 narrow:-right-1.5 narrow:left-auto narrow:translate-x-0 narrow:items-end"
  >
    {pactAmount === null ? null : (
      <span class={TAG}>
        <Icon name="rings" class="size-3 fill-none stroke-ink stroke-2" />
        <span>{pactStakeLabel(pactAmount)}</span>
      </span>
    )}
    {roundStake === null ? null : (
      <span class={TAG}>
        <span>{roundStakeLabel(roundStake)}</span>
      </span>
    )}
  </div>
);
