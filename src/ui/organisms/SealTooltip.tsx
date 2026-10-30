import type { SealHover } from '@application/ports/table-listener';

import { Icon } from '@ui/atoms/Icon';
import { CLOSE_UP_COPY } from '@ui/copy/close-up-copy';

interface SealTooltipProps {
  readonly hover: SealHover | null;
}

const WIDTH = 232;
const GAP = 25;
const EDGE = 8;
const ARROW_CENTER = 28;
const ANCHOR = 0.365;

const placement = ({ rect }: SealHover) => ({
  left: `${String(Math.max(EDGE, rect.left - GAP - WIDTH))}px`,
  top: `${String(Math.max(EDGE, rect.top + rect.height * ANCHOR - ARROW_CENTER))}px`,
});

export const SealTooltip = ({ hover }: SealTooltipProps) =>
  hover === null ? null : (
    <div
      role="tooltip"
      style={placement(hover)}
      class="pointer-events-none fixed z-5 flex w-[232px] flex-col gap-1.5 rounded-[3px] bg-washi px-3.5 py-3 font-mincho text-ink shadow-[inset_0_0_0_1.5px_#c9a35a,0_12px_26px_rgb(0_0_0/0.6)]"
    >
      <span
        aria-hidden="true"
        class="absolute top-[22px] -right-[7px] size-3 rotate-45 bg-washi shadow-[inset_-1.5px_1.5px_0_#c9a35a]"
      />
      <span class="flex items-center gap-[7px] text-[12px] font-extrabold tracking-[2.5px] text-[#8a6a24]">
        <Icon name="sealStar" class="size-3.5 fill-gold-seal" />
        {CLOSE_UP_COPY.seal}
      </span>
      <span class="text-[13px] leading-[1.4] font-semibold">{CLOSE_UP_COPY.sealRule}</span>
    </div>
  );
