interface Size {
  readonly width: number;
  readonly height: number;
}

export interface Rect extends Size {
  readonly x: number;
  readonly y: number;
}

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface CoverRequest {
  readonly source: Size;
  readonly target: Size;
  readonly focus: Point;
}

export interface Ellipse extends Point {
  readonly radiusX: number;
  readonly radiusY: number;
}

export const coverCrop = ({ source, target, focus }: CoverRequest): Rect => {
  const scale = Math.max(target.width / source.width, target.height / source.height);
  const width = target.width / scale;
  const height = target.height / scale;
  return {
    x: (source.width - width) * focus.x,
    y: (source.height - height) * focus.y,
    width,
    height,
  };
};

const seigaihaRow = (rect: Rect, size: number, row: number): Point[] => {
  const y = rect.y + (row * size) / 2;
  const first = rect.x - 2 * size + (row % 2) * size;
  const count = Math.floor((rect.x + rect.width + 2 * size - first) / (2 * size)) + 1;
  return Array.from({ length: count }, (_, column) => ({ x: first + column * 2 * size, y }));
};

export const seigaihaCenters = (rect: Rect, size: number): Point[] => {
  const rows = Math.floor((rect.height + size) / (size / 2)) + 1;
  return Array.from({ length: rows }, (_, row) => seigaihaRow(rect, size, row)).flat();
};

export const insetRect = (rect: Rect, inset: number): Rect => ({
  x: rect.x + inset,
  y: rect.y + inset,
  width: rect.width - 2 * inset,
  height: rect.height - 2 * inset,
});

const isInside = (rect: Rect, point: Point): boolean =>
  point.x > rect.x &&
  point.x < rect.x + rect.width &&
  point.y > rect.y &&
  point.y < rect.y + rect.height;

const centeredSteps = (length: number, spacing: number): number[] => {
  const reach = Math.floor(length / 2 / spacing);
  return Array.from({ length: 2 * reach + 1 }, (_, index) => (index - reach) * spacing);
};

export const ringDots = (outer: Rect, inner: Rect, spacing: number): Point[] => {
  const center = { x: outer.x + outer.width / 2, y: outer.y + outer.height / 2 };
  const columns = centeredSteps(outer.width, spacing);
  return centeredSteps(outer.height, spacing)
    .flatMap((dy) => columns.map((dx) => ({ x: center.x + dx, y: center.y + dy })))
    .filter((dot) => !isInside(inner, dot));
};

export const farthestCornerEllipse = (rect: Rect, focus: Point): Ellipse => ({
  x: rect.x + rect.width * focus.x,
  y: rect.y + rect.height * focus.y,
  radiusX: Math.SQRT2 * rect.width * Math.max(focus.x, 1 - focus.x),
  radiusY: Math.SQRT2 * rect.height * Math.max(focus.y, 1 - focus.y),
});

const at = ({ x, y }: Point): string => `${String(x)} ${String(y)}`;

export const circlePath = ({ x, y }: Point, radius: number): string => {
  const arc = `A${at({ x: radius, y: radius })} 0 1 1`;
  return `M${at({ x: x + radius, y })} ${arc} ${at({ x: x - radius, y })} ${arc} ${at({ x: x + radius, y })}Z`;
};

export const diamondPath = ({ x, y }: Point, half: number): string =>
  [
    `M${at({ x, y: y - half })}`,
    `L${at({ x: x + half, y })}`,
    `L${at({ x, y: y + half })}`,
    `L${at({ x: x - half, y })}Z`,
  ].join(' ');
