import { Color, Group, Vector2Tuple, Vector3Tuple } from "three";
import {
  Tile,
  createBoard,
  createTile,
  createTileMesh,
} from "@srpg-engine/board";
import { BOARD_DEPTH, BOARD_HEIGHT, BOARD_WIDTH } from "@srpg-engine/settings";
import { three } from "@srpg-engine/three-utils";

type Rect = {
  x: number;
  y: number;
  width: number;
  depth: number;
};

const { scene, camera } = three();

export type LevelEditor = {
  board: Group;
  adjustCurrent: (height: number) => void;
  adjustRect: (rect: Rect, height: number) => void;
  adjustRandom: (height: number) => void;
  setSelector: ([x, y]: Vector2Tuple) => void;
  getTileData: () => Vector3Tuple[];
};

const createLevelEditor = (selector: Group): LevelEditor => {
  const { group, grid, getTile, setTile, moveSelector } = createBoard(
    {
      id: "",
      name: "",
      tileData: [],
    },
    selector
  );

  let currentCoordinates: Vector2Tuple = [0, 0];

  const getOrCreateTile = ([x, y]: Vector2Tuple): Tile => {
    if (getTile([x, y])) {
      return getTile([x, y]) as Tile;
    }

    const tile = createTile({ mesh: createTileMesh(0, "forestgreen") });
    tile.setPosition([x, y]);
    group.add(tile.mesh);
    setTile([x, y], tile);
    return tile;
  };

  const randomRect = (): Rect => {
    const x = Math.floor(Math.random() * BOARD_WIDTH);
    const y = Math.floor(Math.random() * BOARD_DEPTH);

    const width = Math.floor(Math.floor(Math.random() * (BOARD_WIDTH - x)) + 1);

    const depth = Math.floor(Math.floor(Math.random() * (BOARD_DEPTH - y)) + 1);

    return { x, y, width, depth };
  };

  const adjustSingle = ([x, y]: Vector2Tuple, height: number) => {
    if (height > 0) {
      const tile = getOrCreateTile([x, y]);
      if (tile.height() < BOARD_HEIGHT) {
        if (tile.height() > BOARD_HEIGHT) {
          tile.setHeight(BOARD_HEIGHT - tile.height());
          return;
        }

        tile.setHeight(height);
        setTile([x, y], tile);
      }

      return;
    }

    if (!getTile([x, y])) {
      return;
    }

    const tile = getTile([x, y]) as Tile;
    tile.setHeight(height);

    setTile([x, y], tile);
  };

  const adjustCurrent = (height: number) =>
    adjustSingle(currentCoordinates, height);

  const adjustRect = (rect: Rect, height: number) => {
    const { x, y, width, depth } = rect;

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < depth; j++) {
        adjustSingle([x + i, y + j], height);
      }
    }
  };

  const adjustRandom = (height: number) => adjustRect(randomRect(), height);

  const setSelector = ([x, y]: Vector2Tuple) => {
    currentCoordinates = [x, y];
    moveSelector([x, y]);
  };

  const getTileData = (): Vector3Tuple[] => {
    const tiles: Vector3Tuple[] = [];

    for (const col of grid) {
      for (const tile of col) {
        if (tile) {
          tiles.push([
            tile.mesh.position.x,
            tile.height(),
            tile.mesh.position.z,
          ]);
        }
      }
    }

    return tiles;
  };

  scene.background = new Color(0xffffff);
  scene.add(group);

  camera().position.y = BOARD_WIDTH / 2;
  camera().position.y = 10;
  camera().position.z = 10;
  camera().lookAt(group.position);

  return {
    board: group,
    adjustCurrent,
    adjustRect,
    adjustRandom,
    setSelector,
    getTileData,
  };
};

let instance: LevelEditor | null = null;
export const levelEditor = (selector: Group) => {
  if (instance !== null) {
    return instance;
  }

  instance = createLevelEditor(selector);
  return instance;
};
