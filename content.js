// Function to create sidebar
function createSidebar() {
  const existingSidebar = document.getElementById("kahoot-text-sidebar");
  if (existingSidebar) return;

  const sidebar = document.createElement("div");
  sidebar.id = "kahoot-text-sidebar";
  sidebar.style.position = "fixed";
  sidebar.style.top = "0";
  sidebar.style.right = "0";
  sidebar.style.width = "300px";
  sidebar.style.height = "100vh";
  sidebar.style.backgroundColor = "white";
  sidebar.style.borderLeft = "2px solid black";
  sidebar.style.overflowY = "auto";
  sidebar.style.padding = "10px";
  sidebar.style.zIndex = "99999"; // Ensure visibility

  // Header with title and toggle button
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";




  const toggleButton = document.createElement("button");
  toggleButton.innerText = "−";
  toggleButton.style.marginLeft = "auto";
  toggleButton.style.padding = "5px 10px";
  toggleButton.style.cursor = "pointer";

  // Function to minimize/maximize sidebar
  toggleButton.onclick = function () {
    const minimized = sidebar.dataset.minimized === "true";
    if (minimized) {
      sidebar.style.width = "300px";
      sidebar.style.height = "100%";
      textBox.style.display = "block";
      copyButton.style.display = "block";
      toggleButton.innerText = "−";
      sidebar.dataset.minimized = "false";
    } else {
      sidebar.style.width = "40px";
      sidebar.style.height = "40px";
      textBox.style.display = "none";
      copyButton.style.display = "none";
      toggleButton.innerText = "+";
      sidebar.dataset.minimized = "true";
    }
  };

  header.appendChild(toggleButton);
  sidebar.appendChild(header);

  // Text area for extracted text
  const textBox = document.createElement("textarea");
  textBox.id = "text-output";
  textBox.style.width = "100%";
  textBox.style.height = "80%";
  textBox.style.display = "block";
  sidebar.appendChild(textBox);

  // Copy button
  const copyButton = document.createElement("button");
  copyButton.innerText = "Copy Text";
  copyButton.style.width = "100%";
  copyButton.style.marginTop = "5px";
  copyButton.onclick = function () {
    navigator.clipboard.writeText(textBox.value).then(() => {
      console.log("Text copied to clipboard!");
    });
  };
  sidebar.appendChild(copyButton);

  document.body.appendChild(sidebar);
  updateTextOutput();
}

// Ensure sidebar is injected on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createSidebar);
} else {
  createSidebar();
}




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
