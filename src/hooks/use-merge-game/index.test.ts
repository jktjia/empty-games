import { act, renderHook } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import * as helperMod from './helpers'
import useMergeGame from '.'

afterEach(() => {
  localStorage.clear()
})

test('init tiles', () => {
  const { result } = renderHook(() => useMergeGame())

  const nFilledTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t != null).length
  expect(nFilledTiles).toBe(2)
  expect(result.current.tiles.length).toBe(4)
  expect(result.current.tiles.every((r) => r.length == 4)).toBe(true)
  expect(
    result.current.tiles
      .flatMap((t) => t)
      .every((t) => t == null || t.value == 2 || t.value == 4),
  ).toBe(true)
  expect(
    Math.max(
      ...result.current.tiles
        .flatMap((t) => t)
        .filter((t) => t != null)
        .map((t) => t.id),
    ),
  ).toBe(1)
  expect(result.current.isGameOver).toBe(false)
  expect(result.current.isGameWon).toBe(false)
})

test('slide up', () => {
  const tileSpy = vi.spyOn(helperMod, 'initTiles')
  tileSpy.mockReturnValue([
    [null, null, null, { id: 0, value: 2 }],
    [null, { id: 1, value: 4 }, null, { id: 2, value: 2 }],
    [null, null, { id: 3, value: 2 }, null],
    [null, { id: 4, value: 2 }, null, null],
  ])

  const { result } = renderHook(() => useMergeGame())

  act(() => result.current.up())

  expect(result.current.tiles[0][1]?.value).toBe(4)
  expect(result.current.tiles[0][2]?.value).toBe(2)
  expect(result.current.tiles[0][3]?.value).toBe(4)
  expect(result.current.tiles[1][1]?.value).toBe(2)

  expect(result.current.tiles[0][1]?.id).toBe(1)
  expect(result.current.tiles[0][2]?.id).toBe(3)
  expect(result.current.tiles[0][3]?.id).toBe(2)
  expect(result.current.tiles[1][1]?.id).toBe(4)

  const nFilledTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t != null).length
  expect(nFilledTiles).toBe(5)
  const nEmptyTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t == null).length
  expect(nEmptyTiles).toBe(11)
  expect(result.current.score).toBe(4)
  expect(result.current.isGameOver).toBe(false)
  expect(result.current.isGameWon).toBe(false)
})

test('slide up 2', () => {
  const tileSpy = vi.spyOn(helperMod, 'initTiles')
  tileSpy.mockReturnValue([
    [null, null, null, { id: 0, value: 2 }],
    [null, { id: 1, value: 2 }, null, { id: 2, value: 2 }],
    [null, { id: 3, value: 2 }, null, null],
    [null, { id: 4, value: 2 }, null, null],
  ])

  const { result } = renderHook(() => useMergeGame())

  act(() => result.current.up())

  expect(result.current.tiles[0][1]?.value).toBe(4)
  expect(result.current.tiles[0][3]?.value).toBe(4)
  expect(result.current.tiles[1][1]?.value).toBe(2)

  expect(result.current.tiles[0][1]?.id).toBe(3)
  expect(result.current.tiles[0][3]?.id).toBe(2)
  expect(result.current.tiles[1][1]?.id).toBe(4)

  const nFilledTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t != null).length
  expect(nFilledTiles).toBe(4)
  const nEmptyTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t == null).length
  expect(nEmptyTiles).toBe(12)
  expect(result.current.score).toBe(8)
  expect(result.current.isGameOver).toBe(false)
  expect(result.current.isGameWon).toBe(false)
})

test('slide up same', () => {
  const tileSpy = vi.spyOn(helperMod, 'initTiles')
  tileSpy.mockReturnValue([
    [null, { id: 0, value: 4 }, { id: 1, value: 2 }, { id: 2, value: 4 }],
    [null, { id: 3, value: 2 }, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ])

  const { result } = renderHook(() => useMergeGame())

  act(() => result.current.up())

  expect(result.current.tiles[0][1]?.value).toBe(4)
  expect(result.current.tiles[0][2]?.value).toBe(2)
  expect(result.current.tiles[0][3]?.value).toBe(4)
  expect(result.current.tiles[1][1]?.value).toBe(2)

  expect(result.current.tiles[0][1]?.id).toBe(0)
  expect(result.current.tiles[0][2]?.id).toBe(1)
  expect(result.current.tiles[0][3]?.id).toBe(2)
  expect(result.current.tiles[1][1]?.id).toBe(3)

  const nFilledTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t != null).length
  expect(nFilledTiles).toBe(4)
  const nEmptyTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t == null).length
  expect(nEmptyTiles).toBe(12)
  expect(result.current.score).toBe(0)
  expect(result.current.isGameOver).toBe(false)
  expect(result.current.isGameWon).toBe(false)
})

test('slide down', () => {
  const tileSpy = vi.spyOn(helperMod, 'initTiles')
  tileSpy.mockReturnValue([
    [null, null, null, { id: 0, value: 2 }],
    [null, { id: 1, value: 4 }, null, { id: 2, value: 2 }],
    [null, null, { id: 3, value: 2 }, null],
    [null, { id: 4, value: 2 }, null, null],
  ])

  const { result } = renderHook(() => useMergeGame())

  act(() => result.current.down())

  expect(result.current.tiles[2][1]?.value).toBe(4)
  expect(result.current.tiles[3][2]?.value).toBe(2)
  expect(result.current.tiles[3][3]?.value).toBe(4)
  expect(result.current.tiles[3][1]?.value).toBe(2)

  expect(result.current.tiles[2][1]?.id).toBe(1)
  expect(result.current.tiles[3][2]?.id).toBe(3)
  expect(result.current.tiles[3][3]?.id).toBe(0)
  expect(result.current.tiles[3][1]?.id).toBe(4)

  const nFilledTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t != null).length
  expect(nFilledTiles).toBe(5)
  const nEmptyTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t == null).length
  expect(nEmptyTiles).toBe(11)
  expect(result.current.score).toBe(4)
  expect(result.current.isGameOver).toBe(false)
  expect(result.current.isGameWon).toBe(false)
})

test('slide down 2', () => {
  const tileSpy = vi.spyOn(helperMod, 'initTiles')
  tileSpy.mockReturnValue([
    [null, null, null, { id: 0, value: 2 }],
    [null, { id: 1, value: 2 }, null, { id: 2, value: 2 }],
    [null, { id: 3, value: 2 }, null, null],
    [null, { id: 4, value: 2 }, null, null],
  ])

  const { result } = renderHook(() => useMergeGame())

  act(() => result.current.down())

  expect(result.current.tiles[2][1]?.value).toBe(2)
  expect(result.current.tiles[3][3]?.value).toBe(4)
  expect(result.current.tiles[3][1]?.value).toBe(4)

  expect(result.current.tiles[2][1]?.id).toBe(1)
  expect(result.current.tiles[3][3]?.id).toBe(0)
  expect(result.current.tiles[3][1]?.id).toBe(3)

  const nFilledTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t != null).length
  expect(nFilledTiles).toBe(4)
  const nEmptyTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t == null).length
  expect(nEmptyTiles).toBe(12)
  expect(result.current.score).toBe(8)
  expect(result.current.isGameOver).toBe(false)
  expect(result.current.isGameWon).toBe(false)
})

test('slide left', () => {
  const tileSpy = vi.spyOn(helperMod, 'initTiles')
  tileSpy.mockReturnValue([
    [{ id: 0, value: 8 }, { id: 1, value: 8 }, null, { id: 2, value: 2 }],
    [null, { id: 3, value: 4 }, null, { id: 4, value: 2 }],
    [null, null, { id: 5, value: 2 }, null],
    [null, { id: 6, value: 2 }, null, null],
  ])

  const { result } = renderHook(() => useMergeGame())

  act(() => result.current.left())

  expect(result.current.tiles[0][0]?.value).toBe(16)
  expect(result.current.tiles[0][1]?.value).toBe(2)
  expect(result.current.tiles[1][0]?.value).toBe(4)
  expect(result.current.tiles[1][1]?.value).toBe(2)
  expect(result.current.tiles[2][0]?.value).toBe(2)
  expect(result.current.tiles[3][0]?.value).toBe(2)

  expect(result.current.tiles[0][0]?.id).toBe(1)
  expect(result.current.tiles[0][1]?.id).toBe(2)
  expect(result.current.tiles[1][0]?.id).toBe(3)
  expect(result.current.tiles[1][1]?.id).toBe(4)
  expect(result.current.tiles[2][0]?.id).toBe(5)
  expect(result.current.tiles[3][0]?.id).toBe(6)

  const nFilledTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t != null).length
  expect(nFilledTiles).toBe(7)
  const nEmptyTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t == null).length
  expect(nEmptyTiles).toBe(9)
  expect(result.current.score).toBe(16)
  expect(result.current.isGameOver).toBe(false)
  expect(result.current.isGameWon).toBe(false)
})

test('slide left 2', () => {
  const tileSpy = vi.spyOn(helperMod, 'initTiles')
  tileSpy.mockReturnValue([
    [null, null, null, { id: 0, value: 2 }],
    [null, { id: 1, value: 2 }, { id: 2, value: 2 }, { id: 3, value: 2 }],
    [null, null, null, null],
    [null, null, null, null],
  ])

  const { result } = renderHook(() => useMergeGame())

  act(() => result.current.left())

  expect(result.current.tiles[0][0]?.value).toBe(2)
  expect(result.current.tiles[1][0]?.value).toBe(4)
  expect(result.current.tiles[1][1]?.value).toBe(2)

  expect(result.current.tiles[0][0]?.id).toBe(0)
  expect(result.current.tiles[1][0]?.id).toBe(2)
  expect(result.current.tiles[1][1]?.id).toBe(3)

  const nFilledTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t != null).length
  expect(nFilledTiles).toBe(4)
  const nEmptyTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t == null).length
  expect(nEmptyTiles).toBe(12)
  expect(result.current.score).toBe(4)
  expect(result.current.isGameOver).toBe(false)
  expect(result.current.isGameWon).toBe(false)
})

test('slide right', () => {
  const tileSpy = vi.spyOn(helperMod, 'initTiles')
  tileSpy.mockReturnValue([
    [{ id: 0, value: 8 }, { id: 1, value: 8 }, null, { id: 2, value: 2 }],
    [null, { id: 3, value: 4 }, null, { id: 4, value: 2 }],
    [null, null, { id: 5, value: 2 }, null],
    [null, { id: 6, value: 2 }, null, null],
  ])

  const { result } = renderHook(() => useMergeGame())

  act(() => result.current.right())

  expect(result.current.tiles[0][2]?.value).toBe(16)
  expect(result.current.tiles[0][3]?.value).toBe(2)
  expect(result.current.tiles[1][2]?.value).toBe(4)
  expect(result.current.tiles[1][3]?.value).toBe(2)
  expect(result.current.tiles[2][3]?.value).toBe(2)
  expect(result.current.tiles[3][3]?.value).toBe(2)

  expect(result.current.tiles[0][2]?.id).toBe(0)
  expect(result.current.tiles[0][3]?.id).toBe(2)
  expect(result.current.tiles[1][2]?.id).toBe(3)
  expect(result.current.tiles[1][3]?.id).toBe(4)
  expect(result.current.tiles[2][3]?.id).toBe(5)
  expect(result.current.tiles[3][3]?.id).toBe(6)

  const nFilledTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t != null).length
  expect(nFilledTiles).toBe(7)
  const nEmptyTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t == null).length
  expect(nEmptyTiles).toBe(9)
  expect(result.current.score).toBe(16)
  expect(result.current.isGameOver).toBe(false)
  expect(result.current.isGameWon).toBe(false)
})

test('slide right 2', () => {
  const tileSpy = vi.spyOn(helperMod, 'initTiles')
  tileSpy.mockReturnValue([
    [null, null, null, { id: 0, value: 2 }],
    [null, { id: 1, value: 2 }, { id: 2, value: 2 }, { id: 3, value: 2 }],
    [null, null, null, null],
    [null, null, null, null],
  ])

  const { result } = renderHook(() => useMergeGame())

  act(() => result.current.right())

  expect(result.current.tiles[0][3]?.value).toBe(2)
  expect(result.current.tiles[1][2]?.value).toBe(2)
  expect(result.current.tiles[1][3]?.value).toBe(4)

  expect(result.current.tiles[0][3]?.id).toBe(0)
  expect(result.current.tiles[1][2]?.id).toBe(1)
  expect(result.current.tiles[1][3]?.id).toBe(2)

  const nFilledTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t != null).length
  expect(nFilledTiles).toBe(4)
  const nEmptyTiles = result.current.tiles
    .flatMap((t) => t)
    .filter((t) => t == null).length
  expect(nEmptyTiles).toBe(12)
  expect(result.current.score).toBe(4)
  expect(result.current.isGameOver).toBe(false)
  expect(result.current.isGameWon).toBe(false)
})

test('game over when nowhere to move', () => {
  const tileSpy = vi.spyOn(helperMod, 'initTiles')
  tileSpy.mockReturnValue([
    [
      { id: 0, value: 2 },
      { id: 1, value: 16 },
      { id: 2, value: 4 },
      { id: 3, value: 2 },
    ],
    [
      { id: 4, value: 16 },
      { id: 5, value: 4 },
      { id: 6, value: 2 },
      { id: 7, value: 8 },
    ],
    [
      { id: 8, value: 4 },
      { id: 9, value: 4 },
      { id: 10, value: 2 },
      { id: 11, value: 16 },
    ],
    [
      { id: 12, value: 2 },
      { id: 13, value: 4 },
      { id: 14, value: 2 },
      { id: 15, value: 8 },
    ],
  ])

  const { result } = renderHook(() => useMergeGame())

  act(() => result.current.left())

  expect(result.current.score).toBe(8)
  expect(result.current.isGameOver).toBe(true)
  expect(result.current.isGameWon).toBe(false)
})

test('game won when 2048 on board', () => {
  const tileSpy = vi.spyOn(helperMod, 'initTiles')
  tileSpy.mockReturnValue([
    [null, null, null, { id: 0, value: 2 }],
    [null, { id: 1, value: 2 }, { id: 2, value: 2048 }, { id: 3, value: 2 }],
    [null, null, null, null],
    [null, null, null, null],
  ])

  const { result } = renderHook(() => useMergeGame())

  act(() => result.current.right())

  expect(result.current.isGameOver).toBe(false)
  expect(result.current.isGameWon).toBe(true)
})

test('game won when 2048 exceeded', () => {
  const tileSpy = vi.spyOn(helperMod, 'initTiles')
  tileSpy.mockReturnValue([
    [null, null, null, { id: 0, value: 2 }],
    [null, { id: 1, value: 2 }, { id: 2, value: 4096 }, { id: 3, value: 2 }],
    [null, null, null, null],
    [null, null, null, null],
  ])

  const { result } = renderHook(() => useMergeGame())

  act(() => result.current.right())

  expect(result.current.isGameOver).toBe(false)
  expect(result.current.isGameWon).toBe(true)
})

test('restart', () => {
  const tileSpy = vi.spyOn(helperMod, 'initTiles')
  tileSpy
    .mockReturnValue([
      [{ id: 0, value: 2 }, null, null, null],
      [null, null, null, null],
      [null, null, null, { id: 1, value: 2 }],
      [null, null, null, null],
    ])
    .mockReturnValueOnce([
      [
        { id: 0, value: 2 },
        { id: 1, value: 16 },
        { id: 2, value: 4 },
        { id: 3, value: 2 },
      ],
      [
        { id: 4, value: 16 },
        { id: 5, value: 4 },
        { id: 6, value: 2 },
        { id: 7, value: 8 },
      ],
      [
        { id: 8, value: 4 },
        { id: 9, value: 4 },
        { id: 10, value: 2 },
        { id: 11, value: 16 },
      ],
      [
        { id: 12, value: 2 },
        { id: 13, value: 4 },
        { id: 14, value: 2 },
        { id: 15, value: 8 },
      ],
    ])

  const { result } = renderHook(() => useMergeGame())

  act(() => result.current.left())

  expect(
    result.current.tiles.flatMap((t) => t).filter((t) => t != null).length,
  ).toBe(16)

  act(() => result.current.restart())

  expect(result.current.score).toBe(0)
  expect(result.current.isGameOver).toBe(false)
  expect(
    result.current.tiles.flatMap((t) => t).filter((t) => t != null).length,
  ).toBe(2)
})

test('id edge case', () => {
  const tileSpy = vi.spyOn(helperMod, 'initTiles')
  tileSpy.mockReturnValue([
    [{ id: 1, value: 2 }, null, { id: 0, value: 2 }, null],
    [null, null, null, null],
    [null, null, null],
    [null, null, null, null],
  ])

  const { result } = renderHook(() => useMergeGame())

  act(() => result.current.left())

  expect(result.current.score).toBe(4)
  expect(result.current.isGameOver).toBe(false)
  expect(
    result.current.tiles.flatMap((t) => t).filter((t) => t != null).length,
  ).toBe(2)
  expect(
    result.current.tiles.flatMap((t) => t).filter((t) => t != null && t.id == 0)
      .length,
  ).toBe(1)
  expect(
    result.current.tiles.flatMap((t) => t).filter((t) => t != null && t.id == 2)
      .length,
  ).toBe(1)
  expect(
    result.current.tiles.flatMap((t) => t).filter((t) => t != null && t.id == 1)
      .length,
  ).toBe(0)
})
