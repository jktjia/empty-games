import { Bomb, FlagTriangleRight, X } from 'lucide-react'
import { Button } from '../components/ui/button'
import type { ReactNode } from 'react'
import useEmptyContext from '@/hooks/use-empty-context'
import useMinesweeper from '@/hooks/use-minesweeper'
import { MineTileState } from '@/lib/types'
import { cn } from '@/lib/utils'
import GameContent from '@/components/game-content'
import { gradient } from '@/lib/colors'

export default function Minesweeper() {
  const { updateActivity } = useEmptyContext()
  const {
    tiles,
    mines,
    reveal,
    flag,
    isGameLost,
    isGameOver,
    restart,
    remaining,
  } = useMinesweeper({})

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    x: number,
    y: number,
  ) => {
    if (!isGameOver()) {
      e.preventDefault()
      if (e.button === 0) {
        reveal(x, y)
      } else if (e.button === 2) {
        flag(x, y)
      }
    } else {
      restart()
    }
    updateActivity()
  }

  return (
    <GameContent
      gameOverMessage={isGameLost() ? 'You Lost!' : 'You Won!'}
      isGameOver={isGameOver()}
      restart={restart}
      // gameName="Minesweeper"
      // rules="minesweeper rules here"
      scoreText={`Mines Remaining: ${remaining()}`}
    >
      <div
        className={cn(
          'grid grid-cols-30 gap-1 transition-all max-h-full min-w-4xl',
          isGameOver() ? 'opacity-50' : '',
        )}
      >
        {tiles.flatMap((r, i) =>
          r.map((t, idx) => {
            let className = cn(
              'rounded flex items-center justify-center aspect-square p-0 m-0 overflow-visible',
              'max-w-full',
            )
            let content: ReactNode = <></>
            if (t == MineTileState.NOT_SEEN || !mines) {
              className = cn(
                className,
                'bg-muted-foreground opacity-50 shadow-lg',
              )
              if (isGameLost() && mines && mines[i][idx] == -1) {
                content = <Bomb className="text-accent" />
              }
            } else if (t == MineTileState.FLAG) {
              className = cn(
                className,
                'bg-muted-foreground opacity-50 shadow-lg',
              )
              if (isGameLost() && mines[i][idx] != -1) {
                content = <X className="text-accent" />
              } else {
                content = <FlagTriangleRight className="text-accent" />
              }
            } else {
              className = cn(
                className,
                'text-black disabled:opacity-100',
                mines[i][idx] == 0
                  ? 'bg-background'
                  : gradient[(mines[i][idx] - 1) * 2 + 1],
              )
              if (mines[i][idx] > 0) {
                content = mines[i][idx]
              }
            }
            return (
              <Button
                className={className}
                key={'tile-' + i + '-' + idx}
                onClick={(e) => handleClick(e, idx, i)}
                onContextMenu={(e) => handleClick(e, idx, i)}
                disabled={t == MineTileState.SEEN && !isGameOver()}
              >
                {content}
              </Button>
            )
          }),
        )}
      </div>
    </GameContent>
  )
}
