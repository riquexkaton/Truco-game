import { cardArtUrl } from '@ui/art/art-urls';
import type { CardFace, DuelHeadline, Tone } from '@ui/copy/headline';

interface DuelBandProps {
  readonly headline: DuelHeadline;
}

type ThumbState = 'won' | 'lost' | 'even';

const THUMBS: Readonly<Record<ThumbState, string>> = {
  won: 'bg-washi shadow-[0_0_0_1.5px_#c9a35a,0_0_16px_rgb(255_178_87/0.5)]',
  lost: 'bg-washi-warm opacity-60',
  even: 'bg-washi',
};

const RESULT_BG: Readonly<Record<Tone, string>> = {
  win: 'bg-green',
  lose: 'bg-red',
  tie: 'bg-tie',
  ink: 'bg-ink',
  rule: 'bg-rule',
};

const thumbStates = (tone: Tone): readonly [ThumbState, ThumbState] => {
  if (tone === 'win') return ['lost', 'won'];
  return tone === 'lose' ? ['won', 'lost'] : ['even', 'even'];
};

const DuelThumb = ({ face, state }: { readonly face: CardFace; readonly state: ThumbState }) => (
  <span
    class={`relative block h-[124px] w-[86px] p-[3px] tall:h-24 tall:w-[66px] tall:p-[2px] ${THUMBS[state]}`}
  >
    <img src={cardArtUrl(face.cardId)} alt="" class="block size-full object-cover" />
    <span class="absolute bottom-[5px] left-[5px] grid size-6 place-items-center bg-ink text-[13px] font-extrabold text-washi tall:bottom-1 tall:left-1 tall:size-5 tall:text-[11px]">
      {face.attack}
    </span>
  </span>
);

export const DuelBand = ({ headline }: DuelBandProps) => {
  const [rivalState, playerState] = thumbStates(headline.tone);
  return (
    <span class="grid grid-cols-[86px_minmax(0,1fr)_86px] items-center gap-4 tall:grid-cols-[66px_minmax(0,1fr)_66px] tall:gap-2">
      <DuelThumb face={headline.rival} state={rivalState} />
      <span class="flex min-w-0 flex-col items-center gap-2 text-center tall:gap-[5px]">
        <span class="text-[11px] font-extrabold tracking-[3px] text-gilt tall:text-[10px]">
          {headline.tag}
        </span>
        <span class="text-[28px] leading-[1.05] font-extrabold tracking-[2px] text-washi2 tall:text-[17px] tall:tracking-[0.5px]">
          {headline.title}
        </span>
        <span class="text-[15px] leading-[1.35] font-semibold tall:text-[12px] tall:leading-[1.3]">
          {headline.body}
        </span>
        <span
          class={`-rotate-3 px-2.5 py-1 text-[12px] font-extrabold tracking-[2.5px] text-washi2 tall:px-2 tall:py-[3px] tall:text-[10px] tall:tracking-[1.5px] ${RESULT_BG[headline.tone]}`}
        >
          {headline.result}
        </span>
      </span>
      <DuelThumb face={headline.player} state={playerState} />
    </span>
  );
};
