import type { Mesh, Vector3 } from 'three';

import type { FlightSample } from '@infrastructure/three/coins/coin-flight-math';
import {
  COIN_STAGGER_SECONDS,
  flightApex,
  flightSeconds,
  sampleFlight,
} from '@infrastructure/three/coins/coin-flight-math';
import { removeSpark, showLanding } from '@infrastructure/three/coins/coin-landing';
import type { CoinFlight, CoinTable } from '@infrastructure/three/coins/coin-table';
import { lerp } from '@infrastructure/three/cards/tween-math';

export interface FlightPlan {
  readonly coin: Mesh;
  readonly order: number;
  readonly to: Vector3;
  readonly flips: number;
  readonly yawFrom: number;
  readonly yawTo: number;
  readonly seconds: number;
  readonly onLand: (() => void) | null;
}

const removeFlight = (table: CoinTable, flight: CoinFlight): void => {
  removeSpark(flight);
  const index = table.flights.indexOf(flight);
  if (index !== -1) table.flights.splice(index, 1);
};

export const launchFlight = (table: CoinTable, plan: FlightPlan): void => {
  const from = plan.coin.position.clone();
  table.flights.push({
    coin: plan.coin,
    from,
    to: plan.to.clone(),
    flips: plan.flips,
    yawFrom: plan.yawFrom,
    yawTo: plan.yawTo,
    onLand: plan.onLand,
    duration: flightSeconds(plan.seconds, table.reducedMotion),
    apex: flightApex(from.distanceTo(plan.to)),
    progress: -plan.order * COIN_STAGGER_SECONDS,
    spark: null,
  });
};

const poseCoin = (table: CoinTable, flight: CoinFlight, sample: FlightSample): void => {
  const { coin } = flight;
  coin.position.lerpVectors(flight.from, flight.to, sample.travel);
  coin.position.y += sample.height + sample.bounce;
  coin.rotation.set(
    table.reducedMotion ? 0 : flight.flips * sample.travel,
    lerp(flight.yawFrom, flight.yawTo, sample.travel),
    sample.wobble,
  );
};

const land = (table: CoinTable, flight: CoinFlight): void => {
  flight.coin.position.copy(flight.to);
  flight.coin.rotation.set(0, flight.yawTo, 0);
  removeFlight(table, flight);
  flight.onLand?.();
};

const stepFlight = (table: CoinTable, flight: CoinFlight, deltaSeconds: number): void => {
  flight.progress += deltaSeconds / flight.duration;
  if (flight.progress < 0) return;
  const sample = sampleFlight(flight.progress, flight.apex);
  poseCoin(table, flight, sample);
  if (sample.landed) showLanding(table, flight, sample.spark);
  if (flight.progress >= 1) land(table, flight);
};

export const areCoinsFlying = (table: CoinTable): boolean => table.flights.length > 0;

export const updateCoinFlights = (table: CoinTable, deltaSeconds: number): void => {
  const flights = [...table.flights];
  for (const flight of flights) {
    stepFlight(table, flight, deltaSeconds);
  }
};

export const dropOrphanFlights = (table: CoinTable): void => {
  const orphans = table.flights.filter((flight) => flight.coin.parent === null);
  for (const flight of orphans) {
    removeFlight(table, flight);
  }
};
