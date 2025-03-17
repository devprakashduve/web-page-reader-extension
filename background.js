chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: createSidebar
  });
});

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
  sidebar.style.zIndex = "10000";

  const title = document.createElement("h2");
  title.innerText = "Extracted Text";
  sidebar.appendChild(title);

  const textBox = document.createElement("textarea");
  textBox.id = "text-output";
  textBox.style.width = "100%";
  textBox.style.height = "80%";
  sidebar.appendChild(textBox);

  const copyButton = document.createElement("button");
  copyButton.innerText = "Copy Text";
  copyButton.onclick = function () {
    navigator.clipboard.writeText(textBox.value).then(() => {
      alert("Text copied to clipboard!");
    });
  };
  sidebar.appendChild(copyButton);

  document.body.appendChild(sidebar);
  updateTextOutput();
}