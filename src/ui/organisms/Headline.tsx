import { CONTINUE_COPY } from '@ui/copy/hud-copy';
import type { HeadlineCopy } from '@ui/copy/headline';
import type { HeadlineView } from '@ui/hud/hud-view';
import { isContinueKey, useCapturedKey } from '@ui/keyboard/captured-keys';
import { CardDecor } from '@ui/molecules/CardDecor';
import { DuelBand } from '@ui/molecules/DuelBand';
import { HeadlineSheet } from '@ui/molecules/HeadlineSheet';
import { ReadingBar } from '@ui/molecules/ReadingBar';
import { CORNER_SLOT, SIDE_SLOT } from '@ui/organisms/hud-slots';

interface HeadlineProps {
  readonly headline: HeadlineView | null;
  readonly onContinue: () => void;
}

interface HeadlineButtonProps {
  readonly view: HeadlineView;
  readonly onContinue: () => void;
}

const BUTTON =
  'flex cursor-pointer flex-col text-left font-mincho animate-card-in motion-reduce:animate-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-washi';

const SHEET = `${SIDE_SLOT} gap-4 rounded-[3px] bg-washi px-[22px] pt-6 pb-4 text-ink tall:gap-3.5 tall:p-[18px] tall:pb-3.5`;

const SHEET_FRAMES = {
  rival: 'shadow-[inset_0_0_0_1.5px_#8e2a2a,0_16px_36px_rgb(0_0_0/0.65)]',
  plain: 'shadow-[inset_0_0_0_1.5px_#1e1a16,0_16px_36px_rgb(0_0_0/0.65)]',
};

const DUEL = `${CORNER_SLOT} gap-3.5 rounded-[3px] bg-night/88 px-5 pt-[18px] pb-3.5 text-washi tall:gap-3 tall:rounded-none tall:border-y tall:border-gilt/70 tall:bg-night/86 tall:p-3.5 tall:pb-3`;

const DUEL_GLOWS = {
  win: 'shadow-[inset_0_0_0_1px_rgb(201_163_90/0.75),0_16px_36px_rgb(0_0_0/0.65),0_0_40px_rgb(78_107_46/0.35)] tall:shadow-[0_0_40px_rgb(78_107_46/0.35)]',
  lose: 'shadow-[inset_0_0_0_1px_rgb(201_163_90/0.75),0_16px_36px_rgb(0_0_0/0.65),0_0_40px_rgb(142_42_42/0.35)] tall:shadow-[0_0_40px_rgb(142_42_42/0.35)]',
  even: 'shadow-[inset_0_0_0_1px_rgb(201_163_90/0.75),0_16px_36px_rgb(0_0_0/0.65)] tall:shadow-none',
};

const frameOf = (headline: HeadlineCopy): string => {
  if (headline.look === 'sheet') {
    return `${SHEET} ${headline.isRival ? SHEET_FRAMES.rival : SHEET_FRAMES.plain}`;
  }
  if (headline.tone === 'win') return `${DUEL} ${DUEL_GLOWS.win}`;
  return `${DUEL} ${headline.tone === 'lose' ? DUEL_GLOWS.lose : DUEL_GLOWS.even}`;
};

const HeadlineFace = ({ headline }: { readonly headline: HeadlineCopy }) => {
  if (headline.look === 'duel') return <DuelBand headline={headline} />;
  return (
    <>
      {headline.isRival ? <CardDecor band="red" isBandWideOnly pointer="paper" hasCandle /> : null}
      <HeadlineSheet headline={headline} />
    </>
  );
};

const HeadlineButton = ({ view, onContinue }: HeadlineButtonProps) => {
  useCapturedKey((event) => (isContinueKey(event) ? onContinue : null));
  const { headline } = view;
  return (
    <button
      type="button"
      aria-label={`${view.text} ${CONTINUE_COPY.label}`}
      onClick={onContinue}
      class={`${BUTTON} ${frameOf(headline)}`}
    >
      <HeadlineFace headline={headline} />
      <ReadingBar duration={view.duration} isDark={headline.look === 'duel'} />
    </button>
  );
};

export const Headline = ({ headline, onContinue }: HeadlineProps) =>
  headline === null ? null : (
    <HeadlineButton key={headline.id} view={headline} onContinue={onContinue} />
  );
