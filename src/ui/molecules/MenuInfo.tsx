import type { TitleCard } from '@ui/art/title-deck';
import { MENU_COPY } from '@ui/copy/menu-copy';

interface MenuInfoProps {
  readonly card: TitleCard | null;
}

const InfoTag = ({ card }: { readonly card: TitleCard }) => (
  <div class="bg-washi2 p-1 shadow-[0_0_0_1px_var(--color-ink)]">
    <p class="flex items-center gap-3 py-[5px] pr-[18px] pl-2 text-[13px] leading-[1.2] font-extrabold tracking-[0.3em] text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink)] narrow:gap-2 narrow:text-[12px] narrow:tracking-[0.18em]">
      <span
        aria-hidden="true"
        class={`grid size-[22px] -rotate-4 place-items-center rounded-[4px] text-[12px] tracking-normal text-washi2 ${card.isPlayable ? 'bg-red' : 'bg-ink'}`}
      >
        {card.slot + 1}
      </span>
      {card.label}
      {card.isPlayable ? null : <span class="text-red">{MENU_COPY.soon}</span>}
    </p>
  </div>
);

export const MenuInfo = ({ card }: MenuInfoProps) => (
  <div class="relative shrink-0 px-4 pt-2 pb-[clamp(16px,4vh,40px)]">
    <div
      aria-live="polite"
      class="flex min-h-[78px] justify-center text-center narrow:min-h-[116px]"
    >
      {card === null ? null : (
        <div key={card.id} class="flex flex-col items-center gap-3 motion-safe:animate-info-in">
          <InfoTag card={card} />
          <p class="max-w-[820px] text-[16px] leading-normal font-semibold text-washi-warm narrow:text-[14px]">
            {card.description}
          </p>
        </div>
      )}
    </div>
  </div>
);
