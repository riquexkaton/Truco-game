import type { GameSession } from '@ui/containers/game-session';
import { HINT_COPY, stripCopy } from '@ui/copy/hud-copy';
import { Banner } from '@ui/organisms/Banner';
import { Hint } from '@ui/organisms/Hint';
import { PromptDialog } from '@ui/organisms/PromptDialog';
import { RevealCard } from '@ui/organisms/RevealCard';
import { Toasts } from '@ui/organisms/Toasts';
import { TurnStrip } from '@ui/organisms/TurnStrip';

interface ContainerProps {
  readonly session: GameSession;
}

const stripView = ({ store, hud }: GameSession) => {
  const strip = hud.strip.value;
  return strip === null ? null : { ...strip, ...stripCopy(strip.side, store.turnSeconds) };
};

export const NoticesContainer = ({ session }: ContainerProps) => {
  const { store, hud } = session;
  const isGiving = store.phase.value === 'give';
  return (
    <>
      <Banner banner={hud.banner.value} />
      <TurnStrip strip={stripView(session)} />
      <Toasts toasts={hud.toasts.value} onDismiss={hud.dismissToast} />
      <RevealCard reveal={hud.reveal.value} />
      <PromptDialog prompt={hud.prompt.value} timer={hud.promptTimer.value} />
      <Hint
        text={isGiving ? HINT_COPY.give : HINT_COPY.play}
        isVisible={isGiving || store.showPlayHint.value}
        isSticky={isGiving}
      />
    </>
  );
};
