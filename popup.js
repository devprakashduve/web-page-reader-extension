document.addEventListener("DOMContentLoaded", function () {
  function updateTextOutput() {
    chrome.storage.local.get("capturedText", (data) => {
      document.getElementById("text-output").textContent = data.capturedText || "No text captured yet.";
    });
  }

  document.getElementById("capture").addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"]
      });
    });
    setTimeout(updateTextOutput, 2000);
  });

  updateTextOutput();
});