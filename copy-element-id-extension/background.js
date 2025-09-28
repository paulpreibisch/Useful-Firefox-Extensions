// Background script - manages the context menu

let lastElementInfo = null;

// Create just ONE menu item with a unique name
browser.contextMenus.create({
  id: "ai-copy-id",
  title: "🤖 Quick ID Copy",
  contexts: ["all"]
});

// Listen for element info from content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "elementInfo") {
    lastElementInfo = message.data;

    // Update the menu item with the actual ID
    if (lastElementInfo.id) {
      browser.contextMenus.update("ai-copy-id", {
        title: `🤖 Quick ID Copy: "${lastElementInfo.id}"`,
        enabled: true
      });
    } else {
      browser.contextMenus.update("ai-copy-id", {
        title: `🤖 Quick ID Copy (no ID)`,
        enabled: false
      });
    }
  }
});

// Handle context menu clicks
browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "ai-copy-id" && lastElementInfo?.id) {
    // Send message to content script to copy and show notification
    await browser.tabs.sendMessage(tab.id, {
      type: "copyToClipboard",
      text: lastElementInfo.id
    });
  }
});