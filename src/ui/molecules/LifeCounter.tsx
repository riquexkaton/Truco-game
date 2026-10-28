import { DiamondRule } from '@ui/atoms/DiamondRule';
import { deltaLabel } from '@ui/copy/text';
import type { LifeHitView } from '@ui/hud/hud-view';

export type HudSize = 'player' | 'rival';

interface LifeCounterProps {
  readonly life: number;
  readonly hit: LifeHitView | null;
  readonly size: HudSize;
}

const LOOK = {
  player: {
    box: 'gap-4',
    rule: 'w-16 narrow:w-[26px]',
    life: 'text-[68px] narrow:text-[56px]',
    delta: 'bottom-full animate-delta-up',
  },
  rival: {
    box: 'gap-3',
    rule: 'w-[34px] narrow:w-[26px]',
    life: 'text-[36px]',
    delta: 'top-full mt-4 animate-delta-down',
  },
};

export const LifeCounter = ({ life, hit, size }: LifeCounterProps) => {
  const look = LOOK[size];
  const isHit = hit?.hit ?? false;
  return (
    <div class={`relative flex items-center ${look.box}`}>
      <DiamondRule class={look.rule} />
      <b
        class={`leading-[0.92] font-extrabold tracking-[0.01em] lining-nums tabular-nums transition-colors duration-300 [text-shadow:0_2px_0_rgb(0_0_0/0.75),0_0_14px_rgb(0_0_0/0.6)] ${look.life} ${isHit ? 'animate-hit text-hit motion-reduce:animate-none' : 'text-white'}`}
      >
        {life}
      </b>
      <DiamondRule class={look.rule} isFlipped />
      {hit === null ? null : (
        <span
          key={hit.id}
          aria-hidden="true"
          class={`pointer-events-none absolute left-1/2 [transform:translateX(-50%)] text-[18px] font-extrabold text-hit opacity-0 [text-shadow:0_2px_0_rgb(0_0_0/0.7)] ${look.delta}`}
        >
          {deltaLabel(hit.delta)}
        </span>
      )}
    </div>
  );
};
