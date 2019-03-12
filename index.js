const inquirer = require('inquirer');
// const shell = require('shelljs');
const chalk = require('chalk');

const welcomePrompt = {
    type: 'input',
    name: 'favoriteColor',
    message: `${chalk.red('Welcome to hello world.')} Please input your favorite color: `
}

async function invokeHello() {
    try {
        const input = await inquirer.prompt(welcomePrompt);
        const color = input && input.favoriteColor;
        if (color) {
            console.log(`Too funny! My favorite color is ${color} too!`);
        } else {
            console.log('Hey not so fast please input your favorite color')
            const welcome = await inquirer.prompt(welcomePrompt);
        }
    } catch (e) {
        console.log(`a bad thing happened ${e}`)
    }

}


invokeHello();
