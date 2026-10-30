import { AsideButton } from '@ui/atoms/AsideButton';
import { RAISE_COPY } from '@ui/copy/hud-copy';
import type { PromptSpec } from '@ui/copy/prompt';
import { optionName } from '@ui/copy/prompt';
import type { PromptTimerView } from '@ui/hud/hud-view';
import type { AnswerAction } from '@ui/molecules/AnswerButton';
import { CallTimer } from '@ui/molecules/CallTimer';
import { PromptHeader } from '@ui/molecules/PromptHeader';
import { AnswerRow } from '@ui/organisms/AnswerRow';
import { rowLayout } from '@ui/organisms/prompt-actions';
import type { VoiceLook } from '@ui/organisms/prompt-look';
import { RaiseRow } from '@ui/organisms/RaiseRow';
import type { Wager } from '@ui/organisms/use-wager';

export interface CallState {
  readonly isRaising: boolean;
  readonly wager: Wager;
  readonly actions: readonly AnswerAction[];
  readonly back: () => void;
}

interface PromptCardBodyProps {
  readonly spec: PromptSpec<unknown>;
  readonly choose: (answer: unknown) => void;
  readonly timer: PromptTimerView | null;
  readonly look: VoiceLook;
  readonly state: CallState;
}

export const PROMPT_IDS = { seal: 'prompt-seal', message: 'prompt-message' };

const Aside = ({ spec, choose, state }: Pick<PromptCardBodyProps, 'spec' | 'choose' | 'state'>) => {
  if (state.isRaising) {
    return (
      <AsideButton
        label={RAISE_COPY.back}
        name={RAISE_COPY.backLabel}
        hasChevron
        onClick={state.back}
      />
    );
  }
  const { aside } = spec;
  if (aside === null) return null;
  const onChoose = () => {
    choose(aside.answer);
  };
  return (
    <AsideButton
      label={aside.label}
      name={optionName(aside)}
      hasChevron={false}
      onClick={onChoose}
    />
  );
};

export const PromptCardBody = ({ spec, choose, timer, look, state }: PromptCardBodyProps) => {
  const raise = state.isRaising ? spec.raise : null;
  return (
    <>
      <PromptHeader
        seal={spec.seal}
        sealClass={look.seal}
        phrases={raise === null ? spec.message : raise.summary(state.wager.amount)}
        messageClass={look.message}
        ids={PROMPT_IDS}
        aside={<Aside spec={spec} choose={choose} state={state} />}
      />
      {timer === null ? null : (
        <CallTimer timer={timer} lead={spec.timeoutLead} isAlarm={look.isAlarm} />
      )}
      {raise === null ? (
        <AnswerRow actions={state.actions} layout={rowLayout(state.actions, look.isAlarm)} />
      ) : (
        <RaiseRow raise={raise} wager={state.wager} />
      )}
    </>
  );
};
