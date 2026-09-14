export interface MinesweeperSettings {
  width?: number
  height?: number
  mineCount?: number
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

export interface MergeTile {
  id: number
  value: number
}

export type MergeSpace = MergeTile | null
