import { AdditiveBlending, Sprite, SpriteMaterial } from 'three';

import type { CoinFlight, CoinTable } from '@infrastructure/three/coins/coin-table';

const SPARK_SIZE = 0.35;

export const removeSpark = (flight: CoinFlight): void => {
  flight.spark?.removeFromParent();
  flight.spark?.material.dispose();
};

const addSpark = (table: CoinTable, flight: CoinFlight): Sprite => {
  const material = new SpriteMaterial({
    map: table.sparkTexture,
    blending: AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0,
  });
  const spark = new Sprite(material);
  spark.position.copy(flight.to);
  spark.scale.set(SPARK_SIZE, SPARK_SIZE, 1);
  table.scene.add(spark);
  return spark;
};

export const showLanding = (table: CoinTable, flight: CoinFlight, opacity: number): void => {
  if (flight.spark === null) {
    flight.spark = addSpark(table, flight);
    table.onCoinLand();
  }
  flight.spark.material.opacity = opacity;
};
