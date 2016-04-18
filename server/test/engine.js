var engine = require("../engine");
var assert = require("assert");

describe("computerMove", function() {
    
    it("makes the winning move when possible", function() {
        
        var state = {
            board: "XOX----O-",
            player1Piece: "X",
            player2Piece: "O"
        };
        
        var actual = engine.computerMove(state);
        
        var expected = {
            board: "XOX-O--O-",
            gameOver: true,
            winningPlayer: 2,
            winningLine: [1, 4, 7]
        };
        
        assert.deepEqual(actual, expected);
    });
    
    it("makes the blocking move when necessary", function() {
        
        var state = {
            board: "X-OOX----",
            player1Piece: "X",
            player2Piece: "O"
        };
        
        var actual = engine.computerMove(state);
        
        var expected = {
            board: "X-OOX---O",
            gameOver: false
        };
        
        assert.deepEqual(actual, expected);
    });
    
    it("detects when the human player has already won", function() {
        
        var state = {
            board: "X-XOXOX-O",
            player1Piece: "X",
            player2Piece: "O"
        };
        
        var actual = engine.computerMove(state);
        
        var expected = {
            board: "X-XOXOX-O",
            gameOver: true,
            winningPlayer: 1,
            winningLine: [2, 4, 6]
        };
        
        assert.deepEqual(actual, expected);
    });
    
    it("detects a draw when the human player went first", function() {
        
        var state = {
            board: "OXOOXXXOX",
            player1Piece: "X",
            player2Piece: "O"
        };
        
        var actual = engine.computerMove(state);
        
        var expected = {
            board: "OXOOXXXOX",
            gameOver: true,
            winningPlayer: 3
        };
        
        assert.deepEqual(actual, expected);
    });
    
    it("detects a draw when the computer went first", function() {
        
        var state = {
            board: "XOXOXO-XO",
            player1Piece: "X",
            player2Piece: "O"
        };
        
        var actual = engine.computerMove(state);
        
        var expected = {
            board: "XOXOXOOXO",
            gameOver: true,
            winningPlayer: 3
        };
        
        assert.deepEqual(actual, expected);
    });
});
