document.addEventListener("keydown", event => {
    if (event.target.name === "chatTextInput" && event.keyCode === 13) {
        if (event.target.value.startsWith('roll') || event.target.value.startsWith('/r')) {
            event.target.value = processRollCommand(event.target.value);
        }
    }
}, true);