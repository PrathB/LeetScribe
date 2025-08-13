document.getElementById("annotateBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.runtime.sendMessage({ type: "ANNOTATE_ACTIVE_TAB", tabId: tab.id });
});
