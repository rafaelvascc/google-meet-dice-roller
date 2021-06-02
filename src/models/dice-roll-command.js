import { diceCommandRegexNoGlobal } from '../constants/regular-expressions';

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
        if (diceCommandRegexNoGlobal.test(cmd)) {
            const matches = diceCommandRegexNoGlobal.exec(cmd);
            const {
                diceCount,
                sides,
                constant,
                constOp,
                constValue,
                hl,
                hlOp,
                hlVal,
                dm,
                dmOp,
                dmVal,
                tn,
                tnOp,
                tnVal
            } = matches.groups;

            const intDiceCount = parseInt(diceCount || '1');
            const intSides = parseInt(sides || '1');

            this.subtract = intDiceCount < 0;
            this.rolls = intDiceCount < 0 ? intDiceCount * -1 : intDiceCount;
            this.sides = intSides;

            if (constant) {
                const intConstant = parseInt(constValue);
                if (constOp === "+") {
                    this.plus = intConstant;
                }
                if (constOp === "-") {
                    this.minus = intConstant;
                }
                if (constOp === "*") {
                    this.times = intConstant;
                }
            }

            if (hl) {
                const intHlVal = parseInt(hlVal);
                if (hlOp === "l") {
                    this.keepLower = intHlVal;
                }
                if (hlOp === "h") {
                    this.keepHigher = intHlVal;
                }
            }

            if (dm) {
                const intDmVal = parseInt(dmVal);
                if (dmOp === "d") {
                    this.difficulty = intDmVal;
                }
                if (dmOp === "m") {
                    this.limit = intDmVal;
                }
            }

            if (tn) {
                const intTnVal = parseInt(tnVal);
                if (tnOp === "t") {
                    this.target = intTnVal;
                }
                if (tnOp === "n") {
                    this.negate = intTnVal;
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