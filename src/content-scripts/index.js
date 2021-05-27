import DiceRollResultSet from '../models/dice-roll-result-set'

var sets = {};

if (chrome && chrome.storage) {
    chrome.storage.sync.get(["gmdrsets"], function (result) {
        sets = result["gmdrsets"] || {};
    });

    chrome.storage.onChanged.addListener(function (changes) {
        var newSetsInStorage = changes["gmdrsets"];
        if (newSetsInStorage && newSetsInStorage["newValue"]) {
            sets = newSetsInStorage["newValue"]
        }
    });
}

if (chrome && chrome.runtime) {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (typeof (message) === "object" && message.type === "onBtnRollClick") {
            var chatTextInput = document.getElementsByName("chatTextInput")[0];
            chatTextInput.value = "roll " + message.payload;
            var event = new KeyboardEvent("keydown", {
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                altKey: false,
                bubbles: true,
                cancelBubble: false,
                cancelable: true,
                charCode: 0,
                composed: true,
                ctrlKey: false,
                defaultPrevented: false,
                detail: 0,
                eventPhase: 1,
                isComposing: false,
                isTrusted: true,
                location: 0,
                metaKey: false,
                repeat: false,
                returnValue: true,
                shiftKey: false
            });
            chatTextInput.dispatchEvent(event);
        }
    });
}

document.addEventListener("keydown", event => {
    if (event.keyCode === 13 && event.target.name === "chatTextInput" && (event.target.value.startsWith('roll') || event.target.value.startsWith('/r'))) {
        var rollLabel = event.target.value.startsWith('/r') ? event.target.value.substring('/r'.length).trim() : event.target.value.substring('roll'.length).trim();

        var hasDot = rollLabel.indexOf(".") > 0;
        var tokens = hasDot ? rollLabel.split(".") : [];

        if (tokens.length === 2) {
            var set = sets[tokens[0]];
            if (set) {
                var command = set["commands"][tokens[1]];
                if (command) {
                    const result = DiceRollResultSet.fromUserCommandLine(command);
                    event.target.value = result ? result.asPresentationString(rollLabel) : event.target.value;
                }
            }
        }
        else {
            const result = DiceRollResultSet.fromUserCommandLine(event.target.value);
            event.target.value = result ? result.asPresentationString() : event.target.value;
        }
    }
}, true);