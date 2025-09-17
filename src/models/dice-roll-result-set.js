import DiceRollCommand from './dice-roll-command';
import DiceRollResult from './dice-roll-result';
import { execVariable } from './dice-roll-utils';
import { diceCommandRegexNoGlobal, constOnlyRegexNoGlobal, variableLabelInExpressionRegex } from '../constants/regular-expressions';
import math from 'mathjs-expression-parser';

/** @class DiceRollResult represents a set dice roll results after processing many DiceRollCommands and possibly a constant for addind/subtracting from the final result.*/
class DiceRollResultSet {
    /**
     * @constructor
     * @param {String} input The full /r or 'roll' command line typed by the user.
     */
    constructor(input, variables) {
        this.results = [];
        this.constant = 0;
        this.processUserInput(input, variables);
    }

    /**
     * Reads the full /r or 'roll' command line from the user, process it and stores the result into this object's properties. 
     * 
     * @param {String} input The full /r or 'roll' command line from the user.
     */
    processUserInput = (input, variables) => {
        if (!input) return;

        const tokens = input.split(' ');

        for (const token of tokens) {
            const cmd = this.replaceVariables(token, variables, true);
            if (diceCommandRegexNoGlobal.test(cmd)) {
                const diceCmd = DiceRollCommand.fromCommandString(cmd);
                const diceRollResult = DiceRollResult.fromDiceRollCommand(diceCmd);
                this.results.push(diceRollResult);
            }
            if (constOnlyRegexNoGlobal.test(cmd)) {
                const { constExp } = constOnlyRegexNoGlobal.exec(cmd).groups;
                const retVal = math.eval(constExp);
                this.constant += retVal;
            }
        }
    }

    replaceVariables = (input, variables, root) => {
        const matches = input.match(variableLabelInExpressionRegex);
        if (matches && matches[0]) {
            for (const match of matches) {
                const variableLabel = match.slice(1, -1);
                let variable = variables[variableLabel] || "NaN";
                const variableResult = execVariable(variable, variables);
                if (variableResult < 0) {
                    input = input.replaceAll(match, '(' + variableResult + ')');
                }
                else {
                    input = input.replaceAll(match, variableResult);
                }
                input = input.replaceAll("*+", '*');
                input = input.replaceAll("++", '+');
                input = input.replaceAll("--", '+');
                input = input.replaceAll("+-", '-');
                input = input.replaceAll("-+", '-');
            }
            if (root) {
                input = input.replaceAll("*+", '*');
                input = input.replaceAll("++", '+');
                input = input.replaceAll("--", '+');
                input = input.replaceAll("+-", '-');
                input = input.replaceAll("-+", '-');
                if (diceCommandRegexNoGlobal.test(input)) {
                    let newInput = '';
                    const subMatches = diceCommandRegexNoGlobal.exec(input);
                    const {
                        diceCount,
                        sides,
                        constant,
                        hl,
                        dm,
                        tn
                    } = subMatches.groups;
                    if (sides) {
                        newInput += (math.eval(diceCount || '1') || NaN) + "d" + sides;
                    }
                    if (hl) {
                        newInput += hl;
                    }
                    if (dm) {
                        newInput += dm;
                    }
                    if (constant) {
                        const constOp = constant[0];
                        if (constOp === '*') {
                            const constExp = constOp === '*' ? constant.slice(1) : constant;
                            const contantValue = math.eval(constExp);
                            newInput += constOp + (contantValue >= 0 ? `+${contantValue}` : contantValue);
                        }
                        else {
                            const contantValue = math.eval(constant);
                            newInput += contantValue >= 0 ? `+${contantValue}` : contantValue;
                        }
                    }
                    if (tn) {
                        newInput += tn;
                    }
                    input = newInput;
                }
                if (constOnlyRegexNoGlobal.test(input)) {
                    const { constExp } = constOnlyRegexNoGlobal.exec(input).groups;
                    const retVal = math.eval(constExp);
                    input = retVal >= 0 ? `+${retVal}` : retVal;
                }
            }
        }
        input = input.replaceAll("*+", '*');
        return input;
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
     * @returns {String} The string used to present this object's results to the user.
     */
    asPresentationString = (rollLabel) => {
        let output = rollLabel ? rollLabel + "\n" : "";
        let total = 0;
        if (this.results && this.results.length) {
            for (const result of this.results) {
                total += result.sum;
                output += result.asPresentationString();
            }
            if (this.results.length > 1 || this.constant !== 0) {
                output += this.formatTotalResult(total, this.constant);
            }
            output += "----------------------------------------------------"
        }
        return output;
    }

    /**
     * Creates a new instance of DiceRollResultSet from a user's /r or 'roll' command line.
     * 
     * @param {String} input The user's /r or 'roll' command line.
     * @returns {DiceRollResultSet} The newly created DiceRollResultSet.
     */
    static fromUserCommandLine = (input, variables) => {
        if (!input) {
            return null;
        }
        else {
            return new DiceRollResultSet(input, variables || {});
        }
    }
}

export default DiceRollResultSet;