
import { act, renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import * as helperMod from './helpers'
import useMergeGame from ".";

test('init tiles', () => {
    const { result } = renderHook(() => useMergeGame())

    const nFilledTiles = result.current.tiles.flatMap(t => t).filter(t => t > 0).length
    expect(nFilledTiles).toBe(2)
    expect(result.current.tiles.length).toBe(4)
    expect(result.current.tiles.every(r => r.length == 4)).toBe(true)
    expect(result.current.tiles.flatMap(t => t).every(t => t == 4 || t == 2 || t == 0)).toBe(true)
    expect(result.current.isGameOver).toBe(false)
})

test('slide up', () => {
    const tileSpy = vi.spyOn(helperMod, 'initTiles')
    tileSpy.mockReturnValue([
        [0, 0, 0, 2],
        [0, 4, 0, 2],
        [0, 0, 2, 0],
        [0, 2, 0, 0],
    ])

    const { result } = renderHook(() => useMergeGame())

    act(() => result.current.up())

    expect(result.current.tiles[0][1]).toBe(4)
    expect(result.current.tiles[0][2]).toBe(2)
    expect(result.current.tiles[0][3]).toBe(4)
    expect(result.current.tiles[1][1]).toBe(2)

    const nFilledTiles = result.current.tiles.flatMap(t => t).filter(t => t > 0).length
    expect(nFilledTiles).toBe(5)
    expect(result.current.score).toBe(4)
    expect(result.current.isGameOver).toBe(false)
})

test('slide up same', () => {
    const tileSpy = vi.spyOn(helperMod, 'initTiles')
    tileSpy.mockReturnValue([
        [0, 4, 2, 4],
        [0, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ])

    const { result } = renderHook(() => useMergeGame())

    act(() => result.current.up())

    expect(result.current.tiles[0][1]).toBe(4)
    expect(result.current.tiles[0][2]).toBe(2)
    expect(result.current.tiles[0][3]).toBe(4)
    expect(result.current.tiles[1][1]).toBe(2)

    const nFilledTiles = result.current.tiles.flatMap(t => t).filter(t => t > 0).length
    expect(nFilledTiles).toBe(4)
    expect(result.current.score).toBe(0)
    expect(result.current.isGameOver).toBe(false)
})

test('slide down', () => {
    const tileSpy = vi.spyOn(helperMod, 'initTiles')
    tileSpy.mockReturnValue([
        [0, 0, 0, 2],
        [0, 4, 0, 2],
        [0, 0, 2, 0],
        [0, 2, 0, 0],
    ])

    const { result } = renderHook(() => useMergeGame())

    act(() => result.current.down())

    expect(result.current.tiles[2][1]).toBe(4)
    expect(result.current.tiles[3][2]).toBe(2)
    expect(result.current.tiles[3][3]).toBe(4)
    expect(result.current.tiles[3][1]).toBe(2)

    const nFilledTiles = result.current.tiles.flatMap(t => t).filter(t => t > 0).length
    expect(nFilledTiles).toBe(5)
    expect(result.current.score).toBe(4)
    expect(result.current.isGameOver).toBe(false)
})

test('slide left', () => {
    const tileSpy = vi.spyOn(helperMod, 'initTiles')
    tileSpy.mockReturnValue([
        [8, 8, 0, 2],
        [0, 4, 0, 2],
        [0, 0, 2, 0],
        [0, 2, 0, 0],
    ])

    const { result } = renderHook(() => useMergeGame())

    act(() => result.current.left())

    expect(result.current.tiles[0][0]).toBe(16)
    expect(result.current.tiles[0][1]).toBe(2)
    expect(result.current.tiles[1][0]).toBe(4)
    expect(result.current.tiles[1][1]).toBe(2)
    expect(result.current.tiles[2][0]).toBe(2)
    expect(result.current.tiles[3][0]).toBe(2)

    const nFilledTiles = result.current.tiles.flatMap(t => t).filter(t => t > 0).length
    expect(nFilledTiles).toBe(7)
    expect(result.current.score).toBe(16)
    expect(result.current.isGameOver).toBe(false)
})

test('slide right', () => {
    const tileSpy = vi.spyOn(helperMod, 'initTiles')
    tileSpy.mockReturnValue([
        [8, 8, 0, 2],
        [0, 4, 0, 2],
        [0, 0, 2, 0],
        [0, 2, 0, 0],
    ])

    const { result } = renderHook(() => useMergeGame())

    act(() => result.current.right())

    expect(result.current.tiles[0][2]).toBe(16)
    expect(result.current.tiles[0][3]).toBe(2)
    expect(result.current.tiles[1][2]).toBe(4)
    expect(result.current.tiles[1][3]).toBe(2)
    expect(result.current.tiles[2][3]).toBe(2)
    expect(result.current.tiles[3][3]).toBe(2)

    const nFilledTiles = result.current.tiles.flatMap(t => t).filter(t => t > 0).length
    expect(nFilledTiles).toBe(7)
    expect(result.current.score).toBe(16)
    expect(result.current.isGameOver).toBe(false)
})

test('game over when nowhere to move', () => {
    const tileSpy = vi.spyOn(helperMod, 'initTiles')
    tileSpy.mockReturnValue([
        [2, 16, 4, 2],
        [16, 4, 2, 8],
        [4, 4, 2, 16],
        [2, 4, 2, 8],
    ])

    const { result } = renderHook(() => useMergeGame())

    act(() => result.current.left())

    expect(result.current.score).toBe(8)
    expect(result.current.isGameOver).toBe(true)
})

test('restart', () => {
    const tileSpy = vi.spyOn(helperMod, 'initTiles')
    tileSpy.mockReturnValue([
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 2],
        [0, 0, 0, 0],
    ]).mockReturnValueOnce([
        [2, 16, 4, 2],
        [16, 4, 2, 8],
        [4, 4, 2, 16],
        [2, 4, 2, 8],
    ])

    const { result } = renderHook(() => useMergeGame())

    act(() => result.current.left())

    expect(result.current.tiles.flatMap(t => t).filter(t => t > 0).length).toBe(16)

    act(() => result.current.restart())

    expect(result.current.score).toBe(0)
    expect(result.current.isGameOver).toBe(false)
    expect(result.current.tiles.flatMap(t => t).filter(t => t > 0).length).toBe(2)
})
