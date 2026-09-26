import {
  blockMatrices,
  dirClockwise,
  iOffsets,
  oOffsets,
  offsets,
} from './consts'
import type { TetrisSpace, TetrisState } from '@/types'
import { Direction, TetrisBlock } from '@/types'
import { moveDirs } from '@/utils'

function initTiles(width: number = 10, height: number = 20): TetrisSpace[][] {
  const baseTiles: TetrisSpace[][] = []
  for (let i = 0; i < height; i++) {
    baseTiles[i] = []
    for (let j = 0; j < width; j++) {
      baseTiles[i][j] = null
    }
  }
  return baseTiles
}

export function initState(width: number, height: number): TetrisState {
  const firstBlocks = randomBag()
  return {
    tiles: initTiles(width, height),
    rotation: Direction.UP,
    block: firstBlocks[0],
    x: width / 2 - 1,
    y: 0,
    next: firstBlocks.slice(1),
    width,
    height,
    score: 0,
    rows: 0,
  }
}

function rotateMatrix(current: boolean[][]) {
  return current.map((row, i) =>
    row.map((_, j) => current[current.length - 1 - j][i]),
  )
}

export function getMatrix(rotation: Direction, block: TetrisBlock) {
  let matrix = blockMatrices[block]
  let rot = Direction.UP
  while (rot != rotation) {
    matrix = rotateMatrix(matrix)
    rot = dirClockwise[rot]
  }
  return matrix
}

export function rotateSRSKick(
  tiles: TetrisSpace[][],
  rotation: Direction,
  block: TetrisBlock,
  x: number,
  y: number,
) {
  const nextRot = dirClockwise[rotation]
  const matrix = getMatrix(nextRot, block)

  const offsetList =
    block == TetrisBlock.I
      ? iOffsets
      : block == TetrisBlock.O
        ? oOffsets
        : offsets

  for (let n = 0; n < offsetList[rotation].length; n++) {
    const offsetX = offsetList[rotation][n].x - offsetList[nextRot][n].x
    const offsetY = offsetList[rotation][n].y - offsetList[nextRot][n].y
    if (currentValid(tiles, matrix, x + offsetX, y - offsetY)) {
      return { rotation: nextRot, x: x + offsetX, y: y - offsetY }
    }
  }
  return { rotation, x, y }
}

export function checkTSpin(
  tiles: TetrisSpace[][],
  rotation: Direction,
  block: TetrisBlock,
  x: number,
  y: number,
) {
  if (block != TetrisBlock.T) {
    return { tSpin: false, miniT: false }
  } else {
    const dirMod = moveDirs[rotation]
    const frontCorners = [
      { x: dirMod.x == 0 ? 1 : dirMod.x, y: dirMod.y == 0 ? 1 : dirMod.y },
      { x: dirMod.x == 0 ? -1 : dirMod.x, y: dirMod.y == 0 ? -1 : dirMod.y },
    ]
    const backCorners = [
      { x: dirMod.x == 0 ? 1 : -dirMod.x, y: dirMod.y == 0 ? 1 : -dirMod.y },
      { x: dirMod.x == 0 ? -1 : -dirMod.x, y: dirMod.y == 0 ? -1 : -dirMod.y },
    ]

    const filledFront = frontCorners.filter((c) =>
      spaceFilled(tiles, x + c.x, y + c.y),
    ).length
    const filledBack = backCorners.filter((c) =>
      spaceFilled(tiles, x + c.x, y + c.y),
    ).length

    if (filledBack + filledFront < 3) {
      return { tSpin: false, miniT: false }
    } else {
      if (filledFront == 2) {
        return { tSpin: true, miniT: false }
      } else {
        return { tSpin: false, miniT: true }
      }
    }
  }
}

function spaceFilled(tiles: TetrisSpace[][], x: number, y: number) {
  return (
    y < 0 ||
    y >= tiles.length ||
    x < 0 ||
    x >= tiles[y].length ||
    tiles[y][x] != null
  )
}

export function canMoveDown(
  tiles: TetrisSpace[][],
  current: boolean[][],
  x: number,
  y: number,
): boolean {
  return canMoveDir(Direction.DOWN, tiles, current, x, y)
}

export function canMoveLeft(
  tiles: TetrisSpace[][],
  current: boolean[][],
  x: number,
  y: number,
): boolean {
  return canMoveDir(Direction.LEFT, tiles, current, x, y)
}

export function canMoveRight(
  tiles: TetrisSpace[][],
  current: boolean[][],
  x: number,
  y: number,
): boolean {
  return canMoveDir(Direction.RIGHT, tiles, current, x, y)
}

function canMoveDir(
  dir: Direction,
  tiles: TetrisSpace[][],
  current: boolean[][],
  x: number,
  y: number,
) {
  return currentValid(tiles, current, x + moveDirs[dir].x, y + moveDirs[dir].y)
}

export function randomBag() {
  let blocks = [
    TetrisBlock.I,
    TetrisBlock.O,
    TetrisBlock.T,
    TetrisBlock.J,
    TetrisBlock.L,
    TetrisBlock.S,
    TetrisBlock.Z,
  ]

  const shuffled = []
  while (blocks.length > 0) {
    const i = Math.floor(Math.random() * blocks.length)
    shuffled.push(blocks[i])
    blocks = [...blocks.slice(0, i), ...blocks.slice(i + 1, blocks.length)]
  }

  return shuffled
}

export function placeCurrent(
  tiles: TetrisSpace[][],
  current: boolean[][],
  x: number,
  y: number,
  currBlock: TetrisBlock,
) {
  const n = current.length
  const halfN = Math.floor(n / 2)

  const newTiles = []
  for (let i = 0; i < tiles.length; i++) {
    const newRow: TetrisSpace[] = []
    for (let j = 0; j < tiles[i].length; j++) {
      const currentX = j - x + halfN
      const currentY = i - y + halfN
      if (
        currentY >= 0 &&
        currentY < current.length &&
        currentX >= 0 &&
        currentX < current[currentY].length &&
        current[currentY][currentX]
      ) {
        newRow.push(currBlock)
      } else {
        newRow.push(tiles[i][j])
      }
    }
    newTiles.push(newRow)
  }
  return newTiles
}

export function currentValid(
  tiles: TetrisSpace[][],
  current: boolean[][],
  x: number,
  y: number,
) {
  const n = current.length - 1
  const halfN = Math.floor(n / 2)
  let valid = true
  for (let i = 0; i < current.length; i++) {
    for (let j = 0; j < current[i].length; j++) {
      if (current[i][j]) {
        const currentX = x - halfN + j
        const currentY = y - halfN + i
        if (currentY < 0) {
          continue
        } else if (
          currentY >= tiles.length ||
          currentX < 0 ||
          currentX >= tiles[currentY].length
        ) {
          return false
        }
        valid = valid && tiles[currentY][currentX] == null
      }
    }
  }
  return valid
}

/**
 * Find the y coordinate of the ghost piece at the bottom where the current piece will land
 * @param tiles
 * @param current
 * @param x
 * @returns
 */
export function ghostLocation(
  tiles: TetrisSpace[][],
  current: boolean[][],
  x: number,
  y: number,
): number {
  while (y < tiles.length) {
    if (!canMoveDown(tiles, current, x, y)) {
      break
    }
    y++
  }
  return y
}

export function ghostCoords(
  tiles: TetrisSpace[][],
  current: boolean[][],
  x: number,
  y: number,
) {
  const ghostY = ghostLocation(tiles, current, x, y)

  const n = current.length - 1
  const halfN = Math.floor(n / 2)
  const coords = []
  for (let i = 0; i < current.length; i++) {
    for (let j = 0; j < current[i].length; j++) {
      if (current[i][j]) {
        const currentX = x - halfN + j
        const currentY = ghostY - halfN + i

        coords.push({ x: currentX, y: currentY })
      }
    }
  }
  return coords
}

export function clearRows(tiles: TetrisSpace[][]) {
  let newTiles: TetrisSpace[][] = []
  let rows = 0
  const width = tiles[0].length
  for (let i = tiles.length - 1; i >= 0; i--) {
    if (tiles[i].some((t) => t == null)) {
      newTiles = [tiles[i], ...newTiles]
    }
  }
  const emptyRow = []
  for (let i = 0; i < width; i++) {
    emptyRow.push(null)
  }
  while (newTiles.length < tiles.length) {
    newTiles = [emptyRow, ...newTiles]
    rows++
  }
  return { tiles: newTiles, rowsCleared: rows }
}

export function shiftLeft(tiles: TetrisSpace[][]) {
  const newTiles: TetrisSpace[][] = []
  for (const row of tiles) {
    const newRow = [
      ...row.filter((t) => t != null),
      ...row.filter((t) => t == null),
    ]
    newTiles.push(newRow)
  }
  return newTiles
}

export function shiftRight(tiles: TetrisSpace[][]) {
  const newTiles: TetrisSpace[][] = []
  for (const row of tiles) {
    const newRow = [
      ...row.filter((t) => t == null),
      ...row.filter((t) => t != null),
    ]
    newTiles.push(newRow)
  }
  return newTiles
}
