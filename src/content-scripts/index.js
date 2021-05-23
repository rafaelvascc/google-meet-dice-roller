debugger;
import DiceRollResultSet from '../models/dice-roll-result-set'

var sets = {};

function setsArrayToHashSet(setsInStorage) {
    for (var i = 0; i < setsInStorage.length; i++) {
        var set = setsInStorage[i];
        sets[set.name] = {};
        if (set.items && set.items.length > 0) {
            for (var j = 0; j < set.items.length; j++) {
                var item = set.items[j];
                sets[set.name][item.label] = item.command;
            }
        }
    }
}

if (chrome && chrome.storage) {
    chrome.storage.sync.get(["gmdrsets"], function (result) {
        var setsInStorage = result["gmdrsets"];
        if (setsInStorage && setsInStorage.length > 0) {
            setsArrayToHashSet(setsInStorage);
        }
    });

    chrome.storage.onChanged.addListener(function (changes) {
        var newSetsInStorage = changes["gmdrsets"];
        if (newSetsInStorage && newSetsInStorage["newValue"]) {
            sets = {}
            setsArrayToHashSet(newSetsInStorage["newValue"]);
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
        var value = event.target.value.startsWith('/r') ? event.target.value.substring('/r'.length).trim() : event.target.value.substring('roll'.length).trim();

        var hasDot = value.indexOf(".") > 0;
        var tokens = hasDot ? value.split(".") : [];

        if (tokens.length === 2) {
            var set = sets[tokens[0]];
            if (set) {
                var command = set[tokens[1]];
                if (command) {
                    const result = DiceRollResultSet.fromUserCommandLine(command);
                    event.target.value = result ? value + ": " + result.asPresentationString() : event.target.value;
                }
            }
        }
        else {
            const result = DiceRollResultSet.fromUserCommandLine(event.target.value);
            event.target.value = result ? result.asPresentationString() : event.target.value;
        }
    }
}, true);