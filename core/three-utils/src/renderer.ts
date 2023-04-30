import { OrthographicCamera, WebGLRenderer } from "three";

export const createRenderer = () =>
  new WebGLRenderer({
    canvas: document.querySelector<HTMLCanvasElement>("#canvas") ?? undefined,
    powerPreference: "high-performance",
    antialias: true,
  });

const frustumSize = 10;
export const resizeToDisplay = (
  camera: OrthographicCamera,
  renderer: WebGLRenderer,
  dpi = window.devicePixelRatio,
  force = false,
  onResize?: (width: number, height: number) => void
) => {
  const { domElement } = renderer;
  const width = (domElement.clientWidth * dpi) | 0;
  const height = (domElement.clientHeight * dpi) | 0;
  const shouldResize =
    domElement.width !== width || domElement.height !== height;

  if (shouldResize || force) {
    const aspect = domElement.clientWidth / domElement.clientHeight;

    camera.left = (frustumSize * aspect) / -2;
    camera.right = (frustumSize * aspect) / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    camera.updateProjectionMatrix();

    onResize?.(width, height);
    renderer.setSize(width, height, false);
  }
};
