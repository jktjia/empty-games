import { useEffect, useState } from 'react'
import { staySorryMessage } from '@/utils/messages'

export function useStay() {
  const [apologies, setApologies] = useState<string>('')
  const [idx, setIdx] = useState<number>(0)
  const [btnPresses, setBtnPresses] = useState<number>(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setApologies((a) => a + staySorryMessage[idx % staySorryMessage.length])
      setIdx((i) => i + 1)
    }, idx / 2)

    return () => clearTimeout(timeout)
  }, [idx])

  return { apologies, btnPresses, setBtnPresses }
}
