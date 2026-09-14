import {
  ViewTransition,
  startTransition,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import useMergeGame from '@/hooks/use-merge-game'
import useEmptyContext from '@/hooks/use-empty-context'
import GameContent from '@/components/game-content'
import { gradient } from '@/lib/colors'
import { cn } from '@/lib/utils'

export default function MergeGame() {
  const { updateActivity } = useEmptyContext()
  const { tiles, score, up, down, left, right, isGameOver, restart } =
    useMergeGame()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    startTransition(() => {
      if (e.key === 'ArrowUp') {
        up()
      } else if (e.key === 'ArrowDown') {
        down()
      } else if (e.key === 'ArrowLeft') {
        left()
      } else if (e.key === 'ArrowRight') {
        right()
      }
      updateActivity()
    })
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
      isGameOver={isGameOver}
      restart={restart}
      scoreText={`Score: ${score}`}
      resetFocus={focusGrid}
    >
      <div
        className={cn(
          'grid grid-cols-4 gap-2 transition-all text-xl w-full p-2',
          isGameOver ? ' opacity-50' : '',
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
    </GameContent>
  )
}
