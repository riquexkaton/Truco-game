import { Hanko } from '@ui/atoms/Hanko';
import type { BannerKind } from '@ui/copy/notice';
import type { BannerView } from '@ui/hud/hud-view';

interface BannerProps {
  readonly banner: BannerView | null;
}

const ENDS: Readonly<Record<BannerKind, string>> = {
  plain: 'pattern-sg-dark',
  win: 'pattern-sg-green',
  lose: 'pattern-asa-red',
};

const SEALS: Readonly<Record<BannerKind, string>> = {
  plain: 'bg-ink',
  win: 'bg-green',
  lose: 'bg-red',
};

const END = 'absolute top-[10.5px] bottom-[10.5px] w-[60px] narrow:w-[38px]';

const Seal = ({ banner }: { readonly banner: BannerView }) =>
  banner.seal === null ? null : (
    <Hanko
      class={`absolute -top-7 -right-3.5 size-16 animate-slam rounded-[10px] shadow-[3px_4px_0_rgb(0_0_0/0.3)] ${SEALS[banner.kind]}`}
    >
      <span class="flex flex-col items-center gap-0.5 leading-none text-washi2">
        <b class="text-[26px]">{banner.seal.value}</b>
        <i class="text-[7px] font-extrabold tracking-[0.2em] not-italic">{banner.seal.caption}</i>
      </span>
    </Hanko>
  );

export const Banner = ({ banner }: BannerProps) =>
  banner === null ? null : (
    <div
      key={banner.id}
      aria-hidden="true"
      style={{ animationDuration: `${String(banner.duration)}ms` }}
      class="paper-rule pointer-events-none fixed top-[40%] left-1/2 z-7 flex min-h-[124px] w-[min(620px,calc(100vw-32px))] [transform:translate(-50%,-50%)] animate-banner-in flex-col items-center justify-center gap-2.5 bg-washi px-[86px] py-6 text-ink opacity-0 shadow-[0_24px_50px_rgb(0_0_0/0.65)] [--rule-inset:9px] narrow:min-h-[108px] narrow:px-14 narrow:py-5 tall:top-[calc(126px+env(safe-area-inset-top,0px))]"
    >
      <i class={`${END} left-[10.5px] border-r-[1.5px] border-ink ${ENDS[banner.kind]}`} />
      <i class={`${END} right-[10.5px] border-l-[1.5px] border-ink ${ENDS[banner.kind]}`} />
      <b class="pl-[0.22em] text-center text-[clamp(18px,4.2vw,27px)] leading-[1.15] font-extrabold tracking-[0.2em] text-ink">
        {banner.title}
      </b>
      {banner.subtitle === '' ? null : (
        <span class="pl-[0.28em] text-center text-[10px] leading-normal font-extrabold tracking-[0.28em] text-ink/65">
          {banner.subtitle}
        </span>
      )}
      <Seal banner={banner} />
    </div>
  );
