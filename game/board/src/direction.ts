import { Euler, Vector2Tuple, Vector3Tuple } from "three";

export enum Direction {
  North,
  East,
  South,
  West,
}

export const directions = [
  Direction.North,
  Direction.East,
  Direction.South,
  Direction.West,
] as const;

export const toVector3 = (direction: Direction): Vector3Tuple => [
  0,
  direction * 90,
  0,
];

export const toEuler = (direction: Direction): Euler =>
  new Euler(0, direction * 90, 0);

export const getDirection = (coordinates: Vector2Tuple): Direction => {
  if (coordinates[1] > 0) return Direction.North;
  if (coordinates[0] > 0) return Direction.East;
  if (coordinates[1] < 0) return Direction.South;
  return Direction.West;
};

export const getHeading = (
  start: Vector2Tuple,
  end: Vector2Tuple
): Direction => {
  if (start[1] < end[1]) return Direction.North;
  if (start[0] < end[0]) return Direction.East;
  if (start[1] > end[1]) return Direction.South;
  return Direction.West;
};

export const getNormal = (direction: Direction): Vector2Tuple => {
  switch (direction) {
    case Direction.North:
      return [0, 1];
    case Direction.East:
      return [1, 0];
    case Direction.South:
      return [0, -1];
    default:
      return [-1, 0];
  }
};

export const normalizedDirections = [
  getNormal(Direction.North),
  getNormal(Direction.East),
  getNormal(Direction.South),
  getNormal(Direction.West),
] as const;
