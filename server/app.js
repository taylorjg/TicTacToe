var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var port = process.env.PORT || 3000;

var apiRouter = express.Router();
apiRouter.post("/computerMove", handleComputerMove);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", express.static("server/public"));
app.use('/api', apiRouter);

app.listen(port, function () {
    console.log("Listening on port %d", port);
});

var CROSS = "X";
var NOUGHT = "O";
var THREE_CROSSES = "XXX";
var THREE_NOUGHTS = "OOO";

function handleComputerMove(req, res, _) {
    
    var board = req.body.board;
    var player1Piece = req.body.player1Piece;
    var player2Piece = req.body.player2Piece;
    
    var winOrDraw = checkForWinOrDraw(board, player1Piece, player2Piece);
    if (winOrDraw) {
        return sendJsonResponse(res, 200, winOrDraw);
    }

    board = makeRandomMove(board, player2Piece);
    
    winOrDraw = checkForWinOrDraw(board, player1Piece, player2Piece);
    if (winOrDraw) {
        return sendJsonResponse(res, 200, winOrDraw);
    }
    else {
        var responseData = {
            board: board,
            gameOver: false
        };
        return sendJsonResponse(res, 200, responseData);   
    }
}

function makeRandomMove(board, player2Piece) {
    var unoccupiedIndices = [];
    for (var i = 0; i < board.length; i++) {
        var ch = board[i];
        if (ch !== CROSS && ch !== NOUGHT) {
            unoccupiedIndices.push(i);
        }
    }
    var randomUnoccupiedIndex = getRandomIntInclusive(0, unoccupiedIndices.length - 1);
    var index = unoccupiedIndices[randomUnoccupiedIndex];
    board = setCharAt(board, player2Piece, index);
    return board;
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

function checkForWinOrDraw(board, player1Piece, player2Piece) {
    
    var lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var winningPlayer = checkForWinningLine(board, player1Piece, player2Piece, line);
        if (winningPlayer) {
            return {
                board: board,
                gameOver: true,
                winningPlayer: winningPlayer,
                winningLine: line
            }
        }
    }
    
    return checkForDraw(board);
}

function checkForWinningLine(board, player1Piece, player2Piece, line) {
    
    var chs = "";
    
    for (var i = 0; i < line.length; i++) {
        var boardIndex = line[i];
        chs += board[boardIndex];
    }
    
    if (chs === THREE_CROSSES || chs == THREE_NOUGHTS) {
        return playerNumberFromPiece(chs[0], player1Piece, player2Piece);
    }
    
    return null;
}

function playerNumberFromPiece(ch, player1Piece, player2Piece) {
    if (ch === player1Piece) return 1;
    if (ch === player2Piece) return 2;
    return null;
}

function checkForDraw(board) {
    
    var occupiedCellCount = 0;
    
    for (var i = 0; i < board.length; i++) {
        var ch = board[i];
        if (ch === CROSS || ch === NOUGHT) {
            occupiedCellCount++;
        }
    }
    
    if (occupiedCellCount === board.length) {
        return {
            board: board,
            gameOver: true,
            winningPlayer: 3,
        }
    }
    
    return null;
}

function sendJsonResponse(res, status, content) {
    if (content) {
        res.status(status);
        res.json(content);
    }
    else {
        res.sendStatus(status);
        res.end();
    }
}
