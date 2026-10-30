import type { GameSession } from '@ui/containers/game-session';
import { closeUpModel } from '@ui/copy/close-up-copy';
import { HINT_COPY, stripCopy } from '@ui/copy/hud-copy';
import { Banner } from '@ui/organisms/Banner';
import { CloseUp } from '@ui/organisms/CloseUp';
import { Headline } from '@ui/organisms/Headline';
import { Hint } from '@ui/organisms/Hint';
import { Mark } from '@ui/organisms/Mark';
import { PromptCard } from '@ui/organisms/PromptCard';
import { RevealCard } from '@ui/organisms/RevealCard';
import { SealTooltip } from '@ui/organisms/SealTooltip';
import { TurnStrip } from '@ui/organisms/TurnStrip';

interface ContainerProps {
  readonly session: GameSession;
}

const stripView = ({ store, hud }: GameSession) => {
  const strip = hud.strip.value;
  return strip === null ? null : { ...strip, ...stripCopy(strip.side, store.turnSeconds) };
};

const TableCloseUps = ({ session: { store, hud } }: ContainerProps) => {
  const closeUp = hud.closeUp.value;
  return (
    <>
      <CloseUp
        model={closeUpModel(store.match.value, closeUp)}
        onShow={hud.showCloseUpSide}
        onClose={hud.closeCloseUp}
      />
      <SealTooltip hover={closeUp === null ? hud.sealHover.value : null} />
    </>
  );
};

export const NoticesContainer = ({ session }: ContainerProps) => {
  const { store, hud } = session;
  const isGiving = store.phase.value === 'give';
  return (
    <>
      <Banner banner={hud.banner.value} />
      <TurnStrip strip={stripView(session)} />
      <Mark mark={hud.mark.value} />
      <TableCloseUps session={session} />
      <RevealCard reveal={hud.reveal.value} />
      <Headline headline={hud.headline.value} onClose={hud.dismissHeadline} />
      <PromptCard prompt={hud.prompt.value} timer={hud.promptTimer.value} />
      <Hint
        text={isGiving ? HINT_COPY.give : HINT_COPY.play}
        isVisible={isGiving || store.showPlayHint.value}
        isSticky={isGiving}
      />
    </>
  );
};
