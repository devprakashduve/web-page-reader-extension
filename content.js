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

  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";

  const title = document.createElement("h2");
  title.innerText = "Extracted Text";
  header.appendChild(title);

  const toggleButton = document.createElement("button");
  toggleButton.innerText = "−";
  toggleButton.onclick = function () {
    if (sidebar.style.width === "300px") {
      sidebar.style.width = "40px";
      textBox.style.display = "none";
      copyButton.style.display = "none";
      searchButton.style.display = "none";
      toggleButton.innerText = "+";
    } else {
      sidebar.style.width = "300px";
      textBox.style.display = "block";
      copyButton.style.display = "block";
      searchButton.style.display = "block";
      toggleButton.innerText = "−";
    }
  };
  header.appendChild(toggleButton);
  sidebar.appendChild(header);

  const textBox = document.createElement("textarea");
  textBox.id = "text-output";
  textBox.style.width = "100%";
  textBox.style.height = "70%";
  sidebar.appendChild(textBox);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "5px";
  buttonContainer.style.marginTop = "5px";

  const copyButton = document.createElement("button");
  copyButton.innerText = "Copy Text";
  copyButton.style.flex = "1";
  copyButton.onclick = function () {
    navigator.clipboard.writeText(textBox.value).then(() => {
      console.log("Text copied to clipboard!");
    });
  };

  const searchButton = document.createElement("button");
  searchButton.innerText = "Search on Google";
  searchButton.style.flex = "1";
  searchButton.onclick = function () {
    const query = encodeURIComponent(textBox.value);
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    } else {
      console.log("No text available to search.");
    }
  };

  buttonContainer.appendChild(copyButton);
  buttonContainer.appendChild(searchButton);
  sidebar.appendChild(buttonContainer);

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
  textContent = textContent.replace('- Waiting for players - Kahoot!', '');
  // textContent = textContent.replace('kahoot.it', 'generate answer this');  

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
