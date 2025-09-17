import { useCallback } from 'react'
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
  }

  const refFocus = useCallback((inputElement: HTMLDivElement | null) => {
    if (inputElement) {
      inputElement.focus()
    }
  }, [])

  return (
    <GameContent
      gameOverMessage="Game Over!"
      isGameOver={isGameOver}
      restart={restart}
      scoreText={`Score: ${score}`}
    >
      <div
        className={cn(
          'grid grid-cols-4 gap-2 transition-all text-xl w-full p-2',
          isGameOver ? ' opacity-50' : '',
        )}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={refFocus}
      >
        {tiles.flatMap((r, i) =>
          r.map((t, idx) => (
            <div
              className={`rounded ${
                t > 0
                  ? gradient[Math.min(Math.log2(t), gradient.length)] +
                    ' shadow-lg text-black'
                  : 'bg-secondary text-gray-500'
              } aspect-square flex items-center justify-center`}
              key={'tile-' + i + '-' + idx}
            >
              {t}
            </div>
          )),
        )}
      </div>
    </GameContent>
  )
}
