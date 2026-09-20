import { ViewTransition, useCallback, useEffect, useRef } from 'react'
import useMergeGame from '@/hooks/use-merge-game'
import useEmptyContext from '@/hooks/use-empty-context'
import GameContent from '@/components/game-content'
import { gradient } from '@/utils/colors'
import { cn } from '@/utils'
import { Button } from '@/components/ui/button'

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
    >
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
              <ViewTransition key={t.id + ''} name={t.id + ''}>
                <div
                  className={`rounded ${
                    gradient[Math.min(Math.log2(t.value), gradient.length)] +
                    ' shadow-lg text-black'
                  } aspect-square flex items-center justify-center`}
                  key={'tile-' + i + '-' + idx}
                >
                  {t.value}
                </div>
              </ViewTransition>
            ) : (
              <div
                className={`rounded bg-secondary text-gray-500 aspect-square flex items-center justify-center`}
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
            className="bg-background/50 text-white"
            onClick={continueGame}
          >
            Continue
          </Button>
        </div>
      )}
    </GameContent>
  )
}
