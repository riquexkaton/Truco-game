import type { TitleCard } from '@ui/art/title-deck';

interface FaceProps {
  readonly card: TitleCard;
}

export const cardNameId = (card: TitleCard): string => `title-card-${card.id}`;

export const cardChipId = (card: TitleCard): string => `title-card-${card.id}-chip`;

const NameTag = ({ card }: FaceProps) => (
  <span class="absolute top-[22px] left-[22px] bg-washi2 p-[3px] shadow-[0_0_0_1px_var(--color-ink)]">
    <span
      id={cardNameId(card)}
      class="block px-[7px] py-[10px] text-[17px] leading-none font-extrabold tracking-[0.08em] shadow-[inset_0_0_0_1.5px_var(--color-ink)] [text-orientation:upright] [writing-mode:vertical-rl]"
    >
      {card.label}
    </span>
  </span>
);

const NumberSeal = ({ card }: FaceProps) => (
  <span
    aria-hidden="true"
    class={`absolute top-[22px] right-[22px] grid size-[38px] -rotate-4 place-items-center rounded-[6px] text-[17px] font-extrabold text-washi2 ${card.isPlayable ? 'bg-red' : 'bg-ink'}`}
  >
    <span class="absolute inset-[3px] rounded-[4px] shadow-[inset_0_0_0_1.5px_var(--color-washi)]" />
    <span class="relative">{card.slot + 1}</span>
  </span>
);

const ChipFooter = ({ card }: FaceProps) => (
  <span class="absolute right-[14px] bottom-[14px] left-[14px] flex h-[67px] items-center justify-center border-t-[1.5px] border-ink pattern-sg-ink">
    <span
      id={cardChipId(card)}
      class="bg-washi2 px-3 py-[5px] text-[12.5px] font-extrabold shadow-[0_0_0_1px_var(--color-ink)]"
    >
      {card.chip}
    </span>
  </span>
);

export const MenuCardFace = ({ card }: FaceProps) => (
  <>
    <img
      src={card.art}
      alt=""
      width={242}
      height={310}
      decoding="async"
      fetchpriority="low"
      class="absolute top-[14px] left-[14px] h-[310px] w-[242px] max-w-none object-cover object-[50%_15%]"
    />
    <NameTag card={card} />
    <NumberSeal card={card} />
    <ChipFooter card={card} />
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-[7px] border-[1.5px] border-ink"
    />
  </>
);
