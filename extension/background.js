const BACKEND_URL = 'http://localhost:8080'; // Update after deploy to Cloud Run

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ tabId: tab.id });
});

// Relay messages between content script and side panel
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'startFactCheck') {
    // Get content from current tab's content script
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractContent' });

      // Send to backend — forward to side panel via storage for SSE pickup
      await chrome.storage.session.set({
        checkPayload: {
          text: response.content,
          url: response.pageUrl,
          title: response.pageTitle
        }
      });

      sendResponse({ status: 'started' });
    });
    return true;
  }
});