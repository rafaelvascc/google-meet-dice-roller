if (chrome && chrome.runtime) {
    chrome.runtime.onInstalled.addListener((event) => {
        if (event.reason === chrome.runtime.OnInstalledReason.INSTALL || event.reason === chrome.runtime.OnInstalledReason.UPDATE) {
            chrome.tabs.create({
                url: 'https://github.com/rafaelvascc/google-meet-dice-roller/blob/master/README.md'
            });
        }
    });
}