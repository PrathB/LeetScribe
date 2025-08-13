function getEditorCode() {
  // Monaco stores code in models
  const monaco = window.monaco;
  if (!monaco || !monaco.editor) {
    console.warn("Monaco editor not found yet.");
    return null;
  }
  const editor = monaco.editor.getModels()[0];
  return editor ? editor.getValue() : null;
}

function setEditorCode(newCode) {
  const monaco = window.monaco;
  const editorModel = monaco?.editor?.getModels()[0];
  if (editorModel) {
    editorModel.setValue(newCode);
  }
}

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "annotate") {
    const code = getEditorCode();
    if (code) {
      chrome.runtime.sendMessage({ type: "sendToLLM", code });
    }
  } else if (msg.type === "insertCode") {
    setEditorCode(msg.annotatedCode);
  }
});
