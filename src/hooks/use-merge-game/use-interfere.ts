import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { timeoutModifier } from '../use-empty-context'
import { Direction } from '@/lib/types'

export function useInterfere({
  up,
  down,
  left,
  right,
  isGameOver,
  getLastMoveTime,
  getLastMove,
}: {
  up: () => void
  down: () => void
  left: () => void
  right: () => void
  isGameOver: () => boolean
  getLastMoveTime: () => Date
  getLastMove: () => Direction | undefined
}) {
  const [inferfereCount, setInterfereCount] = useState<number>(0)
  const [notifyNow, setNotifyNow] = useState<boolean>(false)
  const [interfereNow, setInterfereNow] = useState<boolean>(false)
  const [dir, setDir] = useState<Direction>()
  const [notifiyTime, setNotifyTime] = useState<Date>(new Date())

  const directions = [
    Direction.UP,
    Direction.DOWN,
    Direction.LEFT,
    Direction.RIGHT,
  ]

  const dirStrMap = new Map<Direction, string>([
    [Direction.UP, 'up'],
    [Direction.DOWN, 'down'],
    [Direction.LEFT, 'left'],
    [Direction.RIGHT, 'right'],
  ])

  const dirActMap = useMemo(
    () =>
      new Map<Direction, () => void>([
        [Direction.UP, up],
        [Direction.DOWN, down],
        [Direction.LEFT, left],
        [Direction.RIGHT, right],
      ]),
    [up, down, left, right],
  )

  useEffect(() => {
    if (interfereNow && dir != undefined) {
      if (notifiyTime < getLastMoveTime()) {
        if (getLastMove() == dir) {
          toast(`Just like that!`, {
            description: 'See, I have great suggestions',
          })
        } else {
          toast.warning(`Stop that!`, {
            description: "That's not what I suggested",
          })
        }
      } else {
        const action = dirActMap.get(dir)
        action && action()

        toast.info(`Like this`, {
          description: 'I moved it for you',
        })
      }

      setInterfereNow(false)
      setInterfereCount(inferfereCount + 1)
    }
  }, [
    interfereNow,
    dir,
    dirActMap,
    notifiyTime,
    setInterfereCount,
    getLastMoveTime,
    getLastMove,
  ])

  useEffect(() => {
    if (notifyNow && dir != undefined) {
      if (isGameOver()) {
        toast.info("Let's play again!", {
          description: 'You should restart',
        })
        setInterfereCount(inferfereCount + 1)
      } else {
        const str = dirStrMap.get(dir)
        console.log(str)
        toast.info(`Have you thought about going ${str}?`, {
          description: 'Could be fun',
        })
        setNotifyTime(new Date())

        setTimeout(
          () => {
            console.log('interfere')
            setInterfereNow(true)
          },
          25 * 100 * timeoutModifier,
        )
      }
      setNotifyNow(false)
    }
  }, [
    dir,
    notifyNow,
    isGameOver,
    setInterfereCount,
    setNotifyTime,
    setInterfereNow,
  ])

  useEffect(() => {
    const newDir = directions[Math.floor(Math.random() * directions.length)]
    setDir(newDir)

    const timeout = setTimeout(
      () => {
        console.log('notify')
        setNotifyNow(true)
      },
      60 * 1000 * timeoutModifier * Math.ceil(Math.random() * 5),
    )

    return () => clearTimeout(timeout)
  }, [inferfereCount, setNotifyNow])
}
