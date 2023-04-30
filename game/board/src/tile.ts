import {
  BoxGeometry,
  ColorRepresentation,
  Mesh,
  MeshToonMaterial,
  Vector2Tuple,
  Vector3,
} from "three";
import { IGNORE_LAYER, STEP_HEIGHT, TILE_LAYER } from "@srpg-engine/settings";
import { colors } from "@srpg-engine/colors";

export type TileMesh = Mesh<BoxGeometry, MeshToonMaterial>;

export type MarkerColor = "selected" | "movement" | "offense" | "support";
export const markerColors: Record<MarkerColor, ColorRepresentation> = {
  selected: colors.selected.DEFAULT,
  movement: colors.movement.DEFAULT,
  offense: colors.offense.DEFAULT,
  support: colors.support.DEFAULT,
};

export const createTileGeometry = (height: number) =>
  new BoxGeometry(1, STEP_HEIGHT * height, 1);

export const createTileMaterial = (color: ColorRepresentation) =>
  new MeshToonMaterial({ color });

export const createTileMesh = (
  height: number,
  color: ColorRepresentation
): TileMesh => new Mesh(createTileGeometry(height), createTileMaterial(color));

export type Tile = Readonly<{
  mesh: TileMesh;
}> & {
  position: () => Vector2Tuple;
  height: () => number;
  marked: () => MarkerColor | undefined;
  occupied: () => boolean;
  top: () => Vector3;

  setPosition: (next: Vector2Tuple) => Vector2Tuple;
  setHeight: (next: number) => number;
  setMarked: (color?: MarkerColor) => MarkerColor | undefined;
  setOccupied: (next: boolean) => boolean;
};

export type TileOptions = {
  mesh: Mesh<BoxGeometry, MeshToonMaterial>;
};

export const createTile = ({ mesh }: TileOptions): Tile => {
  let position: Vector2Tuple = [0, 0];
  let height = 0;
  let occupied = false;
  let marked: MarkerColor | undefined;

  const marker = new Mesh(
    new BoxGeometry(0.8, 0.1, 0.8),
    new MeshToonMaterial({
      color: markerColors.selected,
      opacity: 0.75,
      transparent: true,
    })
  );

  const calculatedHeight = () => mesh.geometry.parameters.height;
  const top = () => new Vector3(position[0], calculatedHeight(), position[1]);

  const setPosition = ([x, y]: Vector2Tuple): Vector2Tuple => {
    mesh.position.set(x, calculatedHeight() / 2, y);
    position = [x, y];
    return [x, y];
  };

  const setHeight = (next: number): number => {
    const geometry = createTileGeometry(next);
    mesh.geometry.dispose();
    mesh.geometry = geometry;
    setPosition(position);
    height = next;
    return next;
  };

  const setMarked = (next?: MarkerColor): MarkerColor | undefined => {
    marked = next;

    if (next) {
      marker.visible = true;
      marker.material.color.set(markerColors[next]);
      return next;
    }

    marker.visible = false;
    return next;
  };

  const setOccupied = (next: boolean): boolean => {
    occupied = next;
    return next;
  };

  marker.layers.set(IGNORE_LAYER);
  marker.visible = false;
  marker.position.set(
    mesh.position.x,
    calculatedHeight() / 2 + 0.05,
    mesh.position.z
  );

  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.layers.set(TILE_LAYER);
  mesh.add(marker);

  return {
    mesh,

    height: () => height,
    position: () => position,
    marked: () => marked,
    occupied: () => occupied,

    top,

    setHeight,
    setPosition,
    setMarked,
    setOccupied,
  };
};
