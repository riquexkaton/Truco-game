import { easeOutCubic } from '@infrastructure/three/cards/tween-math';

export const TOUCHDOWN = 0.82;
export const COIN_STAGGER_SECONDS = 0.28;

export interface FlightSample {
  readonly travel: number;
  readonly height: number;
  readonly bounce: number;
  readonly wobble: number;
  readonly spark: number;
  readonly landed: boolean;
}

export const flightApex = (distance: number): number => 0.75 + distance * 0.12;

const REDUCED_FLIGHT_SECONDS = 0.45;

export const flightSeconds = (seconds: number, isReduced: boolean): number =>
  isReduced ? REDUCED_FLIGHT_SECONDS : seconds;

export const sampleFlight = (progress: number, apex: number): FlightSample => {
  const t = Math.min(progress, 1);
  const flight = Math.min(t / TOUCHDOWN, 1);
  const travel = easeOutCubic(flight);
  const height = Math.sin(Math.PI * flight) * apex;
  if (t <= TOUCHDOWN) {
    return { travel, height, bounce: 0, wobble: 0, spark: 0, landed: false };
  }
  const settle = (t - TOUCHDOWN) / (1 - TOUCHDOWN);
  return {
    travel,
    height,
    bounce: Math.sin(Math.PI * settle) * 0.05 * (1 - settle),
    wobble: Math.sin(settle * Math.PI * 3) * 0.12 * (1 - settle),
    spark: Math.sin(Math.PI * settle) * 0.55,
    landed: true,
  };
};
