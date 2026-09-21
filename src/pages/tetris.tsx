import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import { gradient } from '@/utils/colors'
import { TetrisBlock } from '@/types'
import useEmptyContext from '@/hooks/use-empty-context'
import { cn } from '@/utils'
import GameContent from '@/components/game-content'
import useTetris from '@/hooks/use-tetris'
import { blockMatrices } from '@/hooks/use-tetris/consts'

const blockColors = {
  [TetrisBlock.T]: gradient[0],
  [TetrisBlock.S]: gradient[2],
  [TetrisBlock.J]: gradient[4],
  [TetrisBlock.I]: gradient[6],
  [TetrisBlock.O]: gradient[9],
  [TetrisBlock.L]: gradient[11],
  [TetrisBlock.Z]: gradient[13],
}

const defaultSettings = {
  width: 10,
  height: 20,
}

const blockBaseCN = cn(
  'rounded flex items-center justify-center aspect-square p-0 m-0',
  'max-w-full w-8 text-black text-sm ',
)

const blockEmptyCN = 'bg-muted-foreground opacity-25 shadow-lg'

function BlockMatrix({
  block,
  keyPrefix,
}: {
  keyPrefix: string
  block?: TetrisBlock
}) {
  let m = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ]
  if (block != undefined) {
    m = blockMatrices[block]
  }
  const halfN = Math.ceil(m.length / 2)
  const grid = []
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let className = cn(blockBaseCN, 'w-5')
      const mJ = j - 2 + halfN
      const mI = i - 2 + halfN
      if (
        block != undefined &&
        mI >= 0 &&
        mI < m.length &&
        mJ >= 0 &&
        mJ < m[mI].length &&
        m[mI][mJ]
      ) {
        className = cn(className, blockColors[block])
      }
      grid.push(<div className={className} key={`${keyPrefix}-${i}-${j}`} />)
    }
  }

  return (
    <div
      className={cn(
        'grid gap-1 transition-all max-h-full min-h-max',
        'grid-cols-4',
      )}
    >
      {grid.map((t) => t)}
    </div>
  )
}

export default function Tetris() {
  const { updateActivity, message } = useEmptyContext()
  const {
    visibleTiles,
    held,
    next,
    ghost,
    level,
    score,
    isGameOver,
    left,
    right,
    hold,
    rotate,
    hardDown,
    setSoftDown,
    restart,
    paused,
    togglePause,
  } = useTetris(defaultSettings)

  const splitMessage = useMemo(
    () => (message ? message.toUpperCase().split('') : []),
    [message],
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      rotate()
    } else if (e.key === ' ') {
      hardDown()
    } else if (e.key === 'ArrowLeft') {
      left()
    } else if (e.key === 'ArrowRight') {
      right()
    } else if (e.key === 'c') {
      hold()
    } else if (e.key === 'ArrowDown') {
      setSoftDown(true)
    } else if (e.key === 'Escape') {
      togglePause()
    }
    updateActivity()
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setSoftDown(false)
    }
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
      gameOverMessage={'You Lost!'}
      isGameOver={isGameOver}
      restart={restart}
      // gameName="Minesweeper"
      // rules="minesweeper rules here"
      scoreText={`Level: ${level}   Score: ${score}`}
      resetFocus={focusGrid}
    >
      <div
        className="flex flex-row items-start gap-4 text-xl"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        tabIndex={0}
        ref={gridRef}
        autoFocus
      >
        <div className="flex flex-col gap-4">
          Hold
          <BlockMatrix block={held} keyPrefix="held" />
        </div>
        <div
          className={cn(
            'grid gap-1 transition-all max-h-full min-h-max',
            'grid-cols-' + defaultSettings.width,
            'grid-rows-' + defaultSettings.height,
          )}
        >
          {visibleTiles.flatMap((r, i) =>
            r.map((t, idx) => {
              let className = blockBaseCN
              let content: ReactNode = <></>
              if (t != null && !paused) {
                className = cn(className, blockColors[t])
              } else if (
                ghost.some(({ x, y }) => y == i && x == idx) &&
                !paused
              ) {
                className = cn(
                  className,
                  'bg-muted-foreground opacity-50 shadow-lg',
                )
              } else {
                className = cn(className, blockEmptyCN)
              }
              if (message) {
                content =
                  splitMessage[(i * r.length + idx) % splitMessage.length]
              }
              return (
                <div className={className} key={'tile-' + i + '-' + idx}>
                  {content}
                </div>
              )
            }),
          )}
        </div>
        <div className="flex flex-col gap-4">
          Next
          <div>
            {next.slice(0, 3).map((n, idx) => (
              <BlockMatrix block={n} keyPrefix={`next-${idx}`} key={idx} />
            ))}
          </div>
        </div>
        {paused && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="bg-background/50 rounded p-2 w-fit">Paused</div>
          </div>
        )}
      </div>
    </GameContent>
  )
}
