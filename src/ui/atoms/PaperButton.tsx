import type { ButtonHTMLAttributes, ComponentChildren } from 'preact';

export type PaperButtonVariant = 'main' | 'warn' | 'plain' | 'chip' | 'hero';

type ButtonEvents = Pick<
  ButtonHTMLAttributes,
  'onClick' | 'onFocus' | 'onPointerEnter' | 'onTouchStart'
>;

interface PaperButtonProps extends ButtonEvents {
  readonly variant: PaperButtonVariant;
  readonly children: ComponentChildren;
}

const VARIANTS: Readonly<Record<PaperButtonVariant, string>> = {
  main: 'min-h-11 px-[18px] bg-ink text-washi2',
  warn: 'min-h-11 px-[18px] bg-washi2 text-red shadow-[inset_0_0_0_1.5px_var(--color-red)]',
  plain: 'min-h-11 px-[18px] bg-washi2 text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink)]',
  chip: 'min-h-11 px-3.5 bg-washi2 text-red shadow-[inset_0_0_0_1.5px_var(--color-red)]',
  hero: 'min-h-[46px] px-[34px] bg-ink text-washi2',
};

export const PaperButton = ({ variant, children, ...events }: PaperButtonProps) => (
  <button
    type="button"
    class={`cursor-pointer font-mincho text-[12px] leading-none font-extrabold tracking-[0.18em] transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink ${VARIANTS[variant]}`}
    {...events}
  >
    {children}
  </button>
);
