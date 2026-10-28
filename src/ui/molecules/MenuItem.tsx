import { Hanko } from '@ui/atoms/Hanko';
import type { IconName } from '@ui/atoms/Icon';
import { Icon } from '@ui/atoms/Icon';
import type { MenuItemCopy } from '@ui/copy/action-copy';

export interface MenuItemProps {
  readonly copy: MenuItemCopy;
  readonly icon: IconName;
  readonly isDisabled: boolean;
  readonly isWarning: boolean;
  readonly delay: number;
  readonly onSelect: () => void;
}

const MenuItemFace = ({
  copy,
  icon,
  isWarning,
}: Omit<MenuItemProps, 'isDisabled' | 'delay' | 'onSelect'>) => (
  <>
    <b class="mr-auto text-[13px] font-extrabold tracking-[0.22em] narrow:text-[12px]">
      {copy.label}
    </b>
    <span class="text-[9px] font-extrabold tracking-[0.14em] whitespace-nowrap text-ink/60">
      {copy.note}
    </span>
    <Hanko class={`size-10 rounded-[7px] narrow:size-[34px] ${isWarning ? 'bg-red' : 'bg-ink'}`}>
      <Icon
        name={icon}
        class="size-[19px] fill-none stroke-washi2 stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]"
      />
    </Hanko>
  </>
);

export const MenuItem = ({ isDisabled, delay, onSelect, ...face }: MenuItemProps) => (
  <button
    type="button"
    role="menuitem"
    disabled={isDisabled}
    aria-label={face.copy.description}
    title={face.copy.description}
    onClick={onSelect}
    style={{ animationDelay: `${String(delay)}ms` }}
    class="flex h-[54px] min-w-[210px] animate-menu-in cursor-pointer items-center gap-3 bg-washi pr-2 pl-[18px] font-mincho text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink),0_0_0_3px_var(--color-washi),0_12px_24px_rgb(0_0_0/0.6)] transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white hover:enabled:-translate-x-1 disabled:cursor-default narrow:h-[46px] narrow:min-w-[186px] narrow:pl-3.5 [&:disabled>*]:opacity-45"
  >
    <MenuItemFace {...face} />
  </button>
);
