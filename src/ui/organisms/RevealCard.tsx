import { effectArt } from '@ui/art/art-urls';
import { EFFECT_COPY, revealOwner } from '@ui/copy/effect-copy';
import type { RevealView } from '@ui/hud/hud-view';

interface RevealCardProps {
  readonly reveal: RevealView | null;
}

const HIDDEN = 'opacity-0 [transform:translateY(20px)_scale(0.85)_rotate(-3deg)]';

const RevealFace = ({ reveal }: { readonly reveal: RevealView }) => {
  const art = effectArt(reveal.effect);
  const copy = EFFECT_COPY[reveal.effect];
  return (
    <>
      <img
        src={art.url}
        alt=""
        class="absolute top-3 left-3 h-[172px] w-[166px] object-cover"
        style={{
          boxShadow: `0 0 0 1.5px #1E1A16, 0 0 0 4px #F2E8D5, 0 0 0 6px ${art.color}`,
          objectPosition: art.position,
        }}
      />
      <span class="absolute -top-[26px] right-3 left-3 text-center text-[11px] font-extrabold tracking-[0.4em] text-white">
        {revealOwner(reveal.side)}
      </span>
      <span class="absolute inset-x-0 top-[196px] text-center text-[17px] font-extrabold tracking-[0.18em] text-ink">
        {copy.name}
      </span>
      <span class="absolute top-[222px] right-3.5 left-3.5 text-center text-[11px] leading-[1.35] font-semibold text-ink">
        {copy.description}
      </span>
    </>
  );
};

export const RevealCard = ({ reveal }: RevealCardProps) =>
  reveal === null ? null : (
    <div aria-hidden="true" class="pointer-events-none fixed inset-0 grid place-items-center">
      <div
        key={reveal.id}
        class={`relative h-[272px] w-[190px] rounded-[4px] bg-washi shadow-[0_30px_60px_rgb(0_0_0/0.7)] [transition:opacity_280ms_ease,transform_380ms_cubic-bezier(0.2,1.3,0.4,1)] starting:[transform:translateY(20px)_scale(0.85)_rotate(-3deg)] starting:opacity-0 ${reveal.shown ? '[transform:none] opacity-100' : HIDDEN}`}
      >
        <RevealFace reveal={reveal} />
      </div>
    </div>
  );
