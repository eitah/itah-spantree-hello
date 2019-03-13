const inquirer = require('inquirer');
const chalk = require('chalk');

const Game = class {
    constructor () {
        this.board = [
            ['-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-'],
        ];
    }

    paintBoard() {
        this.board.forEach(rowArray => {
            const row = rowArray.reduce((agg, space, index) => {
                let row = `${agg} ${space}`
                
                if (index !== (rowArray.length - 1)) {
                    row += ` |`;
                }
    
                return row
            }, '')
            console.log(row);
        })
    }

    placeToken(column, color = 'R') {
        if (column=== undefined) {
            console.log('column is undefined')
            return false;

        }

        // determine how deep the token travels
        let correctDepth = -1;
        this.board.forEach((row, rowIndex)=>{
            if (row[column] === '-' && correctDepth < rowIndex) {
                correctDepth = rowIndex
            } 
        })
        if (correctDepth === -1) {
            return false;
        }
        const finalColor = (color === 'W') ? 'W' : color;
        this.board[correctDepth][column] = finalColor
        console.log(`Placing ${finalColor} token ${column}`)
        this.paintBoard();
        return true

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
        })
        return response
    }
}

const turnPrompt = {
    type: 'input',
    name: 'space',
    message: `${chalk.red('Place a piece in column:')}`
}

async function takeTurn(myGame) {
    const input = await inquirer.prompt(turnPrompt);
    const mySpace = input.space * 1;
    if (mySpace < myGame.board[0].length && mySpace > 0) {
        const result = myGame.placeToken(mySpace);
        if (!result) {
            console.log('Please chose a different move')
            return false
        }
    } else {
        throw new Error('space is invalid')
        return false;
    }
    return true;
}

async function startGame() {
    console.log('welcome to the game!\n')        
    const myGame = new Game();
    myGame.paintBoard();
    try {
        do {
            const result = await takeTurn(myGame);
            if (result) {
                myGame.aiMakeMove();
            }
        } while (!myGame.isBoardFull())
        console.log('If the code made it here the board is Full! Goodbye!');
    } catch (e) {
        console.log(`a bad thing happened ${e}`)
    }

}

startGame();
