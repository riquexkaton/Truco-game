import { Icon } from '@ui/atoms/Icon';

export type BandLook = 'red' | 'gilt' | 'ink';

type PointerLook = 'solid' | 'paper';

interface CardDecorProps {
  readonly band: BandLook | null;
  readonly isBandWideOnly: boolean;
  readonly pointer: PointerLook | null;
  readonly hasCandle: boolean;
}

const RED_STRIPES = 'bg-[repeating-linear-gradient(135deg,#8e2a2a_0_6px,#a8403a_6px_12px)]';

const BANDS: Readonly<Record<BandLook, string>> = {
  red: RED_STRIPES,
  gilt: `${RED_STRIPES} shadow-[0_2px_0_var(--color-gilt)]`,
  ink: 'bg-[repeating-linear-gradient(135deg,#1e1a16_0_6px,#3b342c_6px_12px)]',
};

const POINTERS: Readonly<Record<PointerLook, string>> = {
  solid: 'bg-red',
  paper: 'bg-washi shadow-[inset_1.5px_1.5px_0_var(--color-red)]',
};

const Candle = () => (
  <span
    aria-hidden="true"
    class="absolute -top-[13px] right-[18px] z-1 grid size-8 -rotate-4 place-items-center rounded-[5px] bg-red shadow-[inset_0_0_0_3px_var(--color-red),inset_0_0_0_4px_var(--color-washi),0_4px_10px_rgb(0_0_0/0.45)] tall:hidden"
  >
    <Icon
      name="candle"
      class="size-4 fill-none stroke-washi stroke-[1.7] [stroke-linecap:round] [stroke-linejoin:round]"
    />
  </span>
);

export const CardDecor = ({ band, isBandWideOnly, pointer, hasCandle }: CardDecorProps) => (
  <>
    {band === null ? null : (
      <span
        aria-hidden="true"
        class={`absolute inset-x-0 top-0 h-[7px] rounded-t-[3px] ${BANDS[band]} ${isBandWideOnly ? 'tall:hidden' : ''}`}
      />
    )}
    {pointer === null ? null : (
      <span
        aria-hidden="true"
        class={`absolute -top-2 left-1/2 -ml-[7px] hidden size-3.5 rotate-45 tall:block ${POINTERS[pointer]}`}
      />
    )}
    {hasCandle ? <Candle /> : null}
  </>
);
