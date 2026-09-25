import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import { gradient } from '@/utils/colors'
import { SnakeTileState } from '@/types'
import useEmptyContext from '@/hooks/use-empty-context'
import { cn } from '@/utils'
import GameContent from '@/components/game-content'
import useSnake from '@/hooks/use-snake'

const tileColors = {
  [SnakeTileState.APPLE]: gradient[13],
  [SnakeTileState.HEAD]: gradient[6],
  [SnakeTileState.BODY]: gradient[5],
}

const controls = `Use arrow keys to change directions 
Eat apples to grow longer
Do not hit the walls or part of the snake`

const defaultSettings = {
  width: 20,
  height: 15,
}

const tileBaseCN = cn(
  'flex items-center justify-center aspect-square p-0 m-0',
  'max-w-full w-8 text-black text-sm ',
)

const tileEmptyCN = 'bg-muted-foreground opacity-25 shadow-lg'

export default function Snake() {
  const { updateActivity, wheatMessage } = useEmptyContext()
  const {
    tiles,
    score,
    up,
    down,
    left,
    right,
    isGameOver,
    isGameLost,
    restart,
    paused,
    togglePause,
  } = useSnake()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isGameOver) {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        up()
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        down()
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        left()
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        right()
      } else if (e.key === 'Escape') {
        togglePause()
      }
    } else {
      restart()
    }
    updateActivity()
  }

  const splitMessage = useMemo(
    () => (wheatMessage ? wheatMessage.toUpperCase().split('') : []),
    [wheatMessage],
  )

  const gridRef = useRef<HTMLDivElement>(null)
  const focusGrid = useCallback(() => {
    gridRef.current?.focus()
  }, [])

  useEffect(() => {
    gridRef.current?.focus()
  }, [])
  return (
    <GameContent
      gameOverMessage={isGameLost ? 'You Lost!' : 'You Won!'}
      isGameOver={isGameOver}
      restart={restart}
      // gameName="Minesweeper"
      controls={controls}
      scoreText={`Score: ${score}`}
      resetFocus={focusGrid}
      announcement={paused ? 'Paused' : undefined}
    >
      <div
        className={cn(
          'grid gap-1 transition-all max-h-full min-h-max',
          'grid-cols-20',
          'grid-rows-' + defaultSettings.height,
        )}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={gridRef}
        autoFocus
      >
        {tiles.flatMap((r, i) =>
          r.map((t, idx) => {
            let className = tileBaseCN
            let content: ReactNode = <></>
            if (t != null && !paused) {
              className = cn(className, tileColors[t])
            } else {
              className = cn(className, tileEmptyCN)
            }
            if (wheatMessage) {
              content = splitMessage[(i * r.length + idx) % splitMessage.length]
            }
            return (
              <div className={className} key={'tile-' + i + '-' + idx}>
                {content}
              </div>
            )
          }),
        )}
      </div>
    </GameContent>
  )
}
