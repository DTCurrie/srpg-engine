import {
  Group,
  Mesh,
  BoxGeometry,
  MeshToonMaterial,
  Vector2Tuple,
  Vector3,
} from "three";
import { BOARD_DEPTH, BOARD_WIDTH, STEP_HEIGHT } from "@srpg-engine/settings";
import { Level } from "@srpg-engine/api";
import { Tile, createTile, createTileMesh, markerColors } from "./tile";

export type Board = Readonly<{
  group: Group;
  selector: Group;
  grid: Tile[][];
  level: Level;
}> & {
  getTile: (coordinates: Vector2Tuple) => Tile;
  setTile: (coordinates: Vector2Tuple, next: Tile) => Tile;
  moveSelector: ([x, y]: Vector2Tuple) => void;
};

export const createBoard = (level: Level, selector: Group): Board => {
  const group = new Group();

  const grid: Tile[][] = Array.from({ length: BOARD_WIDTH }, () =>
    Array.from({ length: BOARD_DEPTH })
  );

  const getTile = ([x, y]: Vector2Tuple) => grid[x][y];
  const setTile = ([x, y]: Vector2Tuple, tile: Tile) => (grid[x][y] = tile);

  const moveSelector = ([x, y]: Vector2Tuple) => {
    const tile = getTile([x, y]);
    tile
      ? selector.position.copy(tile.top()).add(new Vector3(0, 0.05, 0))
      : selector.position.set(x, 0.05, y);
  };

  selector.traverse((obj) => {
    if (obj instanceof Mesh) {
      obj.material = new MeshToonMaterial({
        color: markerColors.selected,
      });
    }
  });

  selector.scale.set(0.5, 0.5, 0.5);
  moveSelector([0, 0]);
  group.add(selector);
  group.position.set(0, 0, 0);

  for (let x = 0; x < BOARD_WIDTH; x++) {
    for (let y = 0; y < BOARD_DEPTH; y++) {
      const gridSquare = new Mesh(
        new BoxGeometry(0.9, STEP_HEIGHT, 0.9),
        new MeshToonMaterial({
          color: "ghostwhite",
          opacity: 0.25,
          transparent: true,
        })
      );

      gridSquare.position.set(x, -STEP_HEIGHT / 2, y);
      group.add(gridSquare);
    }
  }

  for (const [x, y, z] of level.tileData) {
    const tile = createTile({ mesh: createTileMesh(y, "forestgreen") });
    grid[x][z] = tile;
    getTile([x, z])?.setPosition([x, z]);
    tile.setHeight(y);
    group.add(tile.mesh);
  }

  return {
    group,
    selector,
    level,
    grid,
    getTile,
    setTile,
    moveSelector,
  };
};

export * from "./direction";
export * from "./tile";
