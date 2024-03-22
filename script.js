const gameController = (function () {

    let playerOne;
    let playerTwo;
    let currentPlayer;

    function Player(sign) {
        this.sign = sign;

        let setSign = (newSign) => this.sign = newSign;
        let getSign = () => this.sign;
        return { setSign, getSign };
    }

    function switchPlayer() {
        currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
    }

    let htmlController = (function () {
        const gameBoard = document.querySelectorAll(".quadrant");
        const resetButton = document.querySelector(".reset");
        resetButton.addEventListener("click", () => {
            reset();
        });

        function startListening() {
            gameBoard.forEach(quadrant => {
                quadrant.addEventListener('click', function () {
                    divClicked(this.id);
                });
            });
        };

        function reset() {
            gameBoard.forEach(quadrant => {
                quadrant.innerHTML = "";
            });

            gameGrid.reset();

        };

        function showStartGameOverlay() {
            const overlay = document.querySelector(".game-start-overlay");
            overlay.style.display = "flex";
            overlay.addEventListener("click", () => {
                overlay.style.display = "none";
            });
        }

        function showPositionTakenOverlay() {
            let toast = document.getElementById('toast');
            toast.style.display = 'block';
            // Remove any existing animation before setting a new one
            toast.style.animation = '';
            toast.offsetHeight; // Trigger reflow to reset the animation
            toast.style.animation = 'slideIn 0.5s forwards';
            setTimeout(function () {
                toast.style.animation = 'slideOut 0.5s forwards';
            }, 2000); // 2 seconds before slideOut starts
        };

        function updateGameBoard(response, sign) {
            const quadrant = document.getElementById(response.toString());
            quadrant.innerHTML = (sign === "X") ? '<i class="fab fa-xbox"></i>' : '<i class="fab fa-playstation"></i>';
        };

        function showGameOverOverlay(sign) {
            const GameOverOverlay = document.querySelector(".game-over-overlay");
            GameOverOverlay.style.display = "flex";
            if (sign === "Draw") {
                GameOverOverlay.innerHTML = `<p>It's a draw!</p>`;
            } else {
                GameOverOverlay.innerHTML = `<p>${sign === "X" ? '<i class="fab fa-xbox"></i>' : '<i class="fab fa-playstation"></i>'} wins!</p>`;
            }
            GameOverOverlay.addEventListener("click", () => {
                reset();
                GameOverOverlay.style.display = "none";
            });
        }


        function divClicked(id) {
            gameGrid.checkifWin(currentPlayer)
            let response = parseInt(id);
            if (gameGrid.gameBoard[response] === null) {
                gameGrid.gameBoard[response] = currentPlayer.getSign();
                gameGrid.displayBoard();
                htmlController.updateGameBoard(response, currentPlayer.getSign());
                if (gameGrid.checkifWin(currentPlayer)) {
                    console.log(`${currentPlayer.getSign()} wins!`);
                } else {
                    switchPlayer();
                }
            } else {
                console.log("That position is taken!");
                htmlController.showPositionTakenOverlay();
            }

        }
        return { reset, showGameOverOverlay, updateGameBoard, showPositionTakenOverlay, startListening, showStartGameOverlay };
    })();

    const gameGrid = (function () {

        let gameBoard = [
            null, null, null,
            null, null, null,
            null, null, null
        ];

        function reset() {
            gameBoard.fill(null);
        }

        function displayBoard() {
            for (let row = 0; row < 3; row++) {
                let rowString = "";
                for (let col = 0; col < 3; col++) {
                    const index = row * 3 + col;
                    if (gameBoard[index] === null) {
                        rowString += "  ";
                    } else {
                        rowString += gameBoard[index] + " ";
                    }
                }
                console.log(rowString);
            }
        }

        function checkifWin(player) {
            const winningCombinations = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ];

            for (const combination of winningCombinations) {
                let isWinningCombination = true;
                for (const position of combination) {
                    if (gameBoard[position] !== player.getSign()) {
                        isWinningCombination = false;
                        break;
                    }
                }
                if (isWinningCombination) {
                    htmlController.showGameOverOverlay(currentPlayer.getSign());
                    return true;
                }
            }
            if (checkifDraw()) {
                htmlController.showGameOverOverlay("Draw");
            }
            return false;
        }

        function checkifDraw() {
            return gameBoard.every(position => position !== null);
        }

        return { displayBoard, checkifWin, checkifDraw, gameBoard, reset };

    })();

    function addPlayers(signOne, signTwo) {
        playerOne = new Player(signOne);
        playerTwo = new Player(signTwo);
    }

    function startGame() {
        addPlayers("X", "O");
        currentPlayer = playerOne; // Start with playerOne
        htmlController.startListening();
        htmlController.showStartGameOverlay();
        gameGrid.displayBoard();
    }

    return { startGame };

})();

gameController.startGame();




