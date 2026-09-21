import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useStay } from '@/hooks/use-stay'
import { stayBtnText, stayResponseText } from '@/utils/messages'

export default function Stay() {
  const { apologies, btnPresses, setBtnPresses } = useStay()
  const navigate = useNavigate()

  const bottomRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [apologies])

  return (
    <div className="flex flex-col pb-24">
      <div className="pb-8 text-5xl text-red-500 ">
        {btnPresses == 0
          ? apologies.split('\n').map((a, idx) => <p key={idx}>{a}</p>)
          : stayResponseText[btnPresses - 1]}
      </div>
      <Button
        ref={bottomRef}
        onClick={() => {
          if (btnPresses < stayBtnText.length - 1) {
            setBtnPresses(btnPresses + 1)
          } else {
            navigate({ to: '/' })
          }
        }}
        variant={'secondary'}
      >
        {stayBtnText[btnPresses]}
      </Button>
    </div>
  )
}
