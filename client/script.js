(function() {
    
    "use strict";
    
    var PLAYER1_TURN_MESSAGE = "Your turn (X). Click an empty square to make your move.";
    var PLAYER2_TURN_MESSAGE = "The computer (O) is thinking...";
    var PLAYER1_WON_MESSAGE = "You won!";
    var PLAYER2_WON_MESSAGE = "The computer won!";
    
    $(document).ready(function() {
        $("#resetBtn").click(onReset);
        $("#board td").click(onCellClick);
        resetBoard();
        setMessage(PLAYER1_TURN_MESSAGE);
        hideSpinner();
        stringToBoard("X--X--X--");
        highlightWinningLine([0, 3, 6]);
    });
    
    function onReset() {
        resetBoard();
    }

    function onCellClick(e) {
        var id = e.target.id;
        var ch = getCell(id);
        if (ch !== "-") {
            console.log("Cell is already occupied!");
            return;
        }
        setCell(id, "X");
        computerMove();
    }
    
    function computerMove() {
        
        setMessage(PLAYER2_TURN_MESSAGE);
        showSpinner();
        
        var requestData = {
            board: boardToString()
        };
        
        $.post("/computerMove", requestData)
            .done(function(responseData) {
                handleComputerMove(responseData);
            })
            .fail(function(xhr, statusText, error) {
                console.log(arguments);
            })
            .always(function() {
                hideSpinner();
            });        
    }
    
    function handleComputerMove(repsonseData) {
        stringToBoard(responseData.board);
        if (responseData.gameOver) {
            setMessage(responseData.winningPlayer === 1 ? PLAYER1_WON_MESSAGE : PLAYER2_WON_MESSAGE);
            highlightWinningLine(responseData.winningLine);
        }
        else {
            setMessage(PLAYER1_TURN_MESSAGE);
        }
    }
    
    function boardToString() {
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

    function stringToBoard(s) {
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
    
    function resetBoard() {
        stringToBoard("---------");
        $("#board td").removeClass("highlight");
    }
    
    function setCell(id, ch) {
        $("#" + id).html(ch === "X" || ch === "O" ? ch : " ");
    }
    
    function getCell(id) {
        var ch = $("#" + id).html();
        return ch === "X" || ch === "O" ? ch : "-";
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
    
    function showSpinner() {
        $("#spinner").show();
    }
    
    function hideSpinner() {
        $("#spinner").hide();
    }
    
    function setMessage(message) {
        $("#messageArea").html(message);
    }
}());
