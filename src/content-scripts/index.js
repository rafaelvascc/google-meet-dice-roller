import processRollCommand from '../functions/command-processing'

document.addEventListener("keydown", event => {
    if (event.target.name === "chatTextInput" && event.keyCode === 13 && (event.target.value.startsWith('roll') || event.target.value.startsWith('/r'))) {
        event.target.value = processRollCommand(event.target.value);
    }
}, true);