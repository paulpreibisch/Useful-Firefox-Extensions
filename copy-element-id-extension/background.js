// Background script - manages the context menu

let lastElementInfo = null;

// Create main quick copy option with emoji only (no icon)
browser.contextMenus.create({
  id: "robot-quick-copy",
  title: "🤖 Quick ID Copy",
  contexts: ["all"],
  icons: null  // No icon, just emoji
});

// Create separator
browser.contextMenus.create({
  id: "separator-main",
  type: "separator",
  contexts: ["all"]
});

// Create parent menu for additional tools
browser.contextMenus.create({
  id: "element-tools-menu",
  title: "Element Tools",
  contexts: ["all"],
  icons: null
});

// Add submenu items
browser.contextMenus.create({
  id: "copy-selector-tool",
  parentId: "element-tools-menu",
  title: "Copy CSS Selector",
  contexts: ["all"]
});

browser.contextMenus.create({
  id: "copy-classes-tool",
  parentId: "element-tools-menu",
  title: "Copy Classes",
  contexts: ["all"]
});

browser.contextMenus.create({
  id: "copy-xpath-tool",
  parentId: "element-tools-menu",
  title: "Copy XPath",
  contexts: ["all"]
});

// Listen for element info from content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "elementInfo") {
    lastElementInfo = message.data;

    // Update the quick copy menu item with the actual ID
    if (lastElementInfo.id) {
      browser.contextMenus.update("robot-quick-copy", {
        title: `🤖 Quick ID Copy: "${lastElementInfo.id}"`,
        enabled: true
      });
    } else {
      browser.contextMenus.update("robot-quick-copy", {
        title: `🤖 Quick ID Copy (no ID)`,
        enabled: false
      });
    }

    // Update CSS Selector menu item
    if (lastElementInfo.selector) {
      const displaySelector = lastElementInfo.selector.length > 40
        ? lastElementInfo.selector.substring(0, 40) + '...'
        : lastElementInfo.selector;
      browser.contextMenus.update("copy-selector-tool", {
        title: `Copy Selector: ${displaySelector}`,
        enabled: true
      });
    }

    // Update Classes menu item
    if (lastElementInfo.classes && lastElementInfo.classes.trim()) {
      const displayClasses = lastElementInfo.classes.length > 30
        ? lastElementInfo.classes.substring(0, 30) + '...'
        : lastElementInfo.classes;
      browser.contextMenus.update("copy-classes-tool", {
        title: `Copy Classes: "${displayClasses}"`,
        enabled: true
      });
    } else {
      browser.contextMenus.update("copy-classes-tool", {
        title: "Copy Classes (none)",
        enabled: false
      });
    }

    // Update XPath menu item
    if (lastElementInfo.xpath) {
      const displayXPath = lastElementInfo.xpath.length > 40
        ? lastElementInfo.xpath.substring(0, 40) + '...'
        : lastElementInfo.xpath;
      browser.contextMenus.update("copy-xpath-tool", {
        title: `Copy XPath: ${displayXPath}`,
        enabled: true
      });
    }
  }
});

// Handle context menu clicks
browser.contextMenus.onClicked.addListener(async (info, tab) => {
  let textToCopy = null;
  let copyType = null;

  switch(info.menuItemId) {
    case "robot-quick-copy":
      textToCopy = lastElementInfo?.id;
      copyType = "ID";
      break;
    case "copy-selector-tool":
      textToCopy = lastElementInfo?.selector;
      copyType = "CSS Selector";
      break;
    case "copy-classes-tool":
      textToCopy = lastElementInfo?.classes;
      copyType = "Classes";
      break;
    case "copy-xpath-tool":
      textToCopy = lastElementInfo?.xpath;
      copyType = "XPath";
      break;
  }

  if (textToCopy) {
    // Send message to content script to copy and show notification
    try {
      await browser.tabs.sendMessage(tab.id, {
        type: "copyToClipboard",
        text: textToCopy,
        copyType: copyType
      });
    } catch (error) {
      console.error("Error sending message to content script:", error);
    }
  }
});