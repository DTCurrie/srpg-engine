import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let gltfLoaderInstance: GLTFLoader | null = null;
export const gltfLoader = () => {
  if (gltfLoaderInstance === null) {
    gltfLoaderInstance = new GLTFLoader();
  }

  return gltfLoaderInstance;
};
