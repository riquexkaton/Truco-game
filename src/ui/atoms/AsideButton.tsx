import { Icon } from '@ui/atoms/Icon';

interface AsideButtonProps {
  readonly label: string;
  readonly name: string;
  readonly hasChevron: boolean;
  readonly onClick: () => void;
}

export const AsideButton = ({ label, name, hasChevron, onClick }: AsideButtonProps) => (
  <button
    type="button"
    aria-label={name}
    onClick={onClick}
    class={`flex h-11 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-[2px] bg-washi2 pr-3.5 pl-3 font-mincho text-[12px] font-extrabold tracking-[1.5px] text-ink shadow-[inset_0_0_0_1.5px_#1e1a16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink tall:pr-3 tall:pl-2.5 tall:text-[11px] ${hasChevron ? 'min-w-[104px] tall:min-w-24' : 'tall:tracking-[1px]'}`}
  >
    {hasChevron ? (
      <Icon
        name="back"
        class="size-3.5 fill-none stroke-current stroke-[2.4] [stroke-linecap:round] [stroke-linejoin:round]"
      />
    ) : null}
    {label}
  </button>
);
