import type { RefObject } from 'preact';

import { Icon } from '@ui/atoms/Icon';
import { CANTAR_COPY } from '@ui/copy/action-copy';
import { CANTAR_MENU_ID } from '@ui/organisms/CantarMenu';

interface CantarButtonProps {
  readonly isOpen: boolean;
  readonly isEnabled: boolean;
  readonly isReady: boolean;
  readonly isGlowing: boolean;
  readonly buttonRef: RefObject<HTMLButtonElement | null>;
  readonly onToggle: () => void;
}

const ICON =
  'relative size-[22px] fill-none stroke-washi2 stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]';

export const CantarButton = ({
  isOpen,
  isEnabled,
  isReady,
  isGlowing,
  buttonRef,
  onToggle,
}: CantarButtonProps) => (
  <button
    ref={buttonRef}
    type="button"
    disabled={!isEnabled}
    aria-haspopup="menu"
    aria-expanded={isOpen}
    aria-controls={isOpen ? CANTAR_MENU_ID : undefined}
    aria-label={CANTAR_COPY.description}
    onClick={onToggle}
    class={`relative grid size-[66px] [transform:rotate(-4deg)] cursor-pointer place-items-center rounded-[11px] p-0 shadow-[0_0_0_2.5px_var(--color-washi),4px_5px_0_2px_rgb(0_0_0/0.35)] [transition:transform_150ms_ease,background-color_200ms_ease,opacity_300ms_ease] before:absolute before:inset-1 before:rounded-[8px] before:shadow-[inset_0_0_0_1.5px_var(--color-washi)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white hover:enabled:[transform:rotate(-4deg)_translateY(-3px)] disabled:cursor-default disabled:opacity-30 narrow:size-14 narrow:rounded-[10px] ${isOpen ? 'bg-red' : 'bg-ink'} ${isGlowing && isEnabled ? 'animate-cantar-ready motion-reduce:animate-none' : ''}`}
  >
    <Icon name={isOpen ? 'cross' : 'plus'} class={ICON} />
    {isReady ? (
      <span
        title={CANTAR_COPY.ready}
        class="absolute -top-[7px] -right-[7px] size-4 animate-dot-ready rounded-[4px] bg-red shadow-[0_0_0_2px_var(--color-washi)] motion-reduce:animate-none"
      />
    ) : null}
  </button>
);
