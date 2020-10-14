// create a gameboard object and displayController with the module pattern
// create players with factory function
// rule of thumb, only need 1 of something? Use module pattern.  need > 1? factory function


// Creates a gameboard object using the module pattern.  Our gameBoard array is stored in the Gameboard object. 
const Gameboard = (() => {

    let gameBoard = [
        "", "", "",
        "", "", "",
        "", "", ""
    ]
// don't need the brackets but keeping them for now
  return {
    gameBoard,
  };
})();


// displayController houses all functions that affect the display. 
const displayController = (() => {
    const squares = document.querySelectorAll(".square");
    
    const addSquareEvent = (() => {
        squares.forEach((square, index) => square.textContent = `${Gameboard.gameBoard[index]}`)
        squares.forEach(square => square.addEventListener("click", () => {
                evaluateClick(square)
            }));
    });

    const addSubmitEvent = (() => {
        const submitBtn = document.querySelector("#submit");
        submitBtn.addEventListener('click', () => {
            let player1Name = document.querySelector("[name='player1Text']").value;
            let player2Name = document.querySelector("[name='player2Text']").value;
            Game.player1.name = player1Name;
            Game.player2.name = player2Name;
            if(Game.player1.name != ""){
                const player1name = document.getElementById('#player1-name');
                player1name.textContent = `${Game.player1.name} Wins:`;
            }
            if(Game.player2.name != ""){
                const player2name = document.getElementById('#player2-name');
                player2name.textContent = `${Game.player2.name} Wins:`;
            }
            document.getElementById("player-form").style.visibility = "hidden";
            addSquareEvent();
        });
        
    });

    // add a 'take a turn function' or something and have one for if 2 humans and one for human vs AI
    function evaluateClick(square){
        if ((square.textContent === "") && (Game.winner == "")){
            let count = Game.counter();
            let squareIndex = square.getAttribute('data-id')
            let currentPlayer = Game.getCurrentPlayer(count);
            square.textContent = currentPlayer.marker;
            Gameboard.gameBoard[squareIndex] = currentPlayer.marker;
            //could change the counter so that this only gets called after the first 4
            Game.checkForWin(currentPlayer);

            if (!Gameboard.gameBoard.includes("") && Game.winner == "") {
                //winner/draw display call goes here
                console.log("It's a tie")
                updateScoreBoard("draw")
            }
            else if (Game.winner != ""){
                //need to build the display to declare who wins here and make the method call show up here.
                console.log(`${currentPlayer.name} wins!`)
                updateScoreBoard(currentPlayer.playerNum)
            }
        }
        else{
            return;
        }
    }

    const updateScoreBoard = (scoreboardID) => {
        if (scoreboardID == "player1"){
            const player1Para = document.getElementById('#player1-num');
            let player1WinCount = ++player1Para.textContent;
            player1Para.textContent = player1WinCount;
            
        }
        else if (scoreboardID == "player2"){
            const player2Para = document.getElementById('#player2-num')
            let player2WinCount = ++player2Para.textContent;
            player2Para.textContent = player2WinCount;
        }
        else if (scoreboardID = "draw"){
            const drawPara = document.getElementById("#draw-num");
            let drawCount = ++drawPara.textContent;
            drawPara.textContent = drawCount;
        }
    };

    const clearBoardEvent = () => {
        // const clearBtn = document.getElementById("#clear-board");
        const clearBtn = document.querySelector("#clear-board");
        clearBtn.addEventListener('click', () => {
            resetBoard();
        })
    }


    const resetBoard = () => {
        Gameboard.gameBoard = [
            "", "", "",
            "", "", "",
            "", "", ""
        ];
        //writes an empty string to each square (doesn't really need to base it off of the index)
        squares.forEach((square, index) => square.textContent = `${Gameboard.gameBoard[index]}`)
        Game.winner = false;
    }

    return {
        addSquareEvent,
        resetBoard,
        addSubmitEvent,
        clearBoardEvent,
    }

})();

// A factory function to create the players
const Player = (name, marker, playerNum) => {
    const sayName = () => console.log(`my name is ${name}`)
    const winner = false;
    return {sayName, winner, marker, name, playerNum} 
};

// Game module is home to functions related to the games functioning. 
const Game = (() => {
    // let winStatus = false;

    const player1 = Player('', "X", "player1");
    const player2 = Player("", "O", "player2");
    //maybe change this to win status for clarity
    const winner = "";

    let count = 0;
    // Counter is used to determine players turn.  May change it to just alternate each player. 
    const counter = (() => {
        let num = count++;
        if (num != 2) return num;
        //resets the counter variable
        else{
            count = 0;
            return count++;
        }
    });
    // may also want to switch from Game.winner to changing the winner from blank string to the winner player. 
    const checkForWin = ((currentPlayer) => {
        //Check for Row wins
        if (
            Gameboard.gameBoard[0] == currentPlayer.marker && 
            Gameboard.gameBoard[1] == currentPlayer.marker && 
            Gameboard.gameBoard[2] == currentPlayer.marker) {
                Game.winner = currentPlayer;
            }
            
        else if (
            Gameboard.gameBoard[3] == currentPlayer.marker && 
            Gameboard.gameBoard[4] ==currentPlayer.marker && 
            Gameboard.gameBoard[5] == currentPlayer.marker) {
                Game.winner = true;
            }
            
        else if (
            Gameboard.gameBoard[6] == currentPlayer.marker &&
            Gameboard.gameBoard[7] == currentPlayer.marker && 
            Gameboard.gameBoard[8] == currentPlayer.marker) {
                Game.winner = true;
            }
        //Check for Column wins
        else if (
            Gameboard.gameBoard[0] == currentPlayer.marker &&
            Gameboard.gameBoard[3] == currentPlayer.marker && 
            Gameboard.gameBoard[6] == currentPlayer.marker){
                Game.winner = true;
            }
        else if (
            Gameboard.gameBoard[1] == currentPlayer.marker &&
            Gameboard.gameBoard[4] == currentPlayer.marker && 
            Gameboard.gameBoard[7] == currentPlayer.marker){
                Game.winner = true;
            }
        else if (
            Gameboard.gameBoard[2] == currentPlayer.marker &&
            Gameboard.gameBoard[5] == currentPlayer.marker && 
            Gameboard.gameBoard[8] == currentPlayer.marker) {
                Game.winner = true;
            }
        //Check for Diagonal Wins
        else if (
            Gameboard.gameBoard[0] == currentPlayer.marker &&
            Gameboard.gameBoard[4] == currentPlayer.marker && 
            Gameboard.gameBoard[8] == currentPlayer.marker) {
                Game.winner = true;
            }
        else if (
            Gameboard.gameBoard[2] == currentPlayer.marker &&
            Gameboard.gameBoard[4] == currentPlayer.marker && 
            Gameboard.gameBoard[6] == currentPlayer.marker) {
                Game.winner = true;
            }

    });

    // Retrieves the player object for whoever's turn it is
    const getCurrentPlayer = ((count) => {
        if (count % 2 == 0){
            return player1;
        }
        else{
            return player2;
        }
    });

    return {
        player1,
        player2,
        checkForWin,
        getCurrentPlayer,
        counter,
        winner,
    }
})();


const computerPlayer = (() => {
        //Evaluates all possible ways the game can go and
    // Returns the value of the board
    let minimax = (gameBoard, depth, isMax) => {

        let score = evaluate(gameBoard);

        // If Maximizer or Minimizer has won the game
        // return his/her evaluated score
        // If Maximizer has won the game return his/her evaluated score 
        if (score === 10) return score - depth;

        // If Minimizer has won the game return his/her evaluated score 
        if (score === -10) return score + depth;

        //If there are no more moves and no winner then it is a tie
        if (areMovesLeft(gameBoard) == false) return 0;
        
        if (isMax){
            let best = -1000;
            // Go over each cell
            for (let i = 0; i < 9; i++){
                //If cell is empty
                if(gameBoard[i] == ""){
                    // place the player marker there ('X')
                    gameBoard[i] = player;
                    // Call minmax recursively and choose the max value
                    best = Math.max(best, minimax(gameBoard, depth + 1, !isMax));

                    // Undo the move
                    gameBoard[i] = "";
                }
            }
            // return best - depth;
            return best;
        }
        // If minimizer's move
        else{
            let best = 1000;

            // Go over each cell
            for (let i = 0; i < 9; i++){
                //Check if cell is empty
                if (gameBoard[i] == ""){
                    // Make the move
                    gameBoard[i] = opponent;

                    // Call the minimax recursively and choose the minimum value
                    best = Math.min(best, minimax(gameBoard, depth + 1, !isMax))

                    // Undo the move
                    gameBoard[i] = "";
                }
            }
            // return best + depth;
            return best;
        }
    };

    let findBestMove = (gameBoard) => {
        let bestVal = 1000;
        let bestMove = -1;
        // Go over each cell, evaluate minimax function for all empty cells
        // Return the cell with the optimal value
        for (let i = 0; i < 9; i++){
            if(gameBoard[i] == ""){
                gameBoard[i] = opponent;

                let moveVal = minimax(gameBoard, 0, true);

                gameBoard[i] = "";

                if(moveVal < bestVal){
                    bestMove = i;
                    bestVal = moveVal;
                }
            }
        }
        console.log(`The value of the best move is ${bestVal}`);

        return bestMove;
    }

    // "X is player and O is opponent"
    //Change logic next time.
    let evaluate = (gameBoard) => {
        let m = 0;
        // Checking Rows for X or O victory.
        for (let n = 0; n < 3; n++){
            m = n;
            if(m == 1) m = 3;
            else if(m == 2) m = 6;

            if(gameBoard[m] == gameBoard[m+1] && gameBoard[m+1] == gameBoard[m+2]){
                if(gameBoard[m] == 'X') return 10;
                else if (gameBoard[m] == 'O') return -10;
            }
        }
        // Checking Columns for X or O victory.
        for (let n = 0; n < 3; n++){
            if(gameBoard[n] == gameBoard[n+3] && gameBoard[n+3] == gameBoard[n+6]){
                if(gameBoard[n] == 'X') return 10;
                else if(gameBoard[n] == 'O') return -10;
            }
        }
        // Checking Diagonals for X or O victory.
        if(gameBoard[0] == gameBoard[4] && gameBoard[4] == gameBoard[8]){
            if(gameBoard[0] == 'X') return 10;
            else if(gameBoard[0] == 'O') return -10;
        }
        if(gameBoard[2] == gameBoard[4] && gameBoard[4] == gameBoard[6]){
            if(gameBoard[2] == 'X') return 10;
            else if(gameBoard[2] == 'O') return -10;
        }

        // Else if none of them have won then return 0
        return 0;

    };

    //finds Log n in base 2
    // let log2 = (n) => {
    //     return (n == 1)? 0 : 1 + log2(n/2);
    // };

    let areMovesLeft = (gameBoard) => {
        // if moves are left (blank strings in array) return true
        if(gameBoard.includes("")) return true;
        // if moves are not left (no blank strings in array) return false
        else if (!gameBoard.includes("")) return false;
    }


    // can make these variables within the AI factory method based on the player
    let player = "X";
    // opponent is actually the computer player variable. will need to change in the future.
    let opponent = "O";

  return {
    findBestMove,
  };  
})();


displayController.addSubmitEvent();
displayController.clearBoardEvent();


// Need to make changes and add functions for whether the end user is playing 
// someone else or the AI.  AI moves need to be added into the turn based functioning
// of the current program.