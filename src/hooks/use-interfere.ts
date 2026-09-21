import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { timeoutModifier } from './use-empty-context'
import type { InterfereAction } from '@/types'
import { ToastVariant } from '@/types'

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

  useEffect(() => {
    if (interfereNow) {
      if (actIdx != undefined) {
        if (actions[actIdx].action && actions[actIdx].actionPossible) {
          actions[actIdx].action()
        }
        const params = actions[actIdx].afterToast
        variantToToast[params.variant](params.message, {
          description: params.desc,
        })
      }

      setInterfereNow(false)
      setInterfereCount(inferfereCount + 1)
    }
  }, [interfereNow, actIdx, setInterfereCount])

  useEffect(() => {
    if (notifyNow) {
      const idx = randomNextAction(actions)
      console.log(`action: ${idx}`)
      setActIdx(idx)

      if (idx != undefined && actions[idx].beforeToast) {
        const params = actions[idx].beforeToast
        variantToToast[params.variant](params.message, {
          description: params.desc,
        })
      }
      setNotifyTime(new Date())

      setTimeout(
        () => {
          console.log('interfere')
          setInterfereNow(true)
        },
        25 * 100 * timeoutModifier,
      )
      setNotifyNow(false)
    }
  }, [
    setActIdx,
    actions,
    notifyNow,
    setInterfereCount,
    setNotifyTime,
    setInterfereNow,
  ])

  useEffect(() => {
    console.log(`interfere count: ${inferfereCount}`)

    const timeout = setTimeout(
      () => {
        console.log('notify')
        setNotifyNow(true)
      },
      // 60 * 1000 * timeoutModifier * Math.ceil(Math.random() * 5),
      10 * 1000 * timeoutModifier * Math.ceil(Math.random() * 5),
    )

    return () => clearTimeout(timeout)
  }, [inferfereCount, setNotifyNow])
}
