import type { Side } from '@domain/shared/side';

import type {
  CloseUpCard as CloseUpCardCopy,
  CloseUpModel,
  CloseUpResult,
} from '@ui/copy/close-up-copy';
import { CLOSE_UP_COPY, closeUpTab } from '@ui/copy/close-up-copy';
import { CloseUpCard } from '@ui/molecules/CloseUpCard';
import { ResultStamp } from '@ui/molecules/ResultStamp';
import { SealNote } from '@ui/molecules/SealNote';

interface CloseUpDuelProps {
  readonly model: CloseUpModel;
  readonly onShow: (side: Side) => void;
}

interface ColumnProps {
  readonly card: CloseUpCardCopy;
  readonly model: CloseUpModel;
}

const TAB =
  'h-11 cursor-pointer text-[11px] font-extrabold tracking-[2px] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-gilt';

const CardColumn = ({ card, model }: ColumnProps) => (
  <div
    class={`flex flex-col items-center gap-3 tall:gap-3.5 ${card.side === model.shown ? '' : 'tall:hidden'}`}
  >
    <span
      class={`text-[12px] font-extrabold tracking-[4px] tall:text-[11px] ${card.side === 'player' ? 'text-spark' : 'text-washi'}`}
    >
      {card.owner}
      <span class="hidden tall:inline">{` · ${model.duel}`}</span>
    </span>
    <CloseUpCard card={card} isLit={card.side === model.picked} />
    {card.isSealed ? <SealNote /> : null}
  </div>
);

const Versus = ({ result }: { readonly result: CloseUpResult | null }) => (
  <div class="flex flex-col items-center gap-3 self-center tall:hidden">
    <span class="text-[14px] font-extrabold tracking-[4px] text-washi/60">
      {CLOSE_UP_COPY.versus}
    </span>
    {result === null ? null : <ResultStamp result={result} />}
  </div>
);

const TallResult = ({ result }: { readonly result: CloseUpResult | null }) =>
  result === null ? null : (
    <div class="-my-1 hidden tall:block">
      <ResultStamp result={result} />
    </div>
  );

const Tabs = ({ model, onShow }: CloseUpDuelProps) =>
  model.cards.length < 2 ? null : (
    <div class="pointer-events-auto hidden w-[280px] grid-cols-2 shadow-[inset_0_0_0_1.5px_#f2e8d5] tall:grid">
      {model.cards.map((card) => (
        <button
          key={card.side}
          type="button"
          aria-pressed={card.side === model.shown}
          onClick={() => {
            onShow(card.side);
          }}
          class={`${TAB} ${card.side === model.shown ? 'bg-washi text-ink' : 'bg-night/60 text-washi'}`}
        >
          {closeUpTab(card)}
        </button>
      ))}
    </div>
  );

const Footer = () => (
  <span class="text-[11px] font-extrabold tracking-[3px] text-washi/60 tall:text-[9px] tall:tracking-[2.5px]">
    <span class="tall:hidden">
      {`${CLOSE_UP_COPY.click} `}
      <kbd class="rounded-[2px] border border-current px-[5px] py-px font-mincho text-[10px]">
        {CLOSE_UP_COPY.key}
      </kbd>
      {` ${CLOSE_UP_COPY.after}`}
    </span>
    <span class="hidden tall:inline">{CLOSE_UP_COPY.touch}</span>
  </span>
);

export const CloseUpDuel = ({ model, onShow }: CloseUpDuelProps) => {
  const [first, second] = model.cards;
  return (
    <div class="pointer-events-none absolute inset-x-0 top-[70px] flex flex-col items-center gap-[22px] tall:top-[calc(74px+env(safe-area-inset-top,0px))] tall:gap-3.5">
      <span class="text-[12px] font-extrabold tracking-[5px] text-gilt tall:hidden">
        {model.duel}
      </span>
      <div class="flex items-start gap-11">
        {first === undefined ? null : <CardColumn card={first} model={model} />}
        {second === undefined ? null : <Versus result={model.result} />}
        {second === undefined ? null : <CardColumn card={second} model={model} />}
      </div>
      <TallResult result={model.result} />
      <Tabs model={model} onShow={onShow} />
      <Footer />
    </div>
  );
};
