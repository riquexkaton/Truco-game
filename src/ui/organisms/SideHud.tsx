import type { ComponentChildren } from 'preact';

import type { DuelResult } from '@domain/duel/duel';

import { HUD_LABELS } from '@ui/copy/hud-copy';
import type { LifeHitView } from '@ui/hud/hud-view';
import type { HudSize } from '@ui/molecules/LifeCounter';
import { LifeCounter } from '@ui/molecules/LifeCounter';
import { Marks } from '@ui/molecules/Marks';
import { Pips } from '@ui/molecules/Pips';

export interface SideHudProps {
  readonly life: number;
  readonly hit: LifeHitView | null;
  readonly results: readonly DuelResult[];
  readonly isCursed: boolean;
  readonly isSealed: boolean;
}

interface SideHudFrameProps extends SideHudProps {
  readonly size: HudSize;
  readonly children?: ComponentChildren;
}

const PLACEMENT: Readonly<Record<HudSize, string>> = {
  rival:
    'top-[calc(12px+env(safe-area-inset-top,0px))] gap-[7px] px-11 pb-5 bg-[radial-gradient(ellipse_60%_70%_at_50%_30%,rgb(0_0_0/0.55),rgb(0_0_0/0)_72%)]',
  player:
    'bottom-[calc(14px+env(safe-area-inset-bottom,0px))] gap-2 px-14 pt-[26px] bg-[radial-gradient(ellipse_60%_70%_at_50%_72%,rgb(0_0_0/0.62),rgb(0_0_0/0)_72%)] narrow:px-[34px] narrow:pt-[22px]',
};

export const SideHud = (props: SideHudFrameProps) => (
  <div
    role="group"
    aria-label={HUD_LABELS[props.size]}
    class={`pointer-events-none fixed left-1/2 flex -translate-x-1/2 flex-col items-center ${PLACEMENT[props.size]}`}
  >
    <LifeCounter life={props.life} hit={props.hit} size={props.size} />
    <Pips results={props.results} side={props.size} />
    <Marks isCursed={props.isCursed} isSealed={props.isSealed} size={props.size} />
    {props.children}
  </div>
);
