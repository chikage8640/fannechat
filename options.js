function saveOptions(e) {
    e.preventDefault();
    browser.storage.local.set({
      apiUrl: document.getElementById("apiUrl").value
    });
  };
  
  function restoreOptions() {
  
    function setCurrentChoice(result) {
      document.getElementById("apiUrl").value = result.apiUrl || "https://script.google.com/macros/s/AKfycby3K3Tu1Pl1A2eEWdwKlwnJ3KtwapscfW58uYaV5DuFAqkBMlesH_kKGzrfa4XfS14g/exec";
    };
  
    function onError(error) {
      console.log(`Error: ${error}`);
    };
  
    const getting = browser.storage.local.get("apiUrl");
    getting.then(setCurrentChoice, onError);
  };
  
  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);
  