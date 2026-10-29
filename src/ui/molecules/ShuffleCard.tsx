import type { CardCycle, LoaderCard } from '@ui/art/loader-deck';
import { CardArtStack } from '@ui/atoms/CardArtStack';

interface ShuffleCardProps {
  readonly cycle: CardCycle;
  readonly isDone: boolean;
}

const NameTag = ({ name }: { readonly name: string }) => (
  <span class="absolute top-[26px] left-[26px] z-5 bg-washi2 p-1 shadow-[0_0_0_1px_var(--color-ink)]">
    <span class="block px-[9px] py-[13px] text-[19px] leading-none font-extrabold tracking-[0.06em] text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink)] [text-orientation:upright] [writing-mode:vertical-rl]">
      {name}
    </span>
  </span>
);

const AttackSeal = ({ card }: { readonly card: LoaderCard }) => (
  <span
    class="absolute top-[26px] right-[26px] z-5 grid size-[52px] -rotate-4 place-items-center rounded-[8px] text-[22px] font-extrabold text-washi2"
    style={{ backgroundColor: card.color }}
  >
    <span class="absolute inset-1 rounded-[5px] shadow-[inset_0_0_0_1.5px_var(--color-washi)]" />
    <span class="relative">{card.attack}</span>
  </span>
);

export const ShuffleCard = ({ cycle, isDone }: ShuffleCardProps) => (
  <div
    aria-hidden="true"
    class="absolute top-[47%] right-[5.5vw] aspect-[2/3] h-[min(630px,70vh)] -translate-y-1/2 portrait:top-[42%] portrait:right-auto portrait:left-1/2 portrait:h-[min(630px,56vh)] portrait:-translate-x-1/2"
  >
    <div
      class={`pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[143%] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_140_60/0.38),rgb(255_140_60/0)_62%)] transition-opacity duration-600 motion-reduce:transition-none ${isDone ? 'opacity-100' : 'opacity-40'}`}
    />
    <figure class="absolute inset-0 m-0 -rotate-3 bg-washi shadow-[0_40px_90px_rgb(0_0_0/0.85)]">
      <div class="absolute inset-[14px] overflow-hidden bg-[#141210]">
        <CardArtStack
          cycle={cycle}
          class="object-[50%_15%]"
          entrance="motion-safe:animate-leaf-in"
        />
      </div>
      <NameTag name={cycle.active.name} />
      <AttackSeal card={cycle.active} />
      <span class="pointer-events-none absolute inset-[7px] z-6 border-[1.5px] border-ink" />
    </figure>
  </div>
);
