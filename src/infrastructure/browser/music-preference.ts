import { createStoredToggle } from '@infrastructure/browser/stored-toggle';

const musicToggle = createStoredToggle('mesa-de-las-velas:music');

export const isMusicPreferred = musicToggle.isEnabled;

export const saveMusicPreference = musicToggle.save;
