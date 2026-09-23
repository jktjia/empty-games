import { TetrisBlock } from '@/types'

export const blockMatrices = {
  [TetrisBlock.T]: [
    [false, true, false],
    [true, true, true],
    [false, false, false],
  ],
  [TetrisBlock.I]: [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, true, true, true, true],
    [false, false, false, false, false],
    [false, false, false, false, false],
  ],
  [TetrisBlock.J]: [
    [true, false, false],
    [true, true, true],
    [false, false, false],
  ],
  [TetrisBlock.L]: [
    [false, false, true],
    [true, true, true],
    [false, false, false],
  ],
  [TetrisBlock.S]: [
    [false, true, true],
    [true, true, false],
    [false, false, false],
  ],
  [TetrisBlock.Z]: [
    [true, true, false],
    [false, true, true],
    [false, false, false],
  ],
  [TetrisBlock.O]: [
    [false, true, true],
    [false, true, true],
    [false, false, false],
  ],
}

export const scoreRowsCleared = [0, 100, 300, 500, 800]
export const labelRowsCleared = [
  undefined,
  'Single',
  'Double',
  'Triple',
  'Tetris',
]
export const rowsClearedPerLevel = 10

export const offsets = [
  [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ],
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ],
  [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ],
  [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: 0, y: 2 },
    { x: -1, y: 2 },
  ],
]

export const iOffsets = [
  [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: 0 },
  ],
  [
    { x: -1, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -2 },
  ],
  [
    { x: -1, y: 1 },
    { x: 1, y: 1 },
    { x: -2, y: 1 },
    { x: 1, y: 0 },
    { x: -2, y: 0 },
  ],
  [
    { x: 0, y: 1 },
    { x: 0, y: 1 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 0, y: 2 },
  ],
]

export const oOffsets = [
  [{ x: 0, y: 0 }],
  [{ x: 0, y: -1 }],
  [{ x: -1, y: -1 }],
  [{ x: -1, y: 0 }],
]
