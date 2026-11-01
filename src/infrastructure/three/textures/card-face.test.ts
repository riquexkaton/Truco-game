import { describe, expect, it } from 'vitest';

import { cardById } from '@domain/cards/deck';

import { cardFace, faceKey } from '@infrastructure/three/textures/card-face';

describe('cardFace', () => {
  it('shows a normal card with its faction colour and name', () => {
    const face = cardFace(cardById('garin'), 'lirio');
    expect(face).toMatchObject({
      attack: 10,
      isActive: false,
      isDormant: false,
      isSealed: false,
      accent: '#2C4E7A',
      label: 'EL CARNERO',
      stampNote: null,
      bandAlpha: 0.55,
      artFilter: 'saturate(0.88)',
    });
  });

  it('marks legends with a seal', () => {
    const face = cardFace(cardById('baltasar'), 'velo');
    expect(face).toMatchObject({ attack: 12, isSealed: true, label: 'LEGENDARIA' });
  });

  it('greys out a sleeping Velador whose vela is another faction', () => {
    const face = cardFace(cardById('gaspar'), 'velo');
    expect(face).toMatchObject({
      attack: 6,
      isDormant: true,
      isSealed: false,
      accent: '#7D766C',
      label: 'VELADOR',
      stampNote: 'DORMIDO',
      bandAlpha: 0.25,
      artFilter: 'grayscale(0.85)',
    });
  });

  it('lights up an active Velador with its boosted attack and seal', () => {
    const face = cardFace(cardById('gaspar'), 'carnero');
    expect(face).toMatchObject({
      attack: 15,
      isActive: true,
      isSealed: true,
      label: 'VELADOR ACTIVO',
      stampNote: 'BASE 6',
    });
  });

  it('uses the feminine words for the Veladora', () => {
    expect(cardFace(cardById('ursula'), 'velo')).toMatchObject({
      attack: 14,
      label: 'VELADORA ACTIVA',
      stampNote: 'BASE 5',
    });
    expect(cardFace(cardById('ursula'), 'lirio')).toMatchObject({
      label: 'VELADORA',
      stampNote: 'DORMIDA',
    });
  });
});

describe('faceKey', () => {
  it('caches one texture per card and wildcard state', () => {
    expect(faceKey('gaspar', true)).toBe('gaspar:active');
    expect(faceKey('gaspar', false)).toBe('gaspar:plain');
  });
});
