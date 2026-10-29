const STAGE = { width: 1440, height: 900 };

const percentOf = (value: number, total: number): string => `${String((value / total) * 100)}%`;

const EMBERS = Array.from({ length: 14 }, (_, index) => ({
  left: percentOf(300 + ((index * 137) % 840), STAGE.width),
  top: percentOf(760 + ((index * 53) % 110), STAGE.height),
  size: `${String(2 + (index % 3))}px`,
  drift: index % 2 === 0 ? '36px' : '-30px',
  duration: `${(7 + ((index * 1.7) % 5)).toFixed(1)}s`,
  delay: `${(-index * 0.8).toFixed(1)}s`,
}));

export const Embers = () => (
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
  >
    {EMBERS.map((ember, index) => (
      <span
        key={index}
        class="absolute animate-spark-rise rounded-full bg-spark opacity-0 shadow-[0_0_6px_2px_rgb(255_150_70/0.55)]"
        style={{
          left: ember.left,
          top: ember.top,
          width: ember.size,
          height: ember.size,
          '--drift': ember.drift,
          animationDuration: ember.duration,
          animationDelay: ember.delay,
        }}
      />
    ))}
  </div>
);
