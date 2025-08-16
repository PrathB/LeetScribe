const apiUrlEl = document.getElementById("apiUrl");
const modelEl = document.getElementById("model");
const apiKeyEl = document.getElementById("apiKey");
const overallEl = document.getElementById("overall");
const openOptionsBtn = document.getElementById("openOptions");

const KEYS = ["apiUrl", "modelName", "apiKey"];

// mask API key for display
function maskKey(key) {
  if (!key) return "—";
  if (key.length <= 8) return "•".repeat(key.length);
  const last = key.slice(-4);
  return "••••••••" + last;
}

function shortText(text, max = 36) {
  if (!text) return "—";
  if (text.length <= max) return text;
  return text.slice(0, max - 3) + "…";
}

function updateUI(data = {}) {
  const apiUrl = data.apiUrl || "";
  const modelName = data.modelName || "";
  const apiKey = data.apiKey || "";

  apiUrlEl.textContent = apiUrl ? shortText(apiUrl, 48) : "—";
  modelEl.textContent = modelName || "—";
  apiKeyEl.textContent = apiKey ? maskKey(apiKey) : "—";

  // overall status
  const missing = [];
  if (!apiUrl) missing.push("API URL");
  if (!modelName) missing.push("Model");
  if (!apiKey) missing.push("API Key");

  if (missing.length === 0) {
    overallEl.textContent = "✅ Ready — all credentials configured.";
    overallEl.classList.remove("missing");
  } else {
    overallEl.textContent = "⚠ Missing: " + missing.join(", ");
    overallEl.classList.add("missing");
  }
}

// load settings once
function loadSettings() {
  chrome.storage.sync.get(KEYS, (res) => {
    if (chrome.runtime.lastError) {
      overallEl.textContent = "Error reading settings";
      overallEl.classList.add("missing");
      return;
    }
    updateUI(res);
  });
}

// update live if settings change while popup is open
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;
  let changed = false;
  const data = {};
  for (const key of KEYS) {
    if (changes[key]) {
      data[key] = changes[key].newValue;
      changed = true;
    }
  }
  if (changed)
    updateUI(
      Object.assign(
        {},
        {
          apiUrl: apiUrlEl.textContent === "—" ? "" : apiUrlEl.textContent,
          modelName: modelEl.textContent === "—" ? "" : modelEl.textContent,
          apiKey: apiKeyEl.textContent === "—" ? "" : apiKeyEl.textContent,
        },
        data
      )
    );
});

// Open options page
openOptionsBtn.addEventListener("click", () => {
  // opens the options page in a tab (defined by manifest.options_ui)
  chrome.runtime.openOptionsPage();
});

// initialize
document.addEventListener("DOMContentLoaded", loadSettings);
