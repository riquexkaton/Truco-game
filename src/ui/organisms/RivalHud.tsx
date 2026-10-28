import { rivalEffectsLabel } from '@ui/copy/effect-copy';
import type { SideHudProps } from '@ui/organisms/SideHud';
import { SideHud } from '@ui/organisms/SideHud';

interface RivalHudProps extends SideHudProps {
  readonly effectCount: number;
}

const RivalEffects = ({ count }: { readonly count: number }) => (
  <div
    role="img"
    aria-label={rivalEffectsLabel(count)}
    class="absolute top-1.5 right-[calc(100%-26px)] flex gap-1 narrow:right-[calc(100%-34px)]"
  >
    {Array.from({ length: count }, (_, index) => (
      <i key={index} class="block h-[25px] w-[17px] rounded-[2px] effect-back" />
    ))}
  </div>
);

export const RivalHud = ({ effectCount, ...side }: RivalHudProps) => (
  <SideHud size="rival" {...side}>
    <RivalEffects count={effectCount} />
  </SideHud>
);
