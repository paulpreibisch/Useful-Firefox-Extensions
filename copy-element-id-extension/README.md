# Copy Element ID Firefox Extension

A Firefox WebExtension that adds a "Copy Element ID" option to the browser's context menu, allowing users to easily copy element IDs, CSS selectors, and classes from any webpage.

## Features

- **Copy Element ID**: Right-click any element to copy its ID to clipboard
- **Copy CSS Selector**: Get a unique CSS selector for any element
- **Copy Classes**: Copy all classes of an element
- **Dynamic Menu Labels**: Shows the actual ID/classes in the menu
- **Visual Feedback**: Green notification when copying succeeds
- **Works on All Sites**: Functions on any webpage
- **Frame Support**: Works inside iframes

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
3. Look for the following options in the context menu:
   - **Copy ID**: Shows as "Copy ID: 'actual-id'" if element has an ID
   - **Copy CSS Selector**: Always available, shows truncated selector
   - **Copy Classes**: Shows element's classes if available
4. Click the desired option to copy to clipboard
5. A green notification will appear confirming the copy

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

This extension is provided as-is for educational and development purposes.

## Support

For issues or questions, please check the troubleshooting section above or refer to the [Firefox Extension Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions).