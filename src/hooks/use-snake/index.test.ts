import { afterEach, expect, test, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import * as helperMod from './helpers'
import useSnake from '.'
import type { SnakeSpace } from '@/types'
import { Direction, SnakeTileState } from '@/types'
import { encrypt } from '@/utils'

afterEach(() => {
  localStorage.clear()
})

test('init', () => {
  const width = 12
  const height = 9

  const tiles: SnakeSpace[][] = [
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [
      null,
      null,
      SnakeTileState.BODY,
      SnakeTileState.BODY,
      SnakeTileState.HEAD,
      null,
      null,
      null,
      SnakeTileState.APPLE,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
  ]

  const { result } = renderHook(() => useSnake({ width, height }))

  expect(result.current.tiles).toStrictEqual(tiles)
  expect(result.current.isGameOver).toBeFalsy()
  expect(result.current.score).toEqual(0)
})

test('init from local storage', () => {
  const width = 12
  const height = 9

  const state = {
    width,
    height,
    snake: [
      { x: 2, y: 5 },
      { x: 2, y: 4 },
      { x: 2, y: 3 },
      { x: 2, y: 2 },
    ],
    apple: { x: 8, y: 0 },
    score: 1,
    dir: Direction.DOWN,
    isGameLost: false,
  }

  const tiles: SnakeSpace[][] = [
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      SnakeTileState.APPLE,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [
      null,
      null,
      SnakeTileState.BODY,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      SnakeTileState.BODY,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      SnakeTileState.BODY,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      SnakeTileState.HEAD,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
  ]

  localStorage.setItem('snake', encrypt(JSON.stringify(state)))

  const { result } = renderHook(() => useSnake({ width, height }))

  expect(result.current.tiles).toStrictEqual(tiles)
  expect(result.current.isGameOver).toBeFalsy()
  expect(result.current.score).toEqual(1)
})

test('init when local storage does not match', () => {
  const width = 12
  const height = 9

  const state = {
    width: 20,
    height: 15,
    snake: [
      { x: 2, y: 5 },
      { x: 2, y: 4 },
      { x: 2, y: 3 },
      { x: 2, y: 2 },
    ],
    apple: { x: 8, y: 0 },
    score: 1,
    dir: Direction.DOWN,
    isGameLost: false,
  }

  const tiles: SnakeSpace[][] = [
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [
      null,
      null,
      SnakeTileState.BODY,
      SnakeTileState.BODY,
      SnakeTileState.HEAD,
      null,
      null,
      null,
      SnakeTileState.APPLE,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
  ]

  localStorage.setItem('snake', encrypt(JSON.stringify(state)))

  const { result } = renderHook(() => useSnake({ width, height }))

  expect(result.current.tiles).toStrictEqual(tiles)
  expect(result.current.isGameOver).toBeFalsy()
  expect(result.current.score).toEqual(0)
})

test('up from right', async () => {
  const width = 12
  const height = 9

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    width,
    height,
    snake: [
      { x: 4, y: 4 },
      { x: 3, y: 4 },
      { x: 2, y: 4 },
    ],
    apple: { x: 8, y: 4 },
    score: 0,
    dir: Direction.RIGHT,
    isGameLost: false,
  })

  const tiles: SnakeSpace[][] = [
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [
      null,
      null,
      null,
      null,
      SnakeTileState.HEAD,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      null,
      SnakeTileState.BODY,
      SnakeTileState.BODY,
      null,
      null,
      null,
      SnakeTileState.APPLE,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
  ]

  const { result } = renderHook(() => useSnake({ width, height }))

  act(() => result.current.up())
  await waitFor(() => {
    expect(result.current.tiles).toStrictEqual(tiles)
  })
})

test('up from left', async () => {
  const width = 12
  const height = 9

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    width,
    height,
    snake: [
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
    ],
    apple: { x: 8, y: 4 },
    score: 0,
    dir: Direction.DOWN,
    isGameLost: false,
  })

  const tiles: SnakeSpace[][] = [
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [
      null,
      null,
      SnakeTileState.HEAD,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      SnakeTileState.BODY,
      SnakeTileState.BODY,
      null,
      null,
      null,
      null,
      SnakeTileState.APPLE,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
  ]

  const { result } = renderHook(() => useSnake({ width, height }))

  act(() => result.current.up())
  await waitFor(() => {
    expect(result.current.tiles).toStrictEqual(tiles)
  })
})

test('up from down', async () => {
  const width = 12
  const height = 9

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    width,
    height,
    snake: [
      { x: 2, y: 5 },
      { x: 2, y: 4 },
      { x: 2, y: 3 },
    ],
    apple: { x: 8, y: 4 },
    score: 0,
    dir: Direction.DOWN,
    isGameLost: false,
  })

  const tiles: SnakeSpace[][] = [
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [
      null,
      null,
      SnakeTileState.BODY,
      null,
      null,
      null,
      null,
      null,
      SnakeTileState.APPLE,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      SnakeTileState.BODY,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      SnakeTileState.HEAD,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
  ]

  const { result } = renderHook(() => useSnake({ width, height }))

  act(() => result.current.up())
  await waitFor(() => {
    expect(result.current.tiles).toStrictEqual(tiles)
  })
})

test('down from right', async () => {
  const width = 12
  const height = 9

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    width,
    height,
    snake: [
      { x: 4, y: 4 },
      { x: 3, y: 4 },
      { x: 2, y: 4 },
    ],
    apple: { x: 8, y: 4 },
    score: 0,
    dir: Direction.RIGHT,
    isGameLost: false,
  })

  const tiles: SnakeSpace[][] = [
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],

    [
      null,
      null,
      null,
      SnakeTileState.BODY,
      SnakeTileState.BODY,
      null,
      null,
      null,
      SnakeTileState.APPLE,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      null,
      null,
      SnakeTileState.HEAD,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
  ]

  const { result } = renderHook(() => useSnake({ width, height }))

  act(() => result.current.down())
  await waitFor(() => {
    expect(result.current.tiles).toStrictEqual(tiles)
  })
})

test('down from up', async () => {
  const width = 12
  const height = 9

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    width,
    height,
    snake: [
      { x: 2, y: 3 },
      { x: 2, y: 4 },
      { x: 2, y: 5 },
    ],
    apple: { x: 8, y: 4 },
    score: 0,
    dir: Direction.LEFT,
    isGameLost: false,
  })

  const tiles: SnakeSpace[][] = [
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [
      null,
      SnakeTileState.HEAD,
      SnakeTileState.BODY,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      SnakeTileState.BODY,
      null,
      null,
      null,
      null,
      null,
      SnakeTileState.APPLE,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
  ]

  const { result } = renderHook(() => useSnake({ width, height }))

  act(() => result.current.down())
  await waitFor(() => {
    expect(result.current.tiles).toStrictEqual(tiles)
  })
})

test('left from up', async () => {
  const width = 12
  const height = 9

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    width,
    height,
    snake: [
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 3, y: 5 },
    ],
    apple: { x: 8, y: 4 },
    score: 0,
    dir: Direction.UP,
    isGameLost: false,
  })

  const tiles: SnakeSpace[][] = [
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [
      null,
      null,
      SnakeTileState.HEAD,
      SnakeTileState.BODY,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],

    [
      null,
      null,
      null,
      SnakeTileState.BODY,
      null,
      null,
      null,
      null,
      SnakeTileState.APPLE,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
  ]

  const { result } = renderHook(() => useSnake({ width, height }))

  act(() => result.current.left())
  await waitFor(() => {
    expect(result.current.tiles).toStrictEqual(tiles)
  })
})

test('left from right', async () => {
  const width = 12
  const height = 9

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    width,
    height,
    snake: [
      { x: 4, y: 4 },
      { x: 3, y: 4 },
      { x: 3, y: 5 },
    ],
    apple: { x: 8, y: 4 },
    score: 0,
    dir: Direction.UP,
    isGameLost: false,
  })

  const tiles: SnakeSpace[][] = [
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [
      null,
      null,
      null,
      null,
      SnakeTileState.HEAD,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      null,
      SnakeTileState.BODY,
      SnakeTileState.BODY,
      null,
      null,
      null,
      SnakeTileState.APPLE,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
  ]

  const { result } = renderHook(() => useSnake({ width, height }))

  act(() => result.current.left())
  await waitFor(() => {
    expect(result.current.tiles).toStrictEqual(tiles)
  })
})

test('right from up', async () => {
  const width = 12
  const height = 9

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    width,
    height,
    snake: [
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 3, y: 5 },
    ],
    apple: { x: 8, y: 4 },
    score: 0,
    dir: Direction.UP,
    isGameLost: false,
  })

  const tiles: SnakeSpace[][] = [
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [
      null,
      null,
      null,
      SnakeTileState.BODY,
      SnakeTileState.HEAD,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],

    [
      null,
      null,
      null,
      SnakeTileState.BODY,
      null,
      null,
      null,
      null,
      SnakeTileState.APPLE,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
  ]

  const { result } = renderHook(() => useSnake({ width, height }))

  act(() => result.current.right())
  await waitFor(() => {
    expect(result.current.tiles).toStrictEqual(tiles)
  })
})

test('right from left', async () => {
  const width = 12
  const height = 9

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    width,
    height,
    snake: [
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 4, y: 5 },
    ],
    apple: { x: 8, y: 4 },
    score: 0,
    dir: Direction.UP,
    isGameLost: false,
  })

  const tiles: SnakeSpace[][] = [
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [
      null,
      null,
      null,
      SnakeTileState.HEAD,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      null,
      SnakeTileState.BODY,
      SnakeTileState.BODY,
      null,
      null,
      null,
      SnakeTileState.APPLE,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
  ]

  const { result } = renderHook(() => useSnake({ width, height }))

  act(() => result.current.right())
  await waitFor(() => {
    expect(result.current.tiles).toStrictEqual(tiles)
  })
})

test('toggle paused', () => {
  const width = 12
  const height = 9
  const { result } = renderHook(() => useSnake({ width, height }))

  act(() => result.current.togglePause())

  expect(result.current.paused).toBeTruthy()

  act(() => result.current.togglePause())

  expect(result.current.paused).toBeFalsy()
})

test('eat apple', async () => {
  const width = 12
  const height = 9

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    width,
    height,
    snake: [
      { x: 4, y: 4 },
      { x: 3, y: 4 },
      { x: 2, y: 4 },
    ],
    apple: { x: 5, y: 4 },
    score: 0,
    dir: Direction.RIGHT,
    isGameLost: false,
  })

  const { result } = renderHook(() => useSnake({ width, height }))

  await waitFor(() => {
    expect(result.current.tiles[4][5]).toEqual(SnakeTileState.HEAD)
  })
  expect(result.current.score).toBe(1)
})

test('hit wall causes game end', async () => {
  const width = 3
  const height = 3

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    width,
    height,
    snake: [
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
    ],
    apple: { x: 2, y: 2 },
    score: 0,
    dir: Direction.RIGHT,
    isGameLost: false,
  })

  const { result } = renderHook(() => useSnake({ width, height }))

  await waitFor(() => {
    expect(result.current.isGameOver).toBeTruthy()
  })
  expect(result.current.isGameLost).toBeTruthy()
  expect(result.current.isGameWon).toBeFalsy()
  expect(result.current.score).toBe(0)
})

test('hit self causes game end', async () => {
  const width = 3
  const height = 3

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    width,
    height,
    snake: [
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ],
    apple: { x: 1, y: 2 },
    score: 0,
    dir: Direction.UP,
    isGameLost: false,
  })

  const { result } = renderHook(() => useSnake({ width, height }))

  await waitFor(() => {
    expect(result.current.isGameOver).toBeTruthy()
  })
  expect(result.current.isGameLost).toBeTruthy()
  expect(result.current.isGameWon).toBeFalsy()
  expect(result.current.score).toBe(0)
})

test('fill board causes game end', async () => {
  const width = 3
  const height = 3

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    width,
    height,
    snake: [
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ],
    apple: { x: 0, y: 2 },
    score: 1,
    dir: Direction.LEFT,
    isGameLost: false,
  })

  const { result } = renderHook(() => useSnake({ width, height }))

  await waitFor(() => {
    expect(result.current.isGameOver).toBeTruthy()
  })
  expect(result.current.isGameLost).toBeFalsy()
  expect(result.current.isGameWon).toBeTruthy()
  expect(result.current.score).toBe(2)
})

test('restart', () => {
  const width = 12
  const height = 9

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy
    .mockReturnValue({
      width,
      height,
      snake: [
        { x: 4, y: 4 },
        { x: 3, y: 4 },
        { x: 2, y: 4 },
      ],
      apple: { x: 8, y: 4 },
      score: 0,
      dir: Direction.RIGHT,
      isGameLost: false,
    })
    .mockReturnValueOnce({
      width,
      height,
      snake: [
        { x: 8, y: 4 },
        { x: 7, y: 4 },
        { x: 6, y: 4 },
        { x: 5, y: 4 },
        { x: 4, y: 4 },
        { x: 3, y: 4 },
        { x: 2, y: 4 },
      ],
      apple: { x: 1, y: 7 },
      score: 4,
      dir: Direction.RIGHT,
      isGameLost: false,
    })

  const tiles: SnakeSpace[][] = [
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [
      null,
      null,
      SnakeTileState.BODY,
      SnakeTileState.BODY,
      SnakeTileState.HEAD,
      null,
      null,
      null,
      SnakeTileState.APPLE,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
  ]

  const { result } = renderHook(() => useSnake({ width, height }))

  act(() => result.current.restart())

  expect(result.current.tiles).toStrictEqual(tiles)
  expect(result.current.score).toEqual(0)
})
