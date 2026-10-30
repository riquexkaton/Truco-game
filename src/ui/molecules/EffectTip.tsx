import type { EffectId } from '@domain/effects/effect';
import type { EffectBlock } from '@domain/match/gates';

import {
  EFFECT_BLOCK_COPY,
  EFFECT_COPY,
  EFFECT_TIP_USE,
  effectUseLabel,
} from '@ui/copy/effect-copy';

export const EFFECT_TIP_IDS = { name: 'effect-tip-name', text: 'effect-tip-text' };

interface EffectTipProps {
  readonly effect: EffectId;
  readonly block: EffectBlock | null;
  readonly slot: number;
  readonly isPinned: boolean;
  readonly onUse: () => void;
}

const FRAME =
  'absolute bottom-[calc(100%+18px)] left-0 flex w-[min(260px,calc(100vw-36px))] animate-info-in flex-col gap-1.5 rounded-[3px] bg-washi px-3.5 py-3 font-mincho text-ink shadow-[inset_0_0_0_1.5px_#c9a35a,0_12px_26px_rgb(0_0_0/0.6)] motion-reduce:animate-none narrow:w-[min(248px,calc(100vw-20px))]';

const Arrow = () => (
  <span
    aria-hidden="true"
    class="absolute -bottom-[7px] left-[calc(var(--slot)*70px+24px)] size-3 rotate-45 bg-washi shadow-[inset_-1.5px_-1.5px_0_#c9a35a] narrow:left-[calc(var(--slot)*50px+16px)]"
  />
);

const UseButton = ({ effect, onUse }: Pick<EffectTipProps, 'effect' | 'onUse'>) => (
  <button
    type="button"
    aria-label={effectUseLabel(effect)}
    onClick={onUse}
    class="mt-1 min-h-11 cursor-pointer rounded-[2px] bg-ink pl-[0.3em] text-[13px] font-extrabold tracking-[0.3em] text-washi focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
  >
    {EFFECT_TIP_USE}
  </button>
);

export const EffectTip = ({ effect, block, slot, isPinned, onUse }: EffectTipProps) => {
  const canUse = isPinned && block === null;
  return (
    <div
      role={canUse ? 'dialog' : 'tooltip'}
      aria-labelledby={EFFECT_TIP_IDS.name}
      style={{ '--slot': String(slot) }}
      class={`${FRAME} ${isPinned ? '' : 'pointer-events-none'}`}
    >
      <Arrow />
      <span
        id={EFFECT_TIP_IDS.name}
        class="text-[12px] font-extrabold tracking-[2.5px] text-[#8a6a24]"
      >
        {EFFECT_COPY[effect].name}
      </span>
      <p
        id={EFFECT_TIP_IDS.text}
        class="flex flex-col gap-1.5 text-[13px] leading-[1.4] font-semibold"
      >
        <span>{EFFECT_COPY[effect].description}</span>
        {block === null ? null : <span class="text-red">{EFFECT_BLOCK_COPY[block]}</span>}
      </p>
      {canUse ? <UseButton effect={effect} onUse={onUse} /> : null}
    </div>
  );
};
