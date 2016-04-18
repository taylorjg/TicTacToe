var CROSS = "X";
var NOUGHT = "O";
var THREE_CROSSES = "XXX";
var THREE_NOUGHTS = "OOO";
var LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

exports.computerMove = function(state) {
    
    var winOrDraw = checkForWinOrDraw(state);
    if (winOrDraw) {
        return winOrDraw;
    }
    
    var winningMove = tryToWin(state);
    if (winningMove) {
        return winningMove;
    }

    var blockingMove = tryToBlock(state);
    if (blockingMove) {
        return blockingMove;
    }

    console.log("Before makeRandomMove", state.board);
    makeRandomMove(state);
    console.log("After makeRandomMove", state.board);
    
    winOrDraw = checkForWinOrDraw(state);
    if (winOrDraw) {
        console.log("winOrDraw", winOrDraw);
        return winOrDraw;
    }
    
    var responseData = {
        board: state.board,
        gameOver: false
    };
    console.log("responseData", responseData);
    return responseData;   
}

function tryToWin(state) {
    return checkForLineWithTwoPiecesAndOneEmpty(state, state.player2Piece, function(newBoard, line) {
        return {
            board: newBoard,
            gameOver: true,
            winningPlayer: 2,
            winningLine: line
        }
    });
}

function tryToBlock(state) {
    return checkForLineWithTwoPiecesAndOneEmpty(state, state.player1Piece, function(newBoard, line) {
        return {
            board: newBoard,
            gameOver: false
        }
    });
}

function checkForLineWithTwoPiecesAndOneEmpty(state, piece, buildResponse) {
    
    for (var i = 0; i < LINES.length; i++) {
        var line = LINES[i];
        var cellsWithPiece = [];
        var emptyCells = [];
        for (var j = 0; j < line.length; j++) {
            var cellIndex = line[j];
            var ch = state.board[cellIndex];
            if (ch === piece) {
                cellsWithPiece.push(cellIndex);
            }
            if (ch !== state.player1Piece && ch !== state.player2Piece) {
                emptyCells.push(cellIndex);
            }
        }
        if (cellsWithPiece.length === 2 && emptyCells.length === 1) {
            var newBoard = setCharAt(state.board, state.player2Piece, emptyCells[0]);
            return buildResponse(newBoard, line);
        }
    }
    
    return null;
}

function makeRandomMove(state) {
    var unoccupiedIndices = [];
    for (var i = 0; i < state.board.length; i++) {
        var ch = state.board[i];
        if (ch !== CROSS && ch !== NOUGHT) {
            unoccupiedIndices.push(i);
        }
    }
    var r = getRandomIntInclusive(0, unoccupiedIndices.length - 1);
    state.board = setCharAt(state.board, state.player2Piece, unoccupiedIndices[r]);
}

function setCharAt(s, ch, index) {
    var chs = [];
    for (var i = 0; i < s.length; i++) {
        chs.push(s[i]);
    }
    chs[index] = ch;
    return chs.join("");
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkForWinOrDraw(state) {
    
    for (var i = 0; i < LINES.length; i++) {
        var line = LINES[i];
        var winningPlayer = checkForWinningLine(state, line);
        if (winningPlayer) {
            return {
                board: state.board,
                gameOver: true,
                winningPlayer: winningPlayer,
                winningLine: line
            }
        }
    }
    
    return checkForDraw(state);
}

function checkForWinningLine(state, line) {
    
    var chs = "";
    
    for (var i = 0; i < line.length; i++) {
        var boardIndex = line[i];
        chs += state.board[boardIndex];
    }
    
    if (chs === THREE_CROSSES || chs == THREE_NOUGHTS) {
        return playerNumberFromPiece(state, chs[0]);
    }
    
    return null;
}

function playerNumberFromPiece(state, ch) {
    if (ch === state.player1Piece) return 1;
    if (ch === state.player2Piece) return 2;
    return null;
}

function checkForDraw(state) {
    
    var occupiedCellCount = 0;
    
    for (var i = 0; i < state.board.length; i++) {
        var ch = state.board[i];
        if (ch === CROSS || ch === NOUGHT) {
            occupiedCellCount++;
        }
    }
    
    if (occupiedCellCount === state.board.length) {
        return {
            board: state.board,
            gameOver: true,
            winningPlayer: 3,
        }
    }
    
    return null;
}
