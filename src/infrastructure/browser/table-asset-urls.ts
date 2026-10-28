import { requireUrl, urlsByStem } from '@infrastructure/browser/asset-catalog';

export type BackgroundKey = 'wide' | 'tall';

interface CoinMapUrls {
  readonly color: string;
  readonly normal: string;
  readonly metalRoughness: string;
}

const backgrounds = urlsByStem(
  import.meta.glob<string>('/src/assets/backgrounds/bg_*.jpg', {
    eager: true,
    import: 'default',
    query: { format: 'webp', quality: '86' },
  }),
  'bg_',
);

const coinColorMaps = urlsByStem(
  import.meta.glob<string>('/src/assets/coins/moneda_*_c.jpg', {
    eager: true,
    import: 'default',
    query: { format: 'webp', quality: '85' },
  }),
  'moneda_',
);

const coinDataFiles = urlsByStem(
  import.meta.glob<string>(['/src/assets/coins/moneda_*_n.jpg', '/src/assets/coins/*.json'], {
    eager: true,
    import: 'default',
    query: '?url',
  }),
  'moneda_',
);

const coinRoughnessMaps = urlsByStem(
  import.meta.glob<string>('/src/assets/coins/moneda_*_mr.jpg', {
    eager: true,
    import: 'default',
    query: { format: 'webp', quality: '95' },
  }),
  'moneda_',
);

export const backgroundUrl = (key: BackgroundKey): string => requireUrl(backgrounds, key);

export const coinGeometryUrl = (): string => requireUrl(coinDataFiles, 'geo');

export const coinMapUrls = (variant: string): CoinMapUrls => ({
  color: requireUrl(coinColorMaps, `${variant}_c`),
  normal: requireUrl(coinDataFiles, `${variant}_n`),
  metalRoughness: requireUrl(coinRoughnessMaps, `${variant}_mr`),
});
