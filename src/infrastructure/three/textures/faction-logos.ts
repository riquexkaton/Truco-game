import type { FactionId } from '@domain/cards/faction';

interface LogoLayer {
  readonly path: string;
  readonly stroke?: number;
  readonly isFilled?: boolean;
}

export interface LogoStamp {
  readonly faction: FactionId;
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly ink: string;
}

const LOGO_UNITS = 200;

const RING: LogoLayer = { path: 'M10 100 a90 90 0 1 0 180 0 a90 90 0 1 0 -180 0', stroke: 5 };

const EMBLEMS: Readonly<Record<FactionId, readonly LogoLayer[]>> = {
  cayado: [
    {
      path: 'M77.6 151.2 L122.4 52 M108 84 L128.8 76 M100 104.8 L74.4 93.6 M92 122.4 L112.8 127.2',
      stroke: 8,
    },
    {
      path:
        'M122.4 76 a6.4 6.4 0 1 0 12.8 0 a6.4 6.4 0 1 0 -12.8 0 ' +
        'M68 93.6 a6.4 6.4 0 1 0 12.8 0 a6.4 6.4 0 1 0 -12.8 0',
      stroke: 7,
    },
  ],
  velo: [
    {
      path:
        'M68 66 H132 C132 100 118 116 100 116 C82 116 68 100 68 66 Z ' +
        'M95 116 H105 V138 H95 Z M78 138 H122 V146 H78 Z',
      isFilled: true,
    },
  ],
  lirio: [
    {
      path:
        'M100 50 C86 70 86 92 100 112 C114 92 114 70 100 50 Z ' +
        'M97 112 C78 112 62 98 62 76 C78 82 90 94 97 112 Z ' +
        'M103 112 C122 112 138 98 138 76 C122 82 110 94 103 112 Z M80 116 H120 V125 H80 Z ' +
        'M100 125 C94 136 94 141 100 150 C106 141 106 136 100 125 Z',
      isFilled: true,
    },
  ],
  carnero: [
    {
      path:
        'M90 86 C78 68 54 70 52 92 C51 108 66 114 74 104 C80 96 74 88 67 92 ' +
        'M110 86 C122 68 146 70 148 92 C149 108 134 114 126 104 C120 96 126 88 133 92',
      stroke: 8,
    },
    { path: 'M88 84 H112 L106 132 C104 138 96 138 94 132 Z', isFilled: true },
  ],
};

const paintLayer = (context: CanvasRenderingContext2D, layer: LogoLayer, ink: string): void => {
  const path = new Path2D(layer.path);
  if (layer.isFilled === true) {
    context.fillStyle = ink;
    context.fill(path);
  }
  if (layer.stroke === undefined) return;
  context.strokeStyle = ink;
  context.lineWidth = layer.stroke;
  context.stroke(path);
};

export const paintFactionLogo = (context: CanvasRenderingContext2D, stamp: LogoStamp): void => {
  context.save();
  context.translate(stamp.x, stamp.y);
  context.scale(stamp.size / LOGO_UNITS, stamp.size / LOGO_UNITS);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  for (const layer of [RING, ...EMBLEMS[stamp.faction]]) {
    paintLayer(context, layer, stamp.ink);
  }
  context.restore();
};
