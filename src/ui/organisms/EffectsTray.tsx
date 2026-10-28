import type { EffectId } from '@domain/effects/effect';

import { effectLabel, effectTitle } from '@ui/copy/effect-copy';
import { HUD_LABELS } from '@ui/copy/hud-copy';
import { EffectCard } from '@ui/molecules/EffectCard';

interface TrayEffect {
  readonly effect: EffectId;
  readonly isUsable: boolean;
}

interface EffectsTrayProps {
  readonly effects: readonly TrayEffect[];
  readonly onUse: (effect: EffectId) => void;
}

const TrayCard = ({ effect, isUsable, onUse }: TrayEffect & Pick<EffectsTrayProps, 'onUse'>) => (
  <button
    type="button"
    disabled={!isUsable}
    aria-label={effectLabel(effect)}
    title={effectTitle(effect)}
    onClick={() => {
      onUse(effect);
    }}
    class={`block animate-effect-in cursor-pointer rounded-[3px] p-0 transition-[translate,rotate,filter] duration-200 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white ${isUsable ? 'hover:-translate-y-2 hover:-rotate-2' : 'cursor-default brightness-[0.55] saturate-[0.6]'}`}
  >
    <EffectCard effect={effect} size="small" />
  </button>
);

export const EffectsTray = ({ effects, onUse }: EffectsTrayProps) => (
  <div
    role="group"
    aria-label={HUD_LABELS.effects}
    class="fixed bottom-[calc(18px+env(safe-area-inset-bottom,0px))] left-[max(18px,env(safe-area-inset-left,0px))] flex gap-2.5 narrow:left-2.5 narrow:gap-1.5"
  >
    {effects.map((entry, index) => (
      <TrayCard key={index} {...entry} onUse={onUse} />
    ))}
  </div>
);
