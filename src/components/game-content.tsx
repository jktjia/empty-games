import { Title } from 'react-head'
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
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import type { ReactNode } from 'react'
import { Difficulty } from '@/types'
import useEmptyContext from '@/hooks/use-empty-context'

export default function GameContent({
  gameName,
  controls,
  scoreText,
  restart,
  isGameOver,
  difficulty,
  setDifficulty,
  gameOverMessage,
  announcement,
  resetFocus,
  children,
}: {
  gameName?: string
  controls?: string
  scoreText?: string
  restart: () => void
  isGameOver?: boolean
  difficulty?: Difficulty
  setDifficulty?: (d: Difficulty) => void
  gameOverMessage?: string
  announcement?: string
  resetFocus?: () => void
  children?: ReactNode
}) {
  const { title } = useEmptyContext()
  return (
    <>
      <Title>{title}</Title>
      <CardHeader className="text-lg font-semibold flex flex-row gap-1">
        <Button
          variant="secondary"
          onClick={() => {
            restart()
            resetFocus && resetFocus()
          }}
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
                onValueChange={(v) => setDifficulty(parseInt(v))}
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
        {controls && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link">Controls</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Controls</DialogTitle>
                {gameName && <DialogDescription>{gameName}</DialogDescription>}
              </DialogHeader>
              {controls.split('\n').map((str, idx) => (
                <p key={idx}>{str}</p>
              ))}
            </DialogContent>
          </Dialog>
        )}
        <div className="text-end grow">{scoreText}</div>
      </CardHeader>
      <CardContent>
        <div className="max-h-full min-h-fit max-w-full min-w-fit items-center flex justify-center text-3xl font-semibold">
          {children}
          {isGameOver && (
            <div className="absolute w-fit bg-background/50 rounded p-2">
              {gameOverMessage}
            </div>
          )}
          {announcement && (
            <div className="absolute w-fit bg-background/50 rounded p-2">
              {announcement}
            </div>
          )}
        </div>
      </CardContent>
    </>
  )
}
