import { createStoredToggle } from '@infrastructure/browser/stored-toggle';

const sfxToggle = createStoredToggle('mesa-de-las-velas:sfx');

export const isSfxPreferred = sfxToggle.isEnabled;

export const saveSfxPreference = sfxToggle.save;
