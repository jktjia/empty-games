export function sameTiles(t1: number[][], t2: number[][]): boolean {
    // if (!validTiles(t1) || !validTiles(t2)) {
    //     throw new Error('invalid 2048 tiles')
    // }
    var same = true
    for (var i = 0; i < t1.length; i++) {
        for (let j = 0; j < t1[i].length; j++) {
            same = same && t1[i][j] == t2[i][j]
        }
    }
    return same
}

function makeBaseTiles(n: number = 4): number[][] {
    const baseTiles: number[][] = []
    for (var i = 0; i < n; i++) {
        baseTiles[i] = []
        for (let j = 0; j < n; j++) {
            baseTiles[i][j] = 0
        }
    }
    return baseTiles
}

export function slideUp(tiles: number[][]): [number[][], number] {
    // if (!validTiles(tiles)) {
    //     throw new Error('invalid 2048 tiles')
    // }
    const updated = makeBaseTiles()
    var score = 0
    for (var i = 0; i < 4; i++) {
        const onlyVals = tiles.map(r => r[i]).filter(v => v != 0)
        const [newCol, colScore] = mergeValues(onlyVals)
        score += colScore
        for (var n = 0; n < newCol.length; n++) {
            updated[n][i] = newCol[n]
        }
    }
    return [updated, score]
}

export function slideDown(tiles: number[][]): [number[][], number] {
    // if (!validTiles(tiles)) {
    //     throw new Error('invalid 2048 tiles')
    // }
    const updated = makeBaseTiles()
    var score = 0
    for (var i = 0; i < 4; i++) {
        const onlyVals = tiles.map(r => r[i]).filter(v => v != 0)
        const [newCol, colScore] = mergeValues(onlyVals)
        score += colScore
        for (var n = 0; n < newCol.length; n++) {
            updated[updated.length - 1 - n][i] = newCol[newCol.length - 1 - n]
        }
    }
    return [updated, score]
}

export function slideLeft(tiles: number[][]): [number[][], number] {
    // if (!validTiles(tiles)) {
    //     throw new Error('invalid 2048 tiles')
    // }
    const updated = makeBaseTiles()
    var score = 0
    for (var i = 0; i < 4; i++) {
        const onlyVals = tiles[i].filter(v => v != 0)
        const [newCol, colScore] = mergeValues(onlyVals)
        score += colScore
        for (var n = 0; n < newCol.length; n++) {
            updated[i][n] = newCol[n]
        }
    }
    return [updated, score]
}

export function slideRight(tiles: number[][]): [number[][], number] {
    // if (!validTiles(tiles)) {
    //     throw new Error('invalid 2048 tiles')
    // }
    const updated = makeBaseTiles()
    var score = 0
    for (var i = 0; i < 4; i++) {
        const onlyVals = tiles[i].filter(v => v != 0)
        const [newCol, colScore] = mergeValues(onlyVals)
        score += colScore
        for (var n = 0; n < newCol.length; n++) {
            updated[i][updated.length - 1 - n] = newCol[newCol.length - 1 - n]
        }
    }
    return [updated, score]
}

export function mergeValues(vals: number[]): [number[], number] {
    const merged = []
    var score = 0
    var justMerged = false;
    for (var j = 0; j < vals.length; j++) {
        if (justMerged) {
            justMerged = false
            continue
        }
        if (j < vals.length - 1 && vals[j] == vals[j + 1]) {
            merged.push(vals[j] * 2)
            score += vals[j] * 2
            justMerged = true
        } else {
            merged.push(vals[j])
        }
    }
    return [merged, score]
}

export function initTiles(): number[][] {
    const t1 = addNewTile(makeBaseTiles())
    const t2 = addNewTile(t1)
    return t2
}

export function addNewTile(tiles: number[][]): number[][] {
    // if (!validTiles(tiles)) {
    //     throw new Error('invalid 2048 tiles')
    // }
    const newTile = Math.floor(Math.random() * emptyTiles(tiles))
    const newVal = Math.floor(Math.random() * 5) == 0 ? 4 : 2
    const updated: number[][] = []
    let currEmpty = 0
    for (var i = 0; i < tiles.length; i++) {
        updated[i] = []
        for (let j = 0; j < tiles[i].length; j++) {
            const oldVal = tiles[i][j]
            if (oldVal != 0) {
                updated[i][j] = oldVal
            } else {
                updated[i][j] = currEmpty == newTile ? newVal : 0
                currEmpty++
            }
        }
    }
    return updated
}

export function emptyTiles(tiles: number[][]): number {
    // if (!validTiles(tiles)) {
    //     throw new Error('invalid 2048 tiles')
    // }
    return tiles.flatMap(r => r.map(v => v == 0)).filter(v => v).length
}

// function validTiles(tiles: number[][]): boolean {
//     return tiles.length == 4 && tiles.every(r => r.length == 4)
// }
