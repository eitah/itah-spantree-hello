const inquirer = require('inquirer');
const chalk = require('chalk');

// board
// [
//     [],
//     ['R'],
// ]

const Game = class {
    constructor() {
        this.numberOfColumns = 7;
        this.board = [
            ['-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-'],
        ];
    }

    paintBoard() {
        console.log(' 1 | 2 | 3 | 4 | 5 | 6 | 7 ');
        this.board.forEach(rowArray => {
            const row = rowArray.reduce((agg, space, index) => {
                let row = `${agg} ${space}`;

                if (index !== (rowArray.length - 1)) {
                    row += ` |`;
                }

                return row
            }, '');
            console.log(row);
        })
    }

    placeToken(column, color = 'R') {
        if (column === undefined) {
            console.log('column is undefined');
            return false;
        }

        // determine how deep the token travels
        let correctDepth = -1;
        this.board.forEach((row, rowIndex) => {
            if (row[column] === '-' && correctDepth < rowIndex) {
                correctDepth = rowIndex
            }
        });
        if (correctDepth === -1) {
            return false;
        }
        const finalColor = (color === 'W') ? 'W' : color;
        this.board[correctDepth][column] = finalColor;

        this.lastMove = [correctDepth, column];
        console.log(`Placing ${finalColor} token ${column}`)
        this.paintBoard();
        return true

    }

    checkForWinner() {
        let result = false;
        const columns = [[], [], [], [], [], [], []];
        // check for row
        this.board.forEach((row) => {
                let whiteCount = 0;
                let redCount = 0;
                // check for row
                // row 5 index0 and row 6 index 0 full
                // colunms [0 ] index 4 and 5

                row.forEach((space, index) => {
                    columns[index].push(space);
                    // console.log("index >>>", index, columns[index +1]);
                    // console.log(columns)
                    if (space === 'W') {
                        whiteCount += 1;
                        redCount = 0;
                    } else if (space === 'R') {
                        whiteCount = 0;
                        redCount += 1;
                    } else {
                        whiteCount = 0;
                        redCount = 0;
                    }

                    if (whiteCount >= 4) {
                        result = 'WHITE WIN';
                    }
                    if (redCount >= 4) {
                        result = 'RED WIN';
                    }
                })

            });

        // check for column
        columns.forEach((row) => {
            let whiteCount = 0;
            let redCount = 0;
            // check for row
            // row 5 index0 and row 6 index 0 full
            // colunms [0 ] index 4 and 5

            row.forEach((space, index) => {
                // console.log("index >>>", index, columns[index +1]);
                // console.log(columns)
                if (space === 'W') {
                    whiteCount += 1;
                    redCount = 0;
                } else if (space === 'R') {
                    whiteCount = 0;
                    redCount += 1;
                } else {
                    whiteCount = 0;
                    redCount = 0;
                }

                if (whiteCount >= 4) {
                    result = 'WHITE WIN';
                }
                if (redCount >= 4) {
                    result = 'RED WIN';
                }
            })

        });

        // check for diagonals
        // in format row, column, example 1st 1st is 6, 0
        console.log('this.lastMove', this.lastMove);
        // const column = lastMove[1] + 1;
        // const row = 6 - lastMove[0];
        // const lowerBound = Math.max(0, column - 4)

        // for(let i= lowerBound; lowerBound < i && i < upperbound; i++) {
        // }
        // index 
        
    //     let steps = [1, 2,3]
    //     steps.forEach([lastMove[0] + step, lastMove[1] + 1]) {
    //    }

        return result;
    }

    aiMakeMove() {
        let myColumn = 0;
        while (!this.placeToken(myColumn, 'W')) {
            myColumn += 1;
        }
    }

    isBoardFull() {
        let response = true;
        this.board.forEach(row => {
            row.forEach(space => {
                if (space === '-') {
                    response = false
                }
            })
        });
        return response
    }
}

async function takeTurn(myGame) {
    const turnPrompt = {
        type: 'input',
        name: 'space',
        validate: (mySpace) => {

            if (mySpace <= myGame.numberOfColumns && mySpace > 0) {
                return true;
            }
            console.log('\nnope, try again with a valid space\n')
            return false;
        },
        message: `${chalk.red('Place a piece in column:')}`
    };
    const input = await inquirer.prompt(turnPrompt);
    const mySpace = input.space * 1 - 1; // convert to number and index value
    const result = myGame.placeToken(mySpace);
    if (!result) {
        console.log('Please chose a different move');
        return false
    }
    return true;
}

async function startGame() {
    console.log('welcome to the game!\n');
    const myGame = new Game();
    myGame.paintBoard();
    try {
        do {
            const result = await takeTurn(myGame);
            if (result && !myGame.checkForWinner()) {
                myGame.aiMakeMove();
            }
        } while (!myGame.isBoardFull() && !myGame.checkForWinner());
        const outcome = myGame.checkForWinner();
        if (outcome) {
            return console.log(outcome);
        }
        console.log('If the code made it here the board is Full! Goodbye!');
    } catch (e) {
        console.log(`a bad thing happened ${e}`)
    }

}

startGame();
