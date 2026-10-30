import type { EffectId } from '@domain/effects/effect';
import type { Side } from '@domain/shared/side';

import type { GameSession } from '@ui/containers/game-session';
import type { SideHudProps } from '@ui/organisms/SideHud';
import { EffectsTray } from '@ui/organisms/EffectsTray';
import { PlayerHud } from '@ui/organisms/PlayerHud';
import { RivalHud } from '@ui/organisms/RivalHud';

interface ContainerProps {
  readonly session: GameSession;
}

const sideView = ({ store, hud }: GameSession, side: Side): SideHudProps => ({
  life: store.lives.value[side],
  hit: hud.lifeHits.value[side],
  results: store.duelResults.value,
  isCursed: store.curse.value[side],
  isSealed: store.seal.value[side],
});

const EffectsContainer = ({ session }: ContainerProps) => {
  const { store, commands, hud } = session;
  const effects = store.playerEffects.value.map((effect) => ({
    effect,
    block: store.effectBlock(effect),
  }));
  const playEffect = (effect: EffectId) => {
    commands.useEffect(effect);
  };
  return (
    <EffectsTray effects={effects} promptId={hud.prompt.value?.id ?? null} onUse={playEffect} />
  );
};

export const MatchHudContainer = ({ session }: ContainerProps) => (
  <>
    <RivalHud {...sideView(session, 'rival')} effectCount={session.store.rivalEffectCount.value} />
    <PlayerHud {...sideView(session, 'player')} />
    <EffectsContainer session={session} />
  </>
);
