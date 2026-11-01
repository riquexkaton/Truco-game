import type { Side } from '@domain/shared/side';

import type { StripCopy } from '@ui/copy/hud-copy';
import { VOICE_ANCHOR } from '@ui/organisms/hud-slots';

interface TurnStripProps {
  readonly strip: (StripCopy & { readonly id: number; readonly side: Side }) | null;
}

const LOOK: Readonly<Record<Side, { readonly strip: string; readonly end: string }>> = {
  player: {
    strip: 'animate-column-you pl-[76px] narrow:pl-[58px] tall:animate-strip-you',
    end: 'left-[10.5px] border-r-[1.5px] pattern-sg-green',
  },
  rival: {
    strip: 'animate-column-rival pr-[76px] narrow:pr-[58px] tall:animate-strip-rival',
    end: 'right-[10.5px] border-l-[1.5px] pattern-asa-red',
  },
};

const PLACE = `fixed ${VOICE_ANCHOR} w-[min(424px,calc(100vw-40px))] tall:top-[calc(114px+env(safe-area-inset-top,0px))] tall:right-auto tall:bottom-auto tall:left-1/2 tall:w-[min(520px,calc(100vw-32px))] tall:[transform:translate(-50%,-50%)]`;

const TITLE =
  'pl-[0.2em] text-[22px] font-extrabold tracking-[0.2em] whitespace-nowrap tall:text-[clamp(18px,3.6vw,26px)]';

const SUBTITLE =
  'pl-[0.3em] text-[13px] font-extrabold tracking-[0.24em] text-ink/75 narrow:tracking-[0.2em] tall:text-[10px] tall:tracking-[0.3em] tall:text-ink/65 tall:narrow:tracking-[0.2em]';

export const TurnStrip = ({ strip }: TurnStripProps) =>
  strip === null ? null : (
    <div
      key={strip.id}
      aria-hidden="true"
      class={`paper-rule pointer-events-none ${PLACE} flex h-[98px] flex-col items-center justify-center gap-1.5 bg-washi px-7 text-ink opacity-0 shadow-[0_24px_50px_rgb(0_0_0/0.65)] [--rule-inset:9px] narrow:h-[84px] narrow:px-[18px] ${LOOK[strip.side].strip}`}
    >
      <i
        class={`absolute top-[10.5px] bottom-[10.5px] w-[50px] border-ink narrow:w-9 ${LOOK[strip.side].end}`}
      />
      <b class={TITLE}>{strip.title}</b>
      <span class={SUBTITLE}>{strip.subtitle}</span>
    </div>
  );
