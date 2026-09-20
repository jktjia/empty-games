import { afterEach, expect, test, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import * as helperMod from './helpers'
import useMinesweeper from '.'
import { MineTileState } from '@/lib/types'
import { decrypt, encrypt } from '@/lib/utils'

afterEach(() => {
  localStorage.clear()
})

test('mine init', () => {
  const width = 8
  const height = 8
  const count = 12
  const { result } = renderHook(() =>
    useMinesweeper({ width, height, mineCount: count }),
  )

  expect(localStorage.getItem('minesweeper')).toBeFalsy()
  expect(result.current.mines).toBeUndefined()
  act(() => result.current.reveal(4, 2))

  const mines = result.current.mines
  expect(mines).toBeTruthy()
  if (mines) {
    const mineCount = mines.flatMap((a) => a).filter((a) => a == -1).length
    expect(mineCount).toBe(count)

    expect(mines[2][4]).toBe(0)
    expect(mines[2][5]).toBeGreaterThanOrEqual(0)
    expect(mines[3][5]).toBeGreaterThanOrEqual(0)
    expect(mines[3][4]).toBeGreaterThanOrEqual(0)
    expect(mines[3][3]).toBeGreaterThanOrEqual(0)
    expect(mines[2][3]).toBeGreaterThanOrEqual(0)
    expect(mines[1][3]).toBeGreaterThanOrEqual(0)
    expect(mines[1][4]).toBeGreaterThanOrEqual(0)
    expect(mines[1][5]).toBeGreaterThanOrEqual(0)
  }
  expect(localStorage.getItem('minesweeper')).toBeTruthy()
})

test('mine init side', () => {
  const width = 8
  const height = 8
  const count = 12
  const { result } = renderHook(() =>
    useMinesweeper({ width, height, mineCount: count }),
  )

  expect(result.current.mines).toBeUndefined()
  act(() => result.current.reveal(6, 7))

  const mines = result.current.mines
  expect(mines).toBeTruthy()
  if (mines) {
    const mineCount = mines.flatMap((a) => a).filter((a) => a == -1).length
    expect(mineCount).toBe(count)

    expect(mines[7][6]).toBe(0)
    expect(mines[7][5]).toBeGreaterThanOrEqual(0)
    expect(mines[6][5]).toBeGreaterThanOrEqual(0)
    expect(mines[6][6]).toBeGreaterThanOrEqual(0)
    expect(mines[6][7]).toBeGreaterThanOrEqual(0)
    expect(mines[7][7]).toBeGreaterThanOrEqual(0)
  }
})

test('mine init corner', () => {
  const width = 8
  const height = 8
  const count = 12
  const { result } = renderHook(() =>
    useMinesweeper({ width, height, mineCount: count }),
  )

  expect(result.current.mines).toBeUndefined()
  act(() => result.current.reveal(7, 7))

  const mines = result.current.mines
  expect(mines).toBeTruthy()
  if (mines) {
    const mineCount = mines.flatMap((a) => a).filter((a) => a == -1).length
    expect(mineCount).toBe(count)

    expect(mines[7][7]).toBe(0)
    expect(mines[7][6]).toBeGreaterThanOrEqual(0)
    expect(mines[6][6]).toBeGreaterThanOrEqual(0)
    expect(mines[6][7]).toBeGreaterThanOrEqual(0)
  }
})

test('mine init small', () => {
  const width = 4
  const height = 4
  const count = 7
  const { result } = renderHook(() =>
    useMinesweeper({ width, height, mineCount: count }),
  )

  expect(result.current.mines).toBeUndefined()
  act(() => result.current.reveal(1, 2))

  const expected = [
    [-1, -1, -1, -1],
    [2, 3, 5, -1],
    [0, 0, 3, -1],
    [0, 0, 2, -1],
  ]

  expect(result.current.mines).toStrictEqual(expected)
})

// test.for([
//   { x: 4, y: 2, w: -1, h: 8, c: 12, err: 'invalid minesweeper dimensions' },
//   { x: 4, y: 2, w: 0, h: 8, c: 12, err: 'invalid minesweeper dimensions' },
//   { x: 4, y: 2, w: 8, h: -1, c: 12, err: 'invalid minesweeper dimensions' },
//   { x: 4, y: 2, w: 8, h: 0, c: 12, err: 'invalid minesweeper dimensions' },
//   { x: 4, y: 2, w: 8, h: 8, c: -1, err: 'invalid mine count' },
//   { x: 4, y: 2, w: 8, h: 8, c: 0, err: 'invalid mine count' },
//   { x: 4, y: 2, w: 8, h: 8, c: 56, err: 'invalid mine count' },
//   { x: 8, y: 2, w: 8, h: 8, c: 12, err: 'invalid initial click' },
//   { x: 4, y: -1, w: 8, h: 8, c: 12, err: 'invalid initial click' },
//   { x: -2, y: 9, w: 8, h: 8, c: 12, err: 'invalid initial click' },
// ])(
//   'mine init errors',
//   ({
//     x,
//     y,
//     w,
//     h,
//     c,
//     err,
//   }: {
//     x: number
//     y: number
//     w: number
//     h: number
//     c: number
//     err: string
//   }) => {
//     const { result } = renderHook(() =>
//       useMinesweeper({ width: w, height: h, mineCount: c }),
//     )
//     expect(() => act(() => result.current.reveal(x, y))).toThrowError(err)
//   },
// )

test('tile init', () => {
  const { result } = renderHook(() => useMinesweeper())

  expect(result.current.tiles.length).toBe(16)
  expect(result.current.tiles.every((r) => r.length == 30)).toBeTruthy()
  expect(
    result.current.tiles.every((r) =>
      r.every((v) => v == MineTileState.NOT_SEEN),
    ),
  ).toBeTruthy()
})

test('reveal', () => {
  const mineSpy = vi.spyOn(helperMod, 'initMines')
  mineSpy.mockReturnValue([
    [0, 1, -1, -1, 2, 2, -1, 2],
    [0, 1, 4, -1, 5, 4, -1, 2],
    [1, 1, 2, -1, -1, -1, 2, 1],
    [-1, 1, 1, 2, 3, 2, 1, 0],
    [1, 1, 0, 0, 1, 1, 2, 1],
    [0, 0, 0, 0, 1, -1, 2, -1],
    [1, 1, 0, 0, 1, 1, 2, 1],
    [-1, 1, 0, 0, 0, 0, 0, 0],
  ])

  const width = 8
  const height = 8
  const count = 12
  const { result } = renderHook(() =>
    useMinesweeper({ width, height, mineCount: count }),
  )

  act(() => result.current.reveal(2, 2))

  const expected: MineTileState[][] = [
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 1, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
  ]

  expect(result.current.tiles).toStrictEqual(expected)
  expect(result.current.isGameLost()).toBeFalsy()
  expect(result.current.isGameWon()).toBeFalsy()
  expect(result.current.isGameOver()).toBeFalsy()
  const storage = localStorage.getItem('minesweeper')
  expect(storage).toBeTruthy()
  if (storage) {
    expect(JSON.parse(decrypt(storage))['tiles']).toStrictEqual(expected)
  }
})

test('reveal expands from a 0', () => {
  const mineSpy = vi.spyOn(helperMod, 'initMines')
  mineSpy.mockReturnValue([
    [0, 1, -1, -1, 2, 2, -1, 2],
    [0, 1, 4, -1, 5, 4, -1, 2],
    [1, 1, 2, -1, -1, -1, 2, 1],
    [-1, 1, 1, 2, 3, 2, 1, 0],
    [1, 1, 0, 0, 1, 1, 2, 1],
    [0, 0, 0, 0, 1, -1, 2, -1],
    [1, 1, 0, 0, 1, 1, 2, 1],
    [-1, 1, 0, 0, 0, 0, 0, 0],
  ])

  const width = 8
  const height = 8
  const count = 12
  const { result } = renderHook(() =>
    useMinesweeper({ width, height, mineCount: count }),
  )

  act(() => result.current.reveal(1, 0))

  act(() => result.current.reveal(2, 4))

  const expected: MineTileState[][] = [
    [2, 1, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 1, 1, 1, 1, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [2, 1, 1, 1, 1, 1, 1, 1],
  ]

  expect(result.current.tiles).toStrictEqual(expected)
  expect(result.current.isGameLost()).toBeFalsy()
  expect(result.current.isGameWon()).toBeFalsy()
  expect(result.current.isGameOver()).toBeFalsy()
})

test('reveal mine results in game lost', () => {
  const mineSpy = vi.spyOn(helperMod, 'initMines')
  mineSpy.mockReturnValue([
    [0, 1, -1, -1, 2, 2, -1, 2],
    [0, 1, 4, -1, 5, 4, -1, 2],
    [1, 1, 2, -1, -1, -1, 2, 1],
    [-1, 1, 1, 2, 3, 2, 1, 0],
    [1, 1, 0, 0, 1, 1, 2, 1],
    [0, 0, 0, 0, 1, -1, 2, -1],
    [1, 1, 0, 0, 1, 1, 2, 1],
    [-1, 1, 0, 0, 0, 0, 0, 0],
  ])

  const width = 8
  const height = 8
  const count = 12
  const { result } = renderHook(() =>
    useMinesweeper({ width, height, mineCount: count }),
  )

  act(() => result.current.reveal(7, 5))

  const expected: MineTileState[][] = [
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
  ]

  expect(result.current.tiles).toStrictEqual(expected)
  expect(result.current.isGameLost()).toBeTruthy()
  expect(result.current.isGameWon()).toBeFalsy()
  expect(result.current.isGameOver()).toBeTruthy()
})

test('flag', () => {
  const mineSpy = vi.spyOn(helperMod, 'initMines')
  mineSpy.mockReturnValue([
    [0, 1, -1, -1, 2, 2, -1, 2],
    [0, 1, 4, -1, 5, 4, -1, 2],
    [1, 1, 2, -1, -1, -1, 2, 1],
    [-1, 1, 1, 2, 3, 2, 1, 0],
    [1, 1, 0, 0, 1, 1, 2, 1],
    [0, 0, 0, 0, 1, -1, 2, -1],
    [1, 1, 0, 0, 1, 1, 2, 1],
    [-1, 1, 0, 0, 0, 0, 0, 0],
  ])

  const width = 8
  const height = 8
  const count = 12
  const { result } = renderHook(() =>
    useMinesweeper({ width, height, mineCount: count }),
  )

  act(() => result.current.reveal(2, 4))
  act(() => result.current.flag(7, 5))

  const expected: MineTileState[][] = [
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 1, 1, 1, 1, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 2, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [2, 1, 1, 1, 1, 1, 1, 1],
  ]

  expect(result.current.tiles).toStrictEqual(expected)
  expect(result.current.isGameLost()).toBeFalsy()
  expect(result.current.isGameWon()).toBeFalsy()
  expect(result.current.isGameOver()).toBeFalsy()
  const storage = localStorage.getItem('minesweeper')
  expect(storage).toBeTruthy()
  if (storage) {
    expect(JSON.parse(decrypt(storage))['tiles']).toStrictEqual(expected)
  }
})

test('unflag', () => {
  const mineSpy = vi.spyOn(helperMod, 'initMines')
  mineSpy.mockReturnValue([
    [0, 1, -1, -1, 2, 2, -1, 2],
    [0, 1, 4, -1, 5, 4, -1, 2],
    [1, 1, 2, -1, -1, -1, 2, 1],
    [-1, 1, 1, 2, 3, 2, 1, 0],
    [1, 1, 0, 0, 1, 1, 2, 1],
    [0, 0, 0, 0, 1, -1, 2, -1],
    [1, 1, 0, 0, 1, 1, 2, 1],
    [-1, 1, 0, 0, 0, 0, 0, 0],
  ])

  const width = 8
  const height = 8
  const count = 12
  const { result } = renderHook(() =>
    useMinesweeper({ width, height, mineCount: count }),
  )

  act(() => result.current.reveal(2, 4))
  act(() => result.current.flag(7, 5))
  act(() => result.current.flag(7, 5))

  const expected: MineTileState[][] = [
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 1, 1, 1, 1, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [2, 1, 1, 1, 1, 1, 1, 1],
  ]

  expect(result.current.tiles).toStrictEqual(expected)
  expect(result.current.isGameLost()).toBeFalsy()
  expect(result.current.isGameWon()).toBeFalsy()
  expect(result.current.isGameOver()).toBeFalsy()
  const storage = localStorage.getItem('minesweeper')
  expect(storage).toBeTruthy()
  if (storage) {
    expect(JSON.parse(decrypt(storage))['tiles']).toStrictEqual(expected)
  }
})

test('flag does nothing if mines not initialized', () => {
  const width = 8
  const height = 8
  const count = 12
  const { result } = renderHook(() =>
    useMinesweeper({ width, height, mineCount: count }),
  )

  act(() => result.current.flag(7, 5))

  const expected: MineTileState[][] = [
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
  ]

  expect(result.current.mines).toBeUndefined()
  expect(result.current.tiles).toStrictEqual(expected)
  expect(result.current.isGameLost()).toBeFalsy()
  expect(result.current.isGameWon()).toBeFalsy()
  expect(result.current.isGameOver()).toBeFalsy()
})

test('reveal mine results in game lost', () => {
  const mineSpy = vi.spyOn(helperMod, 'initMines')
  mineSpy.mockReturnValue([
    [0, 1, -1, -1, 2, 2, -1, 2],
    [0, 1, 4, -1, 5, 4, -1, 2],
    [1, 1, 2, -1, -1, -1, 2, 1],
    [-1, 1, 1, 2, 3, 2, 1, 0],
    [1, 1, 0, 0, 1, 1, 2, 1],
    [0, 0, 0, 0, 1, -1, 2, -1],
    [1, 1, 0, 0, 1, 1, 2, 1],
    [-1, 1, 0, 0, 0, 0, 0, 0],
  ])

  const width = 8
  const height = 8
  const count = 12
  const { result } = renderHook(() =>
    useMinesweeper({ width, height, mineCount: count }),
  )

  act(() => result.current.reveal(7, 5))

  const expected: MineTileState[][] = [
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
  ]

  expect(result.current.tiles).toStrictEqual(expected)
  expect(result.current.isGameLost()).toBeTruthy()
  expect(result.current.isGameWon()).toBeFalsy()
  expect(result.current.isGameOver()).toBeTruthy()
})

test('reveal last slot results in game won', () => {
  const mineSpy = vi.spyOn(helperMod, 'initMines')
  mineSpy.mockReturnValue([
    [-1, -1, -1, -1],
    [2, 3, 5, -1],
    [0, 0, 2, -1],
    [0, 0, 1, 1],
  ])

  const width = 4
  const height = 4
  const count = 6
  const { result } = renderHook(() =>
    useMinesweeper({ width, height, mineCount: count }),
  )

  act(() => result.current.reveal(1, 2))
  act(() => result.current.flag(0, 0))
  act(() => result.current.flag(1, 0))
  act(() => result.current.flag(2, 0))
  act(() => result.current.flag(3, 0))
  act(() => result.current.flag(3, 1))
  act(() => result.current.flag(3, 2))

  const oneUnseen: MineTileState[][] = [
    [0, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 2],
  ]

  expect(result.current.tiles).toStrictEqual(oneUnseen)

  act(() => result.current.reveal(3, 3))

  const expected: MineTileState[][] = [
    [0, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 1],
  ]

  expect(result.current.tiles).toStrictEqual(expected)
  expect(result.current.isGameLost()).toBeFalsy()
  expect(result.current.isGameWon()).toBeTruthy()
  expect(result.current.isGameOver()).toBeTruthy()
})

test('flag last slot results in game won', () => {
  const mineSpy = vi.spyOn(helperMod, 'initMines')
  mineSpy.mockReturnValue([
    [-1, -1, -1, -1],
    [2, 3, 5, -1],
    [0, 0, 2, -1],
    [0, 0, 1, 1],
  ])

  const width = 4
  const height = 4
  const count = 6
  const { result } = renderHook(() =>
    useMinesweeper({ width, height, mineCount: count }),
  )

  act(() => result.current.reveal(1, 2))
  act(() => result.current.flag(0, 0))
  act(() => result.current.flag(1, 0))
  act(() => result.current.flag(3, 0))
  act(() => result.current.flag(3, 1))
  act(() => result.current.flag(3, 2))
  act(() => result.current.reveal(3, 3))

  const oneUnseen: MineTileState[][] = [
    [0, 0, 2, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 1],
  ]

  expect(result.current.tiles).toStrictEqual(oneUnseen)

  act(() => result.current.flag(2, 0))

  const expected: MineTileState[][] = [
    [0, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 1],
  ]

  expect(result.current.tiles).toStrictEqual(expected)
  expect(result.current.isGameLost()).toBeFalsy()
  expect(result.current.isGameWon()).toBeTruthy()
  expect(result.current.isGameOver()).toBeTruthy()
})

test('flag last slot results in game won', () => {
  const mineSpy = vi.spyOn(helperMod, 'initMines')
  mineSpy.mockReturnValue([
    [-1, -1, -1, -1],
    [2, 3, 5, -1],
    [0, 0, 2, -1],
    [0, 0, 1, 1],
  ])

  const width = 4
  const height = 4
  const count = 6
  const { result } = renderHook(() =>
    useMinesweeper({ width, height, mineCount: count }),
  )

  act(() => result.current.reveal(1, 2))
  act(() => result.current.flag(0, 0))
  act(() => result.current.flag(1, 0))
  act(() => result.current.flag(2, 0))
  act(() => result.current.flag(3, 0))
  act(() => result.current.flag(3, 1))
  act(() => result.current.flag(3, 2))
  act(() => result.current.reveal(3, 3))

  const gameEnd: MineTileState[][] = [
    [0, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 1],
  ]

  expect(result.current.tiles).toStrictEqual(gameEnd)

  act(() => result.current.restart())

  const expected: MineTileState[][] = [
    [2, 2, 2, 2],
    [2, 2, 2, 2],
    [2, 2, 2, 2],
    [2, 2, 2, 2],
  ]

  expect(result.current.tiles).toStrictEqual(expected)
  expect(result.current.mines).toBeUndefined()
  expect(result.current.isGameLost()).toBeFalsy()
  expect(result.current.isGameWon()).toBeFalsy()
  expect(result.current.isGameOver()).toBeFalsy()
  const storage = localStorage.getItem('minesweeper')
  expect(storage).toBeTruthy()
  if (storage) {
    expect(JSON.parse(decrypt(storage))['tiles']).toStrictEqual(expected)
  }
})

test('uses local storage if applicable', () => {
  const mines = [
    [-1, -1, -1, -1],
    [2, 3, 5, -1],
    [0, 0, 2, -1],
    [0, 0, 1, 1],
  ]
  const tiles = [
    [0, 0, 2, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 1],
  ]
  const width = 4
  const height = 4
  const count = 6
  const encrypted = encrypt(
    JSON.stringify({
      mines: mines,
      tiles: tiles,
      width,
      height,
      mineCount: count,
    }),
  )
  localStorage.setItem('minesweeper', encrypted)
  const { result } = renderHook(() =>
    useMinesweeper({
      width,
      height,
      mineCount: count,
    }),
  )

  expect(result.current.mines).toStrictEqual(mines)
  expect(result.current.tiles).toStrictEqual(tiles)
})
