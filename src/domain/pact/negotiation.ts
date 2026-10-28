import type { Bet } from '@domain/pact/bet';
import type { Side } from '@domain/shared/side';
import { opponent } from '@domain/shared/side';

export interface PactNegotiation {
  readonly caller: Side;
  readonly bet: Bet;
  readonly previous: number;
  readonly first: boolean;
}

export type PactAnswer =
  | { readonly kind: 'accept' }
  | { readonly kind: 'reject' }
  | { readonly kind: 'ritual' }
  | { readonly kind: 'raise'; readonly bet: Bet };

export const openNegotiation = (caller: Side, bet: Bet): PactNegotiation => ({
  caller,
  bet,
  previous: 0,
  first: true,
});

export const responderOf = (negotiation: PactNegotiation): Side => opponent(negotiation.caller);

export const raiseNegotiation = (negotiation: PactNegotiation, bet: Bet): PactNegotiation => ({
  caller: responderOf(negotiation),
  bet,
  previous: negotiation.bet.amount,
  first: false,
});
