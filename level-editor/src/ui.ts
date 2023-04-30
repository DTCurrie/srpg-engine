import { Vector2, WebGLRenderer } from "three";
import { nanoid } from "nanoid";
import { createLevel } from "@srpg-engine/api";
import { delay } from "@srpg-engine/delay";
import { BOARD_HEIGHT } from "@srpg-engine/settings";
import { button, buttons } from "@srpg-engine/ui";
import { LevelEditor } from "./editor";

export const createLevelEditorUi = (
  renderer: WebGLRenderer,
  levelEditor: LevelEditor
) => {
  const pointer = new Vector2();

  function onPointerMove(event: PointerEvent) {
    pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    pointer.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  }

  const btns = buttons([
    button("Set Random Height", () =>
      levelEditor.adjustRandom(Math.floor(Math.random() * BOARD_HEIGHT))
    ),
    button("Set Random Ground", () => levelEditor.adjustRandom(1)),
    button("Randomize", async () => {
      for (let i = 0; i < 100; i++) {
        levelEditor.adjustRandom(Math.floor(Math.random() * BOARD_HEIGHT));
        await delay(10);
      }
    }),
    button("Save Level", () =>
      createLevel({
        name: `Test ${nanoid(10)}`,
        tileData: levelEditor.getTileData(),
      })
    ),
  ]);

  document.body.prepend(btns);

  window.addEventListener("pointermove", onPointerMove);

  return { pointer };
};
