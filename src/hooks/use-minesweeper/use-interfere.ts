import { useCallback, useMemo, useState } from 'react'
import { useInterfere } from '../use-interfere'
import type { InterfereAction } from '@/types'
import { MineTileState, ToastVariant } from '@/types'

const randomUnseenCoords = (tiles: MineTileState[][]) => {
  const unseenCount = tiles
    .flatMap((t) => t)
    .filter((t) => t == MineTileState.NOT_SEEN).length
  let idx = Math.floor(Math.random() * unseenCount)
  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[y].length; x++) {
      if (tiles[y][x] != MineTileState.NOT_SEEN) {
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
  return { x: tiles[tiles.length - 1].length - 1, y: tiles.length - 1 }
}

export function useMinesweeperInterfere({
  reveal,
  mines,
  tiles,
  restart,
  isGameOver,
}: {
  reveal: (x: number, y: number) => void
  mines?: number[][]
  tiles: MineTileState[][]
  restart: () => void
  isGameOver: boolean
}) {
  const [_, setNotifyTime] = useState<Date>(new Date())
  const [randomCoords, setRandomCoords] = useState<{ x: number; y: number }>(
    randomUnseenCoords(tiles),
  )
  const [cancelReveal, setCancelReveal] = useState<boolean>(false)

  const actions: InterfereAction[] = [
    {
      actionPossible: isGameOver,
      afterToast: {
        message: 'Press restart to begin a new game',
        desc: "Let's play again!",
        variant: ToastVariant.BASE,
      },
    },
    {
      actionPossible: isGameOver,
      beforeToast: {
        message: 'Press restart to begin a new game',
        desc: "Let's play again!",
        variant: ToastVariant.BASE,
      },
      action: restart,
      afterToast: {
        message: 'Game restarted',
        desc: 'Now we can keep playing!',
        variant: ToastVariant.INFO,
      },
    },
    {
      actionPossible: useMemo(() => !isGameOver, [isGameOver]),
      beforeToast: {
        message: `Revealing (${randomCoords.x + 1}, ${randomCoords.y + 1})`,
        desc: "There probably isn't anything there",
        variant: ToastVariant.WARNING,
        action: {
          label: 'Do not',
          onClick: useCallback(() => setCancelReveal(true), [setCancelReveal]),
        },
      },
      action: useCallback(() => {
        if (!cancelReveal) {
          reveal(randomCoords.x, randomCoords.y)
        }
        setCancelReveal(false)
        setRandomCoords(randomUnseenCoords(tiles))
      }, [tiles, reveal, setCancelReveal, randomCoords]),
      afterToast: useMemo(
        () =>
          cancelReveal
            ? {
                message: `Cancelled revealing (${randomCoords.x + 1}, ${randomCoords.y + 1})`,
                desc: `You're no fun`,
                variant: ToastVariant.BASE,
              }
            : tiles[randomCoords.y][randomCoords.x] == MineTileState.FLAG
              ? {
                  message: `(${randomCoords.x}, ${randomCoords.y}) cannot be revealed`,
                  desc: `You're no fun`,
                  variant: ToastVariant.BASE,
                }
              : mines && mines[randomCoords.y][randomCoords.x] == -1
                ? {
                    message: `There was a mine at (${randomCoords.x + 1}, ${randomCoords.y + 1})`,
                    desc: 'Whoops',
                    variant: ToastVariant.ERROR,
                  }
                : {
                    message: `There was no mine at (${randomCoords.x + 1}, ${randomCoords.y + 1})`,
                    desc: 'See, it was fine',
                    variant: ToastVariant.SUCCESS,
                  },
        [cancelReveal, tiles, mines, randomCoords, isGameOver],
      ),
    },
  ]

  useInterfere({ actions, setNotifyTime })
}
