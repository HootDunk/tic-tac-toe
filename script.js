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
            document.getElementById("player-form").style.visibility = "hidden";
            displayController.addSquareEvent();
        });
        
    });


    function evaluateClick(square){
        if ((square.textContent === "") && (Game.winner == "")){
            let count = Game.counter();
            // console.log(count)
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
                // console.log(currentPlayer.playerNum)
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
            console.log("get draw num")
            const drawPara = document.getElementById("#draw-num");
            let drawCount = ++drawPara.textContent;
            drawPara.textContent = drawCount;
        }
    };


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
        addSubmitEvent
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

//yay it works now.  going to have to look into the submit button.
// Also, these need to be moved out of the global namespace later. 
displayController.addSubmitEvent();


// Create the update scoreboard feature so that player names are updated.
// also have the form have a default value for player 1 and player 2 if nothing is inputted. 





// need to add style
// then connect the new elements to the game (name input and scoreboard)
// also have it say who goes first and switch off after each round

// once all of that is added look into adding the AI. 