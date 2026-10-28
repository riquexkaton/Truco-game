import type { Mesh, Vector3 } from 'three';
import { AdditiveBlending, Sprite, SpriteMaterial } from 'three';

import type { FlightSample } from '@infrastructure/three/coins/coin-flight-math';
import {
  COIN_STAGGER_SECONDS,
  flightApex,
  flightSeconds,
  sampleFlight,
} from '@infrastructure/three/coins/coin-flight-math';
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

const SPARK_SIZE = 0.35;

const removeSpark = (flight: CoinFlight): void => {
  flight.spark?.removeFromParent();
  flight.spark?.material.dispose();
};

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

const showSpark = (table: CoinTable, flight: CoinFlight, opacity: number): void => {
  if (flight.spark === null) {
    const material = new SpriteMaterial({
      map: table.sparkTexture,
      blending: AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0,
    });
    flight.spark = new Sprite(material);
    flight.spark.position.copy(flight.to);
    flight.spark.scale.set(SPARK_SIZE, SPARK_SIZE, 1);
    table.scene.add(flight.spark);
  }
  flight.spark.material.opacity = opacity;
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
  if (sample.landed) showSpark(table, flight, sample.spark);
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
