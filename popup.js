// アクティブなタブを取得する
function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true, active: true});
};

function runTranslation() {
  const targetLang = document.getElementById("target").value
  browser.storage.local.set({
    target: targetLang
  });
  getCurrentWindowTabs().then(tabs => {
    browser.tabs.sendMessage(tabs[0].id, {
      "function": "runTranslateService",
      "target": targetLang
    });
  });

  browser.runtime.sendMessage({
    "function": "setPopup",
    "file": "/popup2.html"
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
