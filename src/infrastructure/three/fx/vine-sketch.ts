export interface VineStroke {
  readonly path: readonly number[];
  readonly isLate: boolean;
  readonly glintAt: number;
}

export interface LeafMark {
  readonly x: number;
  readonly y: number;
  readonly turn: number;
  readonly size: number;
}

export const SKETCH_FRAME = { x: 245, y: 463.5, unit: 220, squash: 0.795 } as const;

export const SKETCH_LEAF_LENGTH = 19;

export const VINE_STROKES: readonly VineStroke[] = [
  {
    path: [
      330, 460, 352, 459, 378, 450, 394, 432, 408, 416, 428, 404, 444, 414, 458, 423, 452, 443, 436,
      444, 424, 445, 419, 432, 427, 426, 433, 422, 440, 427, 437, 432,
    ],
    isLate: false,
    glintAt: 0,
  },
  {
    path: [
      326, 532, 350, 534, 372, 540, 388, 552, 400, 561, 414, 560, 420, 548, 426, 536, 414, 526, 404,
      532, 396, 537, 400, 548, 408, 546,
    ],
    isLate: true,
    glintAt: 1.3,
  },
  {
    path: [
      338, 377, 356, 376, 370, 368, 376, 356, 382, 344, 374, 334, 364, 338, 356, 341, 358, 351, 366,
      350,
    ],
    isLate: false,
    glintAt: 0.15,
  },
  {
    path: [
      156, 483, 136, 486, 116, 480, 106, 464, 96, 448, 104, 430, 120, 432, 132, 434, 132, 450, 121,
      451, 114, 452, 112, 444, 117, 441,
    ],
    isLate: false,
    glintAt: 2.4,
  },
  {
    path: [
      148, 548, 128, 553, 104, 552, 92, 540, 80, 528, 88, 512, 101, 516, 112, 519, 109, 533, 99,
      532, 93, 531, 93, 524, 98, 523,
    ],
    isLate: true,
    glintAt: 2.55,
  },
];

export const LEAF_MARKS: readonly LeafMark[] = [
  { x: 356, y: 457, turn: 55, size: 1 },
  { x: 374, y: 451, turn: -70, size: 1.1 },
  { x: 395, y: 431, turn: 30, size: 0.95 },
  { x: 412, y: 410, turn: -105, size: 0.85 },
  { x: 348, y: 534, turn: -60, size: 0.95 },
  { x: 366, y: 538, turn: 65, size: 1.05 },
  { x: 386, y: 551, turn: -30, size: 0.9 },
  { x: 356, y: 376, turn: -60, size: 0.85 },
  { x: 372, y: 364, turn: 35, size: 0.75 },
  { x: 134, y: 485, turn: 125, size: 0.95 },
  { x: 115, y: 477, turn: -120, size: 1 },
  { x: 101, y: 452, turn: 175, size: 0.85 },
  { x: 124, y: 552, turn: 120, size: 0.9 },
  { x: 104, y: 549, turn: -125, size: 0.95 },
];
