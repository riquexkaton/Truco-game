import type { ComponentChildren } from 'preact';

interface PaperTagProps {
  readonly dot: string;
  readonly size: 'md' | 'sm';
  readonly class?: string;
  readonly children: ComponentChildren;
}

const SIZES = {
  md: { tag: 'text-[10px]', inner: 'px-3 py-[5px]' },
  sm: { tag: 'text-[9px]', inner: 'px-2.5 py-1' },
};

export const PaperTag = ({ dot, size, class: className = '', children }: PaperTagProps) => (
  <span
    class={`flex items-center gap-2 bg-washi2 p-[3px] font-extrabold tracking-[0.3em] whitespace-nowrap text-ink shadow-[0_0_0_1px_var(--color-ink),0_8px_18px_rgb(0_0_0/0.5)] ${SIZES[size].tag} ${className}`}
  >
    <span
      class={`flex items-center gap-2 shadow-[inset_0_0_0_1.5px_var(--color-ink)] ${SIZES[size].inner}`}
    >
      <i class={`block size-2 -rotate-4 rounded-[2px] ${dot}`} />
      {children}
    </span>
  </span>
);
