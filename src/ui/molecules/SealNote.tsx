import { Icon } from '@ui/atoms/Icon';
import { CLOSE_UP_COPY } from '@ui/copy/close-up-copy';

export const SealNote = () => (
  <p class="flex max-w-[270px] items-start gap-2 text-[12px] leading-[1.4] font-semibold text-washi tall:max-w-[280px] tall:text-[11px]">
    <Icon name="sealStar" class="mt-0.5 size-3.5 shrink-0 fill-gilt" />
    <span>
      <b class="font-extrabold tracking-[2px] text-gilt">{CLOSE_UP_COPY.seal}</b>
      {` · ${CLOSE_UP_COPY.sealRule}`}
    </span>
  </p>
);
