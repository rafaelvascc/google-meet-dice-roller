export const formatRoll = (roll) => {
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

    return `${command}:\n\t (${rolls.join(', ')})${plus ? ` +${plus} ` : minus ? ` -${minus} ` :  ''}${successes !== null ? ` Successes: ${successes}` : ''} Total: ${sum}${target ? ` >= ${target},` : negate ? ` <= ${negate},` : ''}${success !== null ? success ? ` SUCCESS ` : ` FAILURE ` : ''}\n`;
}

export const formatTotalResult = (total, constant) => {
    return `Total: ${constant !== 0 ? (constant > 0 ? `${total} + ${constant} = ${total + constant}` : `${total} - ${constant * -1} = ${total + constant}` ): total}\n`;
}