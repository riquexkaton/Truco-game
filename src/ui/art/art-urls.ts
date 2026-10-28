import type { EffectId } from '@domain/effects/effect';

export type BackgroundKey = 'wide' | 'tall';

export interface EffectArt {
  readonly url: string;
  readonly color: string;
  readonly position: string;
}

const stemOf = (path: string): string =>
  path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));

const byStem = (modules: Readonly<Record<string, string>>, prefix: string) =>
  new Map(
    Object.entries(modules).map(([path, url]): [string, string] => [
      stemOf(path).slice(prefix.length),
      url,
    ]),
  );

const effectUrls = byStem(
  import.meta.glob<string>('/src/assets/effects/fx_*.jpg', {
    eager: true,
    import: 'default',
    query: { format: 'webp', quality: '80' },
  }),
  'fx_',
);

const backgroundUrls = byStem(
  import.meta.glob<string>('/src/assets/backgrounds/bg_*.jpg', {
    eager: true,
    import: 'default',
    query: { format: 'webp', quality: '86' },
  }),
  'bg_',
);

const EFFECT_LOOK: Readonly<Record<EffectId, Omit<EffectArt, 'url'>>> = {
  golpe: { color: '#B23A2A', position: '50% 22%' },
  sanacion: { color: '#3F6B4A', position: '45% 30%' },
  saqueo: { color: '#A8701A', position: '50% 25%' },
  maldicion: { color: '#5A3E7A', position: '50% 62%' },
  sello: { color: '#2C4E7A', position: '50% 28%' },
};

export const effectArt = (effect: EffectId): EffectArt => ({
  url: effectUrls.get(effect) ?? '',
  ...EFFECT_LOOK[effect],
});

export const backgroundUrl = (key: BackgroundKey): string => backgroundUrls.get(key) ?? '';
