import { MineTileState } from '@/lib/types'

export function revealTile(
  x: number,
  y: number,
  height: number,
  width: number,
  mines: number[][],
  tiles: MineTileState[][],
): MineTileState[][] {
  const dup = JSON.parse(JSON.stringify(tiles))
  recursiveReveal(x, y, height, width, mines, dup)
  return dup
}

function recursiveReveal(
  x: number,
  y: number,
  height: number,
  width: number,
  mines: number[][],
  tiles: MineTileState[][],
): void {
  const current = tiles[y][x]
  if (current == MineTileState.NOT_SEEN) {
    tiles[y][x] = MineTileState.SEEN
    if (mines[y][x] == 0) {
      if (x > 0) {
        recursiveReveal(x - 1, y, height, width, mines, tiles)
      }
      if (x > 0 && y > 0) {
        recursiveReveal(x - 1, y - 1, height, width, mines, tiles)
      }
      if (y > 0) {
        recursiveReveal(x, y - 1, height, width, mines, tiles)
      }
      if (x < width - 1 && y > 0) {
        recursiveReveal(x + 1, y - 1, height, width, mines, tiles)
      }
      if (x < width - 1) {
        recursiveReveal(x + 1, y, height, width, mines, tiles)
      }
      if (x < width - 1 && y < height - 1) {
        recursiveReveal(x + 1, y + 1, height, width, mines, tiles)
      }
      if (y < height - 1) {
        recursiveReveal(x, y + 1, height, width, mines, tiles)
      }
      if (x > 0 && y < height - 1) {
        recursiveReveal(x - 1, y + 1, height, width, mines, tiles)
      }
    }
  }
}

export function initMines(
  initX: number,
  initY: number,
  width: number,
  height: number,
  count: number,
): number[][] {
  if (width < 1 || height < 1) {
    throw new Error('invalid minesweeper dimensions')
  }
  if (count > width * height - 9 || count < 1) {
    throw new Error('invalid mine count')
  }
  if (initX < 0 || initX > width - 1 || initY < 0 || initY > height - 1) {
    throw new Error('invalid initial click')
  }

  let initInvalid = 9
  const edgeY = initY == 0 || initY == height - 1
  const edgeX = initX == 0 || initX == width - 1
  if (edgeX && edgeY) {
    initInvalid = 4
  } else if (edgeX || edgeY) {
    initInvalid = 6
  }
  const mineLocations: number[] = []
  for (let n = 0; n < count; n++) {
    let loc = Math.floor(Math.random() * (width * height - initInvalid - n))
    let locX = loc % width
    let locY = Math.floor(loc / width)
    while (
      (locY <= initY + 1 &&
        locY >= initY - 1 &&
        locX <= initX + 1 &&
        locX >= initX - 1) ||
      mineLocations.includes(loc)
    ) {
      loc++
      locX = loc % width
      locY = Math.floor(loc / width)
    }
    mineLocations.push(loc)
  }

  const mines: number[][] = []
  for (let i = 0; i < height; i++) {
    mines[i] = []
    for (let j = 0; j < width; j++) {
      if (mineLocations.includes(i * width + j)) {
        mines[i].push(-1)
        if (j > 0 && mines[i][j - 1] != -1) {
          mines[i][j - 1]++
        }
        if (j > 0 && i > 0 && mines[i - 1][j - 1] != -1) {
          mines[i - 1][j - 1]++
        }
        if (i > 0 && mines[i - 1][j] != -1) {
          mines[i - 1][j]++
        }
        if (j < width - 1 && i > 0 && mines[i - 1][j + 1] != -1) {
          mines[i - 1][j + 1]++
        }
      } else {
        let adjCount = 0
        if (j > 0 && mines[i][j - 1] == -1) {
          adjCount++
        }
        if (j > 0 && i > 0 && mines[i - 1][j - 1] == -1) {
          adjCount++
        }
        if (i > 0 && mines[i - 1][j] == -1) {
          adjCount++
        }
        if (j < width - 1 && i > 0 && mines[i - 1][j + 1] == -1) {
          adjCount++
        }
        mines[i].push(adjCount)
      }
    }
  }
  return mines
}

export function initTiles(width: number, height: number) {
  const tiles: MineTileState[][] = []
  for (let i = 0; i < height; i++) {
    tiles[i] = []
    for (let j = 0; j < width; j++) {
      tiles[i].push(MineTileState.NOT_SEEN)
    }
  }
  return tiles
}
