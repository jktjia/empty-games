import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  initApple,
  initSnake,
  makeTiles,
  randomCoords,
  update,
} from './helpers'
import { useSnakeInterefere } from './use-interfere'
import type { Coord, WidthHeightSettings } from '@/types'
import { Direction } from '@/types'
import { moveDirs } from '@/utils'

export interface SnakeState {
  width: number
  height: number
  snake: Coord[]
  apple: Coord
  score: number
  dir: Direction
  isGameLost: boolean
}

const initState = (width: number, height: number) => {
  return {
    width,
    height,
    snake: initSnake(width, height),
    apple: initApple(width, height),
    score: 0,
    dir: Direction.RIGHT,
    isGameLost: false,
  }
}

export default function useSnake(
  { width, height }: WidthHeightSettings = { width: 20, height: 15 },
) {
  const [gameState, setGameState] = useState<SnakeState>(
    initState(width, height),
  )

  const [paused, setPaused] = useState<boolean>(false)
  const [updateNow, setUpdateNow] = useState<boolean>(false)
  const [ticker, setTicker] = useState<number>(0)
  const [tickModifier, setTickModifier] = useState<number>(1)

  const restart = useCallback(() => {
    setPaused(false)
    setGameState(initState(width, height))
    setTickModifier(1)
  }, [setGameState])

  const up = useCallback(() => {
    const upMod = moveDirs[Direction.UP]
    setGameState((s) => ({
      ...s,
      dir:
        s.snake[1].x - s.snake[0].x == upMod.x &&
        s.snake[1].y - s.snake[0].y == upMod.y
          ? s.dir
          : Direction.UP,
    }))
  }, [setGameState])

  const down = useCallback(() => {
    const downMod = moveDirs[Direction.DOWN]
    setGameState((s) => ({
      ...s,
      dir:
        s.snake[1].x - s.snake[0].x == downMod.x &&
        s.snake[1].y - s.snake[0].y == downMod.y
          ? s.dir
          : Direction.DOWN,
    }))
  }, [setGameState])

  const left = useCallback(() => {
    const leftMod = moveDirs[Direction.LEFT]
    setGameState((s) => ({
      ...s,
      dir:
        s.snake[1].x - s.snake[0].x == leftMod.x &&
        s.snake[1].y - s.snake[0].y == leftMod.y
          ? s.dir
          : Direction.LEFT,
    }))
  }, [setGameState])

  const right = useCallback(() => {
    const rightMod = moveDirs[Direction.RIGHT]
    setGameState((s) => ({
      ...s,
      dir:
        s.snake[1].x - s.snake[0].x == rightMod.x &&
        s.snake[1].y - s.snake[0].y == rightMod.y
          ? s.dir
          : Direction.RIGHT,
    }))
  }, [setGameState])

  const tiles = useMemo(
    () => makeTiles(width, height, gameState.snake, gameState.apple),
    [gameState],
  )

  const isGameWon = useMemo(
    () => gameState.snake.length == width * height,
    [gameState],
  )
  const isGameOver = useMemo(
    () => isGameWon || gameState.isGameLost,
    [isGameWon, gameState],
  )

  useEffect(() => {
    if (updateNow && !isGameOver && !paused) {
      setGameState((s) => update(s))

      setTicker((t) => t + 1)
      setUpdateNow(false)
    }
  }, [updateNow, isGameOver, paused, setGameState, setTicker, setUpdateNow])

  useEffect(() => {
    const tickTime = (1000 * 0.25) / tickModifier

    const timeout = setTimeout(() => {
      setUpdateNow(true)
    }, tickTime)

    return () => clearTimeout(timeout)
  }, [ticker])

  const togglePause = useCallback(() => {
    setPaused((p) => !p)
  }, [setPaused])

  const moveApple = useCallback(
    (coord: Coord) => {
      setGameState((s) => ({ ...s, apple: coord }))
    },
    [setGameState],
  )

  const moveSnake = useCallback(
    (coord: Coord) => {
      setGameState((s) => ({ ...s, snake: [coord, ...s.snake.slice(1)] }))
    },
    [setGameState],
  )

  const getRandomCoords = useCallback(() => {
    return randomCoords(gameState.width, gameState.height, gameState.snake)
  }, [gameState])

  useSnakeInterefere({
    isGameOver,
    restart,
    paused,
    togglePause,
    tickModifier,
    setTickModifier,
    moveApple,
    moveSnake,
    getRandomCoords,
  })

  return {
    restart,
    up,
    down,
    left,
    right,
    score: gameState.score,
    tiles,
    isGameLost: gameState.isGameLost,
    isGameWon,
    isGameOver,
    paused,
    togglePause,
  }
}
