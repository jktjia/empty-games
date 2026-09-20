export interface MergeTile {
  id: number
  value: number
}

export type MergeSpace = MergeTile | null

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export interface WidthHeightSettings {
  width: number
  height: number
}

export interface MinesweeperSettings extends WidthHeightSettings {
  mineCount: number
}

export enum MineTileState {
  FLAG,
  SEEN,
  NOT_SEEN,
}

export enum Difficulty {
  BEGINNER,
  INTERMEDIATE,
  EXPERT,
}

export enum TetrisBlock {
  I,
  O,
  T,
  J,
  L,
  S,
  Z,
}

export type TetrisSpace = TetrisBlock | null
