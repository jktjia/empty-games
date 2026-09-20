import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import type { UseNavigateResult } from '@tanstack/react-router'
import { EmptyContext } from '@/components/providers/empty-provider'
import { abandonedMessages, boredMessages } from '@/utils/messages'
import { DONT_LEAVE_PATH, FEED_ME_PATH, MINESWEEPER_PATH } from '@/utils/paths'
import { decrypt, encrypt } from '@/utils'

export const timeoutModifier = 1

const gamePaths = ['/', '/' + MINESWEEPER_PATH]
const randomPaths = [...gamePaths, '/' + FEED_ME_PATH]

export function useEmptyProvider({
  navigate,
}: {
  navigate: UseNavigateResult<string>
}) {
  const [title, setTitle] = useState<string>('A Website')
  const startTime = new Date()
  const [lastActivity, setLastActivity] = useState<Date>(() => {
    const localTime = localStorage.getItem('last-activity')
    return localTime ? JSON.parse(decrypt(localTime)) : new Date()
  })

  const [tooLong, setTooLong] = useState<number>(-1)
  const [showMessage, setShowMessage] = useState<boolean>(false)

  const [nextPage, setNextPage] = useState<string>()
  const [swapPage, setSwapPage] = useState<boolean>(true)

  const [abandoned, setAbandoned] = useState<number>(0)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

  const updateLocal = (activity: Date) => {
    const strActivity = encrypt(JSON.stringify(activity))
    localStorage.setItem('last-activity', strActivity)
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

  const poke = useCallback(() => {
    const now = new Date()
    const startDiff = now.valueOf() - startTime.valueOf()
    const lastDiff = now.valueOf() - lastActivity.valueOf()
    setTooLong(Math.floor(startDiff / (5 * 60 * 1000 * timeoutModifier)))
    setShowMessage(true)
    setTimeout(() => setShowMessage(false), 3 * 1000 * timeoutModifier)
    setTimeout(poke, 5 * 60 * 1000 * timeoutModifier)
  }, [startTime, lastActivity, timeoutModifier, setTooLong, setShowMessage])

  useEffect(() => {
    const startDiff = startTime.valueOf() - new Date(lastActivity).valueOf()
    console.log(startDiff)
    if (startDiff > 2 * 60 * 1000 * timeoutModifier) {
      navigate({ to: '/' + DONT_LEAVE_PATH })
    }
    if (!timeoutId) {
      const id = setTimeout(afkMessage, 300 * 1000 * timeoutModifier)
      setTimeoutId(id)
      console.log('timeout set')
      setTimeout(poke, 5 * 60 * 1000 * timeoutModifier)
    } else {
      console.log('timeout not set')
    }
  }, [])

  const setupSwap = useCallback(() => {
    setSwapPage(false)
    const next = gamePaths[Math.floor(Math.random() * randomPaths.length)]
    setNextPage(next)
    setTimeout(
      () => {
        setSwapPage(true)
      },
      10 * 60 * 1000 * timeoutModifier,
    )
  }, [startTime])

  useEffect(() => {
    if (swapPage) {
      setupSwap()
      if (nextPage) {
        navigate({ to: nextPage })
      }
    }
  }, [swapPage, nextPage])

  const message = useMemo(
    () => (showMessage ? boredMessages[tooLong] : undefined),
    [showMessage, boredMessages, tooLong],
  )

  return { title, setTitle, lastActivity, updateActivity, message }
}

export default function useEmptyContext() {
  return useContext(EmptyContext)
}
