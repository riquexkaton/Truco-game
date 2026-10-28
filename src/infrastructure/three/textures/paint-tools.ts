import type { Rect } from '@infrastructure/three/textures/canvas-geometry';
import { WASHI } from '@infrastructure/three/textures/palette';

export const CARD_LOGICAL_WIDTH = 280;
const CARD_LOGICAL_HEIGHT = 400;

export interface Stroke {
  readonly color: string;
  readonly width: number;
}

export interface Circle {
  readonly radius: number;
  readonly color: string;
}

export interface RoundedSquare {
  readonly offset: number;
  readonly size: number;
  readonly radius: number;
}

export const paintPaper = (context: CanvasRenderingContext2D): void => {
  context.fillStyle = WASHI;
  context.fillRect(0, 0, CARD_LOGICAL_WIDTH, CARD_LOGICAL_HEIGHT);
};

export const strokeBox = (context: CanvasRenderingContext2D, rect: Rect, stroke: Stroke): void => {
  context.strokeStyle = stroke.color;
  context.lineWidth = stroke.width;
  context.strokeRect(rect.x, rect.y, rect.width, rect.height);
};

export const fillBox = (context: CanvasRenderingContext2D, rect: Rect, color: string): void => {
  context.fillStyle = color;
  context.fillRect(rect.x, rect.y, rect.width, rect.height);
};

export const fillCircle = (context: CanvasRenderingContext2D, circle: Circle): void => {
  context.fillStyle = circle.color;
  context.beginPath();
  context.arc(0, 0, circle.radius, 0, Math.PI * 2);
  context.fill();
};

export const strokeCircle = (context: CanvasRenderingContext2D, circle: Circle & Stroke): void => {
  context.strokeStyle = circle.color;
  context.lineWidth = circle.width;
  context.beginPath();
  context.arc(0, 0, circle.radius, 0, Math.PI * 2);
  context.stroke();
};

export const traceRoundedSquare = (
  context: CanvasRenderingContext2D,
  square: RoundedSquare,
): void => {
  context.beginPath();
  context.roundRect(square.offset, square.offset, square.size, square.size, square.radius);
};

export const degrees = (value: number): number => (value * Math.PI) / 180;
