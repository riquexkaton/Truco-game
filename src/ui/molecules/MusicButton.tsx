import { IconButton } from '@ui/atoms/IconButton';
import { MENU_COPY } from '@ui/copy/menu-copy';

export interface MusicToggle {
  readonly isEnabled: boolean;
  readonly onToggle: () => void;
}

export const MusicButton = ({ isEnabled, onToggle }: MusicToggle) => (
  <IconButton
    label={MENU_COPY.music}
    icon={isEnabled ? 'music' : 'musicOff'}
    isPressed={isEnabled}
    onClick={onToggle}
  />
);
