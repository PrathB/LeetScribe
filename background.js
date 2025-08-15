function createAnnotationPrompt(title, code, lang) {
  return `You are an expert competitive programming tutor.  
        You will be given a problem **title**, a problem statement, and a candidate solution.  

        Your task:
        1. **Determine if the solution is correct** for the given problem.
        2. If the solution is correct:
          - At the very top of the code, add:
            - An "Algorithm" section explaining the algorithm step by step.
            - A "Time Complexity" line describing the complexity with reasoning.
            - A "Space Complexity" line describing the complexity with reasoning.
          - Also add inline comments to solution for explaining key steps.
          - Keep the original code completely unchanged.
        3. If the solution is incorrect:
          -Return the original code unchanged.
          - Do NOT modify the code in any way.
          - At the very top, add only a single comment:
            // ❌ The provided solution is incorrect for this problem.
          - Do not suggest corrections, hints, or improvements.
        4. Output ONLY the final annotated code, without any extra text, markdown formatting, or explanations outside the code.

        Input:
        Problem Title: Leetcode ${title}

        Solution (in ${lang}):
        ${code}

        Output:
        [Annotated code only]`;
}

async function getProblemTitleFromPage(tabId) {
  const results = await chrome.scripting.executeScript({
    target: { tabId, allFrames: true },
    world: "MAIN",
    func: () => {
      // Adjust selector if LeetCode changes DOM
      const el =
        document.querySelector("div.text-title-large") ||
        document.querySelector('[data-cy="question-title"]') ||
        document.querySelector("h1") ||
        document.querySelector(".css-v3d350");
      return el?.innerText?.trim() ?? null;
    },
  });
  return results.find((r) => r.result)?.result ?? null;
}

async function getCodeFromPage(tabId) {
  const results = await chrome.scripting.executeScript({
    target: { tabId, allFrames: true },
    world: "MAIN",
    func: () => {
      const m = window.monaco;
      if (!m?.editor) return null;

      const editors = m.editor.getEditors?.() || [];
      const focused = editors.find((e) => e.hasTextFocus?.());
      const editor = focused || editors[0];
      const model = editor?.getModel?.() || m.editor.getModels?.()[0];

      if (!model) return null;
      return {
        code: model.getValue?.() ?? null,
        lang: model.getLanguageId?.() ?? null,
      };
    },
  });
  const hit = results.find((r) => r.result && r.result.code);
  return hit?.result ?? null;
}

async function setCodeInPage(tabId, newCode) {
  await chrome.scripting.executeScript({
    target: { tabId, allFrames: true },
    world: "MAIN",
    args: [newCode],
    func: (annotated) => {
      const m = window.monaco;
      if (!m?.editor) return false;

      const editors = m.editor.getEditors?.() || [];
      const focused = editors.find((e) => e.hasTextFocus?.()) || editors[0];
      const model = focused?.getModel?.() || m.editor.getModels?.()[0];
      if (!model || !focused) return false;

      const full = model.getFullModelRange();
      focused.executeEdits("leetscribe", [{ range: full, text: annotated }]);
      focused.pushUndoStop();
      return true;
    },
  });
}

async function annotateWithLLM(title, code, lang) {
  // Get API settings from sync storage
  const { apiUrl, modelName, apiKey } = await new Promise((resolve) => {
    chrome.storage.sync.get(["apiUrl", "modelName", "apiKey"], resolve);
  });

  if (!apiUrl || !modelName || !apiKey) {
    throw new Error(
      "API settings are missing. Please configure them in extension options."
    );
  }

  const prompt = createAnnotationPrompt(title, code, lang);
  console.log("LLM Prompt:\n", prompt);

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  const m = text.match(/```[\s\S]*?\n([\s\S]*?)```/);
  return m ? m[1].trim() : text.trim();
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "ANNOTATE_ACTIVE_TAB") {
    (async () => {
      try {
        // Use the provided tabId or get the current active tab
        let tabId = msg.tabId;
        if (!tabId) {
          const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
          });
          tabId = tab.id;
        }

        const [info, title] = await Promise.all([
          getCodeFromPage(tabId),
          getProblemTitleFromPage(tabId),
        ]);

        if (!info?.code) {
          sendResponse({
            ok: false,
            error: "Monaco editor not ready or no code found",
          });
          return;
        }
        if (!title) {
          sendResponse({ ok: false, error: "Problem title not found" });
          return;
        }

        const annotated = await annotateWithLLM(title, info.code, info.lang);
        await setCodeInPage(tabId, annotated);
        sendResponse({ ok: true });
      } catch (error) {
        console.error("LeetScribe annotation error:", error);
        sendResponse({ ok: false, error: error.message });
      }
    })();
    return true; // Will respond asynchronously
  }
});
