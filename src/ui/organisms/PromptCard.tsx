import { useState } from 'preact/hooks';

import type { PromptTimerView, PromptView } from '@ui/hud/hud-view';
import { answerIndexFor, useCapturedKey } from '@ui/keyboard/captured-keys';
import { CardDecor } from '@ui/molecules/CardDecor';
import { SIDE_SLOT } from '@ui/organisms/hud-slots';
import { answerActions } from '@ui/organisms/prompt-actions';
import { VOICE_LOOKS } from '@ui/organisms/prompt-look';
import type { CallState } from '@ui/organisms/PromptCardBody';
import { PROMPT_IDS, PromptCardBody } from '@ui/organisms/PromptCardBody';
import { useDesktopFocus } from '@ui/organisms/use-desktop-focus';
import { useWager } from '@ui/organisms/use-wager';

interface PromptCardProps {
  readonly prompt: PromptView | null;
  readonly timer: PromptTimerView | null;
}

interface CallCardProps {
  readonly prompt: PromptView;
  readonly timer: PromptTimerView | null;
}

const useCallState = ({ spec, choose }: PromptView): CallState => {
  const [isRaising, setRaising] = useState(false);
  const wager = useWager(spec.raise, choose);
  const actions = answerActions(spec, choose, () => {
    setRaising(true);
  });
  useCapturedKey((event) => (isRaising ? null : (actions[answerIndexFor(event)]?.run ?? null)));
  return {
    isRaising,
    wager,
    actions,
    back: () => {
      setRaising(false);
    },
  };
};

const CallCard = ({ prompt, timer }: CallCardProps) => {
  const state = useCallState(prompt);
  const look = VOICE_LOOKS[prompt.spec.voice];
  const cardRef = useDesktopFocus<HTMLElement>(state.isRaising ? 'input' : '[data-answer]');
  return (
    <section
      ref={cardRef}
      role="dialog"
      aria-labelledby={PROMPT_IDS.seal}
      aria-describedby={PROMPT_IDS.message}
      class={`${SIDE_SLOT} flex animate-card-in flex-col rounded-[3px] bg-washi text-ink motion-reduce:animate-none ${look.frame}`}
    >
      <CardDecor
        band={look.band}
        isBandWideOnly={false}
        pointer={look.isRival ? 'solid' : null}
        hasCandle={look.isRival}
      />
      <PromptCardBody
        spec={prompt.spec}
        choose={prompt.choose}
        timer={timer}
        look={look}
        state={state}
      />
    </section>
  );
};

export const PromptCard = ({ prompt, timer }: PromptCardProps) =>
  prompt === null ? null : <CallCard key={prompt.id} prompt={prompt} timer={timer} />;
