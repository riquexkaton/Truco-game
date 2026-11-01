interface PendingDotsProps {
  readonly class?: string;
}

const DELAYS = ['0s', '0.2s', '0.4s'];

export const PendingDots = ({ class: className = 'flex' }: PendingDotsProps) => (
  <span class={`${className} gap-1`}>
    {DELAYS.map((delay) => (
      <i
        key={delay}
        class="block size-[5px] animate-dots rounded-full bg-red motion-reduce:animate-none"
        style={{ animationDelay: delay }}
      />
    ))}
  </span>
);
