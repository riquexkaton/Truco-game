import { STAMP_RED, WASHI, WASHI_LIGHT, cardFont } from '@infrastructure/three/textures/palette';
import { degrees, traceRoundedSquare } from '@infrastructure/three/textures/paint-tools';

export const BADGE_CANVAS = 128;

const BADGE = { size: 92, radius: 12, rule: 76, ruleRadius: 8, drop: 'rgba(0,0,0,0.4)' };

const paintBadgeSquare = (context: CanvasRenderingContext2D): void => {
  const offset = -BADGE.size / 2;
  context.fillStyle = BADGE.drop;
  traceRoundedSquare(context, { offset: offset + 3, size: BADGE.size, radius: BADGE.radius });
  context.fill();
  context.fillStyle = STAMP_RED;
  traceRoundedSquare(context, { offset, size: BADGE.size, radius: BADGE.radius });
  context.fill();
  context.strokeStyle = WASHI;
  context.lineWidth = 3;
  traceRoundedSquare(context, {
    offset: -BADGE.rule / 2,
    size: BADGE.rule,
    radius: BADGE.ruleRadius,
  });
  context.stroke();
};

export const paintAttackBadge = (context: CanvasRenderingContext2D, attack: number): void => {
  const text = String(attack);
  context.translate(BADGE_CANVAS / 2, BADGE_CANVAS / 2);
  context.rotate(degrees(-4));
  paintBadgeSquare(context);
  context.fillStyle = WASHI_LIGHT;
  context.font = cardFont(800, text.length > 1 ? 50 : 62);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, 0, 5);
};
