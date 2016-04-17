(function() {
    
    "use strict";

    var CHOOSE_PIECE_MESSAGE = "Choose noughts or crosses then click the Start button.";     
    var PLAYER1_TURN_MESSAGE = "Your turn. Click an empty square to make your move.";
    var PLAYER2_TURN_MESSAGE = "The computer is thinking...";
    var PLAYER1_WON_MESSAGE = "You won!";
    var PLAYER2_WON_MESSAGE = "The computer won!";
    var DRAW_MESSAGE = "It's a draw!";
    var UNKNOWN_WINNER_MESSAGE = "I r confuse about who won!?";
    var CROSS = "X";
    var NOUGHT = "O";
    var EMPTY = "-";
    var player1Piece;
    var player2Piece;
    var started = false;
    var gameOver = false;
    var computerMoveInProgress = false;
    
    $(document).ready(function() {
        $("#startBtn").click(onStart);
        $("#resetBtn").click(onReset);
        $("#board td").click(onCellClick);
        $("#crossesRadio").click(function() {
            choosePiece(CROSS);
        });
        $("#noughtsRadio").click(function() {
            choosePiece(NOUGHT);
        });
        $("#crossesRadio").trigger("click");
        initialise();
    });
    
    function onStart() {
        start();
    }

    function onReset() {
        start();
    }

    function onCellClick(e) {
        if (!started || gameOver || computerMoveInProgress) {
            return;
        }
        var id = e.target.id;
        var ch = getCell(id);
        if (ch !== EMPTY) {
            return;
        }
        setCell(id, player1Piece);
        computerMove();
    }
    
    function choosePiece(piece) {
        player1Piece = piece;
        player2Piece = (piece === CROSS) ? NOUGHT : CROSS;
    }
    
    function whoGoesFirst() {
        return (Math.random() < 0.5) ? 1 : 2;
    }
    
    function computerMove() {
        
        computerMoveInProgress = true;
        
        setMessage(PLAYER2_TURN_MESSAGE);
        showSpinner();
        
        var requestData = {
            board: saveBoardToString(),
            player1Piece: player1Piece,
            player2Piece: player2Piece
        };
        
        $.post({
            url: "/api/computerMove",
            data: JSON.stringify(requestData),
            contentType: "application/json"
        })
            .done(function(responseData) {
                handleComputerMove(responseData);
            })
            .fail(function(xhr, statusText, error) {
                console.log(arguments);
            })
            .always(function() {
                hideSpinner();
                computerMoveInProgress = false;
            });        
    }
    
    function handleComputerMove(responseData) {
        updateBoardFromString(responseData.board);
        if (responseData.gameOver) {
            switch (responseData.winningPlayer) {
                case 1:
                    setMessage(PLAYER1_WON_MESSAGE);
                    highlightWinningLine(responseData.winningLine);
                    break;
                case 2:
                    setMessage(PLAYER2_WON_MESSAGE);
                    highlightWinningLine(responseData.winningLine);
                    break;
                case 3:
                    setMessage(DRAW_MESSAGE);
                    break;
                default:
                    setMessage(UNKNOWN_WINNER_MESSAGE);
                    break;    
            }
            gameOver = true;
            showStartButton();
        }
        else {
            setMessage(PLAYER1_TURN_MESSAGE);
        }
    }
    
    function saveBoardToString() {
        return "" +
            getCell("cell00") +
            getCell("cell01") +
            getCell("cell02") +
            getCell("cell10") +
            getCell("cell11") +
            getCell("cell12") +
            getCell("cell20") +
            getCell("cell21") +
            getCell("cell22");
    }

    function updateBoardFromString(s) {
        setCell("cell00", s[0]);
        setCell("cell01", s[1]);
        setCell("cell02", s[2]);
        setCell("cell10", s[3]);
        setCell("cell11", s[4]);
        setCell("cell12", s[5]);
        setCell("cell20", s[6]);
        setCell("cell21", s[7]);
        setCell("cell22", s[8]);
    }
    
    function initialise() {
        reset();
        showRadioButtons();
        showStartButton();
        hideSpinner();
        setMessage(CHOOSE_PIECE_MESSAGE);
    }
    
    function reset() {
        var emptyBoard = [
            EMPTY, EMPTY, EMPTY,
            EMPTY, EMPTY, EMPTY,
            EMPTY, EMPTY, EMPTY
        ].join("");
        updateBoardFromString(emptyBoard);
        $("#board td").removeClass("highlight");
        started = false;
        gameOver = false;
        computerMoveInProgress = false;
    }
    
    function start() {
        reset();
        started = true;
        hideRadioButtons();
        showResetButton();
        if (whoGoesFirst() === 1) {
            setMessage(PLAYER1_TURN_MESSAGE);
        }
        else {
            computerMove();
        }
    }
    
    function setCell(id, ch) {
        $("#" + id).html(ch === CROSS || ch === NOUGHT ? ch : "");
    }
    
    function getCell(id) {
        var ch = $("#" + id).html();
        return ch === CROSS || ch === NOUGHT ? ch : EMPTY;
    }
    
    function highlightWinningLine(cellIndices) {
        var cellIndicesToIds = {
            0: "cell00",
            1: "cell01",
            2: "cell02",
            3: "cell10",
            4: "cell11",
            5: "cell12",
            6: "cell20",
            7: "cell21",
            8: "cell22"
        };
        for (var i = 0; i < cellIndices.length; i++) {
            var id = cellIndicesToIds[cellIndices[i]];
            $("#" + id).addClass("highlight");
        }
    }
    
    function setMessage(message) {
        $("#messageArea").html(message);
    }
    
    function showStartButton() {
        $("#startBtn").show();
        $("#resetBtn").hide();
    }
    
    function showResetButton() {
        $("#resetBtn").show();
        $("#startBtn").hide();
    }
    
    function showSpinner() {
        $("#spinner").show();
    }
    
    function hideSpinner() {
        $("#spinner").hide();
    }
    
    function showRadioButtons() {
        $("#radioButtons").show();
    }
    
    function hideRadioButtons() {
        $("#radioButtons").hide();
    }
}());
