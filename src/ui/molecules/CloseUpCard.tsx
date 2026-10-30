import { cardArtUrl } from '@ui/art/art-urls';
import type { CloseUpCard as CloseUpCardCopy } from '@ui/copy/close-up-copy';

interface CloseUpCardProps {
  readonly card: CloseUpCardCopy;
  readonly isLit: boolean;
}

const FRAME =
  'relative flex w-[270px] flex-col gap-2.5 rounded-[4px] bg-washi p-2.5 text-ink tall:h-[372px] tall:w-[252px] tall:gap-2 tall:p-[9px] tall:opacity-100 tall:shadow-[inset_0_0_0_1.5px_#1e1a16,0_0_0_2px_#c9a35a,0_30px_60px_rgb(0_0_0/0.75)]';

const LOOKS = {
  lit: 'shadow-[0_0_0_2px_#c9a35a,0_0_30px_rgb(255_178_87/0.45),0_30px_60px_rgb(0_0_0/0.75)]',
  calm: 'opacity-[0.82] shadow-[0_0_0_1px_rgb(201_163_90/0.5),0_30px_60px_rgb(0_0_0/0.75)]',
};

export const CloseUpCard = ({ card, isLit }: CloseUpCardProps) => (
  <div class={`${FRAME} ${isLit ? LOOKS.lit : LOOKS.calm}`}>
    <img
      src={cardArtUrl(card.cardId)}
      alt=""
      class="block h-[330px] w-[250px] object-cover object-[50%_25%] shadow-[0_0_0_1.5px_#1e1a16] tall:h-[300px] tall:w-[234px]"
    />
    <span class="flex items-baseline justify-between px-1 tall:items-center">
      <span class="text-[21px] font-extrabold tracking-[3px] tall:text-[19px]">{card.name}</span>
      <span class="text-[11px] font-extrabold tracking-[2px] text-[#4e5a6b] tall:text-[10px]">
        {card.faction}
      </span>
    </span>
    <span class="absolute top-[292px] left-[18px] grid size-11 place-items-center bg-ink text-[22px] font-extrabold text-washi shadow-[inset_0_0_0_2px_#1e1a16,inset_0_0_0_3px_#f2e8d5] tall:top-[262px] tall:left-4 tall:size-10 tall:text-[20px]">
      {card.attack}
    </span>
  </div>
);
