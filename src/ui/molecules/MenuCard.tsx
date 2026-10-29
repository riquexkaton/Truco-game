import type { ButtonHTMLAttributes } from 'preact';

import type { TitleCard } from '@ui/art/title-deck';
import { cardChipId, cardNameId, MenuCardFace } from '@ui/molecules/MenuCardFace';

export type MenuCardEvents = Pick<
  ButtonHTMLAttributes,
  | 'onClick'
  | 'onFocus'
  | 'onBlur'
  | 'onMouseEnter'
  | 'onMouseLeave'
  | 'onPointerEnter'
  | 'onTouchStart'
>;

interface MenuCardProps {
  readonly card: TitleCard;
  readonly events: MenuCardEvents;
}

const ANGLES = [-11, -4, 4, 11];
const DROPS = [60, 14, 14, 60];
const CHOSEN_LIFT = 56;
const CHOSEN_LAYER = 10;

const CHOSEN_LOOK =
  'cursor-pointer shadow-[0_0_0_2px_var(--color-gold-seal),0_0_70px_rgb(255_140_60/0.45),0_30px_60px_rgb(0_0_0/0.75)]';
const RESTING_LOOK = 'cursor-default shadow-[0_24px_50px_rgb(0_0_0/0.7)]';

const slotStyle = ({ slot, isPlayable }: TitleCard) => {
  const angle = ANGLES[slot] ?? 0;
  const drop = (DROPS[slot] ?? 0) - (isPlayable ? CHOSEN_LIFT : 0);
  return {
    left: `calc(75px + ${String(slot)} * var(--step))`,
    transform: `rotate(${String(angle)}deg) translateY(${String(drop)}px)`,
    zIndex: isPlayable ? CHOSEN_LAYER : slot + 1,
    '--deal-x': `calc(${String(1.5 - slot)} * var(--step))`,
    '--deal-r': `${String(-angle)}deg`,
  };
};

export const MenuCard = ({ card, events }: MenuCardProps) => (
  <div class="absolute top-[28px] h-[405px] w-[270px] origin-bottom" style={slotStyle(card)}>
    <button
      type="button"
      aria-labelledby={cardNameId(card)}
      aria-describedby={cardChipId(card)}
      aria-disabled={card.isPlayable ? undefined : 'true'}
      class={`relative block size-full bg-washi p-0 text-left font-mincho text-ink transition-[translate,box-shadow] duration-200 hover:-translate-y-3.5 focus-visible:outline-3 focus-visible:outline-offset-[6px] focus-visible:outline-gold-seal motion-safe:animate-deal-in motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${card.isPlayable ? CHOSEN_LOOK : RESTING_LOOK}`}
      style={{ animationDelay: `${String(150 + 120 * card.slot)}ms` }}
      {...events}
    >
      {card.isPlayable ? (
        <span
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 motion-safe:animate-aura"
        />
      ) : null}
      <MenuCardFace card={card} />
    </button>
  </div>
);
