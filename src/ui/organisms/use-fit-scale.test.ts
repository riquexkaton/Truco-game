import { describe, expect, it } from 'vitest';

import { fitScale } from '@ui/organisms/use-fit-scale';

const FAN = { width: 1020, height: 520 };

describe('fitScale', () => {
  it('keeps the design size when there is room for it', () => {
    expect(fitScale({ width: 1440, height: 640 }, FAN)).toBe(1);
  });

  it('shrinks to the narrowest side of the slot', () => {
    expect(fitScale({ width: 510, height: 640 }, FAN)).toBe(0.5);
    expect(fitScale({ width: 1440, height: 390 }, FAN)).toBe(0.75);
  });

  it('leaves the fan alone until both sizes are known', () => {
    expect(fitScale({ width: 0, height: 0 }, FAN)).toBe(1);
    expect(fitScale({ width: 375, height: 500 }, { width: 0, height: 0 })).toBe(1);
  });
});
