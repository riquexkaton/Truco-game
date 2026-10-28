import { PaperButton } from '@ui/atoms/PaperButton';
import { backgroundUrl } from '@ui/art/art-urls';
import { TITLE_COPY } from '@ui/copy/hud-copy';

interface TitleScreenProps {
  readonly onIntent: () => void;
  readonly onStart: () => void;
}

const Backdrop = () => (
  <>
    <picture>
      <source media="(orientation: portrait)" srcset={backgroundUrl('tall')} type="image/webp" />
      <img
        src={backgroundUrl('wide')}
        alt=""
        fetchpriority="high"
        class="absolute inset-0 size-full object-cover"
      />
    </picture>
    <div
      aria-hidden="true"
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgb(7_6_10/0.2),rgb(7_6_10/0.88)_75%)]"
    />
  </>
);

export const TitleScreen = ({ onIntent, onStart }: TitleScreenProps) => (
  <main class="fixed inset-0 grid place-items-center overflow-hidden bg-night px-4">
    <Backdrop />
    <div class="paper-rule wcard flex w-[min(480px,calc(100vw-32px))] flex-col items-center gap-4 px-8 pb-8 text-center">
      <div
        aria-hidden="true"
        class="-mx-[22.5px] mt-[11.5px] h-[34px] self-stretch border-b-[1.5px] border-ink pattern-sg-dark narrow:-mx-[12.5px]"
      />
      <div class="wtag">
        <h1 class="py-2.5 pr-5 pl-[calc(20px+0.3em)] text-[clamp(22px,6vw,34px)] leading-none font-extrabold tracking-[0.3em] text-ink">
          {TITLE_COPY.title}
        </h1>
      </div>
      <p class="text-[13px] leading-normal font-semibold text-ink/80">{TITLE_COPY.subtitle}</p>
      <PaperButton
        variant="hero"
        onPointerEnter={onIntent}
        onFocus={onIntent}
        onTouchStart={onIntent}
        onClick={onStart}
      >
        {TITLE_COPY.play}
      </PaperButton>
    </div>
  </main>
);
