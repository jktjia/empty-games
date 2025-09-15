import { MineTileState } from "@/lib/types";
import { useCallback, useState } from "react";
import { initMines, initTiles, revealTile } from "./helpers";

export default function useMinesweeper({
    width = 30,
    height = 16,
    mineCount = 99
}: {
    width?: number,
    height?: number,
    mineCount?: number
}) {
    const [mines, setMines] = useState<number[][]>()
    const [tiles, setTiles] = useState<MineTileState[][]>(initTiles(width, height))
    const [turns, setTurns] = useState<number>(0)
    const [gameLost, setGameLost] = useState<boolean>(false)

    const restart = useCallback(() => {
        setMines(undefined)
        setTiles(initTiles(width, height))
        setGameLost(false)
        console.log(turns)
    }, [setMines, setTiles, setGameLost, turns])

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
    }, [mines, tiles, setTurns])

    const reveal = useCallback((x: number, y: number) => {
        if (!mines) {
            const newMines = initMines(x, y, width, height, mineCount)
            setMines(newMines)
            setGameLost(revealTile(x, y, height, width, newMines, tiles))
            setTurns(t => t + 1)
        } else {
            setGameLost(revealTile(x, y, height, width, mines, tiles))
            setTurns(t => t + 1)
        }
    }, [height, width, mines, tiles, setGameLost, setTurns])

    const remaining = useCallback(() => {
        return mineCount - tiles.flatMap(t => t).filter(t => t == MineTileState.FLAG).length
    }, [mineCount, tiles])

    const isGameLost = useCallback(() => {
        return gameLost
    }, [gameLost])

    const isGameWon = useCallback(() => {
        var gameWon = remaining() == 0
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

