interface HintProps {
  readonly text: string;
  readonly isVisible: boolean;
  readonly isSticky: boolean;
}

const STICKY =
  'narrow:right-1/2 narrow:top-[calc(100px+env(safe-area-inset-top,0px))] narrow:block narrow:translate-x-1/2';

export const Hint = ({ text, isVisible, isSticky }: HintProps) => (
  <div
    aria-hidden={!isVisible}
    class={`pointer-events-none fixed top-[calc(26px+env(safe-area-inset-top,0px))] right-[max(24px,env(safe-area-inset-right,0px))] text-[11px] font-semibold tracking-[0.4em] whitespace-nowrap text-washi-dim transition-opacity duration-600 ${isVisible ? 'opacity-100' : 'opacity-0'} ${isSticky ? STICKY : 'narrow:hidden'}`}
  >
    {text}
  </div>
);
