export interface Size {
  readonly width: number;
  readonly height: number;
}

export interface Rect extends Size {
  readonly x: number;
  readonly y: number;
}

interface Focus {
  readonly x: number;
  readonly y: number;
}

export interface CoverRequest {
  readonly source: Size;
  readonly target: Size;
  readonly focus: Focus;
}

export interface Point {
  readonly x: number;
  readonly y: number;
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

export const tileOrigins = (rect: Rect, tile: Size): Point[] => {
  const columns = Math.ceil((rect.width + tile.width) / tile.width);
  const rows = Math.ceil((rect.height + tile.height) / tile.height);
  return Array.from({ length: rows * columns }, (_, index) => ({
    x: rect.x - tile.width + (index % columns) * tile.width,
    y: rect.y - tile.height + Math.floor(index / columns) * tile.height,
  }));
};
