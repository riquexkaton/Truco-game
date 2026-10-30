import type { ReadonlySignal } from '@preact/signals';

import type { SoundEffectsToggle } from '@ui/molecules/SoundEffectsButton';

export interface SfxControl {
  readonly isEnabled: ReadonlySignal<boolean>;
  readonly toggle: () => void;
}

export const sfxToggleOf = (sfx: SfxControl): SoundEffectsToggle => ({
  isEnabled: sfx.isEnabled.value,
  onToggle: sfx.toggle,
});
