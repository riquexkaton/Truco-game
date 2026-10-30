import type { EffectId } from '@domain/effects/effect';
import type { EffectBlock } from '@domain/match/gates';

import { effectLabel } from '@ui/copy/effect-copy';
import { HUD_LABELS } from '@ui/copy/hud-copy';
import { EffectCard } from '@ui/molecules/EffectCard';
import { EFFECT_TIP_IDS, EffectTip } from '@ui/molecules/EffectTip';
import type { TrayCardEvents } from '@ui/organisms/tray-card-events';
import { trayCardEvents } from '@ui/organisms/tray-card-events';
import type { TipControl, TipOptions } from '@ui/organisms/use-effect-tip';
import { useEffectTip } from '@ui/organisms/use-effect-tip';

interface TrayEffect {
  readonly effect: EffectId;
  readonly block: EffectBlock | null;
}

interface EffectsTrayProps {
  readonly effects: readonly TrayEffect[];
  readonly promptId: number | null;
  readonly onUse: (effect: EffectId) => void;
}

interface TrayTipProps {
  readonly effects: readonly TrayEffect[];
  readonly control: TipControl;
}

interface TrayCardProps {
  readonly entry: TrayEffect;
  readonly isLifted: boolean;
  readonly events: TrayCardEvents;
}

const LIFTED = '-translate-y-2 -rotate-2 shadow-[0_0_0_1.5px_#c9a35a,0_0_18px_rgb(201_163_90/0.5)]';
const DIMMED = 'cursor-default brightness-[0.55] saturate-[0.6]';

const lookOf = (isUsable: boolean, isLifted: boolean): string => {
  if (isLifted) return `${LIFTED} ${isUsable ? 'cursor-pointer' : DIMMED}`;
  return isUsable ? 'cursor-pointer hover:-translate-y-2 hover:-rotate-2' : DIMMED;
};

const TrayCard = ({ entry, isLifted, events }: TrayCardProps) => (
  <button
    type="button"
    aria-disabled={entry.block === null ? undefined : 'true'}
    aria-label={effectLabel(entry.effect)}
    aria-describedby={isLifted ? EFFECT_TIP_IDS.text : undefined}
    {...events}
    class={`block animate-effect-in rounded-[3px] p-0 transition-[translate,rotate,filter,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white motion-reduce:transition-none ${lookOf(entry.block === null, isLifted)}`}
  >
    <EffectCard effect={entry.effect} size="small" />
  </button>
);

const tipOptions = ({ effects, promptId, onUse }: EffectsTrayProps): TipOptions => ({
  resetKey: `${effects.map(({ effect }) => effect).join(',')}|${String(promptId)}`,
  isUsable: (index) => effects[index]?.block === null,
  onUse: (index) => {
    const entry = effects[index];
    if (entry !== undefined) onUse(entry.effect);
  },
});

const ShownTip = ({ effects, control }: TrayTipProps) => {
  const { tip } = control;
  const shown = tip === null ? undefined : effects[tip.index];
  if (tip === null || shown === undefined) return null;
  const use = () => {
    control.use(tip.index);
  };
  return <EffectTip {...shown} slot={tip.index} isPinned={tip.mode === 'touch'} onUse={use} />;
};

export const EffectsTray = (props: EffectsTrayProps) => {
  const { rootRef, control } = useEffectTip(tipOptions(props));
  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={HUD_LABELS.effects}
      class="fixed bottom-[calc(18px+env(safe-area-inset-bottom,0px))] left-[max(18px,env(safe-area-inset-left,0px))] z-5 flex gap-2.5 narrow:left-2.5 narrow:gap-1.5"
    >
      {props.effects.map((entry, index) => (
        <TrayCard
          key={index}
          entry={entry}
          isLifted={control.tip?.index === index}
          events={trayCardEvents(control, index)}
        />
      ))}
      <ShownTip effects={props.effects} control={control} />
    </div>
  );
};
