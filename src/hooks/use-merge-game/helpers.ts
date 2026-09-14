import type { MergeSpace, MergeTile } from '@/lib/types'

export function sameTiles(t1: MergeSpace[][], t2: MergeSpace[][]): boolean {
  // if (!validTiles(t1) || !validTiles(t2)) {
  //     throw new Error('invalid 2048 tiles')
  // }
  let same = true
  for (let i = 0; i < t1.length; i++) {
    for (let j = 0; j < t1[i].length; j++) {
      same =
        same &&
        t1[i][j]?.value == t2[i][j]?.value &&
        t1[i][j]?.id == t2[i][j]?.id
    }
  }
  return same
}

function makeBaseTiles(n: number = 4): MergeSpace[][] {
  const baseTiles: MergeSpace[][] = []
  for (let i = 0; i < n; i++) {
    baseTiles[i] = []
    for (let j = 0; j < n; j++) {
      baseTiles[i][j] = null
    }
  }
  return baseTiles
}

export function slideUp(tiles: MergeSpace[][]): [MergeSpace[][], number] {
  // if (!validTiles(tiles)) {
  //     throw new Error('invalid 2048 tiles')
  // }
  const updated = makeBaseTiles()
  let score = 0
  for (let i = 0; i < 4; i++) {
    const onlyVals = tiles.map((r) => r[i]).filter((v) => v != null)
    const [newCol, colScore] = mergeValues(onlyVals)
    score += colScore
    for (let n = 0; n < newCol.length; n++) {
      updated[n][i] = newCol[n]
    }
  }
  return [updated, score]
}

export function slideDown(tiles: MergeSpace[][]): [MergeSpace[][], number] {
  // if (!validTiles(tiles)) {
  //     throw new Error('invalid 2048 tiles')
  // }
  const updated = makeBaseTiles()
  let score = 0
  for (let i = 0; i < 4; i++) {
    const onlyVals = tiles.map((r) => r[i]).filter((v) => v != null)
    const [newCol, colScore] = mergeValues(onlyVals, true)
    score += colScore
    for (let n = 0; n < newCol.length; n++) {
      updated[updated.length - 1 - n][i] = newCol[newCol.length - 1 - n]
    }
  }
  return [updated, score]
}

export function slideLeft(tiles: MergeSpace[][]): [MergeSpace[][], number] {
  // if (!validTiles(tiles)) {
  //     throw new Error('invalid 2048 tiles')
  // }
  const updated = makeBaseTiles()
  let score = 0
  for (let i = 0; i < 4; i++) {
    const onlyVals = tiles[i].filter((v) => v != null)
    const [newCol, colScore] = mergeValues(onlyVals)
    score += colScore
    for (let n = 0; n < newCol.length; n++) {
      updated[i][n] = newCol[n]
    }
  }
  return [updated, score]
}

export function slideRight(tiles: MergeSpace[][]): [MergeSpace[][], number] {
  // if (!validTiles(tiles)) {
  //     throw new Error('invalid 2048 tiles')
  // }
  const updated = makeBaseTiles()
  let score = 0
  for (let i = 0; i < 4; i++) {
    const onlyVals = tiles[i].filter((v) => v != null)
    const [newCol, colScore] = mergeValues(onlyVals, true)
    score += colScore
    for (let n = 0; n < newCol.length; n++) {
      updated[i][updated.length - 1 - n] = newCol[newCol.length - 1 - n]
    }
  }
  return [updated, score]
}

export function mergeValues(
  vals: MergeTile[],
  reverse?: boolean,
): [MergeTile[], number] {
  let merged: MergeTile[] = []
  let score = 0
  let justMerged = false
  if (reverse) {
    const reversed = []
    for (let idx = 0; idx < vals.length; idx++) {
      reversed.push(vals[vals.length - 1 - idx])
    }
    vals = reversed
  }
  for (let j = 0; j < vals.length; j++) {
    if (justMerged) {
      justMerged = false
      continue
    }
    if (j < vals.length - 1 && vals[j].value == vals[j + 1].value) {
      const tile = vals[j + 1]
      const copy = { id: tile.id, value: tile.value }
      copy.value = copy.value * 2
      merged.push(copy)
      score += copy.value
      justMerged = true
    } else {
      merged.push(vals[j])
    }
  }
  if (reverse) {
    const reversed = []
    for (let idx = 0; idx < merged.length; idx++) {
      reversed.push(merged[merged.length - 1 - idx])
    }
    merged = reversed
  }
  return [merged, score]
}

export function initTiles(): MergeSpace[][] {
  const t1 = addNewTile(makeBaseTiles(), 0)
  const t2 = addNewTile(t1, 1)
  return t2
}

export function addNewTile(tiles: MergeSpace[][], id: number): MergeSpace[][] {
  // if (!validTiles(tiles)) {
  //     throw new Error('invalid 2048 tiles')
  // }
  const newTile = Math.floor(Math.random() * emptyTiles(tiles))
  const newVal = Math.floor(Math.random() * 5) == 0 ? 4 : 2
  const updated: MergeSpace[][] = []
  let currEmpty = 0
  for (let i = 0; i < tiles.length; i++) {
    updated[i] = []
    for (let j = 0; j < tiles[i].length; j++) {
      const oldVal = tiles[i][j]
      if (oldVal != null) {
        updated[i][j] = oldVal
      } else {
        updated[i][j] = currEmpty == newTile ? { id: id, value: newVal } : null
        currEmpty++
      }
    }
  }
  return updated
}

export function emptyTiles(tiles: MergeSpace[][]): number {
  // if (!validTiles(tiles)) {
  //     throw new Error('invalid 2048 tiles')
  // }
  return tiles.flatMap((r) => r.map((v) => v == null)).filter((v) => v).length
}

export function nextId(tiles: MergeSpace[][]): number {
  // if (!validTiles(tiles)) {
  //     throw new Error('invalid 2048 tiles')
  // }
  let id = 0
  for (const r of tiles) {
    for (const t of r) {
      if (t && id <= t.id) {
        id = t.id + 1
      }
    }
  }
  return id
}

// function validTiles(tiles: number[][]): boolean {
//     return tiles.length == 4 && tiles.every(r => r.length == 4)
// }
