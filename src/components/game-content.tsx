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
import { Difficulty } from '@/lib/types'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'

export default function GameContent({
  gameName,
  rules,
  scoreText,
  restart,
  isGameOver,
  difficulty,
  setDifficulty,
  gameOverMessage,
  children,
}: {
  gameName?: string
  rules?: string
  scoreText?: string
  restart: () => void
  isGameOver?: boolean
  difficulty?: Difficulty
  setDifficulty?: (d: Difficulty) => void
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
        {setDifficulty && difficulty != undefined && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link">Difficulty</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Difficulty</DialogTitle>
              </DialogHeader>
              <RadioGroup
                value={difficulty.toString()}
                onValueChange={(v) => setDifficulty(parseInt(v) as Difficulty)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={Difficulty.BEGINNER.toString()}
                    id="beginner"
                  />
                  <Label htmlFor="beginner">Beginner</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={Difficulty.INTERMEDIATE.toString()}
                    id="intermediate"
                  />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={Difficulty.EXPERT.toString()}
                    id="expert"
                  />
                  <Label htmlFor="expert">Expert</Label>
                </div>
              </RadioGroup>
            </DialogContent>
          </Dialog>
        )}
        {rules && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link">Rules</Button>
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
        <div className="h-full w-full items-center flex justify-center text-3xl font-semibold">
          {children}
          {isGameOver && (
            <div className="absolute w-fit bg-background/50 rounded p-2">
              {gameOverMessage}
            </div>
          )}
        </div>
      </CardContent>
    </>
  )
}
