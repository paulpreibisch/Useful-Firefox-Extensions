// Background script - manages the context menu

let lastElementInfo = null;

// Create the main context menu item when extension is installed
browser.contextMenus.create({
  id: "copy-element-id",
  title: "Copy Element ID",
  contexts: ["all"]
});

// Optional: Create additional menu items
browser.contextMenus.create({
  id: "separator-1",
  type: "separator",
  contexts: ["all"]
});

browser.contextMenus.create({
  id: "copy-element-selector",
  title: "Copy CSS Selector",
  contexts: ["all"]
});

browser.contextMenus.create({
  id: "copy-element-classes",
  title: "Copy Classes",
  contexts: ["all"]
});

// Listen for element info from content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "elementInfo") {
    lastElementInfo = message.data;

    // Update the ID menu item
    if (lastElementInfo.id) {
      browser.contextMenus.update("copy-element-id", {
        title: `Copy ID: "${lastElementInfo.id}"`,
        enabled: true
      });
    } else {
      browser.contextMenus.update("copy-element-id", {
        title: `Copy Element ID (no ID found)`,
        enabled: false
      });
    }

    // Update CSS Selector menu item
    if (lastElementInfo.selector) {
      const displaySelector = lastElementInfo.selector.length > 50
        ? lastElementInfo.selector.substring(0, 50) + '...'
        : lastElementInfo.selector;
      browser.contextMenus.update("copy-element-selector", {
        title: `Copy Selector: ${displaySelector}`,
        enabled: true
      });
    }

    // Update Classes menu item
    if (lastElementInfo.classes) {
      browser.contextMenus.update("copy-element-classes", {
        title: `Copy Classes: "${lastElementInfo.classes}"`,
        enabled: true
      });
    } else {
      browser.contextMenus.update("copy-element-classes", {
        title: "Copy Classes (no classes found)",
        enabled: false
      });
    }
  }
});

// Handle context menu clicks
browser.contextMenus.onClicked.addListener(async (info, tab) => {
  let textToCopy = null;

  switch(info.menuItemId) {
    case "copy-element-id":
      textToCopy = lastElementInfo?.id;
      break;
    case "copy-element-selector":
      textToCopy = lastElementInfo?.selector;
      break;
    case "copy-element-classes":
      textToCopy = lastElementInfo?.classes;
      break;
  }

  if (textToCopy) {
    // Send message to content script to copy and show notification
    await browser.tabs.sendMessage(tab.id, {
      type: "copyToClipboard",
      text: textToCopy
    });
  }
});