import { useRef } from 'preact/hooks';

import type { TitleCard } from '@ui/art/title-deck';
import { TITLE_DECK } from '@ui/art/title-deck';
import { MENU_COPY } from '@ui/copy/menu-copy';
import type { MenuCardEvents } from '@ui/molecules/MenuCard';
import { MenuCard } from '@ui/molecules/MenuCard';
import { useFitScale } from '@ui/organisms/use-fit-scale';

interface MenuFanProps {
  readonly onIntent: () => void;
  readonly onStart: () => void;
  readonly onHint: (card: TitleCard | null) => void;
}

const cardEvents = (card: TitleCard, props: MenuFanProps): MenuCardEvents => {
  const show = () => {
    props.onHint(card);
  };
  const hide = () => {
    props.onHint(null);
  };
  const hints = { onMouseEnter: show, onMouseLeave: hide, onBlur: hide };
  if (!card.isPlayable) return { ...hints, onFocus: show };
  return {
    ...hints,
    onFocus: () => {
      props.onIntent();
      show();
    },
    onPointerEnter: props.onIntent,
    onTouchStart: props.onIntent,
    onClick: props.onStart,
  };
};

export const MenuFan = (props: MenuFanProps) => {
  const slot = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const scale = useFitScale({ slot, box });
  return (
    <nav
      ref={slot}
      aria-label={MENU_COPY.nav}
      class="relative mx-4 mt-[clamp(0px,3vh,28px)] min-h-0 flex-1"
    >
      <div
        ref={box}
        class="absolute top-1/2 left-1/2 h-[520px] w-[1020px] [--step:200px] narrow:w-[900px] narrow:[--step:160px]"
        style={{ transform: `translate(-50%, -50%) scale(${String(scale)})` }}
      >
        {TITLE_DECK.map((card) => (
          <MenuCard key={card.id} card={card} events={cardEvents(card, props)} />
        ))}
      </div>
    </nav>
  );
};
