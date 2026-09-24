import { Bomb, FlagTriangleRight, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../components/ui/button'
import type { ReactNode } from 'react'
import type { MinesweeperSettings } from '@/types'
import useEmptyContext from '@/hooks/use-empty-context'
import useMinesweeper from '@/hooks/use-minesweeper'
import { Difficulty, MineTileState } from '@/types'
import { cn } from '@/utils'
import GameContent from '@/components/game-content'
import { gradient } from '@/utils/colors'

interface ColsSettings extends MinesweeperSettings {
  gridCols: string
}

const difficultySettings: Record<Difficulty, ColsSettings> = {
  [Difficulty.BEGINNER]: {
    gridCols: 'grid-cols-9',
    width: 9,
    height: 9,
    mineCount: 10,
  },
  [Difficulty.INTERMEDIATE]: {
    gridCols: 'grid-cols-16',
    width: 16,
    height: 16,
    mineCount: 40,
  },
  [Difficulty.EXPERT]: {
    gridCols: 'grid-cols-30',
    width: 30,
    height: 16,
    mineCount: 99,
  },
}

const controls = `Left-click an empty square to reveal it.
Right-click an empty square to flag it.
Press space bar while hovering over a square to flag it or reveal its adjacent squares.
Press F2 or click the restart button to start a new game`

export default function Minesweeper() {
  const { updateActivity, wheatMessage } = useEmptyContext()
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EXPERT)
  const [hoverX, setHoverX] = useState<number>()
  const [hoverY, setHoverY] = useState<number>()
  const settings = useMemo(() => difficultySettings[difficulty], [difficulty])
  const {
    tiles,
    mines,
    reveal,
    flag,
    flagOrRevealNeighbors,
    isGameLost,
    isGameOver,
    restart,
    remaining,
  } = useMinesweeper(settings)

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    x: number,
    y: number,
  ) => {
    if (!isGameOver) {
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

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isGameOver) {
        e.preventDefault()
        if (e.key === ' ') {
          if (hoverX != undefined && hoverY != undefined) {
            flagOrRevealNeighbors(hoverX, hoverY)
          }
          updateActivity()
        } else if (e.key === 'F2') {
          restart()
          updateActivity()
        }
      }
    },
    [isGameOver, hoverX, hoverY, restart, flagOrRevealNeighbors],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const splitMessage = useMemo(
    () => (wheatMessage ? wheatMessage.toUpperCase().split('') : []),
    [wheatMessage],
  )

  return (
    <GameContent
      gameOverMessage={isGameLost ? 'You Lost!' : 'You Won!'}
      isGameOver={isGameOver}
      restart={restart}
      // gameName="Minesweeper"
      controls={controls}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      scoreText={`Mines Remaining: ${remaining}`}
    >
      <div
        className={cn(
          'grid gap-1 transition-all max-h-full min-w-fit',
          difficultySettings[difficulty].gridCols,
          isGameOver ? 'opacity-50' : '',
        )}
      >
        {tiles.flatMap((r, i) =>
          r.map((t, idx) => {
            let className = cn(
              'rounded-none flex items-center justify-center aspect-square p-0 m-0 overflow-visible',
              'max-w-full',
            )
            let content: ReactNode = <></>
            if (t == MineTileState.NOT_SEEN || !mines) {
              className = cn(
                className,
                'bg-muted-foreground opacity-50 shadow-lg',
              )
              if (isGameLost && mines && mines[i][idx] == -1) {
                content = <Bomb className="text-accent" />
              } else if (wheatMessage) {
                content =
                  splitMessage[(i * r.length + idx) % splitMessage.length]
              }
            } else if (t == MineTileState.FLAG) {
              className = cn(
                className,
                'bg-muted-foreground opacity-50 shadow-lg',
              )
              if (isGameLost && mines[i][idx] != -1) {
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
              } else if (wheatMessage) {
                content = splitMessage[(i * r.length + t) % splitMessage.length]
              }
            }
            return (
              <div
                onMouseEnter={() => {
                  setHoverX(idx)
                  setHoverY(i)
                }}
                onMouseLeave={() => {
                  setHoverX(undefined)
                  setHoverY(undefined)
                }}
              >
                <Button
                  className={className}
                  size={'sm'}
                  key={'tile-' + i + '-' + idx}
                  onClick={(e) => handleClick(e, idx, i)}
                  onContextMenu={(e) => handleClick(e, idx, i)}
                  disabled={t == MineTileState.SEEN && !isGameOver}
                >
                  {content}
                </Button>
              </div>
            )
          }),
        )}
      </div>
    </GameContent>
  )
}
