const NOTE = 'M9 18V5l11-2v13 M9 18a3 3 0 1 1-6 0a3 3 0 1 1 6 0 M20 16a3 3 0 1 1-6 0a3 3 0 1 1 6 0';

const SPEAKER = 'M11 5L6 9H3v6h3l5 4z M15.5 8.5a5 5 0 0 1 0 7 M18.5 5.5a9 9 0 0 1 0 13';

const PATHS = {
  plus: 'M12 5 V19 M5 12 H19',
  cross: 'M6 6 L18 18 M18 6 L6 18',
  back: 'M15 5 L8 12 L15 19',
  leave: 'M14 4 H6 V20 H14 M10 12 H20 M16.5 8.5 L20 12 L16.5 15.5',
  swords: 'M5 4 L19.5 18.5 M19 4 L4.5 18.5 M3.5 16.5 L7.5 20.5 M16.5 20.5 L20.5 16.5',
  ritualLinks: 'M12 9.1 V12.2 M9 14.6 L10.6 13.6 M15 14.6 L13.4 13.6',
  star: 'M12 2 L14.6 9.4 L22 12 L14.6 14.6 L12 22 L9.4 14.6 L2 12 L9.4 9.4 Z',
  sealStar: 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z',
  candle:
    'M12 2.5c1.6 1.8 2.2 3.2 2.2 4.3a2.2 2.2 0 0 1-4.4 0c0-1.1.6-2.5 2.2-4.3z M12 9v2 ' +
    'M9.5 11h5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z M6 21h12',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  shrink: 'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5',
  music: NOTE,
  musicOff: `${NOTE} M3 3l18 18`,
  sound: SPEAKER,
  soundOff: `${SPEAKER} M3 3l18 18`,
};

const SHIELD_PATH =
  'M20 3 L33 8 V19 C33 28 27 33 20 37 C13 33 7 28 7 19 V8 Z M15 15 L25 25 M25 15 L15 25';

export type IconName =
  | 'plus'
  | 'cross'
  | 'back'
  | 'leave'
  | 'swords'
  | 'rings'
  | 'ritual'
  | 'star'
  | 'sealStar'
  | 'candle'
  | 'expand'
  | 'shrink'
  | 'music'
  | 'musicOff'
  | 'sound'
  | 'soundOff';

interface IconProps {
  readonly name: IconName;
  readonly class: string;
}

const Rings = () => (
  <>
    <circle cx="9" cy="12" r="5.2" />
    <circle cx="15" cy="12" r="5.2" />
  </>
);

const Ritual = () => (
  <>
    <circle cx="12" cy="6.5" r="2.6" />
    <circle cx="6.5" cy="16" r="2.6" />
    <circle cx="17.5" cy="16" r="2.6" />
    <path d={PATHS.ritualLinks} />
  </>
);

const shapeOf = (name: IconName) => {
  if (name === 'rings') return <Rings />;
  if (name === 'ritual') return <Ritual />;
  return <path d={PATHS[name]} />;
};

export const Icon = ({ name, class: className }: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" class={className}>
    {shapeOf(name)}
  </svg>
);

export const ShieldIcon = ({ class: className }: { readonly class: string }) => (
  <svg viewBox="0 0 40 40" aria-hidden="true" class={className}>
    <path d={SHIELD_PATH} />
  </svg>
);
