document.addEventListener("keydown", event => {
    if (event.target.name === "chatTextInput" && event.keyCode === 13) {
        console.log(event.target);
        console.log(event.target.value);
        if (event.target.value.startsWith('roll')) {
            const input = event.target.value;
            let output = "";
            let total = 0;
            const cmds = parseRollCommand(input);
            if (cmds && cmds.dice && cmds.dice.length) {
                for (const die of cmds.dice) {
                    const roll = rollDice(die);
                    total += roll.sum;
                    output += formatRoll(roll) + "\n";
                }
                if (cmds.dice.length > 1) {
                    output += `Total: ${total}`;
                }
            }
            event.target.value = output;
        }
    }
}, true);