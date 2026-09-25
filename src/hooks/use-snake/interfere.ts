import { useCallback, useMemo, useState } from 'react'
import { timeoutModifier } from '../use-empty-context'
import { useInterfere } from '../use-interfere'
import type { Coord, InterfereAction } from '@/types'
import { ToastVariant } from '@/types'

export function useSnakeInterefere({
  isGameOver,
  restart,
  paused,
  togglePause,
  tickModifier,
  setTickModifier,
  moveApple,
  moveSnake,
  getRandomCoords,
}: {
  isGameOver: boolean
  restart: () => void
  paused: boolean
  togglePause: () => void
  tickModifier: number
  setTickModifier: React.Dispatch<React.SetStateAction<number>>
  moveApple: (coord: Coord) => void
  moveSnake: (coord: Coord) => void
  getRandomCoords: () => Coord
}) {
  const [_, setNotifyTime] = useState<Date>(new Date())
  const [randomCoords, setRandomCoords] = useState<Coord>(getRandomCoords())
  const [cancelMove, setCancelMove] = useState<boolean>(false)

  const isGamePlaying = useMemo(
    () => !(paused || isGameOver),
    [paused, isGameOver],
  )

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
      actionPossible: paused,
      afterToast: {
        message: 'Why did you stop?',
        desc: 'You should un-pause',
        variant: ToastVariant.BASE,
      },
    },
    {
      actionPossible: paused,
      beforeToast: {
        message: 'Why did you stop?',
        desc: 'You should un-pause',
        variant: ToastVariant.BASE,
      },
      action: togglePause,
      afterToast: {
        message: 'I unpaused it',
        desc: 'Now we can keep going!',
        variant: ToastVariant.INFO,
      },
    },
    {
      actionPossible: useMemo(
        () => isGamePlaying && tickModifier == 1,
        [isGamePlaying, tickModifier],
      ),
      action: useCallback(() => {
        setTickModifier(2.5)

        const timeout = setTimeout(
          () => {
            setTickModifier(1)
          },
          15 * 1000 * timeoutModifier,
        )

        return () => clearTimeout(timeout)
      }, [setTickModifier]),
      afterToast: {
        message: 'Faster!',
        desc: 'Gotta go fast',
        variant: ToastVariant.INFO,
      },
    },
    {
      actionPossible: isGamePlaying,
      action: useCallback(() => {
        moveApple(randomCoords)
        setRandomCoords(getRandomCoords())
      }, [moveApple, randomCoords, getRandomCoords]),
      afterToast: {
        message: `Apple moved to (${randomCoords.x + 1}, ${randomCoords.y + 1})`,
        desc: 'This should be easier to get',
        variant: ToastVariant.INFO,
      },
    },
    {
      actionPossible: isGamePlaying,
      beforeToast: {
        message: `Teleporting snake to (${randomCoords.x + 1}, ${randomCoords.y + 1})`,
        desc: 'The apple will be easier to get this way',
        variant: ToastVariant.WARNING,
        action: {
          label: 'Do not',
          onClick: useCallback(() => setCancelMove(true), [setCancelMove]),
        },
      },
      action: useCallback(() => {
        moveSnake(randomCoords)
        setRandomCoords(getRandomCoords())
      }, [moveSnake, randomCoords, getRandomCoords]),
      afterToast: useMemo(
        () =>
          cancelMove
            ? {
                message: `Cancelled snake teleport`,
                desc: `You're no fun`,
                variant: ToastVariant.BASE,
              }
            : {
                message: `Teleported snake to (${randomCoords.x + 1}, ${randomCoords.y + 1})`,
                desc: `You're welcome`,
                variant: ToastVariant.BASE,
              },
        [cancelMove, randomCoords],
      ),
    },
  ]

  useInterfere({ actions, setNotifyTime })
}
