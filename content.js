function extractText() {
  let textContent = document.body.innerText.trim() || "";
  console.log("Captured Text:", textContent);
  chrome.storage.local.set({ capturedText: textContent });
}

// Observe DOM changes to update text dynamically
const observer = new MutationObserver(() => {
  extractText();
});

observer.observe(document.body, { childList: true, subtree: true, characterData: true });

extractText();