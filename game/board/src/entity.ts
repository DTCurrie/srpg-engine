import { Box3, Mesh, Object3D, Quaternion, Vector2Tuple, Vector3 } from "three";
import { action, atom } from "nanostores";
import { Direction, getNormal } from "./direction";

export type Entity = Readonly<{
  object3d: Object3D;
}> & {
  position: () => Vector3;
  coordinates: () => Vector2Tuple;
  rotation: () => Quaternion;
  direction: () => Direction;
  height: () => number;

  setPosition: (position: Vector3) => Vector3;
  setRotation: (towards: Quaternion) => Quaternion;
  setDirection: (to: Direction) => Direction;
  debug: () => string;
};

export type EntityOptions = {
  mesh: Mesh;
};

export const createEntity = ({ mesh }: EntityOptions): Entity => {
  const position = atom<Vector3>(mesh.position);
  const coordinates = atom<Vector2Tuple>([mesh.position.x, mesh.position.z]);
  const rotation = atom<Quaternion>(mesh.quaternion);
  const direction = atom<Direction>(Direction.North);

  const box = () => new Box3().setFromObject(mesh);
  const height = () => box().max.y - box().min.y;

  const setPosition = action(position, "setPosition", (store, next) => {
    const { x, y, z } = next;
    mesh.position.set(x, y + height() / 2, z);
    coordinates.set([x, z]);
    store.set(new Vector3(x, y, z));
    return next;
  });

  const setRotation = action(
    rotation,
    "setRotation",
    (store, next: Quaternion) => {
      mesh.quaternion.copy(next);
      store.set(next);
      return next;
    }
  );

  const setDirection = action(
    direction,
    "setDirection",
    (store, next: Direction) => {
      const normal = getNormal(next);
      mesh.lookAt(
        new Vector3()
          .copy(mesh.position)
          .add(new Vector3(normal[0], 0, normal[1]))
      );
      store.set(next);
      return next;
    }
  );

  return {
    object3d: mesh,
    position: () => position.get(),
    coordinates: () => coordinates.get(),
    rotation: () => rotation.get(),
    direction: () => direction.get(),
    height,

    setPosition,
    setRotation,
    setDirection,

    debug: () =>
      JSON.stringify(
        {
          mesh,
          position: position.get(),
          rotation: rotation.get(),
          direction: direction.get(),
        },
        undefined,
        2
      ),
  };
};
