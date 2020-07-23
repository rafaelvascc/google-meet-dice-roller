const parseRollCommand = (input) => {
    let result = {
        dice: [],
        constant: 0
    };
    //Examples
    /*
    d6
    d6+1
    d6h1
    d6l1
    d6h1+1
    d6l1+1
    2d6
    2d6+1
    2d6h1
    2d6l1
    2d6h1+1
    2d6l1+1/r 1d6
    +2d6l1m3+1
    -2d10h1d3+1
    */
    const diceRegex = /^([+-]*)(\d*)d(\d+)(([hl])(\d+))?(([dm])(\d+))?(([+-])(\d+))?(([tn])(\d+))?$/
    const constRegex = /^([+-])(\d+)$/

    if (!input) {
        return null;
    }

    const tokens = input.split(' ');

    for (const token of tokens) {
        if (diceRegex.test(token)) {
            let dice = {
                subtract: false,
                rolls: 1,
                sides: 0,
                keepLower: 0,
                keepHigher: 0,
                difficulty: 0,
                limit: 0,
                target: 0,
                negate: 0,
                plus: 0,
                minus: 0,
                command: token
            };

            const matches = diceRegex.exec(token);

            for (let i = 1; i <= matches.length; i++) {
                const subToken = matches[i];
                if (subToken) {
                    if (subToken === '-' && i === 1) {
                        dice.subtract = true;
                    }
                    if (i === 2) {
                        dice.rolls = parseInt(subToken);
                    }
                    if (i === 3) {
                        dice.sides = parseInt(subToken);
                    }
                    if (i === 6) {
                        if (matches[5].toLowerCase() === "l") {
                            dice.keepLower = parseInt(subToken);
                        }
                        if (matches[5].toLowerCase() === "h") {
                            dice.keepHigher = parseInt(subToken);
                        }
                    }
                    if (i === 9) {
                        if (matches[8].toLowerCase() === "d") {
                            dice.difficulty = parseInt(subToken);
                        }
                        if (matches[8].toLowerCase() === "m") {
                            dice.limit = parseInt(subToken);
                        }
                    }
                    if (i === 12) {
                        if (matches[11] === "+") {
                            dice.plus = parseInt(subToken);
                        }
                        if (matches[11] === "-") {
                            dice.minus = parseInt(subToken);
                        }
                    }
                    if (i === 15) {
                        if (matches[14].toLowerCase() === "t") {
                            dice.target = parseInt(subToken);
                        }
                        if (matches[14].toLowerCase() === "n") {
                            dice.negate = parseInt(subToken);
                        }
                    }
                }
            }
            result.dice.push(dice);
        }
        if (constRegex.test(token)) {
            const matches = constRegex.exec(token);

            if (matches && matches.length && matches[2]) {
                if (matches[1] === "+") {
                    result.constant += parseInt(matches[2]);
                }
                if (matches[1] === "-") {
                    result.constant -= parseInt(matches[2]);
                }
            }
        }
    }

    return result;
}

export default parseRollCommand;