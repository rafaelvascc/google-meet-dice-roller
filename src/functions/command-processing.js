import parseRollCommand from './command-parsing';
import rollDice from './dice-rolling';
import { formatRoll, formatTotalResult } from './formatting';

const processRollCommand = (input) => {
    let output = "";
    let total = 0;
    const cmds = parseRollCommand(input);
    if (cmds && cmds.dice && cmds.dice.length) {
        for (const die of cmds.dice) {
            const roll = rollDice(die);
            total += roll.sum;
            output += formatRoll(roll);
        }
        if (cmds.dice.length > 1) {
            output += formatTotalResult(total, cmds.constant);
        }
        output += "---------------------------------------------------------------------------"
    }
    return output;
}

export default processRollCommand;