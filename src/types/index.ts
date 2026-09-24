import type { SnakeTileState, TetrisBlock, ToastVariant } from './enums'

export interface MergeTile {
  id: number
  value: number
}

export type MergeSpace = MergeTile | null

export interface WidthHeightSettings {
  width: number
  height: number
}

export interface MinesweeperSettings extends WidthHeightSettings {
  mineCount: number
}
export type TetrisSpace = TetrisBlock | null

export interface InterfereAction {
  actionPossible: boolean
  beforeToast?: ToastParams
  action?: () => void
  afterToast: ToastParams
}

export interface ToastParams {
  message: string
  desc?: string
  variant: ToastVariant
  action?: { label: string; onClick: () => void }
}

export interface Coord {
  x: number
  y: number
}

export type SnakeSpace = SnakeTileState | null

export * from './enums'
