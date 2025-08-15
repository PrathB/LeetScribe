document.addEventListener("DOMContentLoaded", () => {
  // Load existing settings
  chrome.storage.sync.get(["apiUrl", "modelName", "apiKey"], (items) => {
    if (items.apiUrl) document.getElementById("apiUrl").value = items.apiUrl;
    if (items.modelName)
      document.getElementById("modelName").value = items.modelName;
    if (items.apiKey) document.getElementById("apiKey").value = items.apiKey;
  });

  // Save settings
  document.getElementById("saveBtn").addEventListener("click", () => {
    const apiUrl = document.getElementById("apiUrl").value.trim();
    const modelName = document.getElementById("modelName").value.trim();
    const apiKey = document.getElementById("apiKey").value.trim();

    chrome.storage.sync.set({ apiUrl, modelName, apiKey }, () => {
      document.getElementById("status").textContent = "Settings saved!";
      setTimeout(() => {
        document.getElementById("status").textContent = "";
      }, 2000);
    });
  });
});
