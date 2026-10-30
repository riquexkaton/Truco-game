import { BACK_GOLD, INK, cardFont } from '@infrastructure/three/textures/palette';
import { CARD_LOGICAL_WIDTH, fillBox } from '@infrastructure/three/textures/paint-tools';
import type { RibbonSpec, SealMarkSpec } from '@infrastructure/three/textures/seal-mark-specs';
import { paintWaxSeal, withShadow } from '@infrastructure/three/textures/wax-seal-paint';

interface CardBox {
  readonly width: number;
  readonly height: number;
}

interface MarkPaint {
  readonly spec: SealMarkSpec;
  readonly card: CardBox;
  readonly scale: number;
}

export const SEAL_MARK_MARGIN = 84;
const CARD_RATIO = 400 / CARD_LOGICAL_WIDTH;
const RIBBON_TEXT = 'CON SELLO';
const LINE_HEIGHT = 1.45;

const paintGlow = (context: CanvasRenderingContext2D, { spec, card, scale }: MarkPaint) => {
  withShadow(context, { ...spec.glow, scale }, () => {
    fillBox(context, { x: 0, y: 0, ...card }, BACK_GOLD);
  });
  context.globalCompositeOperation = 'destination-out';
  fillBox(context, { x: 0, y: 0, ...card }, INK);
  context.globalCompositeOperation = 'source-over';
};

const paintBorder = (context: CanvasRenderingContext2D, { spec, card }: MarkPaint) => {
  const width = spec.border;
  context.strokeStyle = BACK_GOLD;
  context.lineWidth = width;
  context.strokeRect(-width / 2, -width / 2, card.width + width, card.height + width);
};

const ribbonBox = (context: CanvasRenderingContext2D, ribbon: RibbonSpec, card: CardBox) => {
  context.font = cardFont(800, ribbon.font);
  context.letterSpacing = `${String(ribbon.spacing)}px`;
  const width = context.measureText(RIBBON_TEXT).width + ribbon.padX * 2;
  const height = ribbon.font * LINE_HEIGHT + ribbon.padY * 2;
  return { x: (card.width - width) / 2, y: card.height + ribbon.below - height, width, height };
};

const paintRibbon = (context: CanvasRenderingContext2D, { spec, card, scale }: MarkPaint) => {
  const { ribbon } = spec;
  const box = ribbonBox(context, ribbon, card);
  withShadow(context, { ...ribbon.drop, scale }, () => {
    fillBox(context, box, BACK_GOLD);
  });
  context.fillStyle = INK;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText(RIBBON_TEXT, box.x + ribbon.padX, box.y + box.height / 2 + 0.5);
  context.letterSpacing = '0px';
};

export const paintSealMark = (
  context: CanvasRenderingContext2D,
  spec: SealMarkSpec,
  canvasScale: number,
): void => {
  const unit = CARD_LOGICAL_WIDTH / spec.cardPx;
  context.translate(SEAL_MARK_MARGIN, SEAL_MARK_MARGIN);
  context.scale(unit, unit);
  const paint: MarkPaint = {
    spec,
    card: { width: spec.cardPx, height: spec.cardPx * CARD_RATIO },
    scale: unit * canvasScale,
  };
  paintGlow(context, paint);
  paintBorder(context, paint);
  paintRibbon(context, paint);
  paintWaxSeal(context, spec.seal, paint.scale);
};
