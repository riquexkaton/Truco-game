import type { ReadonlySignal } from '@preact/signals';

import type { MusicToggle } from '@ui/molecules/MusicButton';

export interface MusicControl {
  readonly isEnabled: ReadonlySignal<boolean>;
  readonly toggle: () => void;
}

export const musicToggleOf = (music: MusicControl): MusicToggle => ({
  isEnabled: music.isEnabled.value,
  onToggle: music.toggle,
});
