import { useCallback, useEffect, useMemo, useState } from 'react'
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
  randomBlock,
  rotateSRSKick,
} from './helpers'
import type { TetrisSpace, WidthHeightSettings } from '@/utils/types'
import { TetrisBlock } from '@/utils/types'
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
}

export const blockMatrices = {
  [TetrisBlock.T]: [
    [false, true, false],
    [true, true, true],
    [false, false, false],
  ],
  [TetrisBlock.I]: [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, true, true, true, true],
    [false, false, false, false, false],
    [false, false, false, false, false],
  ],
  [TetrisBlock.J]: [
    [true, false, false],
    [true, true, true],
    [false, false, false],
  ],
  [TetrisBlock.L]: [
    [false, false, true],
    [true, true, true],
    [false, false, false],
  ],
  [TetrisBlock.S]: [
    [false, true, true],
    [true, true, false],
    [false, false, false],
  ],
  [TetrisBlock.Z]: [
    [true, true, false],
    [false, true, true],
    [false, false, false],
  ],
  [TetrisBlock.O]: [
    [false, true, true],
    [false, true, true],
    [false, false, false],
  ],
}

const scoreRowsCleared = [0, 100, 300, 500, 800]
const rowsClearedPerLevel = 10

function checkLocalOrDefault<X>(
  key: string,
  defaultVal: X,
  width: number,
  height: number,
) {
  const localTiles = localStorage.getItem('tetris')
  const matchingSettings =
    localTiles &&
    JSON.parse(decrypt(localTiles))['width'] == width &&
    JSON.parse(decrypt(localTiles))['height'] == height
  return localTiles && matchingSettings
    ? JSON.parse(decrypt(localTiles))[key]
    : defaultVal
}

export default function useTetris(
  { width, height }: WidthHeightSettings = { width: 10, height: 20 },
) {
  const [tiles, setTiles] = useState<TetrisSpace[][]>(
    checkLocalOrDefault('tiles', initTiles(width, height), width, height),
  )
  const [currBlock, setCurrBlock] = useState<TetrisBlock>(
    checkLocalOrDefault('block', randomBlock(), width, height),
  )
  const [current, setCurrent] = useState<boolean[][]>(
    checkLocalOrDefault('matrix', blockMatrices[currBlock], width, height),
  )
  const [currX, setCurrX] = useState<number>(
    checkLocalOrDefault('x', width / 2 - 1, width, height),
  )
  const [currY, setCurrY] = useState<number>(
    checkLocalOrDefault('y', 0, width, height),
  )
  const [held, setHeld] = useState<TetrisBlock | undefined>(
    checkLocalOrDefault('hold', undefined, width, height),
  )
  const [next, setNext] = useState<TetrisBlock[]>(
    checkLocalOrDefault('next', randomBag(), width, height),
  )
  const [score, setScore] = useState<number>(
    checkLocalOrDefault('score', 0, width, height),
  )

  const [softDown, setSoftDown] = useState<boolean>(false)
  const [paused, setPaused] = useState<boolean>(false)
  const [updateNow, setUpdateNow] = useState<boolean>(false)
  const [ticker, setTicker] = useState<number>(0)
  const [rowsCleared, setRowsCleared] = useState<number>(0)
  const [isGameLost, setGameLost] = useState<boolean>(false)

  useEffect(() => {
    const state: TetrisState = {
      tiles,
      matrix: current,
      block: currBlock,
      x: currX,
      y: currY,
      hold: held,
      next,
      width,
      height,
      score,
    }
    const strState = encrypt(JSON.stringify(state))
    localStorage.setItem('tetris', strState)
  }, [tiles, current, currX, currY, held, next, score])

  const restart = useCallback(() => {
    const newTiles = initTiles(width, height)
    setTiles(newTiles)
    const firstBlock = randomBlock()
    setCurrBlock(firstBlock)
    setCurrent(blockMatrices[firstBlock])
    setCurrX(width / 2 - 1)
    setCurrY(0)
    setHeld(undefined)
    setNext([randomBlock(), randomBlock(), randomBlock()])
    setScore(0)
    setRowsCleared(0)
    setGameLost(false)
  }, [
    setTiles,
    setCurrBlock,
    setCurrent,
    setCurrX,
    setCurrY,
    setHeld,
    setNext,
    setScore,
  ])

  const left = useCallback(() => {
    if (!isGameLost && !paused) {
      setCurrX((x) => {
        if (canMoveLeft(tiles, current, x, currY)) {
          return x - 1
        } else {
          return x
        }
      })
    }
  }, [isGameLost, paused, setCurrX, tiles, current, currY])

  const right = useCallback(() => {
    if (!isGameLost && !paused) {
      setCurrX((x) => {
        if (canMoveRight(tiles, current, x, currY)) {
          return x + 1
        } else {
          return x
        }
      })
    }
  }, [isGameLost, paused, setCurrX, tiles, current, currY])

  const updateNext = useCallback(() => {
    setNext((n) => {
      const back = n.slice(1)
      if (back.length < 3) {
        return [...back, ...randomBag()]
      } else {
        return back
      }
    })
  }, [setNext])

  const hold = useCallback(() => {
    if (!isGameLost && !paused) {
      if (held != undefined) {
        setCurrent(blockMatrices[held])
        setCurrBlock((c) => {
          setHeld(c)
          return held
        })
      } else {
        const newCurr = next[0]
        setCurrent(blockMatrices[newCurr])
        setCurrBlock((c) => {
          setHeld(c)
          return newCurr
        })
        updateNext()
      }
    }
  }, [isGameLost, paused, setHeld, setCurrent, setCurrBlock, next, updateNext])

  const rotate = useCallback(() => {
    if (!isGameLost && !paused) {
      const { rotated, x, y } = rotateSRSKick(
        tiles,
        current,
        currBlock,
        currX,
        currY,
      )
      setCurrent(rotated)
      setCurrX(x)
      setCurrY(y)
    }
  }, [isGameLost, paused, tiles, current, currX, currY])

  const newBlock = useCallback(() => {
    const newCurr = next[0]
    setCurrent(blockMatrices[newCurr])
    setCurrBlock(newCurr)
    setCurrX(width / 2 - 1)
    setCurrY(0)
    updateNext()
    if (!currentValid(tiles, blockMatrices[newCurr], width / 2 - 1, 0)) {
      setGameLost(true)
    }
  }, [next, setCurrent, setCurrBlock, setCurrX, setCurrY, updateNext])

  const addCurrentToTiles = useCallback(() => {
    const updated = clearRows(
      placeCurrent(tiles, current, currX, currY, currBlock),
    )
    setTiles(updated.tiles)
    setScore((s) => s + level * scoreRowsCleared[updated.rowsCleared])
    setRowsCleared((r) => r + updated.rowsCleared)
    newBlock()
  }, [setTiles, current, currX, currY, currBlock, newBlock])

  const hardDown = useCallback(() => {
    if (!isGameLost && !paused) {
      const newY = ghostLocation(tiles, current, currX, currY)
      const updated = clearRows(
        placeCurrent(tiles, current, currX, newY, currBlock),
      )
      setTiles(updated.tiles)
      setScore(
        (s) =>
          s +
          2 * (newY - currY) +
          level * scoreRowsCleared[updated.rowsCleared],
      )
      setRowsCleared((r) => r + updated.rowsCleared)
      newBlock()
    }
  }, [isGameLost, paused, setTiles, current, currX, currY, currBlock, newBlock])

  const visibleTiles = useMemo(() => {
    return placeCurrent(tiles, current, currX, currY, currBlock)
  }, [tiles, current, currX, currY, currBlock])

  useEffect(() => {
    if (updateNow && !isGameLost && !paused) {
      if (canMoveDown(tiles, current, currX, currY)) {
        setCurrY((y) => y + 1)
        if (softDown) {
          setScore((s) => s + 1)
        }
      } else {
        addCurrentToTiles()
      }

      setTicker((t) => t + 1)
      setUpdateNow(false)
    }
  }, [
    updateNow,
    isGameLost,
    paused,
    setTimeout,
    tiles,
    current,
    currX,
    currY,
    addCurrentToTiles,
  ])

  useEffect(() => {
    let tickTime = 1000 * Math.pow(0.8, level)
    if (softDown) {
      tickTime = tickTime / 5
    }
    const timeout = setTimeout(() => {
      setUpdateNow(true)
    }, tickTime)

    return () => clearTimeout(timeout)
  }, [softDown, rowsCleared, ticker])

  const ghost = useMemo(() => {
    const g = ghostCoords(tiles, current, currX, currY)
    return g
  }, [tiles, current, currX])

  const level = useMemo(
    () => Math.floor(rowsCleared / rowsClearedPerLevel),
    [rowsCleared],
  )

  const togglePause = useCallback(() => {
    setPaused((p) => !p)
  }, [setPaused])

  return {
    visibleTiles,
    held,
    next,
    ghost,
    level,
    score,
    isGameLost,
    left,
    right,
    hold,
    rotate,
    hardDown,
    setSoftDown,
    restart,
    paused,
    togglePause,
  }
}
