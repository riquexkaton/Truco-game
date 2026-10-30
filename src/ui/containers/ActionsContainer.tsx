import { useState } from 'preact/hooks';

import type { GameStore } from '@application/store/game-store';

import { actionBarModel } from '@ui/containers/action-view';
import type { GameSession } from '@ui/containers/game-session';
import { ActionBar } from '@ui/organisms/ActionBar';
import { isCantarEnabled } from '@ui/organisms/action-model';
import { TurnBar } from '@ui/organisms/TurnBar';
import { EdgeGlow, RivalTurnTag } from '@ui/organisms/TurnSignals';

interface ContainerProps {
  readonly session: GameSession;
}

interface TurnSignalsProps {
  readonly store: GameStore;
  readonly isMenuOpen: boolean;
}

const TurnSignalsContainer = ({ store, isMenuOpen }: TurnSignalsProps) => {
  const isPlayerTurn = store.turnSide.value === 'player';
  const isLow = store.isTurnLow.value;
  const secondsLeft = store.turnSecondsLeft.value;
  return (
    <>
      <TurnBar
        isActive={isPlayerTurn}
        isConcealed={isMenuOpen}
        isPaused={store.isTurnPaused.value}
        isLow={isLow}
        secondsLeft={secondsLeft}
        totalSeconds={store.turnSeconds}
      />
      <RivalTurnTag isOn={store.turnSide.value === 'rival'} />
      <EdgeGlow isOn={isPlayerTurn && isLow && secondsLeft > 0} />
    </>
  );
};

export const ActionsContainer = ({ session }: ContainerProps) => {
  const { store, commands } = session;
  const [isOpen, setOpen] = useState(false);
  const model = actionBarModel(store);
  const isMenuOpen = isOpen && isCantarEnabled(model);
  if (isOpen && !isMenuOpen) setOpen(false);
  const handlers = {
    onFold: commands.fold,
    onChallenge: commands.callChallenge,
    onPact: commands.callPact,
    onRitual: commands.singRitual,
  };
  return (
    <>
      <ActionBar model={model} handlers={handlers} isOpen={isMenuOpen} onOpenChange={setOpen} />
      <TurnSignalsContainer store={store} isMenuOpen={isMenuOpen} />
    </>
  );
};
