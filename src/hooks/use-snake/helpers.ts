import type { Coord, SnakeSpace } from '@/types'
import type { SnakeState } from '.'
import { SnakeTileState } from '@/types'
import { moveDirs } from '@/utils'

export function initSnake(width: number = 20, height: number = 15): Coord[] {
  const y = Math.floor(height / 2)
  const x = Math.floor(width / 3)
  return [
    { x: x + 1, y },
    { x, y },
    { x: x - 1, y },
  ]
}

export function initApple(width: number = 20, height: number = 15): Coord {
  const y = Math.floor(height / 2)
  const x = width - Math.floor(width / 3)
  return { x, y }
}

export function randomCoords(
  width: number = 20,
  height: number = 15,
  snakeCoords: Coord[],
): Coord {
  const emptySpaces = width * height - snakeCoords.length
  let idx = Math.floor(Math.random() * emptySpaces)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (snakeCoords.some((c) => c.x == x && c.y == y)) {
        continue
      } else {
        if (idx == 0) {
          return { x, y }
        } else {
          idx--
        }
      }
    }
  }
  return { x: width - 1, y: height - 1 }
}

export function makeTiles(
  width: number = 20,
  height: number = 15,
  snakeCoords: Coord[],
  appleCoord: Coord,
): SnakeSpace[][] {
  const baseTiles: SnakeSpace[][] = []
  for (let i = 0; i < height; i++) {
    baseTiles[i] = []
    for (let j = 0; j < width; j++) {
      if (snakeCoords[0].x == j && snakeCoords[0].y == i) {
        baseTiles[i][j] = SnakeTileState.HEAD
      } else if (snakeCoords.slice(1).some((c) => c.x == j && c.y == i)) {
        baseTiles[i][j] = SnakeTileState.BODY
      } else if (appleCoord.x == j && appleCoord.y == i) {
        baseTiles[i][j] = SnakeTileState.APPLE
      } else {
        baseTiles[i][j] = null
      }
    }
  }
  return baseTiles
}

export function update(state: SnakeState): SnakeState {
  const modifier = moveDirs[state.dir]
  const head = {
    x: state.snake[0].x + modifier.x,
    y: state.snake[0].y + modifier.y,
  }
  if (
    head.x < 0 ||
    head.x >= state.width ||
    head.y < 0 ||
    head.y >= state.height
  ) {
    return { ...state, isGameLost: true }
  }
  const ateApple = head.x == state.apple.x && head.y == state.apple.y
  const snakeBody = ateApple
    ? state.snake
    : state.snake.slice(0, state.snake.length - 1)
  if (snakeBody.some((c) => c.x == head.x && c.y == head.y)) {
    return { ...state, isGameLost: true }
  }
  return {
    ...state,
    snake: [head, ...snakeBody],
    apple: ateApple
      ? randomCoords(state.width, state.height, [head, ...snakeBody])
      : state.apple,
    score: ateApple ? state.score + 1 : state.score,
  }
}
