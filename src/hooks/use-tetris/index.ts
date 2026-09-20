import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    canMoveDown,
    canMoveLeft,
    canMoveRight,
    clearRows,
    currentValid,
    ghostCoords,
    ghostLocation,
    initTiles,
    placeCurrent,
    randomBlock,
    rotateSRSKick,
} from './helpers'
import type { TetrisSpace, WidthHeightSettings } from '@/lib/types'
import { TetrisBlock } from '@/lib/types'
import { decrypt, encrypt } from '@/lib/utils'

interface TetrisState {
    tiles: TetrisSpace[][]
    matrix: boolean[][]
    block: TetrisBlock
    x: number
    y: number
    hold?: TetrisBlock
    next: TetrisBlock[]
    width: number
    height: number
    score: number
}

export const blockMatrices = {
    [TetrisBlock.T]: [
        [false, true, false],
        [true, true, true],
        [false, false, false],
    ],
    [TetrisBlock.I]: [
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, true, true, true, true],
        [false, false, false, false, false],
        [false, false, false, false, false],
    ],
    [TetrisBlock.J]: [
        [true, false, false],
        [true, true, true],
        [false, false, false],
    ],
    [TetrisBlock.L]: [
        [false, false, true],
        [true, true, true],
        [false, false, false],
    ],
    [TetrisBlock.S]: [
        [false, true, true],
        [true, true, false],
        [false, false, false],
    ],
    [TetrisBlock.Z]: [
        [true, true, false],
        [false, true, true],
        [false, false, false],
    ],
    [TetrisBlock.O]: [
        [false, true, true],
        [false, true, true],
        [false, false, false],
    ],
}

const scoreRowsCleared = [0, 100, 300, 500, 800]
const rowsClearedPerLevel = 10

export default function useTetris(
    { width, height }: WidthHeightSettings = { width: 10, height: 20 },
) {
    const [tiles, setTiles] = useState<TetrisSpace[][]>(() => {
        const localTiles = localStorage.getItem('tetris')
        const matchingSettings =
            localTiles &&
            JSON.parse(decrypt(localTiles))['width'] == width &&
            JSON.parse(decrypt(localTiles))['height'] == height
        return localTiles && matchingSettings
            ? JSON.parse(decrypt(localTiles))['tiles']
            : initTiles(width, height)
    })
    const [currBlock, setCurrBlock] = useState<TetrisBlock>(() => {
        const localTiles = localStorage.getItem('tetris')
        const matchingSettings =
            localTiles &&
            JSON.parse(decrypt(localTiles))['width'] == width &&
            JSON.parse(decrypt(localTiles))['height'] == height
        return localTiles && matchingSettings
            ? JSON.parse(decrypt(localTiles))['block']
            : randomBlock()
    })
    const [current, setCurrent] = useState<boolean[][]>(() => {
        const localTiles = localStorage.getItem('tetris')
        const matchingSettings =
            localTiles &&
            JSON.parse(decrypt(localTiles))['width'] == width &&
            JSON.parse(decrypt(localTiles))['height'] == height
        return localTiles && matchingSettings
            ? JSON.parse(decrypt(localTiles))['matrix']
            : blockMatrices[currBlock]
    })
    const [currX, setCurrX] = useState<number>(() => {
        const localTiles = localStorage.getItem('tetris')
        const matchingSettings =
            localTiles &&
            JSON.parse(decrypt(localTiles))['width'] == width &&
            JSON.parse(decrypt(localTiles))['height'] == height
        return localTiles && matchingSettings
            ? JSON.parse(decrypt(localTiles))['x']
            : width / 2 - 1
    })
    const [currY, setCurrY] = useState<number>(() => {
        const localTiles = localStorage.getItem('tetris')
        const matchingSettings =
            localTiles &&
            JSON.parse(decrypt(localTiles))['width'] == width &&
            JSON.parse(decrypt(localTiles))['height'] == height
        return localTiles && matchingSettings
            ? JSON.parse(decrypt(localTiles))['y']
            : 0
    })
    const [held, setHeld] = useState<TetrisBlock | undefined>(() => {
        const localTiles = localStorage.getItem('tetris')
        const matchingSettings =
            localTiles &&
            JSON.parse(decrypt(localTiles))['width'] == width &&
            JSON.parse(decrypt(localTiles))['height'] == height
        return localTiles && matchingSettings
            ? JSON.parse(decrypt(localTiles))['hold']
            : undefined
    })
    const [next, setNext] = useState<TetrisBlock[]>(() => {
        const localTiles = localStorage.getItem('tetris')
        const matchingSettings =
            localTiles &&
            JSON.parse(decrypt(localTiles))['width'] == width &&
            JSON.parse(decrypt(localTiles))['height'] == height
        return localTiles && matchingSettings
            ? JSON.parse(decrypt(localTiles))['next']
            : [randomBlock(), randomBlock(), randomBlock()]
    })
    const [score, setScore] = useState<number>(() => {
        const localTiles = localStorage.getItem('tetris')
        const matchingSettings =
            localTiles &&
            JSON.parse(decrypt(localTiles))['width'] == width &&
            JSON.parse(decrypt(localTiles))['height'] == height
        return localTiles && matchingSettings
            ? JSON.parse(decrypt(localTiles))['score']
            : 0
    })

    const [softDown, setSoftDown] = useState<boolean>(false)
    const [updateNow, setUpdateNow] = useState<boolean>(false)
    const [ticker, setTicker] = useState<number>(0)
    const [rowsCleared, setRowsCleared] = useState<number>(0)
    const [isGameLost, setGameLost] = useState<boolean>(false)

    useEffect(() => {
        const state: TetrisState = {
            tiles,
            matrix: current,
            block: currBlock,
            x: currX,
            y: currY,
            hold: held,
            next,
            width,
            height,
            score,
        }
        const strState = encrypt(JSON.stringify(state))
        localStorage.setItem('tetris', strState)
    }, [tiles, current, currX, currY, held, next, score])

    const restart = useCallback(() => {
        const newTiles = initTiles(width, height)
        setTiles(newTiles)
        const firstBlock = randomBlock()
        setCurrBlock(firstBlock)
        setCurrent(blockMatrices[firstBlock])
        setCurrX(width / 2 - 1)
        setCurrY(0)
        setHeld(undefined)
        setNext([randomBlock(), randomBlock(), randomBlock()])
        setScore(0)
        setRowsCleared(0)
        setGameLost(false)
    }, [
        setTiles,
        setCurrBlock,
        setCurrent,
        setCurrX,
        setCurrY,
        setHeld,
        setNext,
        setScore,
    ])

    const left = useCallback(() => {
        if (!isGameLost) {
            setCurrX((x) => {
                if (canMoveLeft(tiles, current, x, currY)) {
                    return x - 1
                } else {
                    return x
                }
            })
        }
    }, [isGameLost, setCurrX, tiles, current, currY])

    const right = useCallback(() => {
        if (!isGameLost) {
            setCurrX((x) => {
                if (canMoveRight(tiles, current, x, currY)) {
                    return x + 1
                } else {
                    return x
                }
            })
        }
    }, [isGameLost, setCurrX, tiles, current, currY])

    const updateNext = useCallback(() => {
        setNext((n) => {
            return [n[1], n[2], randomBlock()]
        })
    }, [setNext])

    const hold = useCallback(() => {
        if (!isGameLost) {
            if (held != undefined) {
                setCurrent(blockMatrices[held])
                setCurrBlock((c) => {
                    setHeld(c)
                    return held
                })
            } else {
                const newCurr = next[0]
                setCurrent(blockMatrices[newCurr])
                setCurrBlock((c) => {
                    setHeld(c)
                    return newCurr
                })
                updateNext()
            }
        }
    }, [isGameLost, setHeld, setCurrent, setCurrBlock, next, updateNext])

    const rotate = useCallback(() => {
        if (!isGameLost) {
            const { rotated, x, y } = rotateSRSKick(tiles, current, currBlock, currX, currY)
            setCurrent(rotated)
            setCurrX(x)
            setCurrY(y)
        }
    }, [isGameLost, tiles, current, currX, currY])

    const newBlock = useCallback(() => {
        const newCurr = next[0]
        setCurrent(blockMatrices[newCurr])
        setCurrBlock(newCurr)
        setCurrX(width / 2 - 1)
        setCurrY(0)
        updateNext()
        if (!currentValid(tiles, blockMatrices[newCurr], width / 2 - 1, 0)) {
            setGameLost(true)
        }
    }, [next, setCurrent, setCurrBlock, setCurrX, setCurrY, updateNext])

    const addCurrentToTiles = useCallback(() => {
        const updated = clearRows(
            placeCurrent(tiles, current, currX, currY, currBlock),
        )
        setTiles(updated.tiles)
        setScore((s) => s + level * scoreRowsCleared[updated.rowsCleared])
        setRowsCleared((r) => r + updated.rowsCleared)
        newBlock()
    }, [setTiles, current, currX, currY, currBlock, newBlock])

    const hardDown = useCallback(() => {
        if (!isGameLost) {
            const newY = ghostLocation(tiles, current, currX, currY)
            const updated = clearRows(
                placeCurrent(tiles, current, currX, newY, currBlock),
            )
            setTiles(updated.tiles)
            setScore(
                (s) =>
                    s +
                    2 * (newY - currY) +
                    level * scoreRowsCleared[updated.rowsCleared],
            )
            setRowsCleared((r) => r + updated.rowsCleared)
            newBlock()
        }
    }, [isGameLost, setTiles, current, currX, currY, currBlock, newBlock])

    const visibleTiles = useMemo(() => {
        return placeCurrent(tiles, current, currX, currY, currBlock)
    }, [tiles, current, currX, currY, currBlock])

    useEffect(() => {
        if (updateNow && !isGameLost) {
            if (canMoveDown(tiles, current, currX, currY)) {
                setCurrY((y) => y + 1)
                if (softDown) {
                    setScore((s) => s + 1)
                }
            } else {
                addCurrentToTiles()
            }

            setTicker((t) => t + 1)
            setUpdateNow(false)
        }
    }, [
        updateNow,
        isGameLost,
        setTimeout,
        tiles,
        current,
        currX,
        currY,
        addCurrentToTiles,
    ])

    useEffect(() => {
        if (!isGameLost) {
            let tickTime = 1000 * Math.pow(0.8, level)
            console.log(tickTime)
            if (softDown) {
                tickTime = tickTime / 5
            }
            const timeout = setTimeout(() => {
                setUpdateNow(true)
            }, tickTime)

            return () => clearTimeout(timeout)
        }
    }, [, softDown, rowsCleared, ticker])

    const ghost = useMemo(() => {
        const g = ghostCoords(tiles, current, currX, currY)
        console.log(g)
        return g
    }, [tiles, current, currX])

    const level = useMemo(
        () => Math.floor(rowsCleared / rowsClearedPerLevel),
        [rowsCleared],
    )

    return {
        visibleTiles,
        held,
        next,
        ghost,
        level,
        score,
        isGameLost,
        left,
        right,
        hold,
        rotate,
        hardDown,
        setSoftDown,
        restart,
    }
}
