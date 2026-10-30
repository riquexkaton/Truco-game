import { SHEET_COPY } from '@ui/copy/hud-copy';
import type { HeadlineView } from '@ui/hud/hud-view';
import { HeadlineSheet } from '@ui/molecules/HeadlineSheet';
import { SIDE_SLOT } from '@ui/organisms/hud-slots';

interface HeadlineProps {
  readonly headline: HeadlineView | null;
  readonly onClose: () => void;
}

const SHEET = `${SIDE_SLOT} flex cursor-pointer flex-col gap-4 rounded-[3px] bg-washi px-[22px] py-6 text-left font-mincho text-ink shadow-[inset_0_0_0_1.5px_#1e1a16,0_16px_36px_rgb(0_0_0/0.65)] animate-card-in motion-reduce:animate-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-washi tall:gap-3.5 tall:p-[18px]`;

export const Headline = ({ headline, onClose }: HeadlineProps) =>
  headline === null ? null : (
    <button
      key={headline.id}
      type="button"
      aria-label={`${headline.text} ${SHEET_COPY.close}`}
      onClick={onClose}
      class={SHEET}
    >
      <HeadlineSheet headline={headline.headline} />
    </button>
  );
