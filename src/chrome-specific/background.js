const collectionToHashSet = (collection) => {
    let kv = {};
    for (var i = 0; i < collection.length; i++) {
        var set = collection[i];
        kv[set.name] = {
            variables: {},
            commands: {}
        };
        if (set.items && set.items.length > 0) {
            for (var j = 0; j < set.items.length; j++) {
                var item = set.items[j];
                kv[set.name]["commands"][item.label] = item.command;
            }
        }
    }
    return kv;
}

if (chrome && chrome.runtime) {
    chrome.runtime.onInstalled.addListener((event) => {
        if (event.reason === chrome.runtime.OnInstalledReason.INSTALL || event.reason === chrome.runtime.OnInstalledReason.UPDATE) {
            try {
                //convert array bassed set into hash table based sets
                if (chrome && chrome.storage) {
                    chrome.storage.sync.get(["gmdrsets"], function (results) {
                        const oldVersionSets = results["gmdrsets"];
                        if (oldVersionSets && Array.isArray(oldVersionSets)) {
                            console.log("Converting array based collection", oldVersionSets);
                            const setsV2 = collectionToHashSet(oldVersionSets);
                            console.log("Converted array based collection. Updating storage.", oldVersionSets);
                            chrome.storage.sync.set({ "gmdrsets": setsV2 }, function () { });
                        }
                    });
                }
            }
            catch (err) {
                console.error("Error converting array based collection", err);
            }

            chrome.tabs.create({
                url: 'https://github.com/rafaelvascc/google-meet-dice-roller/blob/master/README.md'
            });
        }
    });
}