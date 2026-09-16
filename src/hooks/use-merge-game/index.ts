import { useCallback, useMemo, useState } from 'react'
import {
    addNewTile,
    emptyTiles,
    initTiles,
    nextId,
    sameTiles,
    slideDown,
    slideLeft,
    slideRight,
    slideUp,
} from './helpers'
import type { MergeSpace } from '@/lib/types'
import { decrypt, encrypt } from '@/lib/utils'

interface MergeGameState {
    score: number
    tiles: MergeSpace[][]
    continue: boolean
}

export default function useMergeGame() {
    const [tiles, setTiles] = useState<MergeSpace[][]>(() => {
        const localTiles = localStorage.getItem('merge-game')
        return localTiles ? JSON.parse(decrypt(localTiles))['tiles'] : initTiles()
    })
    const [turns, setTurns] = useState<number>(0)
    const [score, setScore] = useState<number>(() => {
        const localTiles = localStorage.getItem('merge-game')
        return localTiles ? JSON.parse(decrypt(localTiles))['score'] : 0
    })
    const [continueWin, setContinueWin] = useState<boolean>(() => {
        const localTiles = localStorage.getItem('merge-game')
        return localTiles ? JSON.parse(decrypt(localTiles))['continue'] : false
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

    const isGameWon = useMemo(() => {
        return (!continueWin) && tiles.flatMap((t) => t).some((t) => t && t.value >= 2048)
    }, [continueWin, tiles])

    const update = useCallback(
        (newTiles: MergeSpace[][], s: number, id: number) => {
            setScore((old) => old + s)
            setTiles((t) => {
                setTurns((n) => (!sameTiles(t, newTiles) ? n + 1 : n))
                if (sameTiles(t, newTiles)) {
                    updateLocal({ tiles: t, score: score + s, continue: continueWin })
                    return t
                }
                let withNewTile = addNewTile(newTiles, id)
                updateLocal({ tiles: withNewTile, score: score + s, continue: continueWin })
                return withNewTile
            })
        },
        [setScore, setTurns, setTiles, continueWin],
    )

    const up = () => {
        const id = nextId(tiles)
        const [newTiles, s] = slideUp(tiles)
        update(newTiles, s, id)
    }

    const down = () => {
        const id = nextId(tiles)
        const [newTiles, s] = slideDown(tiles)
        update(newTiles, s, id)
    }

    const left = () => {
        const id = nextId(tiles)
        const [newTiles, s] = slideLeft(tiles)
        update(newTiles, s, id)
    }

    const right = () => {
        const id = nextId(tiles)
        const [newTiles, s] = slideRight(tiles)
        update(newTiles, s, id)
    }

    const restart = useCallback(() => {
        setTiles(initTiles())
        setScore(0)
        setContinueWin(false)
        console.log(turns)
    }, [setTiles, setScore, turns])

    const continueGame = useCallback(() => {
        setContinueWin(true)
    }, [setContinueWin])

    return { tiles, score, up, down, left, right, isGameOver, isGameWon, restart, continueGame }
}
