import DiceRollResultSet from '../models/dice-roll-result-set'
import $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/resizable';


const getImagePath = (imagePath) => {
    if (chrome && chrome.runtime) {
        return chrome.runtime.getURL(imagePath);
    }
    if (browser && browser.runtime) {
        return browser.runtime.getURL(imagePath);
    }
}


$(function () {
    var $container = $("#dice-roller-container")
    $container.draggable({ containment: "body", handle: '.navbar-dark' });
    $container.hide();
    var $btnToggle = $("<div id='dice-roller-toggle-button'>");
    $("body").append(
        $btnToggle
            .draggable({ containment: "body" })
            .append('<img src="' + getImagePath("icons/64.png") + '"/>')
            .css("position", "absolute")
            .css("top", "65px")
            .css("left", "16px")
            .css("z-index", "2")
            .css("border", "0")
            .css("cursor", "pointer")
            .css("border-radius", "50%")
            .on("click", function (event) {
                $container.css("top", $btnToggle.css("top")).css("left", $btnToggle.css("left"));
                $btnToggle.hide({
                    duration: 200,
                    complete: () => {
                        $container.show({
                            duration: 200
                        });
                    }
                });
            }));
});

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

document.addEventListener("keydown", event => {
    if (event.key === "Enter" && event.target.tagName.toLowerCase() === "textarea" && (event.target.value.startsWith('roll') || event.target.value.startsWith('/r'))) {
        var rollLabel = event.target.value.startsWith('/r') ? event.target.value.substring('/r'.length).trim() : event.target.value.substring('roll'.length).trim();

        var hasDot = rollLabel.indexOf(".") > 0;
        var tokens = hasDot ? rollLabel.split(".") : [];

        if (tokens.length === 2) {
            var set = sets[tokens[0]];
            if (set) {
                var command = set["commands"][tokens[1]];
                var variables = set["variables"];
                if (command) {
                    const result = DiceRollResultSet.fromUserCommandLine(command, variables);
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