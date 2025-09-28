// Background script for Chrome - manages the context menu

let lastElementInfo = null;

// Create the context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "ai-quick-copy",
    title: "🤖 Quick ID Copy",
    contexts: ["all"]
  });
});

// Listen for element info from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "elementInfo") {
    lastElementInfo = message.data;

    // Update the menu item with the actual ID
    if (lastElementInfo.id) {
      chrome.contextMenus.update("ai-quick-copy", {
        title: `🤖 Quick ID Copy: "${lastElementInfo.id}"`,
        enabled: true
      });
    } else {
      chrome.contextMenus.update("ai-quick-copy", {
        title: `🤖 Quick ID Copy (no ID)`,
        enabled: false
      });
    }
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "ai-quick-copy" && lastElementInfo?.id) {
    // Send message to content script to copy and show notification
    await chrome.tabs.sendMessage(tab.id, {
      type: "copyToClipboard",
      text: lastElementInfo.id
    });
  }
});