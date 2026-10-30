import type { Side } from '@domain/shared/side';

import { bySide, num } from '@ui/copy/text';

export interface StripCopy {
  readonly title: string;
  readonly subtitle: string;
}

export const TABLE_LABEL =
  'Mesa de juego a la luz de las velas. Usa las teclas 1, 2 y 3 o toca una carta de tu mano para jugarla.';

export const LOADER_COPY = {
  label: 'Cargando la mesa',
  loading: 'ENCENDIENDO VELAS',
  ready: 'MESA LISTA',
};

export const HINT_COPY = { play: 'ELIGE UNA CARTA', give: 'ELIGE LA CARTA QUE ENTREGAS' };

export const HUD_LABELS = {
  rival: 'Rival',
  player: 'Tú',
  effects: 'Tus efectos',
  actions: 'Jugadas',
  yourTurn: 'TU TURNO',
  theirTurn: 'SU TURNO',
  paused: 'EN PAUSA',
  restart: 'OTRA PARTIDA',
  curse: 'Maldición: su próxima carta tiene −4',
  curseMark: '−4',
  seal: 'Sello: su próximo efecto queda anulado',
};

export const WAGER_COPY = { lower: 'Bajar apuesta', raise: 'Subir apuesta' };

export const RAISE_COPY = { back: 'VOLVER', backLabel: 'Volver a las respuestas' };

export const SHEET_COPY = { close: 'Toca para cerrar.' };

export const stripCopy = (side: Side, turnSeconds: number): StripCopy => ({
  title: bySide(side, 'TU TURNO', 'TURNO DEL RIVAL'),
  subtitle: bySide(side, `LANZA UNA CARTA · ${num(turnSeconds)} S`, 'ESPERA SU JUGADA'),
});

export const timerText = (seconds: number): string => `${num(seconds)} S`;

export const timerLabel = (seconds: number): string => `Quedan ${num(seconds)} segundos`;

export const wagerLabel = (min: number, max: number): string =>
  `Valor de la apuesta, de ${num(min)} a ${num(max)}`;

export const faltaLabel = (max: number): string => `FALTA · ${num(max)}`;
