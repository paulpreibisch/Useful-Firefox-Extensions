# Quick ID Copy - Chrome Extension

A Chrome extension that adds a "Quick ID Copy" option to the browser's context menu, allowing users to instantly copy element IDs from any webpage - perfect for AI-assisted development.

## 💡 Why This Extension?

When working with AI assistants to debug or modify web interfaces, you often need to quickly reference specific elements. This extension provides instant access to element IDs without the hassle of opening developer tools, navigating to inspect mode, and finding the element manually.

## Features

- **🤖 Quick ID Copy**: Single menu item that appears directly in Chrome's context menu
- **Dynamic Labels**: Shows the actual element ID in the menu
- **Visual Feedback**: Green notification confirms successful copy
- **Universal**: Works on any website
- **Frame Support**: Functions inside iframes
- **No Submenus**: Direct access with one click

## Installation

### For Development/Testing:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `copy-element-id-extension-chrome` folder
5. The extension is now installed!

### For Distribution:

1. **Package the extension:**
   - In `chrome://extensions/`, click "Pack extension"
   - Browse to the extension directory
   - Click "Pack Extension" to create a `.crx` file

2. **Or upload to Chrome Web Store:**
   - Create a [Chrome Web Store Developer account](https://chrome.google.com/webstore/devconsole/)
   - Upload the extension for review and publication

## Usage

1. Navigate to any website
2. Right-click on any element
3. Look for **🤖 Quick ID Copy** in the context menu
   - If the element has an ID: Shows as **🤖 Quick ID Copy: "element-id"**
   - If no ID exists: Shows as **🤖 Quick ID Copy (no ID)** and is disabled
4. Click to instantly copy the element's ID
5. A green notification confirms the copy

## Technical Details

### Manifest V3
This extension uses Chrome's Manifest V3 format with:
- Service worker for background operations
- Content scripts for page interaction
- Modern Chrome extension APIs

### File Structure
```
copy-element-id-extension-chrome/
├── manifest.json       # Extension configuration (Manifest V3)
├── background.js       # Service worker managing context menu
├── content.js         # Captures element info and handles clipboard
├── icon-48.png        # Extension icon (48x48)
├── icon-128.png       # Extension icon (128x128)
└── README.md          # This file
```

## Permissions

The extension requires:
- `contextMenus`: To add the quick copy option
- `activeTab`: To access the current tab's content
- `clipboardWrite`: To copy IDs to clipboard

## Browser Compatibility

- Chrome 88+ (Manifest V3 support)
- Edge 88+ (Chromium-based)
- Brave, Opera, and other Chromium-based browsers

## Troubleshooting

**Menu item doesn't appear:**
- Ensure extension is enabled in `chrome://extensions/`
- Refresh the webpage
- Check Chrome DevTools console for errors (F12)

**Copy doesn't work:**
- Verify clipboard permissions are granted
- Check for the console message confirming load
- Try the fallback copy method (automatic)

## License

MIT License © 2025 Paul Preibisch

See the [LICENSE](../../LICENSE) file for full details.

## Disclaimer

**USE AT YOUR OWN RISK**: Created for personal development purposes. This extension interacts with web page content and clipboard operations. No guarantees of functionality or support.