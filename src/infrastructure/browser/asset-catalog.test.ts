import { describe, expect, it } from 'vitest';

import { requireUrl, urlsByStem } from '@infrastructure/browser/asset-catalog';

const MODULES = {
  '/src/assets/cards/c_ada.jpg': '/assets/c_ada-1a2b.webp',
  '/src/assets/cards/c_teo.jpg': '/assets/c_teo-3c4d.webp',
  '/src/assets/cards/notes.txt': '/assets/notes.txt',
  '/src/assets/coins/moneda_geo.json': '/assets/moneda_geo-5e6f.json',
};

describe('urlsByStem', () => {
  it('maps asset ids to their hashed urls using the file name after the prefix', () => {
    const catalog = urlsByStem(MODULES, 'c_');
    expect(catalog.get('ada')).toBe('/assets/c_ada-1a2b.webp');
    expect(catalog.get('teo')).toBe('/assets/c_teo-3c4d.webp');
  });

  it('ignores files without the prefix', () => {
    expect(urlsByStem(MODULES, 'c_')).toEqual(
      new Map([
        ['ada', '/assets/c_ada-1a2b.webp'],
        ['teo', '/assets/c_teo-3c4d.webp'],
      ]),
    );
  });

  it('keeps everything after the prefix, extension aside', () => {
    expect(urlsByStem(MODULES, 'moneda_').get('geo')).toBe('/assets/moneda_geo-5e6f.json');
  });
});

describe('requireUrl', () => {
  it('returns the url of a known asset', () => {
    expect(requireUrl(urlsByStem(MODULES, 'c_'), 'ada')).toBe('/assets/c_ada-1a2b.webp');
  });

  it('fails loudly for a missing asset', () => {
    expect(() => requireUrl(urlsByStem(MODULES, 'c_'), 'nadie')).toThrow('Missing asset: nadie');
  });
});
