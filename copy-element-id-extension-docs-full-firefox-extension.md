# Firefox Extension: Copy Element ID Context Menu

## Project Overview
Create a Firefox WebExtension that adds a "Copy Element ID" option to Firefox's native right-click context menu. When users right-click on any element on a webpage, they should see this option in the browser's context menu (not a custom HTML overlay).

## Important Context
**Why an Extension is Required**: Greasemonkey/userscripts CANNOT modify Firefox's native context menu due to security restrictions. Userscripts only have access to the web page's DOM, not the browser's UI. This requires a proper Firefox WebExtension.

## Requirements
1. **Native Context Menu Integration**: Add menu item(s) to Firefox's actual context menu
2. **Copy Element ID**: Primary function to copy the ID of the right-clicked element
3. **Dynamic Menu Labels**: Show the actual ID in the menu item (e.g., "Copy ID: 'header-section'")
4. **Fallback Behavior**: Disable or show appropriate message when element has no ID
5. **Optional Features**: 
   - Copy CSS selector
   - Copy element classes
   - Visual feedback when copying succeeds

## Project Structure
```
copy-element-id-extension/
├── manifest.json          # Extension manifest (required)
├── background.js          # Background script for menu management
├── content.js            # Content script for element detection
├── icon-48.png           # Extension icon (48x48)
├── icon-96.png           # Extension icon (96x96)
└── README.md             # Documentation
```

## Complete Code Files

### 1. manifest.json
```json
{
  "manifest_version": 2,
  "name": "Copy Element ID",
  "version": "1.0",
  "description": "Right-click any element to copy its ID to clipboard",
  
  "permissions": [
    "contextMenus",
    "activeTab",
    "clipboardWrite",
    "<all_urls>"
  ],
  
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  },
  
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_idle",
      "all_frames": true
    }
  ],
  
  "icons": {
    "48": "icon-48.png",
    "96": "icon-96.png"
  }
}
```

### 2. background.js
```javascript
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
```

### 3. content.js
```javascript
// Content script - runs on web pages and captures element information

let lastRightClickedElement = null;

// Function to get a unique CSS selector for an element
function getCSSSelector(element) {
  if (element.id) {
    return `#${element.id}`;
  }
  
  const path = [];
  while (element && element.nodeType === Node.ELEMENT_NODE) {
    let selector = element.nodeName.toLowerCase();
    
    if (element.id) {
      selector = `#${element.id}`;
      path.unshift(selector);
      break;
    } else if (element.className && typeof element.className === 'string') {
      const classes = element.className.trim().split(/\s+/).filter(c => c);
      if (classes.length > 0) {
        selector += '.' + classes.join('.');
      }
    }
    
    // Add nth-child if needed for uniqueness
    const parent = element.parentNode;
    if (parent) {
      const siblings = Array.from(parent.children);
      const index = siblings.indexOf(element) + 1;
      if (siblings.length > 1) {
        selector += `:nth-child(${index})`;
      }
    }
    
    path.unshift(selector);
    element = element.parentNode;
  }
  
  return path.join(' > ');
}

// Capture right-clicked element
document.addEventListener('contextmenu', function(event) {
  lastRightClickedElement = event.target;
  
  // Get element information
  const elementInfo = {
    id: lastRightClickedElement.id || null,
    classes: lastRightClickedElement.className || null,
    tagName: lastRightClickedElement.tagName.toLowerCase(),
    selector: getCSSSelector(lastRightClickedElement)
  };
  
  // Send element info to background script
  browser.runtime.sendMessage({
    type: "elementInfo",
    data: elementInfo
  });
}, true);

// Listen for copy requests from background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "copyToClipboard") {
    copyToClipboard(message.text);
    showNotification(`Copied: ${message.text}`);
  }
});

// Function to copy text to clipboard
function copyToClipboard(text) {
  // Method 1: Try using navigator.clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {
      fallbackCopyToClipboard(text);
    });
  } else {
    fallbackCopyToClipboard(text);
  }
}

// Fallback copy method using textarea
function fallbackCopyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

// Function to show a notification
function showNotification(message) {
  // Remove any existing notification
  const existing = document.querySelector('.copy-id-notification');
  if (existing) {
    existing.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'copy-id-notification';
  notification.textContent = '✓ ' + message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 2147483647;
    animation: slideIn 0.3s ease;
  `;
  
  // Add animation styles if not already present
  if (!document.querySelector('#copy-id-styles')) {
    const style = document.createElement('style');
    style.id = 'copy-id-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Auto-remove after 2 seconds
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

console.log('Copy Element ID extension loaded successfully!');
```

### 4. Icon Creation
Create simple SVG icons that can be converted to PNG:

**icon.svg** (save this and convert to PNG at 48x48 and 96x96):
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <rect width="96" height="96" fill="#2563eb" rx="12"/>
  <text x="50%" y="52%" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="white">ID</text>
  <rect x="60" y="60" width="28" height="28" fill="#10b981" rx="4"/>
  <path d="M70 74 L74 78 L80 72" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

## Installation Instructions

### For Development/Testing:

1. **Create the extension folder** with all files above

2. **Load in Firefox:**
   - Open Firefox
   - Type `about:debugging` in the address bar
   - Click "This Firefox" in the left sidebar
   - Click "Load Temporary Add-on..."
   - Navigate to the extension folder
   - Select the `manifest.json` file
   - Click "Open"

3. **Test the extension:**
   - Navigate to any website
   - Right-click on any element
   - Look for "Copy Element ID" in the context menu
   - If element has an ID, it will show as "Copy ID: 'actual-id-here'"
   - Click to copy, you should see a green notification

### For Permanent Installation:

1. **Package the extension:**
   - Zip all files together (manifest.json, *.js, *.png)
   - Ensure files are at root of zip, not in a subfolder

2. **Sign the extension** (required for Firefox):
   - Create a Firefox Add-on Developer account
   - Upload to addons.mozilla.org for signing
   - Or use web-ext tool for self-distribution

## Testing Checklist

- [ ] Extension loads without errors
- [ ] "Copy Element ID" appears in context menu
- [ ] Menu item shows actual ID when element has one
- [ ] Menu item is disabled when element has no ID
- [ ] Copying works and shows notification
- [ ] CSS Selector copy works
- [ ] Classes copy works
- [ ] Works on different websites
- [ ] Works in iframes

## Troubleshooting

**Context menu doesn't appear:**
- Check browser console for errors (Ctrl+Shift+J)
- Ensure extension is loaded in about:debugging
- Verify manifest.json syntax is valid

**Copy doesn't work:**
- Check if clipboard permissions are granted
- Look for errors in the web console (F12)
- Verify content script is injected (check for console.log message)

**Menu shows wrong/old information:**
- Ensure message passing between content and background scripts works
- Check timing of contextmenu event listener

## Enhancement Ideas

1. **Add keyboard shortcuts** (requires additional permissions)
2. **Copy multiple attributes** at once
3. **Copy XPath** in addition to CSS selector
4. **Settings page** to customize what appears in menu
5. **Copy formatted output** for developers (e.g., `document.getElementById('...')`)

## Firefox Extension API References

- [Context Menus API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/contextMenus)
- [Content Scripts](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts)
- [Message Passing](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage)
- [Clipboard API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard)

## Notes for ClaudeCode

- The extension needs both background and content scripts to work
- Background script manages the context menu
- Content script captures element information and handles clipboard operations
- Message passing connects the two scripts
- Firefox uses `browser.*` API, not `chrome.*` (though chrome.* often works as polyfill)
- For production, consider adding error handling and edge cases
- Icons can be generated programmatically or use a simple design tool
- Consider using Manifest V3 for future compatibility (though V2 still works in Firefox)
