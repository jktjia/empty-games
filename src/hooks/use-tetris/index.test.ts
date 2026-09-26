import { afterEach, expect, test, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import * as helperMod from './helpers'
import useTetris from '.'
import { Direction, TetrisBlock } from '@/types'
import { encrypt } from '@/utils'

afterEach(() => {
  localStorage.clear()
})

test('init', () => {
  const width = 10
  const height = 5
  const { result } = renderHook(() => useTetris({ width, height }))

  expect(result.current.held).toBeUndefined()
  expect(result.current.visibleTiles.length).toEqual(height)
  expect(
    result.current.visibleTiles.every((r) => r.length == width),
  ).toBeTruthy()
  expect(result.current.next.length).toEqual(6)
  expect(result.current.score).toEqual(0)
  expect(result.current.level).toEqual(0)
  expect(result.current.paused).toBeFalsy()
})

test('init when local storage does not match', () => {
  const width = 10
  const height = 20

  const state = {
    tiles: [
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [
        null,
        null,
        null,
        TetrisBlock.T,
        TetrisBlock.Z,
        TetrisBlock.Z,
        null,
        null,
        null,
        null,
      ],
      [
        null,
        null,
        TetrisBlock.T,
        TetrisBlock.T,
        TetrisBlock.T,
        TetrisBlock.Z,
        TetrisBlock.Z,
        null,
        null,
        null,
      ],
    ],
    rotation: Direction.DOWN,
    block: TetrisBlock.I,
    hold: TetrisBlock.S,
    x: 4,
    y: 1,
    next: [TetrisBlock.J, TetrisBlock.L, TetrisBlock.O, TetrisBlock.Z],
    width: 10,
    height: 5,
    score: 42,
    rows: 72,
  }

  localStorage.setItem('tetris', encrypt(JSON.stringify(state)))
  const { result } = renderHook(() => useTetris({ width, height }))

  expect(result.current.held).toBeUndefined()
  expect(result.current.visibleTiles.length).toEqual(height)
  expect(
    result.current.visibleTiles.every((r) => r.length == width),
  ).toBeTruthy()
  expect(result.current.next.length).toEqual(6)
  expect(result.current.score).toEqual(0)
  expect(result.current.level).toEqual(0)
  expect(result.current.paused).toBeFalsy()
})

test('init from local storage', () => {
  const width = 10
  const height = 5

  const state = {
    tiles: [
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [
        null,
        null,
        null,
        TetrisBlock.T,
        TetrisBlock.Z,
        TetrisBlock.Z,
        null,
        null,
        null,
        null,
      ],
      [
        null,
        null,
        TetrisBlock.T,
        TetrisBlock.T,
        TetrisBlock.T,
        TetrisBlock.Z,
        TetrisBlock.Z,
        null,
        null,
        null,
      ],
    ],
    rotation: Direction.DOWN,
    block: TetrisBlock.I,
    hold: TetrisBlock.S,
    x: 4,
    y: 1,
    next: [TetrisBlock.J, TetrisBlock.L, TetrisBlock.O, TetrisBlock.Z],
    width,
    height,
    score: 42,
    rows: 72,
  }

  const tiles = [
    [null, null, null, null, null, null, null, null, null, null],
    [
      null,
      null,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.I,
      null,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null],
    [
      null,
      null,
      null,
      TetrisBlock.T,
      TetrisBlock.Z,
      TetrisBlock.Z,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      TetrisBlock.T,
      TetrisBlock.T,
      TetrisBlock.T,
      TetrisBlock.Z,
      TetrisBlock.Z,
      null,
      null,
      null,
    ],
  ]

  localStorage.setItem('tetris', encrypt(JSON.stringify(state)))
  const { result } = renderHook(() => useTetris({ width, height }))

  expect(result.current.held).toBe(TetrisBlock.S)
  expect(result.current.visibleTiles).toStrictEqual(tiles)
  expect(result.current.next).toEqual([
    TetrisBlock.J,
    TetrisBlock.L,
    TetrisBlock.O,
    TetrisBlock.Z,
  ])
  expect(result.current.score).toEqual(42)
  expect(result.current.level).toEqual(7)
  expect(result.current.isGameOver).toBeFalsy()
  expect(result.current.paused).toBeFalsy()
})

test('move left', () => {
  const width = 10
  const height = 5

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    tiles: [
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [
        null,
        null,
        null,
        TetrisBlock.T,
        TetrisBlock.Z,
        TetrisBlock.Z,
        null,
        null,
        null,
        null,
      ],
      [
        null,
        null,
        TetrisBlock.T,
        TetrisBlock.T,
        TetrisBlock.T,
        TetrisBlock.Z,
        TetrisBlock.Z,
        null,
        null,
        null,
      ],
    ],
    rotation: Direction.DOWN,
    block: TetrisBlock.I,
    hold: TetrisBlock.S,
    x: 4,
    y: 1,
    next: [TetrisBlock.J, TetrisBlock.L, TetrisBlock.O, TetrisBlock.Z],
    width,
    height,
    score: 42,
    rows: 72,
  })

  const tiles = [
    [null, null, null, null, null, null, null, null, null, null],
    [
      null,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.I,
      null,
      null,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null],
    [
      null,
      null,
      null,
      TetrisBlock.T,
      TetrisBlock.Z,
      TetrisBlock.Z,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      TetrisBlock.T,
      TetrisBlock.T,
      TetrisBlock.T,
      TetrisBlock.Z,
      TetrisBlock.Z,
      null,
      null,
      null,
    ],
  ]

  const { result } = renderHook(() => useTetris({ width, height }))

  act(() => result.current.left())

  expect(result.current.visibleTiles).toStrictEqual(tiles)
})

test('move left', () => {
  const width = 10
  const height = 5

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    tiles: [
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [
        null,
        null,
        null,
        TetrisBlock.T,
        TetrisBlock.Z,
        TetrisBlock.Z,
        null,
        null,
        null,
        null,
      ],
      [
        null,
        null,
        TetrisBlock.T,
        TetrisBlock.T,
        TetrisBlock.T,
        TetrisBlock.Z,
        TetrisBlock.Z,
        null,
        null,
        null,
      ],
    ],
    rotation: Direction.DOWN,
    block: TetrisBlock.J,
    hold: TetrisBlock.S,
    x: 4,
    y: 1,
    next: [TetrisBlock.J, TetrisBlock.L, TetrisBlock.O, TetrisBlock.Z],
    width,
    height,
    score: 42,
    rows: 72,
  })

  const tiles = [
    [null, null, null, null, null, null, null, null, null, null],
    [
      null,
      null,
      null,
      null,
      TetrisBlock.J,
      TetrisBlock.J,
      TetrisBlock.J,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, TetrisBlock.J, null, null, null],
    [
      null,
      null,
      null,
      TetrisBlock.T,
      TetrisBlock.Z,
      TetrisBlock.Z,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      TetrisBlock.T,
      TetrisBlock.T,
      TetrisBlock.T,
      TetrisBlock.Z,
      TetrisBlock.Z,
      null,
      null,
      null,
    ],
  ]

  const { result } = renderHook(() => useTetris({ width, height }))

  act(() => result.current.right())

  expect(result.current.visibleTiles).toStrictEqual(tiles)
})

test('hold no existing hold', () => {
  const width = 10
  const height = 5

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    tiles: [
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ],
    rotation: Direction.LEFT,
    block: TetrisBlock.L,
    x: 4,
    y: 2,
    next: [TetrisBlock.I, TetrisBlock.J, TetrisBlock.O, TetrisBlock.S],
    width,
    height,
    score: 0,
    rows: 0,
  })

  const tiles = [
    [
      null,
      null,
      null,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.I,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
  ]

  const { result } = renderHook(() => useTetris({ width, height }))

  act(() => result.current.hold())

  expect(result.current.held).toStrictEqual(TetrisBlock.L)
  expect(result.current.visibleTiles).toStrictEqual(tiles)
  expect(result.current.next).toEqual([
    TetrisBlock.J,
    TetrisBlock.O,
    TetrisBlock.S,
  ])
})

test('hold with existing hold', () => {
  const width = 10
  const height = 5

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    tiles: [
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ],
    rotation: Direction.LEFT,
    block: TetrisBlock.L,
    x: 4,
    y: 2,
    hold: TetrisBlock.Z,
    next: [TetrisBlock.I, TetrisBlock.J, TetrisBlock.O, TetrisBlock.S],
    width,
    height,
    score: 0,
    rows: 0,
  })

  const tiles = [
    [
      null,
      null,
      null,
      null,
      TetrisBlock.Z,
      TetrisBlock.Z,
      null,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
  ]

  const { result } = renderHook(() => useTetris({ width, height }))

  act(() => result.current.hold())
  expect(result.current.held).toStrictEqual(TetrisBlock.L)
  expect(result.current.visibleTiles).toStrictEqual(tiles)
  expect(result.current.next).toEqual([
    TetrisBlock.I,
    TetrisBlock.J,
    TetrisBlock.O,
    TetrisBlock.S,
  ])

  act(() => result.current.hold())

  expect(result.current.held).toStrictEqual(TetrisBlock.L)
  expect(result.current.visibleTiles).toStrictEqual(tiles)
  expect(result.current.next).toEqual([
    TetrisBlock.I,
    TetrisBlock.J,
    TetrisBlock.O,
    TetrisBlock.S,
  ])
})

test('rotate impossible', () => {
  const width = 10
  const height = 5

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    tiles: [
      [
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        null,
        null,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
      ],
      [
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        null,
        null,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
      ],
      [
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        null,
        null,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
      ],
      [
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        null,
        null,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
      ],
      [
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        null,
        null,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
      ],
    ],
    rotation: Direction.RIGHT,
    block: TetrisBlock.Z,
    x: 4,
    y: 3,
    next: [
      TetrisBlock.J,
      TetrisBlock.L,
      TetrisBlock.O,
      TetrisBlock.S,
      TetrisBlock.Z,
    ],
    width,
    height,
    score: 0,
    rows: 100,
  })

  const tiles = [
    [
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      null,
      null,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
    ],
    [
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      null,
      null,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
    ],
    [
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      null,
      TetrisBlock.Z,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
    ],
    [
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.Z,
      TetrisBlock.Z,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
    ],
    [
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.Z,
      null,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
    ],
  ]

  const { result } = renderHook(() => useTetris({ width, height }))

  act(() => result.current.rotate())

  expect(result.current.visibleTiles).toStrictEqual(tiles)
  expect(result.current.score).toEqual(0)
  expect(result.current.annoucement).toEqual(undefined)
})

test('rotate i off-center', async () => {
  const width = 10
  const height = 5

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    tiles: [
      [null, null, null, null, null, null, null, null, null, null],
      [
        null,
        TetrisBlock.O,
        TetrisBlock.O,
        null,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
      ],
      [
        null,
        TetrisBlock.O,
        TetrisBlock.O,
        null,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
      ],
      [
        null,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
      ],
      [
        null,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
        TetrisBlock.O,
      ],
    ],
    rotation: Direction.UP,
    block: TetrisBlock.I,
    x: 1,
    y: 0,
    next: helperMod.randomBag(),
    width,
    height,
    score: 0,
    rows: 100,
  })

  const tiles = [
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [
      TetrisBlock.I,
      TetrisBlock.O,
      TetrisBlock.O,
      null,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
    ],
    [
      TetrisBlock.I,
      TetrisBlock.O,
      TetrisBlock.O,
      null,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
      TetrisBlock.O,
    ],
  ]

  const { result } = renderHook(() => useTetris({ width, height }))

  act(() => result.current.rotate())

  await waitFor(() => {
    expect(result.current.next.length).toEqual(6)
  })

  expect(result.current.visibleTiles[2]).toStrictEqual(tiles[2])
  expect(result.current.visibleTiles[3]).toStrictEqual(tiles[3])
  expect(result.current.visibleTiles[4]).toStrictEqual(tiles[4])
  expect(result.current.score).toEqual(300 * 10)
  expect(result.current.annoucement).toEqual('Double')

  await waitFor(
    () => {
      expect(result.current.annoucement).toBeUndefined()
    },
    { timeout: 2000 },
  )
})

test('rotate t', () => {
  const width = 10
  const height = 5

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    tiles: [
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ],
    rotation: Direction.UP,
    block: TetrisBlock.T,
    x: 4,
    y: 1,
    next: [
      TetrisBlock.I,
      TetrisBlock.J,
      TetrisBlock.L,
      TetrisBlock.O,
      TetrisBlock.S,
      TetrisBlock.Z,
    ],
    width,
    height,
    score: 0,
    rows: 100,
  })

  const tiles = [
    [null, null, null, null, TetrisBlock.T, null, null, null, null, null],
    [
      null,
      null,
      null,
      null,
      TetrisBlock.T,
      TetrisBlock.T,
      null,
      null,
      null,
      null,
    ],
    [null, null, null, null, TetrisBlock.T, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
  ]

  const { result } = renderHook(() => useTetris({ width, height }))

  act(() => result.current.rotate())

  expect(result.current.visibleTiles).toStrictEqual(tiles)
  expect(result.current.score).toEqual(0)
  expect(result.current.annoucement).toEqual(undefined)
})

test('t-spin single', async () => {
  const width = 10
  const height = 4

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    tiles: [
      [null, null, null, null, null, null, null, null, null, null],
      [
        null,
        null,
        TetrisBlock.I,
        TetrisBlock.I,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      [
        null,
        TetrisBlock.I,
        TetrisBlock.I,
        null,
        null,
        null,
        TetrisBlock.I,
        null,
        null,
        null,
      ],
      [
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        null,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
      ],
    ],
    rotation: Direction.RIGHT,
    block: TetrisBlock.T,
    x: 4,
    y: 2,
    next: helperMod.randomBag(),
    width,
    height,
    score: 0,
    rows: 100,
  })

  const tiles = [
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [
      null,
      null,
      TetrisBlock.I,
      TetrisBlock.I,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.T,
      TetrisBlock.T,
      TetrisBlock.T,
      TetrisBlock.I,
      null,
      null,
      null,
    ],
  ]

  const { result } = renderHook(() => useTetris({ width, height }))

  act(() => result.current.rotate())

  await waitFor(() => {
    expect(result.current.next.length).toEqual(6)
  })

  expect(result.current.visibleTiles[2]).toStrictEqual(tiles[2])
  expect(result.current.visibleTiles[3]).toStrictEqual(tiles[3])
  expect(result.current.score).toEqual(800 * 10)
  expect(result.current.annoucement).toEqual('T-Spin Single')
})

test('t-spin double off-center', async () => {
  const width = 10
  const height = 5

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    tiles: [
      [
        TetrisBlock.I,
        TetrisBlock.I,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      [TetrisBlock.I, null, null, null, null, null, null, null, null, null],
      [
        TetrisBlock.I,
        null,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
      ],
      [
        TetrisBlock.I,
        null,
        null,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
      ],
      [
        TetrisBlock.I,
        null,
        null,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
      ],
    ],
    rotation: Direction.UP,
    block: TetrisBlock.T,
    x: 2,
    y: 1,
    next: helperMod.randomBag(),
    width,
    height,
    score: 0,
    rows: 107,
  })

  const tiles = [
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [
      TetrisBlock.I,
      TetrisBlock.I,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [TetrisBlock.I, null, null, null, null, null, null, null, null, null],
    [
      TetrisBlock.I,
      TetrisBlock.T,
      null,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.I,
    ],
  ]

  const { result } = renderHook(() => useTetris({ width, height }))

  act(() => result.current.rotate())

  await waitFor(() => {
    expect(result.current.next.length).toEqual(6)
  })

  expect(result.current.visibleTiles[2]).toStrictEqual(tiles[2])
  expect(result.current.visibleTiles[3]).toStrictEqual(tiles[3])
  expect(result.current.visibleTiles[4]).toStrictEqual(tiles[4])
  expect(result.current.score).toEqual(1200 * 10)
  expect(result.current.annoucement).toEqual('T-Spin Double')
})

test('mini t-spin single', async () => {
  const width = 10
  const height = 4

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    tiles: [
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, TetrisBlock.I],
      [
        null,
        null,
        null,
        null,
        TetrisBlock.I,
        TetrisBlock.I,
        null,
        null,
        TetrisBlock.I,
        TetrisBlock.I,
      ],
      [
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        TetrisBlock.I,
        null,
        null,
        null,
        TetrisBlock.I,
        TetrisBlock.I,
      ],
    ],
    rotation: Direction.LEFT,
    block: TetrisBlock.T,
    x: 7,
    y: 2,
    next: helperMod.randomBag(),
    width,
    height,
    score: 0,
    rows: 100,
  })

  const tiles = [
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, TetrisBlock.I],
    [
      null,
      null,
      null,
      null,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.T,
      null,
      TetrisBlock.I,
      TetrisBlock.I,
    ],
  ]

  const { result } = renderHook(() => useTetris({ width, height }))

  act(() => result.current.rotate())

  await waitFor(() => {
    expect(result.current.next.length).toEqual(6)
  })

  expect(result.current.visibleTiles[2]).toStrictEqual(tiles[2])
  expect(result.current.visibleTiles[3]).toStrictEqual(tiles[3])
  expect(result.current.score).toEqual(200 * 10)
  expect(result.current.annoucement).toEqual('Mini T-Spin Single')
})

test('hard down', () => {
  const width = 10
  const height = 5

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    tiles: [
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ],
    rotation: Direction.UP,
    block: TetrisBlock.Z,
    x: 4,
    y: 0,
    hold: TetrisBlock.L,
    next: [TetrisBlock.I, TetrisBlock.J, TetrisBlock.O],
    width,
    height,
    score: 0,
    rows: 99,
  })

  const tiles = [
    [
      null,
      null,
      null,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.I,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [
      null,
      null,
      null,
      TetrisBlock.Z,
      TetrisBlock.Z,
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
      null,
      TetrisBlock.Z,
      TetrisBlock.Z,
      null,
      null,
      null,
      null,
    ],
  ]

  const { result } = renderHook(() => useTetris({ width, height }))

  act(() => result.current.hardDown())

  expect(result.current.score).toStrictEqual(2 * 4)
  expect(result.current.visibleTiles).toStrictEqual(tiles)
  expect(result.current.next.length).toEqual(9)
})

test('soft down', async () => {
  const width = 10
  const height = 5

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy.mockReturnValue({
    tiles: [
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ],
    rotation: Direction.UP,
    block: TetrisBlock.Z,
    x: 4,
    y: 0,
    hold: TetrisBlock.L,
    next: [TetrisBlock.I, TetrisBlock.J, TetrisBlock.O, TetrisBlock.S],
    width,
    height,
    score: 0,
    rows: 99,
  })

  const tiles = [
    [
      null,
      null,
      null,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.I,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [
      null,
      null,
      null,
      TetrisBlock.Z,
      TetrisBlock.Z,
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
      null,
      TetrisBlock.Z,
      TetrisBlock.Z,
      null,
      null,
      null,
      null,
    ],
  ]

  const { result } = renderHook(() => useTetris({ width, height }))

  act(() => result.current.setSoftDown(true))

  await waitFor(() => {
    expect(result.current.visibleTiles[2]).toEqual(tiles[3])
  })

  act(() => result.current.setSoftDown(false))

  await waitFor(() => {
    expect(result.current.next).toEqual([
      TetrisBlock.J,
      TetrisBlock.O,
      TetrisBlock.S,
    ])
  })

  expect(result.current.score).toStrictEqual(3)
  expect(result.current.visibleTiles).toStrictEqual(tiles)
})

test('restart', () => {
  const width = 10
  const height = 5

  const initSpy = vi.spyOn(helperMod, 'initState')
  initSpy
    .mockReturnValue({
      tiles: [
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
      ],
      rotation: Direction.UP,
      block: TetrisBlock.I,
      x: width / 2 - 1,
      y: 0,
      next: helperMod.randomBag(),
      width,
      height,
      score: 0,
      rows: 0,
    })
    .mockReturnValueOnce({
      tiles: [
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [
          null,
          null,
          null,
          TetrisBlock.Z,
          TetrisBlock.Z,
          null,
          null,
          TetrisBlock.T,
          null,
          null,
        ],
        [
          null,
          null,
          null,
          null,
          TetrisBlock.Z,
          TetrisBlock.Z,
          TetrisBlock.T,
          TetrisBlock.T,
          TetrisBlock.T,
          null,
        ],
      ],
      rotation: Direction.UP,
      block: TetrisBlock.Z,
      x: 4,
      y: 0,
      hold: TetrisBlock.L,
      next: [TetrisBlock.I, TetrisBlock.J, TetrisBlock.O, TetrisBlock.S],
      width,
      height,
      score: 28,
      rows: 99,
    })

  const tiles = [
    [
      null,
      null,
      null,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.I,
      TetrisBlock.I,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
  ]

  const { result } = renderHook(() => useTetris({ width, height }))

  act(() => result.current.restart())

  expect(result.current.held).toBeUndefined()
  expect(result.current.level).toEqual(0)
  expect(result.current.score).toEqual(0)
  expect(result.current.visibleTiles).toStrictEqual(tiles)
})

test('toggle paused', () => {
  const width = 10
  const height = 20
  const { result } = renderHook(() => useTetris({ width, height }))

  act(() => result.current.togglePause())

  expect(result.current.paused).toBeTruthy()

  act(() => result.current.togglePause())

  expect(result.current.paused).toBeFalsy()
})
