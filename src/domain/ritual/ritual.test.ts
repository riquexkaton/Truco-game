import { describe, expect, it } from 'vitest';

import { cardsByIds } from '@domain/cards/deck';
import { hasRitual, RITUAL_DAMAGE } from '@domain/ritual/ritual';

describe('hasRitual', () => {
  it('detects three cards of the same faction', () => {
    expect(hasRitual(cardsByIds(['baltasar', 'teo', 'gaspar']))).toBe(true);
  });

  it('rejects mixed factions', () => {
    expect(hasRitual(cardsByIds(['baltasar', 'teo', 'alba']))).toBe(false);
  });

  it('rejects an empty hand', () => {
    expect(hasRitual([])).toBe(false);
  });

  it('deals 3 damage', () => {
    expect(RITUAL_DAMAGE).toBe(3);
  });
});
