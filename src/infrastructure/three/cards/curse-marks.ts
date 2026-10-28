import type { Scene, Sprite } from 'three';

import type { TablePoint } from '@infrastructure/three/layout/table-points';
import { CARD_Y } from '@infrastructure/three/layout/table-points';
import { createMarkSprite } from '@infrastructure/three/textures/mark-sprite';
import { CURSE_VIOLET } from '@infrastructure/three/textures/palette';

const CURSE_TEXT = '−4';

export const addCurseMark = (scene: Scene, marks: Sprite[], slot: TablePoint): void => {
  const mark = createMarkSprite({ text: CURSE_TEXT, color: CURSE_VIOLET });
  mark.position.set(slot.x + 0.36, CARD_Y + 0.08, slot.z - 0.4);
  scene.add(mark);
  marks.push(mark);
};

export const clearCurseMarks = (marks: Sprite[]): void => {
  for (const mark of marks) {
    mark.removeFromParent();
    mark.material.map?.dispose();
    mark.material.dispose();
  }
  marks.length = 0;
};
