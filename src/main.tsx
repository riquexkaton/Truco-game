import { render } from 'preact';

import { App } from '@ui/containers/App';

import { createBackgroundMusic } from './composition/background-music';
import { createLauncher } from './composition/launcher';
import { createSoundEffects } from './composition/sound-effects';
import './ui/styles/main.css';

const root = document.querySelector('#app');

if (root !== null) {
  const sfx = createSoundEffects();
  render(
    <App launcher={createLauncher(sfx.play)} music={createBackgroundMusic()} sfx={sfx.control} />,
    root,
  );
}
