const formatRoll = (roll) => {
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
    } = roll;

    return `Result: ${success !== null ? success ? `SUCCESS ` : `FAILURE ` : ''}(${rolls.join(', ')})${successes !== null ? `, Successes: ${successes}` : ''}, Total: ${sum}`;
}

console.info("Loaded formatRoll function");

//export default formatRoll;