const inquirer = require('inquirer');
const chalk = require('chalk');

const MAX_X_ROWS = 6;
const MAX_Y_COLUMNS = 7;
const Game = class {
    constructor() {
        this.board = [];
        Array(MAX_X_ROWS).fill('X').forEach((val, xindex) => {
            Array(MAX_Y_COLUMNS).fill('Y').forEach((val, yindex) => {
                // -1 is necessary to be sure that the x index is correct and that the rows are in the right order;
                this.board.push({ x: MAX_X_ROWS - xindex - 1, y: yindex });
            })
        });
    }

    paintBoard() {
        console.log(' 1 | 2 | 3 | 4 | 5 | 6 | 7 ');
        const output = this.board.reduce((agg, space) => {
            let output = `${agg} ${space.val || '-'}`;

            if ((space.y === (MAX_Y_COLUMNS - 1))) {
                output += '\n'
            } else {
                output += ` |`;
            }
            return output
        }, '');
        console.log(output);

    }

    placeToken(column, color = 'R') {
        if (column === undefined) {
            console.log('column is undefined');
            return false;
        }

        // determine how deep the token travels
        const myColumn = this.board.filter(space => space.y === column);
        const emptySpaces = myColumn.filter(space => !space.val);

        if (!emptySpaces.length) {
            console.log('no empty spaces')
            return false
        }

        const x_values = emptySpaces.map(space => space.x)
        const lowest_x = Math.min(...x_values);

        const smallest_x_space = this.board.find((space) => space.x === lowest_x && space.y === column);

        const index = this.board.indexOf(smallest_x_space)
        this.lastMove = this.board[index];

        const finalColor = (color === 'W') ? 'W' : color;
        this.board[index].val = finalColor;

        this.paintBoard();
        return true;
    }

    examineArray(array) {
        let result = false
        let whiteCount = 0;
        let redCount = 0;

        array.forEach(space => {
            if (space.val === 'W') {
                whiteCount += 1;
                redCount = 0;
            } else if (space.val === 'R') {
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

        return result
    }

    getDiagonal(myMove) {
        const rightCoordinates = [-3, -2, -1, 0, 1, 2, 3].reduce((acc, val) => { // check values 4 to either side of current piece
            const x = myMove.x + val;
            const y = myMove.y + val
            if (x >= 0 && x < MAX_X_ROWS &&
                y >= 0 && y < MAX_Y_COLUMNS) {
                    acc.push({ x, y })
                    return acc;
            }
            return acc;
        }, [])
        const leftCoordinates = [-3, -2, -1, 0, 1, 2, 3].reduce((acc, val) => { // check values 4 to either side of current piece
            const x = myMove.x + val;
            const y = myMove.y - val;
            if (x >= 0 && x < MAX_X_ROWS &&
                y >= 0 && y < MAX_Y_COLUMNS) {
                    acc.push({ x, y })
                    return acc;
            }
            return acc;
        }, [])
        
        const result = {
            upAndRight: rightCoordinates.map(space => this.board.find(boardSpace => space.x === boardSpace.x && space.y === boardSpace.y )),
            upAndLeft:  leftCoordinates.map(space => this.board.find(boardSpace => space.x === boardSpace.x && space.y === boardSpace.y )),
        };

        return result;
    }
    checkForWinner() {
        let result = false;
        // check rows
        let row = this.board.filter(space => space.x === this.lastMove.x);
        result = this.examineArray(row);

        if (!result) {
            // if no win check columns
            let column = this.board.filter(space => space.y === this.lastMove.y);
            result = this.examineArray(column);
        }

        if (!result) {
            // if no win check diagonals
            const { upAndRight, upAndLeft } = this.getDiagonal(this.lastMove);
            result = this.examineArray(upAndRight);
            if (!result) {
                result = this.examineArray(upAndLeft);
            }
        }
        return result
    }

    aiMakeMove() {
        let column = 0;
        while (!this.placeToken(column, 'W')) {
            column += 1;
        }
        return true
    }

    isBoardFull() {
        return !this.board.filter(space => !space.val).length
    }
}

async function takeTurn(myGame) {
    const turnPrompt = {
        type: 'input',
        name: 'space',
        validate: (mySpace) => {
            // validate runs before the input is accepted;
            if (mySpace <= MAX_Y_COLUMNS && mySpace > 0) {
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

const newGamePrompt = {
    type: 'confirm',
    name: 'newGame',
    message: 'Would you like to play a new game?'
}

async function startGame() {
    console.log('Welcome to the game!\n');
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
            console.log(outcome);
        } else {
            console.log('If the code made it here there are no possible moves remaining board is Full! Goodbye!');
        }
        const input = await inquirer.prompt(newGamePrompt);
        if (input.newGame) {
            return startGame();
        }
        return console.log(`Congratulations on the ${outcome ? outcome.toLowerCase() : 'tie game'}! Goodbye.`)
    } catch (e) {
        console.log(`a bad thing happened ${e}`)
    }

}

startGame();
