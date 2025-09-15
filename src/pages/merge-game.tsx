import useMergeGame from '@/hooks/use-merge-game'
import { CardContent, CardHeader } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useCallback } from 'react'
import useEmptyContext from '@/hooks/use-empty-context'

const gradient = [
  'bg-[#3c1c4a]',
  'bg-[#574084]',
  'bg-[#655ec0]',
  'bg-[#5a78e3]',
  'bg-[#549fff]',
  'bg-[#4fd8ff]',
  'bg-[#7fffff]',
  'bg-[#bfffff]',
  'bg-[#ffffff]',
  'bg-[#ffdaef]',
  'bg-[#ffa8df]',
  'bg-[#ef60bf]',
  'bg-[#e716ac]',
  'bg-[#991674]',
  'bg-[#5c024a]',
  'bg-[#300020]',
]

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

  const refFocus = useCallback((inputElement: HTMLDivElement) => {
    if (inputElement) {
      inputElement.focus()
    }
  }, [])

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
        <div className="text-end flex-grow">Score: {score}</div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full">
          <div
            className={`grid grid-cols-4 gap-2 transition-all text-xl p-2${
              isGameOver ? ' opacity-50' : ''
            }`}
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
          {isGameOver && (
            <div className="absolute bottom-1/2 w-full text-center text-3xl font-semibold">
              Game Over!
            </div>
          )}
        </div>
      </CardContent>
    </>
  )
}
