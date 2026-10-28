import type { MenuItemCopy } from '@ui/copy/action-copy';

export interface MenuAction {
  readonly copy: MenuItemCopy;
  readonly isEnabled: boolean;
  readonly isVisible: boolean;
}

export interface ActionBarModel {
  readonly canFold: boolean;
  readonly isTurn: boolean;
  readonly challenge: MenuAction;
  readonly pact: MenuAction;
  readonly ritual: MenuAction;
  readonly pactAmount: number | null;
  readonly roundStake: number | null;
}

export interface ActionBarHandlers {
  readonly onFold: () => void;
  readonly onChallenge: () => void;
  readonly onPact: () => void;
  readonly onRitual: () => void;
}

export const isCantarEnabled = ({ challenge, pact, ritual }: ActionBarModel): boolean =>
  challenge.isEnabled || pact.isEnabled || ritual.isEnabled;
