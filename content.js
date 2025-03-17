async function extractText() {
  let textContent = document.body.innerText.trim() || "";
  
  // Remove repeated unnecessary text
  textContent = textContent.replace(/(giItT1WQy@!\-\/#[\s\n]*)+/g, '');
  textContent = textContent.replace(/(Game PIN:\s*\d+\s*)+/gi, ''); // Remove repeated Game PIN entries
  textContent = textContent.replace(/(Next|Skip|Show media|Jump to main content)/gi, ''); // Remove unnecessary UI text
  textContent = textContent.replace(/(\bSpace\b[\s\n]*)+/gi, ''); // Remove repeated 'Space' text
  textContent = textContent.replace('- Waiting for players - Kahoot!', 'generate answer for below question'); 

  chrome.storage.local.set({ capturedText: textContent });
}

// Observe DOM changes to update text dynamically
const observer = new MutationObserver(() => {
  extractText();
});
observer.observe(document.body, { childList: true, subtree: true, characterData: true });
extractText();

// Function to update sidebar content
function updateTextOutput() {
  chrome.storage.local.get("capturedText", (data) => {
    const text = data.capturedText || "No text captured yet.";
    const textBox = document.getElementById("text-output");
    if (textBox) textBox.value = text;
  });
}

chrome.storage.onChanged.addListener(updateTextOutput);