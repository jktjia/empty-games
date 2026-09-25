import { ViewTransition, useCallback, useEffect, useRef } from 'react'
import useMergeGame from '@/hooks/use-merge-game'
import useEmptyContext from '@/hooks/use-empty-context'
import GameContent from '@/components/game-content'
import { gradient } from '@/utils/colors'
import { cn } from '@/utils'
import { Button } from '@/components/ui/button'

const controls = `Use arrow keys to move the tiles.
When two tiles having the same number touch, they join into one.`

const tileBaseCN = cn(
  'flex items-center justify-center aspect-square p-0 m-0',
  'max-w-full text-black ',
)

const tileEmptyCN = 'bg-muted-foreground opacity-25 shadow-lg'

export default function MergeGame() {
  const { updateActivity } = useEmptyContext()
  const {
    tiles,
    score,
    up,
    down,
    left,
    right,
    isGameOver,
    isGameLost,
    isGameWon,
    restart,
    continueGame,
  } = useMergeGame()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'w') {
      up()
    } else if (e.key === 'ArrowDown' || e.key === 's') {
      down()
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
      left()
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      right()
    }
    updateActivity()
  }

  const gridRef = useRef<HTMLDivElement>(null)
  const focusGrid = useCallback(() => {
    gridRef.current?.focus()
  }, [])

  useEffect(() => {
    gridRef.current?.focus()
  }, [])

  return (
    <GameContent
      gameOverMessage="Game Over!"
      isGameOver={isGameLost}
      restart={restart}
      scoreText={`Score: ${score}`}
      resetFocus={focusGrid}
      controls={controls}
    >
      <ViewTransition>
        <div
          className={cn(
            'grid grid-cols-4 gap-2 transition-all text-xl w-full',
            isGameOver() ? ' opacity-50' : '',
          )}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          ref={gridRef}
          autoFocus
        >
          {tiles.flatMap((r, i) =>
            r.map((t, idx) =>
              t ? (
                <div
                  className={cn(
                    tileBaseCN,
                    gradient[Math.min(Math.log2(t.value), gradient.length)],
                  )}
                  key={'tile-' + i + '-' + idx}
                  style={{ viewTransitionName: 'tile-' + t.id }}
                >
                  {t.value}
                </div>
              ) : (
                <div
                  className={cn(tileBaseCN, tileEmptyCN)}
                  key={'tile-' + i + '-' + idx}
                />
              ),
            ),
          )}
        </div>
        {isGameWon && (
          <div className="absolute w-fit flex flex-col gap-2">
            <div className="bg-background/50 rounded p-2">Game Won!</div>
            <Button
              className="bg-background/50 text-primary"
              onClick={continueGame}
            >
              Continue
            </Button>
          </div>
        )}
      </ViewTransition>
    </GameContent>
  )
}
