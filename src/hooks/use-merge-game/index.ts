import { startTransition, useCallback, useMemo, useState } from 'react'
import {
  addNewTile,
  emptyTiles,
  initTiles,
  nextId,
  sameTiles,
  slideDown,
  slideLeft,
  slideRight,
  slideUp,
} from './helpers'
import { useMergeInterfere } from './use-interfere'
import type { MergeSpace } from '@/types'
import { Direction } from '@/types'
import { decrypt, encrypt } from '@/utils'

interface MergeGameState {
  score: number
  tiles: MergeSpace[][]
  continue: boolean
}

export default function useMergeGame() {
  const [tiles, setTiles] = useState<MergeSpace[][]>(() => {
    const localTiles = localStorage.getItem('merge-game')
    return localTiles ? JSON.parse(decrypt(localTiles))['tiles'] : initTiles()
  })
  const [turns, setTurns] = useState<number>(0)
  const [score, setScore] = useState<number>(() => {
    const localTiles = localStorage.getItem('merge-game')
    return localTiles ? JSON.parse(decrypt(localTiles))['score'] : 0
  })
  const [continueWin, setContinueWin] = useState<boolean>(() => {
    const localTiles = localStorage.getItem('merge-game')
    return localTiles ? JSON.parse(decrypt(localTiles))['continue'] : false
  })
  const [lastMoveTime, setLastMoveTime] = useState<Date>(new Date())
  const [lastMove, setLastMove] = useState<Direction>()

  const updateLocal = (state: MergeGameState) => {
    const strState = encrypt(JSON.stringify(state))
    localStorage.setItem('merge-game', strState)
  }

  const isGameLost = useMemo(() => {
    let gameOver = emptyTiles(tiles) == 0
    gameOver = gameOver && sameTiles(tiles, slideUp(tiles)[0])
    gameOver = gameOver && sameTiles(tiles, slideDown(tiles)[0])
    gameOver = gameOver && sameTiles(tiles, slideLeft(tiles)[0])
    gameOver = gameOver && sameTiles(tiles, slideRight(tiles)[0])
    return gameOver
  }, [tiles])

  const isGameWon = useMemo(() => {
    return (
      !continueWin && tiles.flatMap((t) => t).some((t) => t && t.value >= 2048)
    )
  }, [continueWin, tiles])

  const isGameOver = useCallback(() => {
    return isGameLost || isGameWon
  }, [isGameLost, isGameWon])

  const update = useCallback(
    (newTiles: MergeSpace[][], s: number, id: number) => {
      if (!isGameOver()) {
        startTransition(() => {
          setScore((old) => old + s)
          setTiles((t) => {
            const moveWorked = !sameTiles(t, newTiles)
            setTurns((n) => (moveWorked ? n + 1 : n))
            if (moveWorked) {
              setLastMoveTime(new Date())
            } else {
              updateLocal({ tiles: t, score: score + s, continue: continueWin })
              return t
            }
            const withNewTile = addNewTile(newTiles, id)
            updateLocal({
              tiles: withNewTile,
              score: score + s,
              continue: continueWin,
            })
            return withNewTile
          })
        })
      }
    },
    [isGameOver, setScore, setTurns, setTiles, continueWin, setLastMoveTime],
  )

  const up = () => {
    const id = nextId(tiles)
    const [newTiles, s] = slideUp(tiles)
    update(newTiles, s, id)
    setLastMove(Direction.UP)
  }

  const down = () => {
    const id = nextId(tiles)
    const [newTiles, s] = slideDown(tiles)
    update(newTiles, s, id)
    setLastMove(Direction.DOWN)
  }

  const left = () => {
    const id = nextId(tiles)
    const [newTiles, s] = slideLeft(tiles)
    update(newTiles, s, id)
    setLastMove(Direction.LEFT)
  }

  const right = () => {
    const id = nextId(tiles)
    const [newTiles, s] = slideRight(tiles)
    update(newTiles, s, id)
    setLastMove(Direction.RIGHT)
  }

  const restart = useCallback(() => {
    const newTiles = initTiles()
    setTiles(newTiles)
    setScore(0)
    setContinueWin(false)
    updateLocal({ tiles: newTiles, score: 0, continue: false })
  }, [setTiles, setScore, turns])

  const continueGame = useCallback(() => {
    setContinueWin(true)
  }, [setContinueWin])

  const getLastMoveTime = useCallback(() => {
    return lastMoveTime
  }, [lastMoveTime])

  const getLastMove = useCallback(() => {
    return lastMove
  }, [lastMoveTime])

  useMergeInterfere({
    up,
    down,
    left,
    right,
    isGameOver,
    getLastMoveTime,
    getLastMove,
  })

  return {
    tiles,
    score,
    up,
    down,
    left,
    right,
    isGameOver,
    isGameLost,
    isGameWon,
    restart,
    continueGame,
  }
}
