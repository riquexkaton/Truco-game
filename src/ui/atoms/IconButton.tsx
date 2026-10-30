import type { IconName } from '@ui/atoms/Icon';
import { Icon } from '@ui/atoms/Icon';

interface IconButtonProps {
  readonly label: string;
  readonly icon: IconName;
  readonly onClick: () => void;
  readonly isPressed?: boolean;
}

export const IconButton = ({ label, icon, onClick, isPressed }: IconButtonProps) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={isPressed}
    onClick={onClick}
    class="grid size-11 cursor-pointer place-items-center text-washi/75 transition-colors duration-150 hover:text-washi focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-seal motion-reduce:transition-none"
  >
    <Icon
      name={icon}
      class="size-[18px] fill-none stroke-current stroke-[1.6] [stroke-linecap:round] [stroke-linejoin:round]"
    />
  </button>
);
