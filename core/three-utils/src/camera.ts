import { OrthographicCamera } from "three";

export const FRUSTUM_SIZE = 1000 as const;

export const createCamera = () => new OrthographicCamera();
