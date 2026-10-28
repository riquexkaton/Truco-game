import { render } from 'preact';

import { App } from '@ui/containers/App';

import { createLauncher } from './composition/launcher';
import './ui/styles/main.css';

const root = document.querySelector('#app');

if (root !== null) {
  render(<App launcher={createLauncher()} />, root);
}
