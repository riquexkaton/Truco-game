import { useEffect, useRef } from 'preact/hooks';

import { CANTAR_COPY } from '@ui/copy/action-copy';
import type { MenuItemProps } from '@ui/molecules/MenuItem';
import { MenuItem } from '@ui/molecules/MenuItem';
import type { ActionBarHandlers, ActionBarModel, MenuAction } from '@ui/organisms/action-model';

export const CANTAR_MENU_ID = 'cantar-menu';

const FOCUS_DELAY_MS = 30;

const ITEM_DELAY_MS = 40;

type MenuHandlers = Omit<ActionBarHandlers, 'onFold'>;

interface CantarMenuProps {
  readonly model: ActionBarModel;
  readonly handlers: MenuHandlers;
}

const itemOf = (
  action: MenuAction,
  item: Pick<MenuItemProps, 'icon' | 'isWarning' | 'delay' | 'onSelect'>,
) => (action.isVisible ? { ...item, copy: action.copy, isDisabled: !action.isEnabled } : null);

const menuItems = ({ ritual, pact, challenge }: ActionBarModel, handlers: MenuHandlers) =>
  [
    itemOf(ritual, { icon: 'ritual', isWarning: true, delay: 0, onSelect: handlers.onRitual }),
    itemOf(pact, {
      icon: 'rings',
      isWarning: false,
      delay: ITEM_DELAY_MS,
      onSelect: handlers.onPact,
    }),
    itemOf(challenge, {
      icon: 'swords',
      isWarning: false,
      delay: ITEM_DELAY_MS * 2,
      onSelect: handlers.onChallenge,
    }),
  ].filter((item) => item !== null);

const useFirstEnabledFocus = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      menuRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
    }, FOCUS_DELAY_MS);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return menuRef;
};

export const CantarMenu = ({ model, handlers }: CantarMenuProps) => (
  <div
    ref={useFirstEnabledFocus()}
    id={CANTAR_MENU_ID}
    role="menu"
    aria-label={CANTAR_COPY.menu}
    class="absolute right-0 bottom-[calc(100%+16px)] flex flex-col items-end gap-2.5"
  >
    {menuItems(model, handlers).map((item) => (
      <MenuItem key={item.icon} {...item} />
    ))}
  </div>
);
