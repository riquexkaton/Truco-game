import type { Side } from '@domain/shared/side';

import type { StripCopy } from '@ui/copy/hud-copy';

interface TurnStripProps {
  readonly strip: (StripCopy & { readonly id: number; readonly side: Side }) | null;
}

const LOOK: Readonly<Record<Side, { readonly strip: string; readonly end: string }>> = {
  player: {
    strip: 'animate-strip-you pl-[76px] narrow:pl-[58px]',
    end: 'left-[10.5px] border-r-[1.5px] pattern-sg-green',
  },
  rival: {
    strip: 'animate-strip-rival pr-[76px] narrow:pr-[58px]',
    end: 'right-[10.5px] border-l-[1.5px] pattern-asa-red',
  },
};

export const TurnStrip = ({ strip }: TurnStripProps) =>
  strip === null ? null : (
    <div
      key={strip.id}
      aria-hidden="true"
      class={`paper-rule pointer-events-none fixed top-[33%] left-1/2 flex h-[98px] w-[min(520px,calc(100vw-32px))] [transform:translate(-50%,-50%)] flex-col items-center justify-center gap-1.5 bg-washi px-7 text-ink opacity-0 shadow-[0_24px_50px_rgb(0_0_0/0.65)] [--rule-inset:9px] narrow:h-[84px] narrow:px-[18px] tall:top-[calc(114px+env(safe-area-inset-top,0px))] ${LOOK[strip.side].strip}`}
    >
      <i
        class={`absolute top-[10.5px] bottom-[10.5px] w-[50px] border-ink narrow:w-9 ${LOOK[strip.side].end}`}
      />
      <b class="pl-[0.2em] text-[clamp(18px,3.6vw,26px)] font-extrabold tracking-[0.2em] whitespace-nowrap">
        {strip.title}
      </b>
      <span class="pl-[0.3em] text-[10px] font-extrabold tracking-[0.3em] text-ink/65 narrow:tracking-[0.2em]">
        {strip.subtitle}
      </span>
    </div>
  );
