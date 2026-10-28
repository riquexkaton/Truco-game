const PATHS = {
  plus: 'M12 5 V19 M5 12 H19',
  cross: 'M6 6 L18 18 M18 6 L6 18',
  leave: 'M14 4 H6 V20 H14 M10 12 H20 M16.5 8.5 L20 12 L16.5 15.5',
  swords: 'M5 4 L19.5 18.5 M19 4 L4.5 18.5 M3.5 16.5 L7.5 20.5 M16.5 20.5 L20.5 16.5',
  ritualLinks: 'M12 9.1 V12.2 M9 14.6 L10.6 13.6 M15 14.6 L13.4 13.6',
  star: 'M12 2 L14.6 9.4 L22 12 L14.6 14.6 L12 22 L9.4 14.6 L2 12 L9.4 9.4 Z',
};

const SHIELD_PATH =
  'M20 3 L33 8 V19 C33 28 27 33 20 37 C13 33 7 28 7 19 V8 Z M15 15 L25 25 M25 15 L15 25';

export type IconName = 'plus' | 'cross' | 'leave' | 'swords' | 'rings' | 'ritual' | 'star';

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
