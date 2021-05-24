/** @class DiceRollResult represents a single dice roll result after processing a DiceRollCommand. */
class DiceRollResult {
    /**
     * @constructor
     * @param {DiceRollCommand} diceRollCommand The dice rolling command object from which this object's rolls, successes, etc... will be processed.
     */
    constructor(diceRollCommand) {
        this.rolls = [];
        this.successes = null;
        this.success = null;
        this.sum = 0;
        this.plus = diceRollCommand.plus;
        this.minus = diceRollCommand.minus;
        this.difficulty = diceRollCommand.difficulty;
        this.limit = diceRollCommand.limit;
        this.target = diceRollCommand.target;
        this.negate = diceRollCommand.negate;
        this.command = diceRollCommand.command;
        this.processDiceRollCommand(diceRollCommand);
    }

    /**
     * Returns a random interger number with min value 1 and max value equals to the 'sides' parameter.
     * 
     * @param {Number} sides An interger number greaetr than 0. The maximum random number value (how many sides the die has).
     * @returns {Number} An interger number between (inclusive) 1 and the value from the 'sides' parameter.
     */
    rollDie = (sides) => {
        if (!sides || sides < 1) {
            throw "Number of sides should be a number greater than 0";
        }

        const step = 1 / sides;
        const rad = Math.random();
        const sub = 1 - rad;
        if (sub === 0) {
            sub = 0.000000000001;
        }
        return Math.ceil(sub / step);
    }

    /**
     * Takes values from a dice roll command, rolls dice and stores the results into this object's properties.
     * 
     * @param {DiceRollCommand} diceRollCommand The dice rolling command.
     */
    processDiceRollCommand = (diceRollCommand) => {
        const {
            subtract,
            rolls,
            sides,
            keepLower,
            keepHigher,
            difficulty,
            limit,
            target,
            negate,
            plus,
            minus,
            times,
            command,
        } = diceRollCommand;

        for (let i = 0; i < rolls; i++) {
            const value = this.rollDie(sides);
            this.rolls.push(value);
        }

        if (keepHigher) {
            this.rolls.sort((a, b) => b - a);
            this.sum = this.rolls.slice(0, keepHigher).reduce((a, b) => {
                return a + b;
            }, 0);
        }
        else if (keepLower) {
            this.rolls.sort((a, b) => a - b);
            this.sum = this.rolls.slice(0, keepLower).reduce((a, b) => {
                return a + b;
            }, 0);
        }
        else {
            this.rolls.sort((a, b) => b - a);
            this.sum = this.rolls.reduce((a, b) => {
                return a + b;
            }, 0);
        }

        if (difficulty) {
            this.successes = this.rolls.filter(v => v >= difficulty).length;
        }

        if (limit) {
            this.successes = this.rolls.filter(v => v <= limit).length;
        }

        if (minus) {
            this.sum -= minus;
        }

        if (plus) {
            this.sum += plus;
        }

        if (times) {
            this.sum *= times;
        }

        if (target) {
            this.success = this.sum >= target;
        }

        if (negate) {
            this.success = this.sum <= negate;
        }

        if (subtract && this.sum !== 0) {
            this.sum = -this.sum;
        }
    }

    /**
     * Formats this object's dice rolling result into a string for presentation to the user.
     * 
     * @returns {String} The string used to present this object's results to the user.
     */
    asPresentationString = (rollLabel) => {
        const {
            rolls,
            successes,
            failures,
            success,
            sum,
            difficulty,
            limit,
            target,
            negate,
            plus,
            minus,
            times,
            command
        } = this;

        return `${rollLabel ? `${rollLabel} => `: ''}${command}:\n\t (${rolls.join(', ')})${plus ? ` +${plus} ` : minus ? ` -${minus} ` : times ? ` *${times} ` : ''}${successes !== null ? ` Successes: ${successes}` : ''} Total: ${sum}${target ? ` >= ${target},` : negate ? ` <= ${negate},` : ''}${success !== null ? success ? ` SUCCESS ` : ` FAILURE ` : ''}\n`;
    }

    /**
     * Creates a new instance of DiceRollResult from a DiceRollCommand.
     * 
     * @param {DiceRollCommand} diceRollCommand The dice rolling command.
     * @returns {DiceRollResult} The newly created DiceRollResult.
     */
    static fromDiceRollCommand = (diceRollCommand) => {
        return new DiceRollResult(diceRollCommand);
    }
}

export default DiceRollResult;