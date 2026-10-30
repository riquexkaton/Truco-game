import { DECK } from '@domain/cards/deck';
import { MAX_LIFE } from '@domain/life/life';

import { num } from '@ui/copy/text';

export type TitleCardId = 'play' | 'rules' | 'deck' | 'settings';

export interface TitleCardCopy {
  readonly id: TitleCardId;
  readonly label: string;
  readonly chip: string;
  readonly description: string;
}

export const MENU_COPY = {
  title: 'MESA DE LAS VELAS',
  prompt: 'ELIGE UNA CARTA',
  nav: 'Menú principal',
  soon: 'PRÓXIMAMENTE',
  fullscreen: 'Pantalla completa',
  exitFullscreen: 'Salir de pantalla completa',
  music: 'Música',
  sfx: 'Efectos de sonido',
};

export const TITLE_CARDS: readonly TitleCardCopy[] = [
  {
    id: 'play',
    label: 'JUGAR',
    chip: 'Contra la IA',
    description: `Enfrenta a la IA: gana dos de tres duelos por ronda y baja al rival de ${num(MAX_LIFE)} a 0 de vida.`,
  },
  {
    id: 'rules',
    label: 'REGLAS',
    chip: 'Ritual · Pacto · Desafío',
    description:
      'Aprende los duelos, la vira, el Perico y la Perica, y cuándo cantar Desafío, Pacto o Ritual.',
  },
  {
    id: 'deck',
    label: 'MAZO',
    chip: `${num(DECK.length)} cartas`,
    description: `Las ${num(DECK.length)} cartas de las cuatro facciones y los efectos que ganas con las cartas con sello.`,
  },
  {
    id: 'settings',
    label: 'AJUSTES',
    chip: 'Sonido y pantalla',
    description: 'Ajusta el sonido y la pantalla, o reduce las animaciones.',
  },
];
