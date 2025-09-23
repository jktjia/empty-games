import { useCallback, useMemo, useState } from "react"
import { addNewTile, emptyTiles, initTiles, sameTiles, slideDown, slideLeft, slideRight, slideUp } from "./helpers"
import { decrypt, encrypt } from "@/lib/utils"

interface MergeGameState {
    score: number
    tiles: number[][]
}

export default function useMergeGame() {
    const [tiles, setTiles] = useState<number[][]>(() => {
        const localMines = localStorage.getItem('merge-game')
        return localMines ? JSON.parse(decrypt(localMines))['tiles'] : initTiles()
    })
    const [turns, setTurns] = useState<number>(0)
    const [score, setScore] = useState<number>(() => {
        const localMines = localStorage.getItem('merge-game')
        return localMines ? JSON.parse(decrypt(localMines))['score'] : 0
    })

    const updateLocal = (state: MergeGameState) => {
        const strState = encrypt(JSON.stringify(state))
        localStorage.setItem('merge-game', strState)
    }

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
        updateLocal({ tiles: newTiles, score: score + s })
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

