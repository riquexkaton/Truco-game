import { IconButton } from '@ui/atoms/IconButton';
import { MENU_COPY } from '@ui/copy/menu-copy';

export interface SoundEffectsToggle {
  readonly isEnabled: boolean;
  readonly onToggle: () => void;
}

export const SoundEffectsButton = ({ isEnabled, onToggle }: SoundEffectsToggle) => (
  <IconButton
    label={MENU_COPY.sfx}
    icon={isEnabled ? 'sound' : 'soundOff'}
    isPressed={isEnabled}
    onClick={onToggle}
  />
);
