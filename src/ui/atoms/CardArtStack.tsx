import type { CardCycle } from '@ui/art/loader-deck';

interface CardArtStackProps {
  readonly cycle: CardCycle;
  readonly class: string;
  readonly entrance: string;
}

export const CardArtStack = ({ cycle, class: look, entrance }: CardArtStackProps) => {
  const { active, previous } = cycle;
  return (
    <>
      {previous === null ? null : (
        <img
          key={previous.id}
          src={previous.url}
          alt=""
          decoding="async"
          class={`absolute inset-0 z-2 size-full object-cover ${look}`}
        />
      )}
      <img
        key={active.id}
        src={active.url}
        alt=""
        decoding="async"
        class={`absolute inset-0 z-3 size-full object-cover ${look} ${entrance}`}
      />
    </>
  );
};
