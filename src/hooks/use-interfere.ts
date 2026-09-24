import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useLocation, useNavigate } from '@tanstack/react-router'
import useEmptyContext, { timeoutModifier } from './use-empty-context'
import type { InterfereAction } from '@/types'
import { ToastVariant } from '@/types'
import { abandonedMessages } from '@/utils/messages'
import { MINESWEEPER_PATH, SNAKE_PATH, TETRIS_PATH } from '@/utils/paths'

const gamePaths = [
  '/',
  '/' + MINESWEEPER_PATH,
  '/' + TETRIS_PATH,
  '/' + SNAKE_PATH,
]

function randomNextAction(actions: InterfereAction[]) {
  const nDoable = actions.filter((a) => a.actionPossible).length
  if (nDoable == 0) {
    return undefined
  }
  let n = Math.floor(Math.random() * nDoable)
  let idx = 0
  while (n > 0 || !actions[idx].actionPossible) {
    if (actions[idx].actionPossible) {
      n--
    }
    idx++
  }
  return idx
}

const variantToToast = {
  [ToastVariant.BASE]: toast.message,
  [ToastVariant.SUCCESS]: toast.success,
  [ToastVariant.INFO]: toast.info,
  [ToastVariant.WARNING]: toast.warning,
  [ToastVariant.ERROR]: toast.error,
}

export function useInterfere({
  actions,
  setNotifyTime,
}: {
  actions: InterfereAction[]
  setNotifyTime: React.Dispatch<React.SetStateAction<Date>>
}) {
  const [inferfereCount, setInterfereCount] = useState<number>(0)
  const [notifyNow, setNotifyNow] = useState<boolean>(false)
  const [interfereNow, setInterfereNow] = useState<boolean>(false)
  const [actIdx, setActIdx] = useState<number>()

  const [abandonedIdx, setAbandonedIdx] = useState<number>(0)

  const { interfereAllowed, lastActivity } = useEmptyContext()
  const navigate = useNavigate()
  const location = useLocation()

  const startTime = new Date()

  const otherGamePaths = gamePaths.filter((p) => location.href != p)

  const baseActions: InterfereAction[] = [
    {
      actionPossible: useMemo(
        () =>
          new Date().getTime() - lastActivity.getTime() >
          5 * 60 * 1000 * timeoutModifier,
        [lastActivity],
      ),
      action: useCallback(
        () =>
          setAbandonedIdx((a) =>
            a < abandonedMessages.length - 1 ? a + 1 : a,
          ),
        [setAbandonedIdx],
      ),
      afterToast: {
        message: useMemo(
          () =>
            abandonedMessages[abandonedIdx].title
              ? abandonedMessages[abandonedIdx].title
              : `It's been ${Math.floor((new Date().getTime() - lastActivity.getTime()) / (1000 * 60))} minutes since you were last active`,
          [abandonedIdx, lastActivity],
        ),
        desc: useMemo(
          () => abandonedMessages[abandonedIdx].desc,
          [abandonedIdx],
        ),
        variant: ToastVariant.BASE,
      },
    },
    {
      actionPossible: useMemo(
        () =>
          new Date().getTime() - startTime.getTime() >
          5 * 60 * 1000 * timeoutModifier,
        [lastActivity],
      ),
      action: () =>
        navigate({
          to: otherGamePaths[Math.floor(Math.random() * otherGamePaths.length)],
        }),
      afterToast: {
        message: `Redirecting...`,
        desc: "Let's play something different",
        variant: ToastVariant.INFO,
      },
    },
  ]

  const allActions = [...baseActions, ...actions]
  // const allActions = baseActions

  useEffect(() => {
    if (interfereNow && interfereAllowed) {
      if (actIdx != undefined) {
        if (allActions[actIdx].action && allActions[actIdx].actionPossible) {
          allActions[actIdx].action()
        }
        const params = allActions[actIdx].afterToast
        variantToToast[params.variant](params.message, {
          description: params.desc,
          action: params.action,
        })
        console.log('interfere:', new Date())
      }

      setInterfereNow(false)
      setInterfereCount(inferfereCount + 1)
      console.log('last activity:', lastActivity)
    }
  }, [interfereNow, interfereAllowed, actIdx, setInterfereCount, lastActivity])

  useEffect(() => {
    if (notifyNow && interfereAllowed) {
      const idx = randomNextAction(allActions)
      // console.log('action:', idx)
      setActIdx(idx)

      if (idx != undefined && allActions[idx].beforeToast) {
        const params = allActions[idx].beforeToast
        variantToToast[params.variant](params.message, {
          description: params.desc,
          action: params.action,
        })
      }
      setNotifyTime(new Date())

      setTimeout(
        () => {
          setInterfereNow(true)
        },
        25 * 100 * timeoutModifier,
      )
      setNotifyNow(false)
    }
  }, [
    interfereAllowed,
    setActIdx,
    allActions,
    notifyNow,
    setInterfereCount,
    setNotifyTime,
    setInterfereNow,
  ])

  useEffect(() => {
    if (interfereAllowed) {
      // console.log('interfere count:', inferfereCount)

      const timeout = setTimeout(
        () => {
          setNotifyNow(true)
        },
        // 60 * 1000 * timeoutModifier * Math.ceil(Math.random() * 5),
        10 * 1000 * timeoutModifier * Math.ceil(Math.random() * 5),
      )

      return () => clearTimeout(timeout)
    }
  }, [inferfereCount, interfereAllowed, setNotifyNow])
}
