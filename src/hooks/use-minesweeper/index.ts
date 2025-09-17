import { useCallback, useState } from "react";
import { initMines, initTiles, revealTile } from "./helpers";
import { MineTileState } from "@/lib/types";
import { decrypt, encrypt } from "@/lib/utils";

interface MinesweeperState {
    mines?: number[][]
    tiles: MineTileState[][]
}

export default function useMinesweeper({
    width = 30,
    height = 16,
    mineCount = 99
}: {
    width?: number,
    height?: number,
    mineCount?: number
}) {
    const [mines, setMines] = useState<number[][] | undefined>(() => {
        const localMines = localStorage.getItem('minesweeper')
        return localMines ? JSON.parse(decrypt(localMines))['mines'] : undefined
    })
    const [tiles, setTiles] = useState<MineTileState[][]>(() => {
        const localMines = localStorage.getItem('minesweeper')
        if (localMines) {
            console.log(JSON.parse(decrypt(localMines))['tiles'])
        }
        return localMines ? JSON.parse(decrypt(localMines))['tiles'] : initTiles(width, height)
    })
    const [turns, setTurns] = useState<number>(0)

    const updateLocal = (state: MinesweeperState) => {
        const strState = encrypt(JSON.stringify(state))
        localStorage.setItem('minesweeper', strState)
    }

    const restart = useCallback(() => {
        setMines(undefined)
        const newTiles = initTiles(width, height)
        setTiles(newTiles)
        updateLocal({ mines: undefined, tiles: newTiles })
        console.log(turns)
    }, [setMines, setTiles, updateLocal, turns])

    const flag = useCallback((x: number, y: number) => {
        if (mines) {
            const current = tiles[y][x]
            if (current == MineTileState.FLAG) {
                tiles[y][x] = MineTileState.NOT_SEEN
                setTurns(t => t + 1)
            } else if (current == MineTileState.NOT_SEEN) {
                tiles[y][x] = MineTileState.FLAG
                setTurns(t => t + 1)
            }
        }
        updateLocal({ mines: mines, tiles: tiles })
    }, [mines, tiles, setTurns, updateLocal])

    const reveal = useCallback((x: number, y: number) => {
        if (!mines) {
            const newMines = initMines(x, y, width, height, mineCount)
            setMines(newMines)
            const newTiles = revealTile(x, y, height, width, newMines, tiles)
            setTiles(newTiles)
            setTurns(t => t + 1)
            updateLocal({ mines: newMines, tiles: newTiles })
        } else {
            const newTiles = revealTile(x, y, height, width, mines, tiles)
            setTiles(newTiles)
            setTurns(t => t + 1)
            updateLocal({ mines: mines, tiles: newTiles })
        }
    }, [height, width, mines, tiles, setTiles, setTurns, updateLocal])

    const remaining = useCallback(() => {
        return mineCount - tiles.flatMap(t => t).filter(t => t == MineTileState.FLAG).length
    }, [mineCount, tiles])

    const isGameLost = useCallback(() => {
        return mines && tiles.some((r, i) => r.some((t, idx) => t == MineTileState.SEEN && mines[i][idx] == -1))
    }, [mines, tiles])

    const isGameWon = useCallback(() => {
        let gameWon = remaining() == 0
        gameWon = gameWon && tiles.flatMap(t => t).filter(t => t == MineTileState.NOT_SEEN).length == 0
        return gameWon
    }, [remaining, tiles])

    const isGameOver = useCallback(() => {
        return isGameLost() || isGameWon()
    }, [isGameLost, isGameWon])

    return {
        width,
        height,
        mines,
        tiles,
        flag,
        reveal,
        restart,
        remaining,
        isGameLost,
        isGameWon,
        isGameOver
    }
}

