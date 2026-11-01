import { FALTA_COPY, faltaLabel } from '@ui/copy/hud-copy';
import type { RaiseSpec } from '@ui/copy/prompt';
import { num } from '@ui/copy/text';
import { Stepper } from '@ui/molecules/Stepper';
import type { Wager } from '@ui/organisms/use-wager';

interface RaiseRowProps {
  readonly raise: RaiseSpec<unknown>;
  readonly wager: Wager;
}

interface FaltaButtonProps {
  readonly max: number;
  readonly onFill: () => void;
}

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

const FaltaButton = ({ max, onFill }: FaltaButtonProps) => (
  <button
    type="button"
    aria-label={faltaLabel(max)}
    onClick={onFill}
    class={`flex shrink-0 cursor-pointer flex-col items-center justify-center gap-[3px] rounded-[2px] px-3.5 font-mincho leading-none font-extrabold whitespace-nowrap text-red shadow-[inset_0_0_0_1.5px_#8e2a2a] tall:px-[9px] ${FOCUS}`}
  >
    <span class="text-[12px] tracking-[1.5px] tall:text-[11px] tall:tracking-[1px]">
      {FALTA_COPY.label}
    </span>
    <span class="text-[10px] tracking-[1.5px]">{num(max)}</span>
  </button>
);

export const RaiseRow = ({ raise, wager }: RaiseRowProps) => (
  <div class="flex h-[46px] items-stretch gap-2.5 tall:h-11 tall:gap-2">
    <Stepper
      value={wager.text}
      min={raise.min}
      max={raise.max}
      onInput={wager.setText}
      onStep={wager.step}
      onCommit={wager.commit}
      onSubmit={wager.submit}
    />
    <FaltaButton max={raise.max} onFill={wager.fill} />
    <button
      type="button"
      onClick={wager.submit}
      class={`min-w-0 flex-1 cursor-pointer rounded-[2px] bg-ink font-mincho text-[13px] font-extrabold tracking-[2px] whitespace-nowrap text-washi tall:text-[12px] tall:tracking-[1.5px] ${FOCUS}`}
    >
      {raise.go(wager.amount)}
    </button>
  </div>
);
