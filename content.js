async function extractText() {
  let textContent = document.body.innerText.trim() || "";
  
  // Remove repeated unnecessary text
  textContent = textContent.replace(/(giItT1WQy@!\-\/#[\s\n]*)+/g, '');
  textContent = textContent.replace(/(Game PIN:\s*\d+\s*)+/gi, ''); // Remove repeated Game PIN entries
  textContent = textContent.replace(/(Next|Skip|Show media|Jump to main content)/gi, ''); // Remove unnecessary UI text
  textContent = textContent.replace(/(\bSpace\b[\s\n]*)+/gi, ''); // Remove repeated 'Space' text
  
  console.log("Captured Text:", textContent);
  chrome.storage.local.set({ capturedText: textContent });
  localStorage.setItem("capturedText", textContent);
}

// Observe DOM changes to update text dynamically
const observer = new MutationObserver(() => {
  extractText();
});

observer.observe(document.body, { childList: true, subtree: true, characterData: true });

extractText();