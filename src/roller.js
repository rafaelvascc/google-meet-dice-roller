const rollDie = (sides) => {
    const step = 1 / (sides);
    const rad = Math.random();
    const sub = 1 - rad;
    if(sub === 0) {
        sub = 0.000000000001;
    }
    return Math.ceil(sub / step);
}

const rollDice = (dice) => {
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
        command,
    } = dice;

    let result = {
        rolls: [],
        successes: null,
        success: null,
        sum: 0,
        plus,
        minus,
        difficulty,
        limit,
        target,
        negate,
        command
    }

    for (let i = 0; i < rolls; i++) {
        const value = rollDie(sides);
        result.rolls.push(value);
    }

    if (keepHigher) {
        result.rolls.sort((a, b) => b - a);
        result.sum = result.rolls.slice(0, keepHigher).reduce((a, b) => {
            return a + b;
        }, 0);
    }
    else if (keepLower) {
        result.rolls.sort((a, b) => a - b);
        result.sum = result.rolls.slice(0, keepLower).reduce((a, b) => {
            return a + b;
        }, 0);
    }
    else {
        result.rolls.sort((a, b) => b - a);
        result.sum = result.rolls.reduce((a, b) => {
            return a + b;
        }, 0);
    }

    if (difficulty) {
        result.successes = result.rolls.filter(v => v >= difficulty).length;
    }

    if (limit) {
        result.successes = result.rolls.filter(v => v <= limit).length;
    }

    if (minus) {
        result.sum += minus;
    }

    if (plus) {
        result.sum += plus;
    }

    if (target) {
        result.success = result.sum >= target;
    }

    if (negate) {
        result.success = result.sum <= negate;
    }

    if (subtract && result.sum) {
        result.sum = -result.sum;
    }

    return result;
}

console.info("Loaded rollDice function");

//export default rollDice;