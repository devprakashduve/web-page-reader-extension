document.addEventListener("DOMContentLoaded", function () {
  function updateTextOutput() {
    chrome.storage.local.get("capturedText", (data) => {
      console.log(data.capturedText || "No text captured yet.");
      document.getElementById("text-output").textContent = data.capturedText || "No text captured yet.";
    });
    navigator.clipboard.writeText(data.capturedText).then(() => {
      console.log("Text copied to clipboard!");
    }).catch(err => console.error("Failed to copy text: ", err));
    // chrome.storage.local.set({ capturedText:  data.capturedText });
    // localStorage.setItem("capturedText", data.capturedText);
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

  document.getElementById("copy-button").addEventListener("click", function () {
    const text = document.getElementById("text-output").textContent;
    navigator.clipboard.writeText(text).then(() => {
      console.log("Text copied to clipboard!");
    }).catch(err => console.error("Failed to copy text: ", err));
  });

  updateTextOutput();
});