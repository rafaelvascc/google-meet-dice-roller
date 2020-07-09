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
        plus, 
        minus,
        command
    } = roll;

    return `${command}:\n\t (${rolls.join(', ')})${plus ? ` +${plus} ` : minus ? ` -${minus} ` :  ''}${successes !== null ? `, Successes: ${successes}` : ''}, Total: ${sum}${target ? ` >= ${target},` : negate ? ` <= ${negate},` : ''}${success !== null ? success ? ` SUCCESS ` : ` FAILURE ` : ''}`;
}

console.info("Loaded formatRoll function");

//export default formatRoll;