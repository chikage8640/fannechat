function getCurrentWindowTabs() {
    return browser.tabs.query({currentWindow: true, active: true});
}
function reset(){
    const reloading = browser.tabs.reload()
    reloading.then(function() {
        getCurrentWindowTabs().then(tabs => {
            const activeTab=tabs[0].id;
            browser.pageAction.setPopup({tabId: activeTab, popup: "/popup.html"});
            window.close();
        });
    });
};
document.getElementById("stopButton").addEventListener('click', reset);