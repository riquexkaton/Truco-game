import type { Side } from '@domain/shared/side';

import { effectArt } from '@ui/art/art-urls';
import { EFFECT_COPY, REVEAL_ANNULLED, revealOwner } from '@ui/copy/effect-copy';
import type { RevealView } from '@ui/hud/hud-view';

interface RevealCardProps {
  readonly reveal: RevealView | null;
}

const ENTRIES: Readonly<Record<Side, { readonly from: string; readonly hidden: string }>> = {
  player: {
    from: 'starting:[transform:translateY(20px)_scale(0.85)_rotate(-3deg)]',
    hidden: '[transform:translateY(20px)_scale(0.85)_rotate(-3deg)]',
  },
  rival: {
    from: 'starting:[transform:translateY(-20px)_scale(0.85)_rotate(3deg)]',
    hidden: '[transform:translateY(-20px)_scale(0.85)_rotate(3deg)]',
  },
};

const AnnulStamp = () => (
  <span class="absolute top-[70px] left-1/2 -ml-[68px] block w-[136px] animate-slam bg-red py-1.5 text-center text-[17px] font-extrabold tracking-[0.2em] text-washi2 shadow-[inset_0_0_0_2px_var(--color-red),inset_0_0_0_3.5px_var(--color-washi),3px_4px_0_rgb(0_0_0/0.3)] motion-reduce:animate-none">
    {REVEAL_ANNULLED}
  </span>
);

const RevealFace = ({ reveal }: { readonly reveal: RevealView }) => {
  const art = effectArt(reveal.effect);
  return (
    <>
      <img
        src={art.url}
        alt=""
        class={`absolute top-3 left-3 h-[172px] w-[166px] object-cover ${reveal.annulled ? 'grayscale-[0.7]' : ''}`}
        style={{
          boxShadow: `0 0 0 1.5px #1E1A16, 0 0 0 4px #F2E8D5, 0 0 0 6px ${art.color}`,
          objectPosition: art.position,
        }}
      />
      <span class="absolute -top-[26px] right-3 left-3 text-center text-[11px] font-extrabold tracking-[0.4em] text-white">
        {revealOwner(reveal.side)}
      </span>
      {reveal.annulled ? <AnnulStamp /> : null}
      <span class="absolute inset-x-0 top-[196px] text-center text-[17px] font-extrabold tracking-[0.18em] text-ink">
        {EFFECT_COPY[reveal.effect].name}
      </span>
      <span
        class={`absolute top-[222px] right-3.5 left-3.5 text-center text-[11px] leading-[1.35] font-semibold ${reveal.annulled ? 'text-red' : 'text-ink'}`}
      >
        {reveal.line}
      </span>
    </>
  );
};

export const RevealCard = ({ reveal }: RevealCardProps) => {
  if (reveal === null) return null;
  const entry = ENTRIES[reveal.side];
  return (
    <div aria-hidden="true" class="pointer-events-none fixed inset-0 grid place-items-center">
      <div
        key={reveal.id}
        class={`relative h-[272px] w-[190px] rounded-[4px] bg-washi shadow-[0_30px_60px_rgb(0_0_0/0.7)] [transition:opacity_280ms_ease,transform_380ms_cubic-bezier(0.2,1.3,0.4,1)] starting:opacity-0 ${entry.from} ${reveal.shown ? '[transform:none] opacity-100' : `opacity-0 ${entry.hidden}`}`}
      >
        <RevealFace reveal={reveal} />
      </div>
    </div>
  );
};
