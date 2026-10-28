import { Icon } from '@ui/atoms/Icon';
import { FOLD_COPY } from '@ui/copy/action-copy';

interface FoldButtonProps {
  readonly isEnabled: boolean;
  readonly onFold: () => void;
}

export const FoldButton = ({ isEnabled, onFold }: FoldButtonProps) => (
  <button
    type="button"
    disabled={!isEnabled}
    aria-label={FOLD_COPY.description}
    title={FOLD_COPY.description}
    onClick={onFold}
    class="grid size-[46px] cursor-pointer place-items-center rounded-full bg-black/55 p-0 shadow-[inset_0_0_0_1.5px_rgb(255_255_255/0.9),0_6px_18px_rgb(0_0_0/0.5)] transition-[translate,opacity] duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white hover:enabled:-translate-y-[3px] disabled:cursor-default disabled:opacity-30 narrow:size-[38px]"
  >
    <Icon
      name="leave"
      class="size-[19px] fill-none stroke-white stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round] narrow:size-4"
    />
  </button>
);
