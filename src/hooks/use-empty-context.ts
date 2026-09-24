import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import type { UseNavigateResult } from '@tanstack/react-router'
import { EmptyContext } from '@/components/providers/empty-provider'
import { boredMessages } from '@/utils/messages'
import { DONT_LEAVE_PATH } from '@/utils/paths'

export const timeoutModifier = 1

export function useEmptyProvider({
  navigate,
}: {
  navigate: UseNavigateResult<string>
}) {
  const [title, setTitle] = useState<string>('Cube Games')
  const [lastActivity, setLastActivity] = useState<Date>(() => {
    const localTime = localStorage.getItem('last-activity')
    return localTime ? new Date(JSON.parse(localTime)) : new Date()
  })

  // const [tooLong, setTooLong] = useState<number>(-1)
  const [showMessage, setShowMessage] = useState<boolean>(false)
  const [pokes, setPokes] = useState<number>(0)

  const [abandoned, setAbandoned] = useState<number>(0)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

  const [interfereAllowed, setInterfereAllowed] = useState<boolean>(true)
  const [ignoreCount, setIgnoreCount] = useState<number>(0)

  const startTime = new Date()

  const updateLocal = (activity: Date) => {
    localStorage.setItem('last-activity', JSON.stringify(activity))
  }

  const updateActivity = useCallback(() => {
    const now = new Date()
    setLastActivity(now)
    setAbandoned(0)
    updateLocal(now)
  }, [setLastActivity, setAbandoned, timeoutId, setTimeoutId])

  const afkMessage = useCallback(() => {
    const now = new Date()
    const diff = now.valueOf() - lastActivity.valueOf()
    console.log('last activity: %d minutes ago', diff / (60 * 1000))
    if (diff < 5 * 60 * 1000 * timeoutModifier) {
      const id = setTimeout(
        afkMessage,
        (5 * 60 * 1000 - diff) * timeoutModifier,
      )
      setTimeoutId(id)
      console.log('timeout reset')
    } else {
      // setAbandoned((a) => {
      //     const message = abandonedMessages[Math.min(a, abandonedMessages.length - 1)]
      //     toast(message.title, {
      //         description: message.description
      //     })
      //     toast('Where did you go?', {
      //         description: `last activity: ${Math.floor(diff / (60 * 1000))} minutes, ${Math.floor((diff / 1000) % 60)} seconds ago`
      //     })
      //     return a + 1
      // })
      const time =
        abandoned < 4
          ? 60 * 1000 + Math.floor(Math.random() * 240 * 1000)
          : abandoned < 8
            ? 240 * 1000 + Math.floor(Math.random() * 360 * 1000)
            : 600 * 1000 + Math.floor(Math.random() * 1200 * 1000)
      const id = setTimeout(afkMessage, time * timeoutModifier)
      setTimeoutId(id)
      console.log('timeout set')
    }
  }, [setAbandoned])

  // const poke = useCallback(() => {
  //   const now = new Date()
  //   const startDiff = now.valueOf() - startTime.valueOf()
  //   const lastDiff = now.valueOf() - lastActivity.valueOf()
  //   // setTooLong(Math.floor(startDiff / (5 * 60 * 1000 * timeoutModifier)))
  //   setShowMessage(true)
  //   setTimeout(() => setShowMessage(false), 2.5 * 1000 * timeoutModifier)
  //   setTimeout(poke, 5 * 60 * 1000 * timeoutModifier)
  // }, [startTime, lastActivity, timeoutModifier, setShowMessage])

  useEffect(() => {
    const now = new Date()
    const startDiff = now.valueOf() - startTime.valueOf()
    if (startDiff > 10 * 60 * 1000 * timeoutModifier) {
      setShowMessage(true)

      setTimeout(() => setShowMessage(false), 2.5 * 1000 * timeoutModifier)
    }
    const timeout = setTimeout(
      () => setPokes((p) => p + 1),
      2 * 60 * 1000 * timeoutModifier,
    )
    return () => clearTimeout(timeout)
  }, [pokes])

  useEffect(() => {
    const startDiff = startTime.valueOf() - lastActivity.valueOf()
    if (startDiff > 20 * 60 * 1000 * timeoutModifier) {
      navigate({ to: '/' + DONT_LEAVE_PATH })
    }
    // if (!timeoutId) {
    //   const id = setTimeout(afkMessage, 300 * 1000 * timeoutModifier)
    //   setTimeoutId(id)
    //   console.log('timeout set')
    //   setTimeout(poke, 5 * 60 * 1000 * timeoutModifier)
    // } else {
    //   console.log('timeout not set')
    // }
  }, [])

  const wheatMessage = useMemo(
    () =>
      showMessage
        ? boredMessages[Math.floor(Math.random() * boredMessages.length)]
        : undefined,
    [showMessage],
  )

  const toggleInterference = useCallback(
    (b: boolean) => {
      if (b) {
        setInterfereAllowed(true)
      } else {
        setInterfereAllowed(false)
        setTimeout(
          () => {
            setInterfereAllowed(true)
            toast.info('I lived, bitch', {
              description: "Thought you'd seen the last of me, didn't you?",
            })
          },
          60 * 1000 * timeoutModifier * (5 + Math.ceil(Math.random() * 5)),
        )
      }
    },
    [setInterfereAllowed],
  )

  return {
    title,
    setTitle,
    lastActivity,
    updateActivity,
    wheatMessage,
    interfereAllowed,
    setInterfereAllowed: toggleInterference,
    // setInterfereAllowed: setInterfereAllowed,
  }
}

export default function useEmptyContext() {
  return useContext(EmptyContext)
}
