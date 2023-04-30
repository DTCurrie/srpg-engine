import { Object3D, OrthographicCamera, Vector2, Vector3 } from "three";
import { updatesSystem } from "./updates-system";

const vector = new Vector3();

export type Html = Readonly<{
  camera: OrthographicCamera;
  canvas: HTMLCanvasElement;
  el: HTMLElement;
  object3D: Object3D;
}> & {
  update: () => void;
  dispose: () => void;
};

const { addUpdate, removeUpdate } = updatesSystem();

export const createHtml = (
  camera: OrthographicCamera,
  canvas: HTMLCanvasElement,
  el: HTMLElement,
  object3D: Object3D,
  offset?: Vector2
): Html => {
  const offsetX = offset?.x ?? 0;
  const offsetY = offset?.y ?? 0;

  let cameraStore: OrthographicCamera | undefined = camera;
  let canvasStore: HTMLCanvasElement | undefined = canvas;
  let elStore: HTMLElement | undefined = el;
  let object3DStore: Object3D | undefined = object3D;

  const update = () => {
    if (cameraStore === undefined) {
      return;
    }

    if (canvasStore === undefined) {
      return;
    }

    if (elStore === undefined) {
      return;
    }

    if (object3DStore === undefined) {
      return;
    }

    vector
      .setFromMatrixPosition(object3DStore.matrixWorld)
      .project(cameraStore);

    const x = (vector.x * 0.5 + 0.5) * canvasStore.clientWidth + offsetX;
    const y = (vector.y * -0.5 + 0.5) * canvasStore.clientHeight + offsetY;

    elStore.style.transform = `translate3d(-50%, -50%, 0) translate3d(${x}px,${y}px,0)`;
    elStore.style.zIndex = String(((-vector.z * 0.5 + 0.5) * 100000) | 0);
  };

  const dispose = () => {
    cameraStore = undefined;
    canvasStore = undefined;
    elStore = undefined;
    object3DStore = undefined;

    removeUpdate(update);
    document.body.removeChild(el);
  };

  document.body.prepend(el);
  addUpdate(update);

  return {
    camera: cameraStore,
    canvas: canvasStore,
    el: elStore,
    object3D: object3DStore,
    update,
    dispose,
  };
};
