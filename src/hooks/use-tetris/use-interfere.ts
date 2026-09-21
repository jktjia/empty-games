import { useCallback, useMemo, useState } from 'react'
import { timeoutModifier } from '../use-empty-context'
import { useInterfere } from '../use-interfere'
import type { InterfereAction } from '@/types'
import { ToastVariant } from '@/types'

export function useTetrisInterfere({
  isGameOver,
  restart,
  hold,
  hardDown,
  paused,
  togglePause,
  tickModifier,
  setTickModifier,
  shiftAllLeft,
  shiftAllRight,
}: {
  isGameOver: boolean
  restart: () => void
  hold: () => void
  hardDown: () => void
  paused: boolean
  togglePause: () => void
  tickModifier: number
  setTickModifier: React.Dispatch<React.SetStateAction<number>>
  shiftAllLeft: () => void
  shiftAllRight: () => void
}) {
  const [_, setNotifyTime] = useState<Date>(new Date())

  const isGamePlaying = useMemo(
    () => !(paused || isGameOver),
    [paused, isGameOver],
  )

  const actions: InterfereAction[] = [
    {
      actionPossible: isGameOver,
      afterToast: {
        message: "Let's play again!",
        desc: 'You should restart',
        variant: ToastVariant.BASE,
      },
    },
    {
      actionPossible: isGameOver,
      beforeToast: {
        message: "Let's play again!",
        desc: 'You should restart',
        variant: ToastVariant.BASE,
      },
      action: restart,
      afterToast: {
        message: 'Now we can keep playing',
        desc: 'I restarted it for you',
        variant: ToastVariant.BASE,
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
        variant: ToastVariant.BASE,
      },
    },
    {
      actionPossible: useMemo(
        () => isGamePlaying && tickModifier == 1,
        [isGamePlaying, tickModifier],
      ),
      action: useCallback(() => {
        setTickModifier(4)

        const timeout = setTimeout(
          () => {
            setTickModifier(1)
          },
          30 * 1000 * timeoutModifier,
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
      beforeToast: {
        message: 'Not this block',
        desc: "Let's hold it for now",
        variant: ToastVariant.INFO,
      },
      action: hold,
      afterToast: {
        message: 'This block is better',
        desc: 'I put the other block on hold',
        variant: ToastVariant.INFO,
      },
    },
    {
      actionPossible: isGamePlaying,
      beforeToast: {
        message: 'Drop the block here',
        desc: 'This is a good spot',
        variant: ToastVariant.INFO,
      },
      action: hardDown,
      afterToast: {
        message: 'Like this',
        desc: 'I dropped it for you',
        variant: ToastVariant.INFO,
      },
    },
    {
      actionPossible: isGamePlaying,
      action: shiftAllLeft,
      afterToast: {
        message: '←',
        desc: 'To the left, to the left',
        variant: ToastVariant.BASE,
      },
    },
    {
      actionPossible: isGamePlaying,
      action: shiftAllRight,
      afterToast: {
        message: '→',
        desc: 'To the right, to the right',
        variant: ToastVariant.BASE,
      },
    },
  ]

  useInterfere({ actions, setNotifyTime })
}
