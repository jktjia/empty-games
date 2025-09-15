import { useCallback, useMemo, useState } from "react"
import { addNewTile, emptyTiles, initTiles, sameTiles, slideDown, slideLeft, slideRight, slideUp } from "./helpers"

export default function useMergeGame() {
    const [tiles, setTiles] = useState<number[][]>(initTiles())
    const [turns, setTurns] = useState<number>(0)
    const [score, setScore] = useState<number>(0)

    const isGameOver = useMemo(() => {
        let gameOver = emptyTiles(tiles) == 0
        gameOver = gameOver && sameTiles(tiles, slideUp(tiles)[0])
        gameOver = gameOver && sameTiles(tiles, slideDown(tiles)[0])
        gameOver = gameOver && sameTiles(tiles, slideLeft(tiles)[0])
        gameOver = gameOver && sameTiles(tiles, slideRight(tiles)[0])
        return gameOver
    }, [tiles])

    const update = useCallback((newTiles: number[][], s: number) => {
        setScore(old => old + s)
        setTiles(t => {
            setTurns(n => !sameTiles(t, newTiles) ? n + 1 : n)
            return !sameTiles(t, newTiles) ? addNewTile(newTiles) : t
        })
    }, [setScore, setTurns, setTiles])

    const up = () => {
        const [newTiles, s] = slideUp(tiles)
        update(newTiles, s)
    }

    const down = () => {
        const [newTiles, s] = slideDown(tiles)
        update(newTiles, s)
    }

    const left = () => {
        const [newTiles, s] = slideLeft(tiles)
        update(newTiles, s)
    }

    const right = () => {
        const [newTiles, s] = slideRight(tiles)
        update(newTiles, s)
    }

    const restart = useCallback(() => {
        setTiles(initTiles())
        setScore(0)
        console.log(turns)
    }, [setTiles, setScore, turns])

    return { tiles, score, up, down, left, right, isGameOver, restart }
}

