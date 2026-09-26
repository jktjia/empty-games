import { useCallback, useEffect, useMemo, useState } from 'react'
import { timeoutModifier } from '../use-empty-context'
import {
  canMoveDown,
  canMoveLeft,
  canMoveRight,
  checkTSpin,
  clearRows,
  currentValid,
  getMatrix,
  ghostCoords,
  ghostLocation,
  initState,
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
  scoreMiniTRows,
  scoreRowsCleared,
  scoreTSpinRows,
} from './consts'
import { useTetrisInterfere } from './interfere'
import type { TetrisState, WidthHeightSettings } from '@/types'
import { Direction, TetrisBlock } from '@/types'
import { decrypt, encrypt } from '@/utils'

export default function useTetris(
  { width, height }: WidthHeightSettings = { width: 10, height: 20 },
) {
  const [gameState, setGameState] = useState<TetrisState>(() => {
    const localTiles = localStorage.getItem('tetris')
    if (localTiles) {
      const state: TetrisState = JSON.parse(decrypt(localTiles))
      const matchingSettings = state.width == width && state.height == height
      if (matchingSettings) {
        return state
      }
    }
    return initState(width, height)
  })

  const [softDown, setSoftDown] = useState<boolean>(false)
  const [paused, setPaused] = useState<boolean>(false)
  const [updateNow, setUpdateNow] = useState<boolean>(false)
  const [ticker, setTicker] = useState<number>(0)
  const [tickModifier, setTickModifier] = useState<number>(1)
  const [isGameOver, setGameOver] = useState<boolean>(false)
  const [holdPossible, setHoldPossible] = useState<boolean>(true)
  const [prevDifficult, setPrevDifficult] = useState<boolean>(false)
  const [didTSpin, setDidTSpin] = useState<boolean>(false)
  const [miniTSpin, setMiniTSpin] = useState<boolean>(false)

  const [annoucement, setAnnouncement] = useState<string>()

  const ghost = useMemo(() => {
    const matrix = getMatrix(gameState.rotation, gameState.block)
    return ghostCoords(gameState.tiles, matrix, gameState.x, gameState.y)
  }, [gameState])

  const level = useMemo(
    () => Math.floor(gameState.rows / rowsClearedPerLevel),
    [gameState],
  )

  useEffect(() => {
    const strState = encrypt(JSON.stringify(gameState))
    localStorage.setItem('tetris', strState)
  }, [gameState])

  const restart = useCallback(() => {
    setGameState(initState(width, height))
    setGameOver(false)
    setTickModifier(1)
    setPaused(false)
  }, [setGameState, setGameOver, setTickModifier, setPaused])

  const left = (state: TetrisState) => {
    let newX = state.x
    const matrix = getMatrix(state.rotation, state.block)
    if (canMoveLeft(state.tiles, matrix, state.x, state.y)) {
      newX = state.x - 1
    }
    return { ...state, x: newX }
  }

  const right = (state: TetrisState) => {
    let newX = state.x
    const matrix = getMatrix(state.rotation, state.block)
    if (canMoveRight(state.tiles, matrix, state.x, state.y)) {
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
            rotation: Direction.UP,
          }
        } else {
          const nextBlock = state.next[0]
          return updateNext({
            ...state,
            x: width / 2 - 1,
            y: 0,
            hold: state.block,
            block: nextBlock,
            rotation: Direction.UP,
          })
        }
      }
      return state
    },
    [holdPossible],
  )

  const rotate = useCallback(
    (state: TetrisState) => {
      const { rotation, x, y } = rotateSRSKick(
        state.tiles,
        state.rotation,
        state.block,
        state.x,
        state.y,
      )
      if (state.block == TetrisBlock.T) {
        const { tSpin, miniT } = checkTSpin(
          state.tiles,
          rotation,
          state.block,
          x,
          y,
        )
        setDidTSpin(tSpin)
        if (
          miniT &&
          ((Math.abs(y - state.y) == 2 && Math.abs(x - state.x) == 1) ||
            (Math.abs(x - state.x) == 2 && Math.abs(y - state.y) == 1))
        ) {
          setDidTSpin(miniT)
        } else {
          setMiniTSpin(miniT)
        }
      }
      return { ...state, rotation: rotation, x: x, y: y }
    },
    [setDidTSpin, setMiniTSpin],
  )

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
        rotation: Direction.UP,
        block: nextBlock,
        x: width / 2 - 1,
        y: 0,
      })
    },
    [setHoldPossible, setGameOver],
  )

  const scorePlacement = useCallback(
    (state: TetrisState, rowsCleared: number) => {
      const score =
        state.score +
        level *
          (didTSpin
            ? scoreTSpinRows[rowsCleared] *
              (rowsCleared != 0 && prevDifficult ? 1.5 : 1)
            : miniTSpin
              ? scoreMiniTRows[rowsCleared] *
                (rowsCleared != 0 && prevDifficult ? 1.5 : 1)
              : scoreRowsCleared[rowsCleared] *
                (rowsCleared == 4 && prevDifficult ? 1.5 : 1))
      if (rowsCleared == 4 || didTSpin || miniTSpin) {
        setPrevDifficult(true)
      } else {
        setPrevDifficult(false)
      }
      if (rowsCleared > 0) {
        setAnnouncement(
          (didTSpin ? 'T-Spin ' : miniTSpin ? 'Mini T-Spin ' : '') +
            labelRowsCleared[rowsCleared],
        )
      }
      setDidTSpin(false)
      setMiniTSpin(false)
      return score
    },
    [level, didTSpin, prevDifficult, miniTSpin, setAnnouncement],
  )

  const addCurrentToTiles = useCallback(
    (state: TetrisState) => {
      const matrix = getMatrix(state.rotation, state.block)
      const updated = clearRows(
        placeCurrent(state.tiles, matrix, state.x, state.y, state.block),
      )

      return newBlock({
        ...state,
        tiles: updated.tiles,
        score: scorePlacement(state, updated.rowsCleared),
        rows: state.rows + updated.rowsCleared,
      })
    },
    [newBlock, scorePlacement],
  )

  const down = useCallback(
    (state: TetrisState) => {
      const matrix = getMatrix(state.rotation, state.block)
      if (canMoveDown(state.tiles, matrix, state.x, state.y)) {
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
      const matrix = getMatrix(state.rotation, state.block)
      const newY = ghostLocation(state.tiles, matrix, state.x, state.y)
      const updated = clearRows(
        placeCurrent(state.tiles, matrix, state.x, newY, state.block),
      )

      return newBlock({
        ...state,
        tiles: updated.tiles,
        score:
          2 * (newY - state.y) + scorePlacement(state, updated.rowsCleared),
        rows: state.rows + updated.rowsCleared,
      })
    },
    [newBlock, scorePlacement],
  )

  const visibleTiles = useMemo(() => {
    const matrix = getMatrix(gameState.rotation, gameState.block)
    return placeCurrent(
      gameState.tiles,
      matrix,
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
      setGameState((s) => down(s))

      setTicker((t) => t + 1)
      setUpdateNow(false)
    }
  }, [
    updateNow,
    isGameOver,
    paused,
    setGameState,
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
