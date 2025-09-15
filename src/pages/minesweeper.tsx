import { CardContent, CardHeader } from '../components/ui/card'
import { Button } from '../components/ui/button'
import useEmptyContext from '@/hooks/use-empty-context'
import useMinesweeper from '@/hooks/use-minesweeper'
import { Bomb, FlagTriangleRight, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { MineTileState } from '@/lib/types'
import { cn } from '@/lib/utils'

const tileColors = [
  //   'bg-[#3c1c4a]',
  'bg-[#574084]',
  //   'bg-[#655ec0]',
  'bg-[#5a78e3]',
  //   'bg-[#549fff]',
  'bg-[#4fd8ff]',
  //   'bg-[#7fffff]',
  'bg-[#bfffff]',
  //   'bg-[#ffffff]',
  'bg-[#ffdaef]',
  //   'bg-[#ffa8df]',
  'bg-[#ef60bf]',
  //   'bg-[#e716ac]',
  'bg-[#991674]',
  //   'bg-[#5c024a]',
  'bg-[#300020]',
]

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
      console.log(e.button, x, y)
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
    <>
      <CardHeader className="text-xl font-semibold flex flex-row">
        <Button
          variant="secondary"
          onClick={restart}
          className="hover:cursor-pointer"
        >
          Restart
        </Button>
        <div className="text-end flex-grow">Mines Remaining: {remaining()}</div>
      </CardHeader>
      <CardContent className="min-w-fit">
        <div className="relative w-fit">
          <div
            className={`grid grid-cols-30 gap-1 transition-all text-xl p-2${
              isGameOver() ? ' opacity-50' : ''
            }`}
          >
            {tiles.flatMap((r, i) =>
              r.map((t, idx) => {
                var className =
                  'rounded flex items-center justify-center aspect-square p-0 m-0 overflow-clip '
                var content: ReactNode = <></>
                if (t == MineTileState.NOT_SEEN || !mines) {
                  className = cn(
                    className,
                    'bg-muted-foreground opacity-50 shadow-lg',
                  )
                  if (isGameLost() && mines && mines[i][idx] == -1) {
                    content = <Bomb className="text-accent max-w-full" />
                  }
                } else if (t == MineTileState.FLAG) {
                  className = cn(
                    className,
                    'bg-muted-foreground opacity-50 shadow-lg',
                  )
                  if (isGameLost() && mines && mines[i][idx] != -1) {
                    content = <X className="text-accent max-w-full" />
                  } else {
                    content = (
                      <FlagTriangleRight className="text-accent max-w-full" />
                    )
                  }
                } else {
                  className = cn(
                    className,
                    'text-black disabled:opacity-100',
                    mines[i][idx] == 0
                      ? 'bg-background'
                      : tileColors[mines[i][idx] - 1],
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
          {isGameOver() && (
            <div className="absolute bottom-1/2 w-full flex justify-center text-3xl font-semibold">
              <div className="w-fit bg-background rounded p-2 opacity-75">
                {isGameLost() ? 'You Lost!' : 'You Won!'}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </>
  )
}
