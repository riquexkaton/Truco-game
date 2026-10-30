import type { Tone } from '@ui/copy/headline';
import type { MarkView } from '@ui/hud/hud-view';

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

export const Mark = ({ mark }: MarkProps) =>
  mark === null ? null : (
    <div
      key={mark.id}
      aria-hidden="true"
      class="pointer-events-none fixed top-[calc(56px+env(safe-area-inset-top,0px))] right-[max(20px,env(safe-area-inset-right,0px))] z-5 max-w-[min(400px,calc(100vw-40px))] animate-mark motion-reduce:animate-none tall:top-[calc(128px+env(safe-area-inset-top,0px))] tall:right-auto tall:left-1/2 tall:w-max tall:max-w-[calc(100vw-28px)] tall:-translate-x-1/2"
    >
      <span class="block bg-washi2 p-[3px] text-ink shadow-[0_0_0_1px_var(--color-ink),0_8px_18px_rgb(0_0_0/0.5)]">
        <span class="flex items-center gap-2.5 px-3 py-[7px] shadow-[inset_0_0_0_1.5px_var(--color-ink)]">
          <i class={`block size-2.5 shrink-0 -rotate-4 rounded-[2px] ${DOTS[mark.tone]}`} />
          <span class="flex min-w-0 flex-col gap-0.5">
            <b class="text-[10px] leading-tight font-extrabold tracking-[0.25em]">{mark.title}</b>
            <span class="text-[11px] leading-snug font-semibold text-ink/75">{mark.detail}</span>
          </span>
        </span>
      </span>
    </div>
  );
