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
}

export default function useMergeGame() {
    const [tiles, setTiles] = useState<MergeSpace[][]>(() => {
        const localTiles = localStorage.getItem('merge-game')
        return localTiles ? JSON.parse(decrypt(localTiles))['tiles'] : initTiles()
        // return initTiles()
    })
    const [turns, setTurns] = useState<number>(0)
    const [score, setScore] = useState<number>(() => {
        const localTiles = localStorage.getItem('merge-game')
        return localTiles ? JSON.parse(decrypt(localTiles))['score'] : 0
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

    const update = useCallback(
        (newTiles: MergeSpace[][], s: number, id: number) => {
            setScore((old) => old + s)
            setTiles((t) => {
                setTurns((n) => (!sameTiles(t, newTiles) ? n + 1 : n))
                if (sameTiles(t, newTiles)) {
                    updateLocal({ tiles: t, score: score + s })
                    return t
                }
                let withNewTile = addNewTile(newTiles, id)
                updateLocal({ tiles: withNewTile, score: score + s })
                return withNewTile
            })
        },
        [setScore, setTurns, setTiles],
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
        console.log(turns)
    }, [setTiles, setScore, turns])

    return { tiles, score, up, down, left, right, isGameOver, restart }
}
