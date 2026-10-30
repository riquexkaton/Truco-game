import type { SheetHeadline, Tone } from '@ui/copy/headline';

interface HeadlineSheetProps {
  readonly headline: SheetHeadline;
}

const SEAL_BG: Readonly<Record<Tone, string>> = {
  win: 'bg-green',
  lose: 'bg-red',
  tie: 'bg-tie',
  ink: 'bg-ink',
  rule: 'bg-rule',
};

const RESULT_TEXT: Readonly<Record<Tone, string>> = {
  win: 'text-green',
  lose: 'text-red',
  tie: 'text-tie',
  ink: 'text-ink',
  rule: 'text-rule',
};

const LONG_TITLE = 10;

const SheetSeal = ({ headline }: HeadlineSheetProps) => {
  const size =
    headline.seal.length > 1 ? 'text-[36px] tall:text-[30px]' : 'text-[44px] tall:text-[36px]';
  return (
    <span
      class={`grid size-20 shrink-0 -rotate-4 place-items-center leading-none font-extrabold text-washi2 outline-2 -outline-offset-5 outline-washi tall:size-[66px] tall:outline-[1.5px] tall:-outline-offset-4 ${size} ${SEAL_BG[headline.tone]}`}
    >
      {headline.seal}
    </span>
  );
};

export const HeadlineSheet = ({ headline }: HeadlineSheetProps) => (
  <span class="flex items-center gap-[22px] tall:gap-[18px]">
    <SheetSeal headline={headline} />
    <span class="flex min-w-0 flex-col gap-2 tall:gap-1">
      <span
        class={`text-[30px] leading-[1.08] font-extrabold tracking-[3px] tall:leading-[1.05] ${headline.title.length > LONG_TITLE ? 'tall:text-[24px] tall:tracking-[1.5px]' : 'tall:text-[27px] tall:tracking-[2px]'}`}
      >
        {headline.title}
      </span>
      {headline.body === '' ? null : (
        <span class="text-[15px] leading-[1.3] font-semibold tall:text-[13px]">
          {headline.body}
        </span>
      )}
      {headline.result === '' ? null : (
        <span
          class={`text-[15px] font-extrabold tracking-[3.5px] tall:text-[12px] tall:tracking-[2px] ${RESULT_TEXT[headline.tone]}`}
        >
          {headline.result}
        </span>
      )}
    </span>
  </span>
);
