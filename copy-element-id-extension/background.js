// Background script - manages the context menu

let lastElementInfo = null;

// Create ONLY ONE menu item - no submenus, no separators, nothing else
browser.contextMenus.create({
  id: "ai-assistant-copy",
  title: "🤖 AI Quick Copy",
  contexts: ["all"]
});

// Listen for element info from content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "elementInfo") {
    lastElementInfo = message.data;

    // Update the menu item with the actual ID
    if (lastElementInfo.id) {
      browser.contextMenus.update("ai-assistant-copy", {
        title: `🤖 AI Quick Copy: "${lastElementInfo.id}"`,
        enabled: true
      });
    } else {
      browser.contextMenus.update("ai-assistant-copy", {
        title: `🤖 AI Quick Copy (no ID)`,
        enabled: false
      });
    }
  }
});

// Handle context menu clicks
browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "ai-assistant-copy" && lastElementInfo?.id) {
    // Send message to content script to copy and show notification
    try {
      await browser.tabs.sendMessage(tab.id, {
        type: "copyToClipboard",
        text: lastElementInfo.id,
        copyType: "ID"
      });
    } catch (error) {
      console.error("Error sending message to content script:", error);
    }
  }
});