import { CardContent, CardHeader } from '../components/ui/card'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import type { ReactNode } from 'react'

export default function GameContent({
  gameName,
  rules,
  scoreText,
  restart,
  isGameOver,
  gameOverMessage,
  children,
}: {
  gameName?: string
  rules?: string
  scoreText?: string
  restart: () => void
  isGameOver?: boolean
  gameOverMessage?: string
  children?: ReactNode
}) {
  return (
    <>
      <CardHeader className="text-xl font-semibold flex flex-row gap-1">
        <Button
          variant="secondary"
          onClick={restart}
          className="hover:cursor-pointer"
        >
          Restart
        </Button>
        {rules && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">Rules</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Rules</DialogTitle>
                {gameName && <DialogDescription>{gameName}</DialogDescription>}
              </DialogHeader>
              {rules}
            </DialogContent>
          </Dialog>
        )}
        <div className="text-end flex-grow">{scoreText}</div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full">
          {children}
          {isGameOver && (
            <div className="absolute bottom-0 h-full w-full items-center flex justify-center text-3xl font-semibold">
              <div className="w-fit bg-background/50 rounded p-2">
                {gameOverMessage}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </>
  )
}
