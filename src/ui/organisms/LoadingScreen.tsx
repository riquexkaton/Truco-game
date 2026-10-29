import type { CardCycle } from '@ui/art/loader-deck';
import { CardArtStack } from '@ui/atoms/CardArtStack';
import { LoadCounter } from '@ui/molecules/LoadCounter';
import { ShuffleCard } from '@ui/molecules/ShuffleCard';
import { READY_PERCENT, targetPercent } from '@ui/organisms/loader-motion';
import { useCardCycle, useEasedPercent, useLoaderPhase } from '@ui/organisms/use-loader';

interface LoadingScreenProps {
  readonly progress: number;
  readonly isReady: boolean;
}

const SHADE =
  'bg-[radial-gradient(ellipse_600px_560px_at_80%_47%,rgb(7_6_10/0.82),rgb(7_6_10/0.25)_75%),linear-gradient(90deg,rgb(7_6_10/0.75)_0%,rgb(7_6_10/0)_50%),linear-gradient(0deg,rgb(7_6_10/0.96)_0%,rgb(7_6_10/0)_44%),linear-gradient(180deg,rgb(7_6_10/0.85)_0%,rgb(7_6_10/0)_18%)] portrait:bg-[radial-gradient(ellipse_480px_560px_at_50%_42%,rgb(7_6_10/0.82),rgb(7_6_10/0.25)_75%),linear-gradient(0deg,rgb(7_6_10/0.96)_0%,rgb(7_6_10/0)_44%),linear-gradient(180deg,rgb(7_6_10/0.85)_0%,rgb(7_6_10/0)_18%)]';

const ShuffleBackdrop = ({ cycle }: { readonly cycle: CardCycle }) => (
  <div
    aria-hidden="true"
    class="absolute -inset-10 overflow-hidden blur-[10px] brightness-[0.42] saturate-[0.8]"
  >
    <CardArtStack
      cycle={cycle}
      class="object-[50%_25%]"
      entrance="motion-safe:animate-backdrop-in"
    />
  </div>
);

export const LoadingScreen = ({ progress, isReady }: LoadingScreenProps) => {
  const percent = Math.floor(useEasedPercent(targetPercent(progress, isReady)));
  const isDone = percent >= READY_PERCENT;
  const cycle = useCardCycle(percent);
  const phase = useLoaderPhase(isDone);
  if (phase === 'gone') return null;
  return (
    <div
      class={`fixed inset-0 z-30 overflow-hidden bg-night font-mincho text-washi transition-opacity duration-700 motion-reduce:transition-none ${phase === 'leaving' ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      <ShuffleBackdrop cycle={cycle} />
      <div aria-hidden="true" class={`absolute inset-0 ${SHADE}`} />
      <ShuffleCard cycle={cycle} isDone={isDone} />
      <LoadCounter percent={percent} isDone={isDone} />
    </div>
  );
};
