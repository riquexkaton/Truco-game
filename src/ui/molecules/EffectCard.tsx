import type { EffectId } from '@domain/effects/effect';

import { effectArt } from '@ui/art/art-urls';
import { EFFECT_COPY } from '@ui/copy/effect-copy';

type EffectCardSize = 'small' | 'big';

interface EffectCardProps {
  readonly effect: EffectId;
  readonly size: EffectCardSize;
}

const LOOK = {
  small: {
    card: 'h-[86px] w-[60px] narrow:h-[64px] narrow:w-[44px]',
    art: 'left-[5px] top-[5px] h-[60px] w-[50px] narrow:left-1 narrow:top-1 narrow:h-11 narrow:w-9',
    name: 'bottom-1.5 text-[7px] narrow:bottom-[5px] narrow:text-[5.5px]',
  },
  big: {
    card: 'h-[132px] w-[92px] narrow:h-[115px] narrow:w-20',
    art: 'left-[7px] top-[7px] h-[92px] w-[78px] narrow:left-1.5 narrow:top-1.5 narrow:h-20 narrow:w-[68px]',
    name: 'bottom-2.5 text-[9px]',
  },
};

const frameOf = (color: string): string =>
  `0 0 0 1px #1E1A16, 0 0 0 2.5px #F2E8D5, 0 0 0 3.5px ${color}`;

export const EffectCard = ({ effect, size }: EffectCardProps) => {
  const art = effectArt(effect);
  const look = LOOK[size];
  return (
    <span
      class={`relative block overflow-hidden rounded-[3px] bg-washi shadow-[0_8px_18px_rgb(0_0_0/0.6)] ${look.card}`}
    >
      <img
        src={art.url}
        alt=""
        class={`absolute object-cover ${look.art}`}
        style={{ boxShadow: frameOf(art.color), objectPosition: art.position }}
      />
      <span
        class={`absolute inset-x-0 text-center leading-none font-extrabold tracking-[0.1em] text-ink ${look.name}`}
      >
        {EFFECT_COPY[effect].name}
      </span>
    </span>
  );
};
