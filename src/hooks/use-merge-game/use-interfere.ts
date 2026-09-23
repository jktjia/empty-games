import { useCallback, useMemo, useState } from 'react'
import { useInterfere } from '../use-interfere'
import type { InterfereAction } from '@/types'
import { Direction, ToastVariant } from '@/types'

export function useMergeInterfere({
  up,
  down,
  left,
  right,
  isGameOver,
  restart,
  getLastMoveTime,
  getLastMove,
}: {
  up: () => void
  down: () => void
  left: () => void
  right: () => void
  isGameOver: () => boolean
  restart: () => void
  getLastMoveTime: () => Date
  getLastMove: () => Direction | undefined
}) {
  const [notifiyTime, setNotifyTime] = useState<Date>(new Date())

  const moveOpts = useMemo(
    () => [
      {
        dir: Direction.UP,
        str: 'up',
        act: up,
      },
      {
        dir: Direction.DOWN,
        str: 'down',
        act: down,
      },
      {
        dir: Direction.LEFT,
        str: 'left',
        act: left,
      },
      {
        dir: Direction.RIGHT,
        str: 'right',
        act: right,
      },
    ],
    [up, down, left, right],
  )

  const actions: InterfereAction[] = [
    {
      actionPossible: useMemo(() => isGameOver(), [isGameOver]),
      afterToast: {
        message: 'Press restart to begin a new game',
        desc: "Let's play again!",
        variant: ToastVariant.BASE,
      },
    },
    {
      actionPossible: useMemo(() => isGameOver(), [isGameOver]),
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
    ...moveOpts.map((m) => {
      return {
        actionPossible: useMemo(
          () => !isGameOver() && getLastMove() != m.dir,
          [isGameOver, getLastMove],
        ),
        beforeToast: {
          message: `Have you thought about going ${m.str}?`,
          desc: 'Could be fun',
          variant: ToastVariant.INFO,
        },
        action: useCallback(() => {
          if (notifiyTime >= getLastMoveTime()) {
            m.act()
          }
        }, [notifiyTime, getLastMoveTime]),
        afterToast: useMemo(
          () =>
            notifiyTime >= getLastMoveTime()
              ? {
                  message: 'Like this',
                  desc: 'I moved it for you',
                  variant: ToastVariant.INFO,
                }
              : getLastMove() == m.dir
                ? {
                    message: 'Just like that!',
                    desc: 'See, I have great suggestions',
                    variant: ToastVariant.SUCCESS,
                  }
                : {
                    message: 'Stop that!',
                    desc: "That's not what I suggested",
                    variant: ToastVariant.ERROR,
                  },
          [notifiyTime, getLastMoveTime, getLastMove],
        ),
      }
    }),
  ]

  useInterfere({ actions, setNotifyTime })
}
