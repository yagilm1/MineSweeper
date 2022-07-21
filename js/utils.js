'use strict'


// creates a board and returns it
function buildBoard(size) {
    const board = []
    var cellsCopy
    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }

    return board
}



// Gets array of numbers and returns it shuffled
function shuffleNums(nums) {
    var shuffledNums = []
    for (var i = 0; i < gMaxNum; i++) {
        var randIdx = getRandomInt(0, nums.length)
        var num = nums[randIdx]
        nums.splice(randIdx, 1)
        shuffledNums[i] = num
    }
    return shuffledNums
}

// returns a random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Gets date
function getTime() {
    return new Date().toString().split(' ')[4];
}

// renders board on html
function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j })

            // TODO - change to short if statement
            if (!currCell.isShown) cellClass += ' hidden';
            if (currCell.isMarked) cellClass += ' marked';
           
            strHTML += `\t<td class="cell ${cellClass}"  onclick="cellClicked(this,${i}, ${j})" onmousedown="cellMarked(this,${i}, ${j})" >\n`;


            if (!currCell.isShown && currCell.isMarked) strHTML += `🚩</td>`;
            if (currCell.isShown && currCell.isMine) strHTML += `💣</td>`;
            if (currCell.isShown && !currCell.isMine && currCell.minesAroundCount > 0) strHTML += `${currCell.minesAroundCount}</td>`;
            if (currCell.isShown && !currCell.isMine && currCell.minesAroundCount === 0) strHTML += `</td>`;
            if (!currCell.isShown && !currCell.isMarked) strHTML += `</td>`;
        }
        strHTML += '</tr>\n';
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}


// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

// creates a mat copy
function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}


function renderCell(i, j, value) {
    // var elCell = document.querySelector(`[data-i][data-j]`)
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    elCell.innerText = value
    return elCell
}

// counts neighbors
function countNeighbors(cellI, cellJ, board) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine) neighborsCount++;
        }
    }
    return neighborsCount;
}


// Convert a location object {i, j} (cell-1-2) to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

function getRandomEmptyCell(board) {
    var cells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            if (!cell.isMarked && !cell.isMine && !cell.isShown) {
                var coord = { i, j }
                cells.push(coord)
            }
        }
    }
    var randomCell = drawNum(cells)
    return randomCell
}

// returning a fixed number from array
function drawNum(gNums) {
    var randIdx = getRandomInt(0, gNums.length)
    var num = gNums[randIdx]
    gNums.splice(randIdx, 1)
    return num
}





function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

//cancel R.click menu
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
}, false);


