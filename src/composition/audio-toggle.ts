import type { ReadonlySignal } from '@preact/signals-core';
import { signal } from '@preact/signals-core';

export interface AudioOutput {
  readonly play: () => Promise<void>;
  readonly pause: () => void;
}

interface AudioPreference {
  readonly isEnabled: () => boolean;
  readonly save: (isEnabled: boolean) => void;
}

interface PageActivity {
  readonly onFirstGesture: (listener: () => void) => void;
  readonly onVisibilityChange: (listener: (isVisible: boolean) => void) => void;
}

export interface AudioToggleDependencies {
  readonly output: AudioOutput;
  readonly preference: AudioPreference;
  readonly page: PageActivity;
}

interface AudioToggle {
  readonly isEnabled: ReadonlySignal<boolean>;
  readonly toggle: () => void;
}

type Follow = (isOn: boolean) => void;

const createPlayer = (output: AudioOutput, page: PageActivity, isWanted: () => boolean): Follow => {
  let hasGesture = false;
  const resume = async () => {
    if (!hasGesture || !isWanted()) return;
    try {
      await output.play();
    } catch {
      hasGesture = false;
      page.onFirstGesture(unlock);
    }
  };
  const unlock = () => {
    hasGesture = true;
    void resume();
  };
  page.onFirstGesture(unlock);
  return (isOn) => {
    if (isOn) void resume();
    else output.pause();
  };
};

export const createAudioToggle = ({
  output,
  preference,
  page,
}: AudioToggleDependencies): AudioToggle => {
  const choice = signal(preference.isEnabled());
  const follow = createPlayer(output, page, () => choice.value);
  page.onVisibilityChange(follow);
  const toggle = () => {
    choice.value = !choice.value;
    preference.save(choice.value);
    follow(choice.value);
  };
  return { isEnabled: choice, toggle };
};
