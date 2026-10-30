export const WASHI = '#F2E8D5';
export const WASHI_LIGHT = '#F7F0E1';
export const INK = '#1E1A16';
export const DORMANT_GREY = '#7D766C';
export const SEAL_GOLD = '#B08A3E';
export const GAME_BACK = '#120E0A';
export const EFFECT_BACK = '#0E0B08';
export const BACK_GOLD = '#C9A35A';
export const BACK_GOLD_LIGHT = '#D9B66B';
export const EMBER = '#FF8C3C';
export const CURSE_VIOLET = '#C9A6FF';
export const STAMP_RED = '#8E2A2A';
const CARD_FONT = '"Shippori Mincho", serif';

export const hexAlpha = (hex: string, alpha: number): string => {
  const value = Number.parseInt(hex.slice(1), 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${String(red)},${String(green)},${String(blue)},${String(alpha)})`;
};

export const cardFont = (weight: number, sizePx: number): string =>
  `${String(weight)} ${String(sizePx)}px ${CARD_FONT}`;
