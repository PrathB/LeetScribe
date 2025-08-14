const BUTTON_ID = "leetscribe-annotate-btn";
const STYLES_ID = "leetscribe-styles";
const STATES = {
  DEFAULT: "default",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

function injectStyles() {
  if (!document.getElementById(STYLES_ID)) {
    const link = document.createElement("link");
    link.id = STYLES_ID;
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("styles.css");
    document.head.appendChild(link);
  }
}

function createAnnotateButton() {
  if (document.getElementById(BUTTON_ID)) return;

  const topBtnsContainer = document.querySelector("#ide-top-btns");
  if (!topBtnsContainer) return;

  const annotateBtn = document.createElement("button");
  annotateBtn.id = BUTTON_ID;
  annotateBtn.innerHTML = `✏️ Annotate`;
  annotateBtn.addEventListener("click", () => handleAnnotateClick(annotateBtn));

  topBtnsContainer.appendChild(annotateBtn);
}

async function handleAnnotateClick(button) {
  setButtonState(button, STATES.LOADING);

  try {
    const response = await chrome.runtime.sendMessage({
      type: "ANNOTATE_ACTIVE_TAB",
    });

    if (!response?.ok) throw new Error(response?.error || "Annotation failed");

    setButtonState(button, STATES.SUCCESS);
    setTimeout(() => setButtonState(button, STATES.DEFAULT), 2000);
  } catch (error) {
    console.error("LeetScribe annotation error:", error);
    setButtonState(button, STATES.ERROR);
    setTimeout(() => setButtonState(button, STATES.DEFAULT), 3000);
  }
}

function setButtonState(button, state) {
  button.classList.remove(STATES.SUCCESS, STATES.ERROR);

  switch (state) {
    case STATES.LOADING:
      button.disabled = true;
      button.innerHTML = `<div class="leetscribe-spinner"></div><span>Processing...</span>`;
      break;
    case STATES.SUCCESS:
      button.disabled = false;
      button.classList.add(STATES.SUCCESS);
      button.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zM7 11.5L3.5 8 5 6.5l2 2 4-4L12.5 6 7 11.5z"/></svg><span>Done!</span>`;
      break;
    case STATES.ERROR:
      button.disabled = false;
      button.classList.add(STATES.ERROR);
      button.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zM4 7h8v2H4V7z"/></svg><span>Error</span>`;
      break;
    default:
      button.disabled = false;
      button.innerHTML = `✏️ Annotate`;
  }
}

// initialize styles and button
function initObserver() {
  let lastUrl = location.href;

  // watch for react rerender (question navigation) and re inject button
  const observer = new MutationObserver(() => {
    // SPA URL change detection
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(() => {
        injectStyles();
        createAnnotateButton();
      }, 1000);
    }

    // Inject button if container exists
    if (
      document.querySelector("#ide-top-btns") &&
      !document.getElementById(BUTTON_ID)
    ) {
      createAnnotateButton();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial run
  injectStyles();
  createAnnotateButton();

  // Auto-stop after 30s to reduce overhead
  setTimeout(() => observer.disconnect(), 30000);
}

// Initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initObserver);
} else {
  initObserver();
}
