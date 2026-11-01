import { PendingDots } from '@ui/atoms/PendingDots';
import type { Tone } from '@ui/copy/headline';
import type { MarkView } from '@ui/hud/hud-view';
import { VOICE_ANCHOR } from '@ui/organisms/hud-slots';

interface MarkProps {
  readonly mark: MarkView | null;
}

const DOTS: Readonly<Record<Tone, string>> = {
  win: 'bg-green',
  lose: 'bg-red',
  tie: 'bg-tie',
  ink: 'bg-ink',
  rule: 'bg-rule',
};

const FRAMES = {
  plain: {
    outer:
      'shadow-[0_0_0_1px_var(--color-ink),0_10px_24px_rgb(0_0_0/0.55)] tall:shadow-[0_0_0_1px_var(--color-ink),0_8px_18px_rgb(0_0_0/0.5)]',
    inner: 'shadow-[inset_0_0_0_1.5px_var(--color-ink)]',
  },
  rival: {
    outer:
      'shadow-[0_0_0_1.5px_var(--color-red),0_10px_24px_rgb(0_0_0/0.55),0_0_18px_rgb(142_42_42/0.45)] tall:shadow-[0_0_0_1.5px_var(--color-red),0_8px_18px_rgb(0_0_0/0.5),0_0_18px_rgb(142_42_42/0.45)]',
    inner: 'shadow-[inset_0_0_0_1.5px_var(--color-red)]',
  },
};

const PLACE = `pointer-events-none fixed ${VOICE_ANCHOR} z-7 w-max max-w-[min(424px,calc(100vw-40px))] animate-column-mark motion-reduce:animate-none tall:top-[calc(128px+env(safe-area-inset-top,0px))] tall:right-auto tall:bottom-auto tall:left-1/2 tall:z-5 tall:max-w-[calc(100vw-28px)] tall:-translate-x-1/2 tall:animate-mark tall:motion-reduce:animate-none`;

const TEXT = {
  title:
    'text-[15px] leading-[1.2] font-extrabold tracking-[0.2em] tall:text-[10px] tall:leading-tight tall:tracking-[0.25em]',
  detail:
    'text-[15px] leading-[1.35] font-semibold text-ink/85 tall:text-[11px] tall:leading-snug tall:text-ink/75',
};

export const Mark = ({ mark }: MarkProps) => {
  if (mark === null) return null;
  const frame = mark.isRival === true ? FRAMES.rival : FRAMES.plain;
  return (
    <div key={mark.id} aria-hidden="true" class={PLACE}>
      <span class={`block bg-washi2 p-1 text-ink tall:p-[3px] ${frame.outer}`}>
        <span
          class={`flex items-center gap-3 px-4 py-3 tall:gap-2.5 tall:px-3 tall:py-[7px] ${frame.inner}`}
        >
          <i
            class={`block size-3 shrink-0 -rotate-4 rounded-[2px] tall:size-2.5 ${DOTS[mark.tone]}`}
          />
          <span class="flex min-w-0 flex-col gap-0.5">
            <b class={TEXT.title}>
              {mark.title}
              {mark.isPending === true ? (
                <PendingDots class="ml-2 inline-flex align-middle" />
              ) : null}
            </b>
            <span class={TEXT.detail}>{mark.detail}</span>
          </span>
        </span>
      </span>
    </div>
  );
};
