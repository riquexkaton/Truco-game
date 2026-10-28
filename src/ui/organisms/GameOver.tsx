import { useEffect, useRef } from 'preact/hooks';

import { Icon } from '@ui/atoms/Icon';
import { HUD_LABELS } from '@ui/copy/hud-copy';
import type { GameOverCopy } from '@ui/copy/notice';

interface GameOverProps {
  readonly gameOver: GameOverCopy | null;
  readonly onRestart: () => void;
}

interface OverCardProps {
  readonly gameOver: GameOverCopy;
  readonly onRestart: () => void;
}

const TITLE_ID = 'game-over-title';

const OverSeal = ({ isWin }: { readonly isWin: boolean }) => (
  <span
    aria-hidden="true"
    class={`relative -mt-[60px] grid size-[84px] animate-seal-in place-items-center rounded-full shadow-[3px_4px_0_rgb(0_0_0/0.25)] before:absolute before:inset-[5px] before:rounded-full before:shadow-[inset_0_0_0_2px_var(--color-washi)] after:absolute after:inset-[9px] after:rounded-full after:shadow-[inset_0_0_0_1px_var(--color-ink)] ${isWin ? 'bg-gold-seal' : 'bg-red'}`}
  >
    <Icon name="star" class={`relative size-[34px] ${isWin ? 'fill-ink' : 'fill-washi2'}`} />
  </span>
);

const OverHeading = ({ gameOver }: { readonly gameOver: GameOverCopy }) => (
  <>
    <div
      aria-hidden="true"
      class="-mx-[22.5px] mt-[11.5px] h-[120px] self-stretch border-b-[1.5px] border-ink pattern-sg-dark narrow:-mx-[12.5px]"
    />
    <OverSeal isWin={gameOver.winner === 'player'} />
    <div class="wtag">
      <h1
        id={TITLE_ID}
        class="py-2.5 pr-6 pl-[calc(24px+0.3em)] text-[clamp(28px,7vw,40px)] leading-none font-extrabold tracking-[0.3em] text-ink"
      >
        {gameOver.title}
      </h1>
    </div>
    <span class="text-[10px] font-extrabold tracking-[0.26em] text-ink/65">
      {gameOver.subtitle}
    </span>
  </>
);

const OverCard = ({ gameOver, onRestart }: OverCardProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    buttonRef.current?.focus();
  }, []);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={TITLE_ID}
      class="paper-rule wcard flex w-[min(480px,calc(100vw-32px))] animate-over-in flex-col items-center gap-4 px-8 pb-8 text-center"
    >
      <OverHeading gameOver={gameOver} />
      <button
        ref={buttonRef}
        type="button"
        onClick={onRestart}
        class="min-h-[46px] cursor-pointer bg-ink px-[26px] font-mincho text-[12px] leading-none font-extrabold tracking-[0.22em] text-washi2 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink"
      >
        {HUD_LABELS.restart}
      </button>
    </div>
  );
};

export const GameOver = ({ gameOver, onRestart }: GameOverProps) =>
  gameOver === null ? null : (
    <div class="fixed inset-0 z-7 grid place-items-center bg-[radial-gradient(ellipse_at_50%_50%,rgb(7_6_10/0.55),rgb(7_6_10/0.9))] pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,env(safe-area-inset-left,0px))]">
      <OverCard gameOver={gameOver} onRestart={onRestart} />
    </div>
  );
