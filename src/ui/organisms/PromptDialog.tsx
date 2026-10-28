import { useEffect, useRef } from 'preact/hooks';

import type { PromptSpec, PromptTone } from '@ui/copy/prompt';
import type { PromptTimerView, PromptView } from '@ui/hud/hud-view';
import { PromptTimer } from '@ui/molecules/PromptTimer';
import { PromptOptions } from '@ui/organisms/PromptOptions';
import { WagerInput } from '@ui/organisms/WagerInput';

interface PromptDialogProps {
  readonly prompt: PromptView | null;
  readonly timer: PromptTimerView | null;
}

interface PromptCardProps {
  readonly prompt: PromptView;
  readonly timer: PromptTimerView | null;
}

const TITLE_ID = 'prompt-title';

const FOCUS_DELAY_MS = 30;

const BANDS: Readonly<Record<PromptTone, string>> = {
  plain: 'h-[34px] pattern-sg-dark',
  pacto: 'h-[34px] pattern-sg-ink',
  desafio: 'h-[52px] pattern-asa-red',
};

const useFirstButtonFocus = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      cardRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    }, FOCUS_DELAY_MS);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return cardRef;
};

const PromptHeading = ({
  spec,
  timer,
}: { readonly spec: PromptSpec<unknown> } & Pick<PromptCardProps, 'timer'>) => (
  <>
    <div
      aria-hidden="true"
      class={`-mx-[22.5px] mt-[11.5px] self-stretch border-b-[1.5px] border-ink narrow:-mx-[12.5px] ${BANDS[spec.tone]}`}
    />
    {timer === null ? null : <PromptTimer timer={timer} />}
    <div class="wtag">
      <h2
        id={TITLE_ID}
        class="py-2 pr-5 pl-[calc(20px+0.3em)] text-[clamp(20px,4.6vw,28px)] leading-none font-extrabold tracking-[0.3em] text-ink"
      >
        {spec.title}
      </h2>
    </div>
    {spec.subtitle === '' ? null : (
      <p class="max-w-[40ch] text-[13px] leading-normal font-semibold text-ink/80">
        {spec.subtitle}
      </p>
    )}
  </>
);

const PromptCard = ({ prompt, timer }: PromptCardProps) => (
  <div
    ref={useFirstButtonFocus()}
    role="dialog"
    aria-modal="true"
    aria-labelledby={TITLE_ID}
    class="paper-rule wcard flex w-[min(460px,calc(100vw-32px))] animate-card-in flex-col items-center gap-3.5 px-[34px] pb-[30px] text-center narrow:px-6 narrow:pb-6"
  >
    <PromptHeading spec={prompt.spec} timer={timer} />
    <PromptOptions options={prompt.spec.options} onChoose={prompt.choose} />
    {prompt.spec.wager === null ? null : (
      <WagerInput wager={prompt.spec.wager} onChoose={prompt.choose} />
    )}
  </div>
);

export const PromptDialog = ({ prompt, timer }: PromptDialogProps) =>
  prompt === null ? null : (
    <div class="fixed inset-0 z-6 grid place-items-center bg-black/50 pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,env(safe-area-inset-left,0px))]">
      <PromptCard key={prompt.id} prompt={prompt} timer={timer} />
    </div>
  );
