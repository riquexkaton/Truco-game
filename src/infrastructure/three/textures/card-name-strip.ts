import { INK, WASHI_LIGHT, cardFont } from '@infrastructure/three/textures/palette';
import { fillBox, strokeBox } from '@infrastructure/three/textures/paint-tools';

const STRIP = { x: 222, y: 24, letterStep: 17 };

const letterSegmenter = new Intl.Segmenter('es', { granularity: 'grapheme' });

const lettersOf = (name: string): string[] =>
  Array.from(letterSegmenter.segment(name), (part) => part.segment);

const paintStripFrame = (context: CanvasRenderingContext2D, height: number): void => {
  const { x, y } = STRIP;
  strokeBox(
    context,
    { x: x - 4.5, y: y - 4.5, width: 43, height: height + 9 },
    { color: INK, width: 1 },
  );
  fillBox(context, { x: x - 4, y: y - 4, width: 42, height: height + 8 }, WASHI_LIGHT);
  strokeBox(context, { x, y, width: 34, height }, { color: INK, width: 1.5 });
};

export const paintNameStrip = (context: CanvasRenderingContext2D, name: string): void => {
  const letters = lettersOf(name);
  paintStripFrame(context, 20 + letters.length * STRIP.letterStep);
  context.fillStyle = INK;
  context.font = cardFont(800, 13);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  for (const [index, letter] of letters.entries()) {
    if (letter !== ' ') {
      context.fillText(letter, STRIP.x + 17, STRIP.y + 18 + index * STRIP.letterStep);
    }
  }
};
