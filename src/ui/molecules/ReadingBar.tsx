import { CONTINUE_COPY } from '@ui/copy/hud-copy';

interface ReadingBarProps {
  readonly duration: number;
  readonly isDark: boolean;
}

const LOOKS = {
  dark: { track: 'bg-washi/20', fill: 'bg-gilt', text: 'text-washi/65' },
  paper: { track: 'bg-ink/15', fill: 'bg-ink', text: 'text-ink/60' },
};

export const ReadingBar = ({ duration, isDark }: ReadingBarProps) => {
  const look = isDark ? LOOKS.dark : LOOKS.paper;
  return (
    <span class="flex items-center gap-3 tall:gap-2.5">
      <span aria-hidden="true" class={`block h-[2px] flex-1 ${look.track}`}>
        <span
          class={`block h-full origin-left animate-read motion-reduce:animate-none ${look.fill}`}
          style={{ animationDuration: `${String(duration)}ms` }}
        />
      </span>
      <span
        aria-hidden="true"
        class={`shrink-0 text-[11px] font-extrabold tracking-[2px] tall:text-[10px] ${look.text}`}
      >
        <span class="tall:hidden">
          {`${CONTINUE_COPY.click} `}
          <kbd class="rounded-[2px] border border-current px-[5px] py-px font-mincho text-[10px]">
            {CONTINUE_COPY.key}
          </kbd>
          {` ${CONTINUE_COPY.after}`}
        </span>
        <span class="hidden tall:inline">{CONTINUE_COPY.touch}</span>
      </span>
    </span>
  );
};
