import readline from 'readline';
import parseRollCommand from './parser.js';
import rollDice from './roller.js';
 import formatRoll from './presenter.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(`Roll Dices 0.1`);
rl.on('line', (input) => {
    let total = 0;
    const cmds = parseRollCommand(input);
    if (cmds && cmds.dice && cmds.dice.length) {
        for (const die of cmds.dice) {
            const roll = rollDice(die);
            total += roll.sum;
            console.log(formatRoll(roll));
        }
        if(cmds.dice.length > 1) {
            console.log(`Total: ${total}`);
        }
    }
});