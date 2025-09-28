// Background script - manages the context menu

let lastElementInfo = null;

// Create quick copy option with unique name to avoid submenu grouping
browser.contextMenus.create({
  id: "quick-copy-id",
  title: "🤖 Copy Element ID",
  contexts: ["all"]
});

// Create a parent menu item for additional options
browser.contextMenus.create({
  id: "element-tools",
  title: "Element Tools",
  contexts: ["all"]
});

// Create child items under Element Tools
browser.contextMenus.create({
  id: "copy-element-id-detailed",
  parentId: "element-tools",
  title: "Copy ID (with details)",
  contexts: ["all"]
});

browser.contextMenus.create({
  id: "copy-element-selector",
  parentId: "element-tools",
  title: "Copy CSS Selector",
  contexts: ["all"]
});

browser.contextMenus.create({
  id: "copy-element-classes",
  parentId: "element-tools",
  title: "Copy Classes",
  contexts: ["all"]
});

// Listen for element info from content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "elementInfo") {
    lastElementInfo = message.data;

    // Update the quick copy option
    if (lastElementInfo.id) {
      browser.contextMenus.update("quick-copy-id", {
        title: `🤖 Copy Element ID: "${lastElementInfo.id}"`,
        enabled: true
      });
    } else {
      browser.contextMenus.update("quick-copy-id", {
        title: `🤖 Copy Element ID (no ID)`,
        enabled: false
      });
    }

    // Update the detailed ID menu item
    if (lastElementInfo.id) {
      browser.contextMenus.update("copy-element-id-detailed", {
        title: `Copy ID: "${lastElementInfo.id}" (with details)`,
        enabled: true
      });
    } else {
      browser.contextMenus.update("copy-element-id-detailed", {
        title: `Copy ID (no ID found)`,
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
    case "quick-copy-id":
      textToCopy = lastElementInfo?.id;
      break;
    case "copy-element-id-detailed":
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