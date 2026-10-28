import type { RefObject } from 'preact';
import { useCallback, useRef } from 'preact/hooks';

import { CANTAR_COPY, FOLD_COPY } from '@ui/copy/action-copy';
import { HUD_LABELS } from '@ui/copy/hud-copy';
import { ActionColumn } from '@ui/molecules/ActionColumn';
import { FoldButton } from '@ui/molecules/FoldButton';
import { StakeTags } from '@ui/molecules/StakeTags';
import type { ActionBarHandlers, ActionBarModel } from '@ui/organisms/action-model';
import { isCantarEnabled } from '@ui/organisms/action-model';
import { CantarButton } from '@ui/organisms/CantarButton';
import { CantarMenu } from '@ui/organisms/CantarMenu';
import { useMenuDismiss } from '@ui/organisms/use-menu-dismiss';

interface ActionBarProps {
  readonly model: ActionBarModel;
  readonly handlers: ActionBarHandlers;
  readonly isOpen: boolean;
  readonly onOpenChange: (isOpen: boolean) => void;
}

interface CantarColumnProps extends ActionBarProps {
  readonly triggerRef: RefObject<HTMLButtonElement | null>;
}

const closing = (close: () => void, run: () => void) => () => {
  close();
  run();
};

const CantarColumn = ({ model, handlers, isOpen, onOpenChange, triggerRef }: CantarColumnProps) => {
  const close = () => {
    onOpenChange(false);
  };
  const menuHandlers = {
    onRitual: closing(close, handlers.onRitual),
    onPact: closing(close, handlers.onPact),
    onChallenge: closing(close, handlers.onChallenge),
  };
  return (
    <ActionColumn label={CANTAR_COPY.label}>
      {isOpen ? (
        <CantarMenu model={model} handlers={menuHandlers} />
      ) : (
        <StakeTags pactAmount={model.pactAmount} roundStake={model.roundStake} />
      )}
      <CantarButton
        isOpen={isOpen}
        isEnabled={isCantarEnabled(model)}
        isReady={model.ritual.isEnabled}
        isGlowing={model.isTurn}
        buttonRef={triggerRef}
        onToggle={() => {
          onOpenChange(!isOpen);
        }}
      />
    </ActionColumn>
  );
};

export const ActionBar = (props: ActionBarProps) => {
  const { model, handlers, isOpen, onOpenChange } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);
  useMenuDismiss({ isOpen, rootRef, triggerRef, onClose: close });
  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={HUD_LABELS.actions}
      class="fixed right-[max(22px,env(safe-area-inset-right,0px))] bottom-[calc(20px+env(safe-area-inset-bottom,0px))] flex items-end gap-4 narrow:right-3.5 narrow:gap-2.5"
    >
      <ActionColumn label={FOLD_COPY.label}>
        <FoldButton isEnabled={model.canFold} onFold={closing(close, handlers.onFold)} />
      </ActionColumn>
      <CantarColumn {...props} triggerRef={triggerRef} />
    </div>
  );
};
