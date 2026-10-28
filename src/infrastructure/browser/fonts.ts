const CARD_FONTS = ['800 36px "Shippori Mincho"', '600 10px "Shippori Mincho"'];

export const loadCardFonts = async (): Promise<void> => {
  await Promise.allSettled(CARD_FONTS.map((font) => document.fonts.load(font)));
};
