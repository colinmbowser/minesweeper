
import { TILE_STATUS, newField, markTile, revealTile, checkWin, checkLose } from "./index.js";

const FIELD_WIDTH = 9;
const FIELD_HEIGHT = 9;
const NUMBER_OF_MINES = 10;

//add no right click to gaps of minefield | DONE
//add flag pixel art to flagged tile | DONE
//add win condition from having all mines flagged and nothing else flagged | NOT THE WAY YOU PLAY THE GAME

//add choices below to type of game | 
//easy: 9w 9h 10m
//medium: 16w 16h 40m
//hard: 30w 16h 99m
//custom: userinput w userinput h userinput m

const mineField = newField(FIELD_WIDTH, FIELD_HEIGHT, NUMBER_OF_MINES);

const fieldElement = document.querySelector(".mineField");
const mineAmountChange = document.querySelector("[data-mine-amount]");

const messageText = document.querySelector(".subtext")

//stops the right click menu from occuring on each tile
fieldElement.addEventListener("contextmenu", e => { e.preventDefault()})

mineField.forEach(row => 
{
    row.forEach(tile =>
    {
        fieldElement.append(tile.element);
        tile.element.addEventListener("click", () =>
        {
            revealTile(mineField, tile)
            checkGameEnd()
        })
        tile.element.addEventListener("contextmenu", e =>
        {
            e.preventDefault() //stops the right click menu from occuring on each tile
             markTile(tile)
             listMinesLeft()
             checkGameEnd()
        })
    })
})

fieldElement.style.setProperty("--fieldWidth", FIELD_WIDTH);
fieldElement.style.setProperty("--fieldHeight", FIELD_HEIGHT);
mineAmountChange.textContent = NUMBER_OF_MINES;

function listMinesLeft()
{
    const totalMarkedTiles = mineField.reduce
    ((count, row) =>
        { return count + row.filter(tile =>tile.status === TILE_STATUS.FLAGGED).length }, 0)
    mineAmountChange.textContent = NUMBER_OF_MINES - totalMarkedTiles;
}

function checkGameEnd()
{
    const win = checkWin(mineField)
    const lose = checkLose(mineField)

    if (win || lose)
    {
        fieldElement.addEventListener("click", stopProp, {capture: true})
        fieldElement.addEventListener("contextmenu", stopProp, {capture: true})
    }

    if(win)
    {
        messageText.textContent = "WINNER!"
    }

    if (lose)
    {
        messageText.textContent = "YOU LOSE!"
        mineField.forEach(row => 
            {
                row.forEach(tile => 
                    {
                        if (tile.mine && tile.status === TILE_STATUS.FLAGGED)
                        {
                            markTile(tile);
                            markTile(tile);
                        }
                        if (tile.mine && tile.status === TILE_STATUS.QUESTION)
                        {
                            markTile(tile);
                        }
                        if (tile.mine)
                        {
                            revealTile(mineField, tile);
                        }
                    })
            })
    }

    function stopProp(e)
    {
        e.stopImmediatePropagation()
    }
}