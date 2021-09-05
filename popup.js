function getCurrentWindowTabs() {
    return browser.tabs.query({currentWindow: true, active: true});
}

function runTranslation(e) {
    e.preventDefault();
    browser.storage.local.set({
      target: document.getElementById("target").value
    });
    browser.tabs.executeScript({file: "/youtube.js"});
    getCurrentWindowTabs().then(tabs => {
        const activeTab=tabs[0].id;
        browser.pageAction.setPopup({tabId: activeTab, popup: "/popup2.html"});
        window.close();
    });

  };
  
  function restoreOptions() {
  
    function setCurrentChoice(result) {
      document.getElementById("target").value = result.target || "";
    };
  
    function onError(error) {
      console.log(`Error: ${error}`);
    };
  
    const getting = browser.storage.local.get("target");
    getting.then(setCurrentChoice, onError);
  };
  
  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.querySelector("form").addEventListener("submit", runTranslation);
  