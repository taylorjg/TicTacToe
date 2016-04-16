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

function handleComputerMove(req, res, _) {
    
    var board = req.body.board;
    console.log(board);
    
    var win = checkForWin(board);
    if (win) {
        var responseData = {
            board: board,
            gameOver: true,
            winningPlayer: win.winningPlayer,
            winningLine: win.winningLine
        }
        sendJsonResponse(res, 200, responseData);
        return;   
    }
    
    board = makeRandomMove(board);
    
    win = checkForWin(board);
    if (win) {
        var responseData = {
            board: board,
            gameOver: true,
            winningPlayer: win.winningPlayer,
            winningLine: win.winningLine
        }
        sendJsonResponse(res, 200, responseData);
    }
    else {
        var responseData = {
            board: board,
            gameOver: false
        };
        sendJsonResponse(res, 200, responseData);   
    }
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

function makeRandomMove(board) {
    // TODO: Make random move
    return board;
}

function checkForWin(s) {
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
        var winningPlayer = checkLineForWin(s, line);
        if (winningPlayer) {
            return {
                winningPlayer: winningPlayer,
                winningLine: line
            }
        }
    }
    return null;
}

function checkLineForWin(s, line) {
    var chs = "";
    for (var i = 0; i < line.length; i++) {
        var idx = line[i];
        chs += s[idx];
    }
    if (chs === "XXX") return 1;
    if (chs === "OOO") return 2;
    return null;
}
