import { describe, expect, it } from 'vitest';

import { cardFont, hexAlpha } from '@infrastructure/three/textures/palette';

describe('hexAlpha', () => {
  it('turns a faction colour into a translucent rgba', () => {
    expect(hexAlpha('#2C4E7A', 0.55)).toBe('rgba(44,78,122,0.55)');
    expect(hexAlpha('#A8701A', 0.25)).toBe('rgba(168,112,26,0.25)');
  });

  it('handles black and white', () => {
    expect(hexAlpha('#000000', 1)).toBe('rgba(0,0,0,1)');
    expect(hexAlpha('#FFFFFF', 0)).toBe('rgba(255,255,255,0)');
  });
});

describe('cardFont', () => {
  it('builds a Shippori Mincho canvas font', () => {
    expect(cardFont(800, 13)).toBe('800 13px "Shippori Mincho", serif');
  });
});
