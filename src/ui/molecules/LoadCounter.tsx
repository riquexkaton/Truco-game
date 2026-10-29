import { LOADER_COPY } from '@ui/copy/hud-copy';

interface LoadCounterProps {
  readonly percent: number;
  readonly isDone: boolean;
}

const ProgressBar = ({ percent }: { readonly percent: number }) => (
  <div
    role="progressbar"
    aria-label={LOADER_COPY.label}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={percent}
    class="absolute inset-x-[clamp(16px,3.3vw,48px)] bottom-[clamp(20px,3.3vh,30px)] h-0.5 bg-washi/18"
  >
    <div
      class="relative h-full bg-washi transition-[width] duration-120 ease-linear motion-reduce:transition-none"
      style={{ width: `${String(percent)}%` }}
    >
      <span
        aria-hidden="true"
        class="absolute -top-1 -right-[5px] size-2.5 rounded-full bg-[radial-gradient(circle,#fff3c4_0%,var(--color-spark)_45%,rgb(255_140_60/0)_75%)] shadow-[0_0_14px_4px_rgb(255_140_60/0.6)]"
      />
    </div>
  </div>
);

export const LoadCounter = ({ percent, isDone }: LoadCounterProps) => (
  <>
    <p
      aria-hidden="true"
      class="absolute bottom-[clamp(36px,5.6vh,50px)] left-[clamp(16px,3vw,44px)] flex items-start text-[min(260px,32vw,30vh)] leading-[0.78] font-extrabold tracking-[-0.03em] tabular-nums"
    >
      {String(percent).padStart(3, '0')}
      <span class="mt-[0.23em] ml-[0.32em] text-[0.17em] tracking-normal text-gilt-light">%</span>
    </p>
    <p role="status" class="sr-only">
      {isDone ? LOADER_COPY.ready : LOADER_COPY.loading}
    </p>
    <ProgressBar percent={percent} />
  </>
);
