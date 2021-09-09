const button = document.getElementById("stopButton")
function getCurrentWindowTabs() {
    return browser.tabs.query({currentWindow: true, active: true});
};

function stopButton() {
    browser.runtime.sendMessage({
        "function": "setPopup",
        "file": "/popup.html"
    });
    getCurrentWindowTabs().then(tabs => {
        browser.tabs.sendMessage(tabs[0].id, {
          "function": "stopTranslateService"
        });
    });
};

button.onclick = stopButton();