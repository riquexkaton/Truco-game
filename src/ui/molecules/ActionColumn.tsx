import type { ComponentChildren } from 'preact';

interface ActionColumnProps {
  readonly label: string;
  readonly children: ComponentChildren;
}

export const ActionColumn = ({ label, children }: ActionColumnProps) => (
  <div class="relative flex flex-col items-center gap-1.5">
    {children}
    <span
      aria-hidden="true"
      class="pointer-events-none pl-[0.16em] text-[8px] font-extrabold tracking-[0.16em] text-white/85 narrow:text-[7px]"
    >
      {label}
    </span>
  </div>
);
