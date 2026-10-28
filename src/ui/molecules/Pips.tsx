import type { DuelResult } from '@domain/duel/duel';
import type { Side } from '@domain/shared/side';

interface PipsProps {
  readonly results: readonly DuelResult[];
  readonly side: Side;
}

const DUELS = [0, 1, 2];

const pipFill = (result: DuelResult | undefined, side: Side): string => {
  if (result === side) return 'bg-white scale-110';
  return result === 'tie' ? 'bg-white/35' : '';
};

export const Pips = ({ results, side }: PipsProps) => (
  <div class="flex gap-3" aria-hidden="true">
    {DUELS.map((duel) => (
      <i
        key={duel}
        class={`block rotate-45 shadow-[inset_0_0_0_1.5px_rgb(255_255_255/0.9)] transition-[background-color,scale] duration-300 ${side === 'player' ? 'size-[11px]' : 'size-[9px]'} ${pipFill(results[duel], side)}`}
      />
    ))}
  </div>
);
