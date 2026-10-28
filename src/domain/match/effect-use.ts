import type { CardId } from '@domain/cards/card';
import type { EffectId } from '@domain/effects/effect';
import { HEAL_AMOUNT, removeFirst, STRIKE_DAMAGE } from '@domain/effects/effect';
import type { EffectChoice } from '@domain/match/gates';
import { changeLife } from '@domain/match/life-change';
import type { MatchState } from '@domain/match/match-state';
import type { Random } from '@domain/shared/random';
import { pickOne } from '@domain/shared/random';
import type { Side } from '@domain/shared/side';
import { opponent, withSide } from '@domain/shared/side';

type EffectHandler = (state: MatchState, side: Side) => MatchState;

const HANDLERS: Readonly<Record<EffectId, EffectHandler>> = {
  golpe: (state, side) => changeLife(state, { side: opponent(side), amount: -STRIKE_DAMAGE }),
  sanacion: (state, side) => changeLife(state, { side, amount: HEAL_AMOUNT }),
  maldicion: (state, side) => ({ ...state, curse: withSide(state.curse, opponent(side), true) }),
  sello: (state, side) => ({ ...state, seal: withSide(state.seal, opponent(side), true) }),
  saqueo: (state) => state,
};

export interface EffectActivation {
  readonly state: MatchState;
  readonly annulled: boolean;
}

const spendEffect = (state: MatchState, { side, effect }: EffectChoice): MatchState => ({
  ...state,
  usedEffectThisTurn: true,
  effects: {
    ...state.effects,
    stored: withSide(state.effects.stored, side, removeFirst(state.effects.stored[side], effect)),
    discard: [...state.effects.discard, effect],
  },
});

const isAnnulledBySeal = (state: MatchState, { side, effect }: EffectChoice): boolean =>
  state.seal[side] && effect !== 'sello';

const breakSeal = (state: MatchState, side: Side): MatchState => ({
  ...state,
  seal: withSide(state.seal, side, false),
});

export const activateEffect = (state: MatchState, choice: EffectChoice): EffectActivation => {
  const spent = spendEffect(state, choice);
  const isAnnulled = isAnnulledBySeal(state, choice);
  return {
    state: isAnnulled ? breakSeal(spent, choice.side) : HANDLERS[choice.effect](spent, choice.side),
    annulled: isAnnulled,
  };
};

export interface PlunderChoice {
  readonly side: Side;
  readonly give: CardId;
}

export const plunder = (
  state: MatchState,
  { side, give }: PlunderChoice,
  random: Random,
): MatchState => {
  const mine = state.hands[side];
  const theirs = state.hands[opponent(side)];
  if (mine.length === 0 || theirs.length === 0) return state;
  if (!mine.includes(give)) {
    throw new Error(`Cannot give ${give}: it is not in the ${side} hand`);
  }
  const steal = pickOne(random, theirs);
  const swapped = withSide(
    state.hands,
    side,
    mine.map((id) => (id === give ? steal : id)),
  );
  return {
    ...state,
    hands: withSide(
      swapped,
      opponent(side),
      theirs.map((id) => (id === steal ? give : id)),
    ),
  };
};
