'use strict'

var gBoard = []
const gLevel = {
    size: 4,
    mines: 2
}
const gGame = {
    isOn: false,
    isOver: false,
    secPassed: 0,
    bestTime: null,
    shownCount: 0,
    markedCount: 0,
    lives: 3

}
var gNextId = 101
var gCells = []
var gTimeIntervalID

function init() {
    gBoard = buildBoard(gLevel.size)
    renderBoard(gBoard)
}


function cellClicked(elCell, i, j) {


    if (gGame.isOver) return

    if (gBoard[i][j].isMarked) return

    if (!gGame.isOn) {
        gBoard[i][j].isShown = true
        gGame.shownCount++
        getMines()
        gGame.isOn = true
        gTimeIntervalID = setInterval(updateStopWatch, 1000)
    }

    if (!gBoard[i][j].isShown) {
        gBoard[i][j].isShown = true
        gGame.shownCount++
    }

    checkVictory(gBoard, i, j)
    if (!gBoard[i][j].isMine) {
        var neighborsCount = countNeighbors(i, j, gBoard)
        gBoard[i][j].minesAroundCount = neighborsCount
        if (neighborsCount === 0) expandShown(i, j, gBoard)

    }

    renderBoard(gBoard)



}

function cellMarked(elCell, i, j) {
    if (window.event.which === 1) return
    if (gGame.isOver) return




    if (!gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        checkVictory(gBoard, i, j)

    } else if (gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
        gBoard[i][j].isMarked = false
        gGame.markedCount--
    }

   
    renderBoard(gBoard)

}



function getMines() {
    var emptyCells = []
    for (var i = 0; i < gLevel.mines; i++) {

        emptyCells = getRandomEmptyCell(gBoard)
        var emptyCell = gBoard[emptyCells.i][emptyCells.j]
        emptyCell.isMine = true

    }
}



function checkVictory(gBoard, cellI, cellJ) {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isShown && gBoard[i][j].isMine) {
                if (gGame.lives >= 1) {
                    gBoard[cellI][cellJ].isShown = false
                    gGame.shownCount--
                    gGame.lives--
                    var elLives = document.querySelector(".lives")
                    elLives.innerText = gGame.lives
                } if (gGame.lives === 0) {
                    clearInterval(gTimeIntervalID)
                    gGame.isOn = false
                    gGame.isOver = true
                    var elUser = document.querySelector(".user")
                    elUser.innerText = '🤯'
                }
            }

        }
    }
    if (gGame.lives > 0 && gGame.markedCount === gLevel.mines) {

        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
                    return
                }
            }

        }

        if (gLevel.size * gLevel.size - gGame.markedCount === gGame.shownCount)
        // gLevel.size * gLevel.size - gGame.shownCount === gGame.markedCount)
        {
            var elUser = document.querySelector(".user")
            elUser.innerText = '😎'
            clearInterval(gTimeIntervalID)
            gGame.isOver = true
            if (!gGame.bestTime) {
                gGame.bestTime = gGame.secPassed
                var elBestTime = document.querySelector(".bestTime")
                elBestTime.innerText = gGame.bestTime
                
            } 
             if (gGame.secPassed < gGame.bestTime) {
                var elBestTime = document.querySelector(".bestTime")
                elBestTime.innerText = gGame.secPassed
               
            } else if (gGame.secPassed > gGame.bestTime) {
                var elBestTime = document.querySelector(".bestTime")
                elBestTime.innerText = gGame.bestTime
            }  
                
        }


    }

}
function expandShown(cellI, cellJ, board) {

    var cellNeighbors = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (!board[i][j].isMine) {
                cellNeighbors.push({ i, j })
            }
        }

    }


    for (var i = 0; i < cellNeighbors.length; i++) {


        if (!gBoard[cellNeighbors[i].i][cellNeighbors[i].j].isMine &&
            !gBoard[cellNeighbors[i].i][cellNeighbors[i].j].isMarked) {
            var neighborsCount = countNeighbors(cellNeighbors[i].i, cellNeighbors[i].j, gBoard)
            gBoard[cellNeighbors[i].i][cellNeighbors[i].j].minesAroundCount = neighborsCount
            if (gBoard[cellNeighbors[i].i][cellNeighbors[i].j].minesAroundCount >= 0 &&
                !gBoard[cellNeighbors[i].i][cellNeighbors[i].j].isShown) {
                gBoard[cellNeighbors[i].i][cellNeighbors[i].j].isShown = true
                gGame.shownCount++
                checkVictory(gBoard, i, j)
            }
        }

    }
}


function setEasyLevel() {
    gLevel.size = 4
    gLevel.mines = 2
    gGame.isOn = false
    gGame.secPassed = 0
    gGame.shownCount = 0
    gGame.markedCount = 0
    clearInterval(gTimeIntervalID)
    var elTimeCount = document.querySelector(".timeCount")
    elTimeCount.innerText = 0
    gGame.lives = 3
    gGame.isOver = false
    var elUser = document.querySelector(".user")
    elUser.innerText = '😀'
    init()
}

function setMediumLevel() {
    gLevel.size = 8
    gLevel.mines = 12
    gGame.isOn = false
    gGame.secPassed = 0
    gGame.shownCount = 0
    gGame.markedCount = 0
    clearInterval(gTimeIntervalID)
    var elTimeCount = document.querySelector(".timeCount")
    elTimeCount.innerText = 0
    gGame.lives = 3
    gGame.isOver = false
    var elUser = document.querySelector(".user")
    elUser.innerText = '😀'
    init()
}

function setHardLevel() {
    gLevel.size = 12
    gLevel.mines = 30
    gGame.isOn = false
    gGame.secPassed = 0
    gGame.shownCount = 0
    gGame.markedCount = 0
    clearInterval(gTimeIntervalID)
    var elTimeCount = document.querySelector(".timeCount")
    elTimeCount.innerText = 0
    gGame.lives = 3
    gGame.isOver = false
    var elUser = document.querySelector(".user")
    elUser.innerText = '😀'
    init()
}



function updateStopWatch() {
    gGame.secPassed += 1
    var elTimeCount = document.querySelector(".timeCount")
    elTimeCount.innerText = gGame.secPassed

}

function restartGame() {
    gGame.isOn = false
    gGame.secPassed = 0
    gGame.shownCount = 0
    gGame.markedCount = 0
    clearInterval(gTimeIntervalID)
    var elTimeCount = document.querySelector(".timeCount")
    elTimeCount.innerText = 0
    gGame.lives = 3
    gGame.isOver = false
    var elUser = document.querySelector(".user")
    elUser.innerText = '😀'
    init()
}