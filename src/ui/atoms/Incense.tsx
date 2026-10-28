interface IncenseProps {
  readonly fraction: number;
  readonly isLow: boolean;
  readonly tone: 'washi' | 'ink';
  readonly class?: string;
}

const TONES = {
  washi: {
    track: 'h-[3px] rounded-[2px] bg-washi/18',
    burn: 'rounded-[2px] bg-washi',
    low: 'rounded-[2px] bg-low',
    ember:
      '-top-[2.5px] size-2 -ml-1 animate-ember shadow-[0_0_6px_2px_rgb(255_140_60/0.85)] motion-reduce:animate-none',
  },
  ink: {
    track: 'h-[2px] bg-ink/14',
    burn: 'bg-ink',
    low: 'bg-red',
    ember: '-top-[2px] size-1.5 -ml-[3px] shadow-[0_0_5px_2px_rgb(255_140_60/0.8)]',
  },
};

const percent = (fraction: number): string => `${String(fraction * 100)}%`;

export const Incense = ({ fraction, isLow, tone, class: className = '' }: IncenseProps) => {
  const look = TONES[tone];
  return (
    <div class={`relative ${look.track} ${className}`} aria-hidden="true">
      <i
        class={`block h-full origin-left ${isLow ? look.low : look.burn}`}
        style={{ transform: `scaleX(${String(fraction)})` }}
      />
      <i
        class={`absolute block rounded-full bg-ember ${look.ember}`}
        style={{ left: percent(fraction) }}
      />
    </div>
  );
};
