export const TILE_STATUS =
{
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    FLAGGED: 'flagged',
    QUESTION: 'question'
}

export function newField(fieldWidth, fieldHeight, numofMines)
{
    const minePositions = getMinePositions(fieldWidth, fieldHeight, numofMines)
    const mineField = []

    for (let h = 0; h < fieldHeight; h++)
    {
        const row = []
        for (let w = 0; w < fieldWidth; w++)
        {
            const element = document.createElement("div")
            element.dataset.status = TILE_STATUS.HIDDEN

            const tile = 
            {
                element,
                w,
                h,
                mine: minePositions.some(positionMatch.bind(null, {w, h})),
                get status()
                {
                    return this.element.dataset.status
                },
                set status(value)
                {
                    this.element.dataset.status = value
                }
            }

            row.push(tile)
        }
        mineField.push(row)
    }
    return mineField;
}

export function markTile(tile)
{
    if (
        tile.status !== TILE_STATUS.HIDDEN &&
        tile.status !== TILE_STATUS.FLAGGED &&
        tile.status !== TILE_STATUS.QUESTION
        )
    {
        return;
    }

    if (tile.status === TILE_STATUS.HIDDEN)
    {
        tile.status = TILE_STATUS.FLAGGED;

        var flagImg = document.createElement("img");
        flagImg.src = "flag.png";
        tile.element.appendChild(flagImg);
    }
    else if (tile.status === TILE_STATUS.FLAGGED)
    {
        tile.status = TILE_STATUS.QUESTION;

        tile.element.textContent = "?"
    }
    else if (tile.status === TILE_STATUS.QUESTION)
    {
        tile.status = TILE_STATUS.HIDDEN;
        tile.element.textContent = "";
    }
}

export function revealTile(mineField, tile)
{
    if (tile.status !== TILE_STATUS.HIDDEN)
    {
        return;
    }

    if (tile.mine)
    {
        tile.status = TILE_STATUS.MINE
        return
    }

        tile.status = TILE_STATUS.NUMBER

        const adjacentTiles = scanTiles(mineField, tile)
        const mines = adjacentTiles.filter(t => t.mine)
        if (mines.length === 0)
        {
            adjacentTiles.forEach(revealTile.bind(null, mineField))
        }
        else
        {
            tile.element.textContent = mines.length
        }

}

function getMinePositions(fieldWidth, fieldHeight, numofMines)
{
    const positions = []

    while(positions.length < numofMines)
    {
        const position =
        {
            w: randomNumber(fieldWidth),
            h: randomNumber(fieldHeight)
        }

        if (!positions.some(positionMatch.bind(null, position)))
        {
            positions.push(position)
        }
    }
    return positions
}

export function checkWin(mineField)
{
    return mineField.every(row =>
        {
            return row.every(tile =>
                {
                    return tile.status === TILE_STATUS.NUMBER ||
                    (tile.mine &&
                        (tile.status === TILE_STATUS.HIDDEN ||
                            tile.status === TILE_STATUS.FLAGGED))
                })
        })
}

export function checkLose(mineField)
{
    return mineField.some(row =>
        {
            return row.some(tile =>
                {
                    return tile.status === TILE_STATUS.MINE
                })
        })
}

function positionMatch(a, b)
{
    return a.w === b.w && a.h === b.h
}

function randomNumber(sizeVariable)
{
    return Math.floor(Math.random() * sizeVariable);
}

function scanTiles(mineField, {w, h})
{
    const tiles = []
    for (let scanH = -1; scanH <= 1; scanH++)
    {
        for (let scanW = -1; scanW <= 1; scanW++)
        {
            const tile = mineField[h + scanH]?.[w + scanW]
            if (tile) 
            {
                tiles.push(tile)
            }
        }
    }
    return tiles
}