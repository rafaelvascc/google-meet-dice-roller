import { diceRegex } from '../constants/regular-expressions';

/** @class DiceRollCommand represents a single dice roll command like '5d6+10'. */
class DiceRollCommand {
    /**
     * @constructor
     * @param {String} commandString The dice rolling command token, like '5d6+10', from which this object got it's values.
     */
    constructor(commandString) {
        this.subtract = false;
        this.rolls = 1;
        this.sides = 0;
        this.keepLower = 0;
        this.keepHigher = 0;
        this.difficulty = 0;
        this.limit = 0;
        this.target = 0;
        this.negate = 0;
        this.plus = 0;
        this.minus = 0;
        this.times = 0;
        this.command = commandString;
        this.processCommandString(commandString);
    }

    /**
     * Extracts values from a dice roll command string to this object's properties.
     * 
     * @param {String} commandString The dice rolling command token, like '5d6+10'. If null/empty string/undefined, will use the 'commandString' value set in the constructor.
     */
    processCommandString = (commandString) => {
        const cmd = commandString || this.command;
        if (diceRegex.test(cmd)) {
            const matches = diceRegex.exec(cmd);
            for (let i = 1; i <= matches.length; i++) {
                const subToken = matches[i];
                if (subToken) {
                    if (i === 1) {
                        this.subtract = subToken === '-';
                        continue;
                    }
                    if (i === 2) {
                        this.rolls = parseInt(subToken);
                        continue;
                    }
                    if (i === 3) {
                        this.sides = parseInt(subToken);
                        continue;
                    }
                    if (i === 6) {
                        if (matches[5].toLowerCase() === "l") {
                            this.keepLower = parseInt(subToken);
                        }
                        if (matches[5].toLowerCase() === "h") {
                            this.keepHigher = parseInt(subToken);
                        }
                        continue;
                    }
                    if (i === 9) {
                        if (matches[8].toLowerCase() === "d") {
                            this.difficulty = parseInt(subToken);
                        }
                        if (matches[8].toLowerCase() === "m") {
                            this.limit = parseInt(subToken);
                        }
                        continue;
                    }
                    if (i === 12) {
                        if (matches[11] === "+") {
                            this.plus = parseInt(subToken);
                        }
                        if (matches[11] === "-") {
                            this.minus = parseInt(subToken);
                        }
                        if (matches[11] === "*") {
                            this.times = parseInt(subToken);
                        }
                        continue;
                    }
                    if (i === 15) {
                        if (matches[14].toLowerCase() === "t") {
                            this.target = parseInt(subToken);
                        }
                        if (matches[14].toLowerCase() === "n") {
                            this.negate = parseInt(subToken);
                        }
                    }
                }
            }
        }
        else {
            throw `Invalid dice roll command ${cmd}`;
        }
    }

    /**
     * Creates a new instance of DiceRollCommand from a dice roll command string like'5d6+10'.
     * 
     * @param {String} commandString The dice rolling command token, like '5d6+10'.
     */
    static fromCommandString = (commandString) => {
        return new DiceRollCommand(commandString);
    }
}

export default DiceRollCommand;