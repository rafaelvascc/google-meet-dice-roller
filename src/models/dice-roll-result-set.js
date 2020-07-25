import DiceRollCommand from './dice-roll-command';
import DiceRollResult from './dice-roll-result';
import { diceRegex, constRegex } from '../constants/regular-expressions';

/** @class DiceRollResult represents a set dice roll results after processing many DiceRollCommands and possibly a constant for addind/subtracting from the final result.*/
class DiceRollResultSet {
    /**
     * @constructor
     * @param {String} input The full /r or 'roll' command line typed by the user.
     */
    constructor(input) {
        this.results = [];
        this.constant = 0;
        this.processUserInput(input);
    }

    /**
     * Reads the full /r or 'roll' command line from the user, process it and stores the result into this object's properties. 
     * 
     * @param {String} input The full /r or 'roll' command line from the user.
     */
    processUserInput = (input) => {
        if (!input) return;

        const tokens = input.split(' ');

        for (const token of tokens) {
            if (diceRegex.test(token)) {
                const diceCmd = DiceRollCommand.fromCommandString(token);
                const diceRollResult = DiceRollResult.fromDiceRollCommand(diceCmd);
                this.results.push(diceRollResult);
            }
            if (constRegex.test(token)) {
                const matches = constRegex.exec(token);

                if (matches && matches.length && matches[2]) {
                    if (matches[1] === "+") {
                        this.constant += parseInt(matches[2]);
                    }
                    if (matches[1] === "-") {
                        this.constant -= parseInt(matches[2]);
                    }
                }
            }
        }
    }

    /**
     * Formats this object's total sum, plus constants, of dice rolling results into a string for presentation to the user.
     * 
     * @returns {String} The string used to present the total sum of dice rolling results to the user.
     */
    formatTotalResult = (total, constant) => {
        return `Total: ${constant !== 0 ? (constant > 0 ? `${total} + ${constant} = ${total + constant}` : `${total} - ${constant * -1} = ${total + constant}`) : total}\n`;
    }

    /**
     * Formats this object's dice rolling result into a string for presentation to the user.
     * 
     * @returns {String} The string used to present this object's results to the used.
     */
    asPresentationString = () => {
        let output = "";
        let total = 0;
        if (this.results && this.results.length) {
            for (const result of this.results) {
                total += result.sum;
                output += result.asPresentationString();
            }
            if (this.results.length > 1 || this.constant !== 0) {
                output += this.formatTotalResult(total, this.constant);
            }
            output += "---------------------------------------------------------------------------"
        }
        return output;
    }

    /**
     * Creates a new instance of DiceRollResultSet from a user's /r or 'roll' command line.
     * 
     * @param {String} input The user's /r or 'roll' command line.
     * @returns {DiceRollResultSet} The newly created DiceRollResultSet.
     */
    static fromUserCommandLine = (input) => {
        if (!input) {
            return null;
        }
        else {
            return new DiceRollResultSet(input);
        }
    }
}

export default DiceRollResultSet;