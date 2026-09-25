import { useCallback, useEffect, useMemo, useState } from 'react'
import { timeoutModifier } from '../use-empty-context'
import {
  canMoveDown,
  canMoveLeft,
  canMoveRight,
  clearRows,
  currentValid,
  ghostCoords,
  ghostLocation,
  initTiles,
  placeCurrent,
  randomBag,
  rotateSRSKick,
  shiftLeft,
  shiftRight,
} from './helpers'
import {
  blockMatrices,
  labelRowsCleared,
  rowsClearedPerLevel,
  scoreRowsCleared,
} from './consts'
import { useTetrisInterfere } from './use-interfere'
import type { TetrisBlock, TetrisSpace, WidthHeightSettings } from '@/types'
import { decrypt, encrypt } from '@/utils'

interface TetrisState {
  tiles: TetrisSpace[][]
  matrix: boolean[][]
  block: TetrisBlock
  x: number
  y: number
  hold?: TetrisBlock
  next: TetrisBlock[]
  width: number
  height: number
  score: number
  rows: number
}

const initTetris = (width: number, height: number) => {
  const firstBlocks = randomBag()
  return {
    tiles: initTiles(width, height),
    matrix: blockMatrices[firstBlocks[0]],
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

export default function useTetris(
  { width, height }: WidthHeightSettings = { width: 10, height: 20 },
) {
  const [gameState, setGameState] = useState<TetrisState>(() => {
    const localTiles = localStorage.getItem('tetris')
    const matchingSettings =
      localTiles &&
      JSON.parse(decrypt(localTiles))['width'] == width &&
      JSON.parse(decrypt(localTiles))['height'] == height
    return localTiles && matchingSettings
      ? JSON.parse(decrypt(localTiles))
      : initTetris(width, height)
  })

  const [softDown, setSoftDown] = useState<boolean>(false)
  const [paused, setPaused] = useState<boolean>(false)
  const [updateNow, setUpdateNow] = useState<boolean>(false)
  const [ticker, setTicker] = useState<number>(0)
  const [tickModifier, setTickModifier] = useState<number>(1)
  const [isGameOver, setGameOver] = useState<boolean>(false)
  const [holdPossible, setHoldPossible] = useState<boolean>(true)
  const [prevDifficult, setPrevDifficult] = useState<boolean>(false)

  const [annoucement, setAnnouncement] = useState<string>()

  const ghost = useMemo(() => {
    return ghostCoords(
      gameState.tiles,
      gameState.matrix,
      gameState.x,
      gameState.y,
    )
  }, [gameState])

  const level = useMemo(
    () => Math.floor(gameState.rows / rowsClearedPerLevel),
    [gameState],
  )

  const updateLocal = (state: TetrisState) => {
    const strState = encrypt(JSON.stringify(state))
    localStorage.setItem('tetris', strState)
    return state
  }

  const restart = useCallback(() => {
    setGameState(initTetris(width, height))
    setGameOver(false)
    setTickModifier(1)
    setPaused(false)
  }, [setGameState, setGameOver, setTickModifier, setPaused])

  const left = (state: TetrisState) => {
    let newX = state.x
    if (canMoveLeft(state.tiles, state.matrix, state.x, state.y)) {
      newX = state.x - 1
    }
    return { ...state, x: newX }
  }

  const right = (state: TetrisState) => {
    let newX = state.x
    if (canMoveRight(state.tiles, state.matrix, state.x, state.y)) {
      newX = state.x + 1
    }
    return { ...state, x: newX }
  }

  const updateNext = (state: TetrisState) => {
    let next = state.next.slice(1)
    if (next.length < 3) {
      next = [...next, ...randomBag()]
    }
    return { ...state, next: next }
  }

  const hold = useCallback(
    (state: TetrisState) => {
      if (holdPossible) {
        setHoldPossible(false)
        if (state.hold != undefined) {
          return {
            ...state,
            x: width / 2 - 1,
            y: 0,
            hold: state.block,
            block: state.hold,
            matrix: blockMatrices[state.hold],
          }
        } else {
          const nextBlock = state.next[0]
          return updateNext({
            ...state,
            x: width / 2 - 1,
            y: 0,
            hold: state.block,
            block: nextBlock,
            matrix: blockMatrices[nextBlock],
          })
        }
      }
      return state
    },
    [holdPossible],
  )

  const rotate = (state: TetrisState) => {
    const { rotated, x, y } = rotateSRSKick(
      state.tiles,
      state.matrix,
      state.block,
      state.x,
      state.y,
    )
    return { ...state, matrix: rotated, x: x, y: y }
  }

  const newBlock = useCallback(
    (state: TetrisState) => {
      setHoldPossible(true)
      const nextBlock = state.next[0]
      const nextMatrix = blockMatrices[nextBlock]

      if (!currentValid(state.tiles, nextMatrix, width / 2 - 1, 0)) {
        setGameOver(true)
      }
      return updateNext({
        ...state,
        matrix: nextMatrix,
        block: nextBlock,
        x: width / 2 - 1,
        y: 0,
      })
    },
    [setHoldPossible, setGameOver],
  )

  const addCurrentToTiles = useCallback(
    (state: TetrisState) => {
      const updated = clearRows(
        placeCurrent(state.tiles, state.matrix, state.x, state.y, state.block),
      )
      const score =
        state.score +
        level *
          scoreRowsCleared[updated.rowsCleared] *
          (updated.rowsCleared == 4 && prevDifficult ? 1.5 : 1)
      if (updated.rowsCleared == 4) {
        setPrevDifficult(true)
      } else {
        setPrevDifficult(false)
      }
      setAnnouncement(labelRowsCleared[updated.rowsCleared])
      return newBlock({
        ...state,
        tiles: updated.tiles,
        score: score,
        rows: state.rows + updated.rowsCleared,
      })
    },
    [setPrevDifficult, setAnnouncement, newBlock],
  )

  const down = useCallback(
    (state: TetrisState) => {
      if (canMoveDown(state.tiles, state.matrix, state.x, state.y)) {
        return {
          ...state,
          y: state.y + 1,
          score: softDown ? state.score + 1 : state.score,
        }
      } else {
        return addCurrentToTiles(state)
      }
    },
    [softDown, addCurrentToTiles],
  )

  const hardDown = useCallback(
    (state: TetrisState) => {
      const newY = ghostLocation(state.tiles, state.matrix, state.x, state.y)
      const updated = clearRows(
        placeCurrent(state.tiles, state.matrix, state.x, newY, state.block),
      )
      const score =
        state.score +
        (2 * (newY - state.y) +
          level *
            scoreRowsCleared[updated.rowsCleared] *
            (updated.rowsCleared == 4 && prevDifficult ? 1.5 : 1))
      if (updated.rowsCleared == 4) {
        setPrevDifficult(true)
      } else {
        setPrevDifficult(false)
      }
      setAnnouncement(labelRowsCleared[updated.rowsCleared])
      return newBlock({
        ...state,
        tiles: updated.tiles,
        score: score,
        rows: state.rows + updated.rowsCleared,
      })
    },
    [setPrevDifficult, setAnnouncement, newBlock],
  )

  const visibleTiles = useMemo(() => {
    return placeCurrent(
      gameState.tiles,
      gameState.matrix,
      gameState.x,
      gameState.y,
      gameState.block,
    )
  }, [gameState])

  const checkPossibleAndUpdate = useCallback(
    (f: (state: TetrisState) => TetrisState) => {
      return () => {
        if (!isGameOver && !paused) {
          setGameState((state) => f(state))
        }
      }
    },
    [isGameOver, paused, setGameState],
  )

  useEffect(() => {
    if (updateNow && !isGameOver && !paused) {
      setGameState((s) => updateLocal(down(s)))

      setTicker((t) => t + 1)
      setUpdateNow(false)
    }
  }, [
    updateNow,
    isGameOver,
    paused,
    setGameState,
    updateLocal,
    down,
    setTicker,
    setUpdateNow,
  ])

  useEffect(() => {
    if (annoucement) {
      const timeout = setTimeout(() => {
        setAnnouncement(undefined)
      }, 1000 * timeoutModifier)

      return () => clearTimeout(timeout)
    }
  }, [annoucement])

  useEffect(() => {
    let tickTime = (1000 * Math.pow(0.8, level)) / tickModifier
    if (softDown) {
      tickTime = tickTime / 5
    }
    const timeout = setTimeout(() => {
      setUpdateNow(true)
    }, tickTime)

    return () => clearTimeout(timeout)
  }, [level, softDown, ticker])

  const togglePause = useCallback(() => {
    setPaused((p) => !p)
  }, [setPaused])

  const shiftAllLeft = (state: TetrisState) => {
    return { ...state, tiles: shiftLeft(state.tiles) }
  }

  const shiftAllRight = (state: TetrisState) => {
    return { ...state, tiles: shiftRight(state.tiles) }
  }

  useTetrisInterfere({
    isGameOver,
    restart,
    hardDown: checkPossibleAndUpdate(hardDown),
    hold: checkPossibleAndUpdate(hold),
    paused,
    togglePause,
    shiftAllLeft: checkPossibleAndUpdate(shiftAllLeft),
    shiftAllRight: checkPossibleAndUpdate(shiftAllRight),
    tickModifier,
    setTickModifier,
  })

  return {
    visibleTiles,
    held: gameState.hold,
    next: gameState.next,
    ghost,
    level,
    score: gameState.score,
    isGameOver,
    left: checkPossibleAndUpdate(left),
    right: checkPossibleAndUpdate(right),
    hold: checkPossibleAndUpdate(hold),
    rotate: checkPossibleAndUpdate(rotate),
    hardDown: checkPossibleAndUpdate(hardDown),
    setSoftDown,
    restart,
    paused,
    togglePause,
    annoucement,
  }
}
