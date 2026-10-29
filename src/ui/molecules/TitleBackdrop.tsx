import { backgroundUrl } from '@ui/art/art-urls';
import { Embers } from '@ui/atoms/Embers';

export const TitleBackdrop = () => (
  <>
    <picture>
      <source media="(orientation: portrait)" srcset={backgroundUrl('tall')} type="image/webp" />
      <img
        src={backgroundUrl('wide')}
        alt=""
        fetchpriority="high"
        class="absolute -inset-6 size-[calc(100%+48px)] max-w-none object-cover blur-[4px] brightness-50"
      />
    </picture>
    <div
      aria-hidden="true"
      class="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_6_10/0.8),rgb(7_6_10/0.3)_50%,rgb(7_6_10/0.85))]"
    />
    <div
      aria-hidden="true"
      class="absolute inset-0 bg-[radial-gradient(ellipse_820px_460px_at_50%_56%,rgb(255_140_60/0.2),rgb(7_6_10/0)_70%)] motion-safe:animate-table-glow"
    />
    <Embers />
  </>
);
