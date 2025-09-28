# AI Quick Copy Tool - Firefox Extension

A simple Firefox extension that adds "🤖 AI Quick Copy" directly to your right-click menu for instant element ID copying - perfect for AI-assisted development.

## 💡 Motivation

I created this extension because when developing with AI assistants, I often need to quickly reference specific elements on a webpage. Rather than opening developer tools, navigating to inspect mode, and finding the element ID, this extension provides a quick shortcut - just right-click and copy!

This is especially useful when:
- Working with AI to debug or modify web interfaces
- Quickly identifying elements without breaking your workflow
- Needing to reference multiple elements in rapid succession
- Teaching or demonstrating web development concepts

The robot emoji (🤖) appears directly in the main context menu - no submenus, just instant access!

## ⚠️ Disclaimer

**USE AT YOUR OWN RISK**: This extension was created for my personal development purposes, but you're welcome to use it. Please note:

- This extension interacts with web page content and clipboard operations
- No guarantees of functionality, compatibility, or support
- May not work on all websites or with all Firefox versions
- The author assumes no responsibility for any issues that may arise from its use
- This is a personal project and may not receive regular updates

By using this extension, you acknowledge and accept these terms.

## Features

- **🤖 AI Quick Copy**: Single menu item directly in Firefox's context menu (no submenus!)
- **Dynamic Labels**: Shows the actual element ID right in the menu item
- **Smart Behavior**: Automatically disabled when element has no ID
- **Visual Feedback**: Green notification confirms successful copy
- **Universal**: Works on any website including iframes
- **Clean Design**: Just the robot emoji - no extra icons cluttering your menu

## Installation

### For Development/Testing:

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on..."
4. Navigate to the `copy-element-id-extension` folder
5. Select the `manifest.json` file
6. Click "Open"

The extension will be loaded temporarily until Firefox is closed.

### For Permanent Installation:

1. **Package the extension:**
   ```bash
   cd copy-element-id-extension
   zip -r ../copy-element-id.xpi *
   ```

2. **Sign the extension** (required for distribution):
   - Create a [Firefox Add-on Developer account](https://addons.mozilla.org/developers/)
   - Upload to addons.mozilla.org for signing
   - Or use [web-ext](https://github.com/mozilla/web-ext) tool for self-distribution

## Usage

1. Navigate to any website
2. Right-click on any element you want to inspect
3. Look for **🤖 AI Quick Copy** in the main context menu
   - If the element has an ID: Shows as **🤖 AI Quick Copy: "actual-id"**
   - If no ID exists: Shows as **🤖 AI Quick Copy (no ID)** and is grayed out
4. Click to instantly copy the element's ID
5. A green notification appears confirming the copy

## File Structure

```
copy-element-id-extension/
├── manifest.json       # Extension configuration
├── background.js       # Manages context menu
├── content.js         # Captures element info and handles clipboard
├── icon-48.png        # Extension icon (48x48)
├── icon-96.png        # Extension icon (96x96)
├── icon.svg           # Source SVG icon
└── README.md          # This file
```

## How It Works

1. **Content Script** (`content.js`):
   - Listens for right-click events on web pages
   - Captures information about the clicked element
   - Sends element data to the background script
   - Handles clipboard operations and notifications

2. **Background Script** (`background.js`):
   - Creates and manages the context menu items
   - Updates menu labels based on element information
   - Handles menu click events
   - Communicates with content script for copying

3. **Message Passing**:
   - Content and background scripts communicate via browser messaging API
   - Element info flows: Content → Background (on right-click)
   - Copy commands flow: Background → Content (on menu click)

## Browser Compatibility

- Firefox 57+ (Firefox Quantum and later)
- Uses WebExtensions API (Manifest v2)

## Permissions

The extension requires the following permissions:
- `contextMenus`: To add items to the right-click menu
- `activeTab`: To access the current tab's content
- `clipboardWrite`: To copy text to clipboard
- `<all_urls>`: To work on all websites

## Troubleshooting

**Context menu doesn't appear:**
- Check browser console for errors (`Ctrl+Shift+J`)
- Ensure extension is loaded in `about:debugging`
- Verify `manifest.json` syntax

**Copy doesn't work:**
- Check web console for errors (`F12`)
- Verify clipboard permissions are granted
- Look for the success console message

**Menu shows wrong information:**
- Ensure you're right-clicking directly on the target element
- Check that the page has fully loaded

## Development

To modify the extension:

1. Edit the source files
2. Go to `about:debugging`
3. Find your extension and click "Reload"
4. Test your changes

For debugging:
- Browser Console: `Ctrl+Shift+J` (for background script errors)
- Web Console: `F12` (for content script errors)

## Enhancement Ideas

- Add keyboard shortcuts
- Copy XPath in addition to CSS selector
- Settings page to customize menu items
- Copy formatted code snippets (e.g., `document.getElementById('...')`)
- Export multiple attributes at once

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for full details.

MIT License © 2025 Paul Preibisch

Permission is hereby granted to use, copy, modify, and distribute this software. See the LICENSE file for complete terms.

## Support

For issues or questions, please check the troubleshooting section above or refer to the [Firefox Extension Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions).