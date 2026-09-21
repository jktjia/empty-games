import { expect, test } from 'vitest'
import * as helperMod from './helpers'
import { TetrisBlock } from '@/types'

test('initTiles creates empty 10x20', () => {
  const result = helperMod.initTiles()

  expect(result.length).toBe(20)
  expect(result.every((r) => r.length == 10)).toBe(true)
  expect(result.every((r) => r.every((t) => t == null))).toBe(true)
})

// test('rotate', () => {
//     const initial = [
//         [false, true, true],
//         [false, true, false],
//         [false, true, false],
//     ]
//     const current = [
//         [false, false, false],
//         [true, true, true],
//         [false, false, true],
//     ]

//     const emptyTiles = helperMod.initTiles()

//     const result = helperMod.rotateSRSKick(emptyTiles, initial, TetrisBlock.J, 4, 4)

//     expect(result.rotated).toEqual(current)
//     expect(result.x).toEqual(4)
//     expect(result.y).toEqual(4)
// })

// test('rotate 2', () => {
//     const initial = [
//         [false, false, true, false, false],
//         [false, false, true, false, false],
//         [false, false, true, false, false],
//         [false, false, true, false, false],
//         [false, false, false, false, false],
//     ]
//     const current = [
//         [false, false, false, false, false],
//         [false, false, false, false, false],
//         [false, true, true, true, true],
//         [false, false, false, false, false],
//         [false, false, false, false, false],
//     ]

//     const emptyTiles = helperMod.initTiles()

//     const result = helperMod.rotateSRSKick(emptyTiles, initial, TetrisBlock.I, 4, 4)

//     expect(result.rotated).toEqual(current)
//     expect(result.x).toEqual(4)
//     expect(result.y).toEqual(4)
// })

// test('rotate 3', () => {
//     const initial = [
//         [false, true, true],
//         [false, true, true],
//         [false, false, false],
//     ]
//     const current = [
//         [false, false, false],
//         [false, true, true],
//         [false, true, true],
//     ]

//     const emptyTiles = helperMod.initTiles()

//     const result = helperMod.rotateSRSKick(emptyTiles, initial, TetrisBlock.I, 4, 4)

//     expect(result.rotated).toEqual(current)
//     expect(result.x).toEqual(4)
//     expect(result.y).toEqual(4)
// })

test('can move down', () => {
  const tiles = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]
  const current = [
    [false, true, true],
    [false, true, false],
    [false, true, false],
  ]

  const result = helperMod.canMoveDown(tiles, current, 2, 2)

  expect(result).toBe(true)
})

test('cannot move down if at bottom', () => {
  const tiles = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]
  const current = [
    [false, true, true],
    [false, true, false],
    [false, true, false],
  ]

  const result = helperMod.canMoveDown(tiles, current, 2, 3)

  expect(result).toBe(false)
})

test('cannot move down if block below', () => {
  const tiles = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [TetrisBlock.I, TetrisBlock.I, TetrisBlock.I, TetrisBlock.I, null],
  ]
  const current = [
    [false, true, true],
    [false, true, false],
    [false, true, false],
  ]

  const result = helperMod.canMoveDown(tiles, current, 2, 2)

  expect(result).toBe(false)
})

test('cannot move down if block below 2', () => {
  const tiles = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, TetrisBlock.L, TetrisBlock.L],
    [null, null, null, null, TetrisBlock.L],
    [null, null, null, null, TetrisBlock.L],
  ]
  const current = [
    [false, true, true],
    [false, true, false],
    [false, true, false],
  ]

  const result = helperMod.canMoveDown(tiles, current, 2, 2)

  expect(result).toBe(false)
})

test('can move left', () => {
  const tiles = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]
  const current = [
    [false, true, true],
    [false, true, false],
    [false, true, false],
  ]

  const result = helperMod.canMoveLeft(tiles, current, 2, 2)

  expect(result).toBe(true)
})

test('cannot move left if at side', () => {
  const tiles = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]
  const current = [
    [false, true, true],
    [false, true, false],
    [false, true, false],
  ]

  const result = helperMod.canMoveLeft(tiles, current, 0, 2)

  expect(result).toBe(false)
})

test('cannot move left if block to left', () => {
  const tiles = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [TetrisBlock.T, null, null, null, null],
    [TetrisBlock.T, TetrisBlock.T, null, null, null],
    [TetrisBlock.T, null, null, null, null],
  ]
  const current = [
    [false, true, true],
    [false, true, false],
    [false, true, false],
  ]

  const result = helperMod.canMoveLeft(tiles, current, 2, 2)

  expect(result).toBe(false)
})

test('can move right', () => {
  const tiles = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]
  const current = [
    [false, true, true],
    [false, true, false],
    [false, true, false],
  ]

  const result = helperMod.canMoveRight(tiles, current, 2, 2)

  expect(result).toBe(true)
})

test('cannot move right if at side', () => {
  const tiles = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]
  const current = [
    [false, true, true],
    [false, true, false],
    [false, true, false],
  ]

  const result = helperMod.canMoveRight(tiles, current, 3, 2)

  expect(result).toBe(false)
})

test('cannot move right if block to right', () => {
  const tiles = [
    [null, null, null, null, null],
    [null, null, null, null, TetrisBlock.I],
    [null, null, null, null, TetrisBlock.I],
    [null, null, null, null, TetrisBlock.I],
    [null, null, null, null, TetrisBlock.I],
  ]
  const current = [
    [false, true, true],
    [false, true, false],
    [false, true, false],
  ]

  const result = helperMod.canMoveRight(tiles, current, 2, 2)

  expect(result).toBe(false)
})

test('cannot move right if block to right 2', () => {
  const tiles = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, TetrisBlock.O, TetrisBlock.O],
    [null, null, null, TetrisBlock.O, TetrisBlock.O],
  ]
  const current = [
    [false, true, true],
    [false, true, false],
    [false, true, false],
  ]

  const result = helperMod.canMoveRight(tiles, current, 2, 3)

  expect(result).toBe(false)
})

test('ghost piece 1', () => {
  const tiles = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]
  const current = [
    [false, true, false, false],
    [false, true, false, false],
    [false, true, false, false],
    [false, true, false, false],
  ]

  const result = helperMod.ghostLocation(tiles, current, 2, 0)

  expect(result).toBe(2)
})

test('ghost piece 2', () => {
  const tiles = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]
  const current = [
    [false, true, false, false],
    [false, true, false, false],
    [false, true, false, false],
    [false, true, false, false],
  ]

  const result = helperMod.ghostLocation(tiles, current, 2, 0)

  expect(result).toBe(2)
})

test('ghost piece 3', () => {
  const tiles = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]
  const current = [
    [false, false, false, false],
    [true, true, true, true],
    [false, false, false, false],
    [false, false, false, false],
  ]

  const result = helperMod.ghostLocation(tiles, current, 1, 0)

  expect(result).toBe(4)
})

test('ghost piece 4', () => {
  const tiles = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]
  const current = [
    [false, false, false, false],
    [false, false, false, false],
    [true, true, true, true],
    [false, false, false, false],
  ]

  const result = helperMod.ghostLocation(tiles, current, 1, 0)

  expect(result).toBe(3)
})

test('ghost piece 5', () => {
  const tiles = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, TetrisBlock.O, TetrisBlock.O],
    [null, null, null, TetrisBlock.O, TetrisBlock.O],
  ]
  const current = [
    [false, false, false, false],
    [true, true, true, true],
    [false, false, false, false],
    [false, false, false, false],
  ]

  const result = helperMod.ghostLocation(tiles, current, 1, 0)

  expect(result).toBe(2)
})

test('ghost coords', () => {
  const tiles = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, TetrisBlock.O, TetrisBlock.O],
    [null, null, null, TetrisBlock.O, TetrisBlock.O],
  ]
  const current = [
    [false, false, false, false],
    [true, true, true, true],
    [false, false, false, false],
    [false, false, false, false],
  ]

  const result = helperMod.ghostCoords(tiles, current, 1, 0)

  expect(result).toStrictEqual([
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
    { x: 3, y: 2 },
  ])
})

test('place current', () => {
  const initial = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, TetrisBlock.O, TetrisBlock.O],
    [null, null, null, TetrisBlock.O, TetrisBlock.O],
  ]
  const current = [
    [false, false, false, false],
    [true, true, true, true],
    [false, false, false, false],
    [false, false, false, false],
  ]
  const final = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [TetrisBlock.I, TetrisBlock.I, TetrisBlock.I, TetrisBlock.I, null],
    [null, null, null, TetrisBlock.O, TetrisBlock.O],
    [null, null, null, TetrisBlock.O, TetrisBlock.O],
  ]

  const result = helperMod.placeCurrent(initial, current, 1, 2, TetrisBlock.I)

  expect(result).toStrictEqual(final)
})

test('place current 2', () => {
  const initial = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]
  const current = [
    [false, false, false, false],
    [false, false, false, false],
    [true, true, true, true],
    [false, false, false, false],
  ]
  const final = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [TetrisBlock.I, TetrisBlock.I, TetrisBlock.I, TetrisBlock.I, null],
  ]

  const result = helperMod.placeCurrent(initial, current, 1, 3, TetrisBlock.I)

  expect(result).toStrictEqual(final)
})

test('clear rows', () => {
  const initial = [
    [null, null, null, TetrisBlock.S, null],
    [null, null, null, TetrisBlock.S, TetrisBlock.S],
    [TetrisBlock.I, TetrisBlock.I, TetrisBlock.I, TetrisBlock.I, TetrisBlock.S],
    [null, null, null, TetrisBlock.O, TetrisBlock.O],
    [null, null, null, TetrisBlock.O, TetrisBlock.O],
  ]
  const final = [
    [null, null, null, null, null],
    [null, null, null, TetrisBlock.S, null],
    [null, null, null, TetrisBlock.S, TetrisBlock.S],
    [null, null, null, TetrisBlock.O, TetrisBlock.O],
    [null, null, null, TetrisBlock.O, TetrisBlock.O],
  ]

  const result = helperMod.clearRows(initial)
  expect(result.tiles).toStrictEqual(final)
  expect(result.rowsCleared).toStrictEqual(1)
})
