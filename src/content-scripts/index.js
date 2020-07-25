import DiceRollResultSet from '../models/dice-roll-result-set'

document.addEventListener("keydown", event => {
    if (event.keyCode === 13 && event.target.name === "chatTextInput" && (event.target.value.startsWith('roll') || event.target.value.startsWith('/r'))) {
        const result = DiceRollResultSet.fromUserCommandLine(event.target.value)
        event.target.value = result ? result.asPresentationString() : event.target.value;
    }
}, true);