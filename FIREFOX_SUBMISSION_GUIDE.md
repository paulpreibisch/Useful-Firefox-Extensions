# Firefox Extension Submission Guide

## Part 1: Install Permanently on Your Machine

### Method 1: Developer Installation (Stays permanently)
1. Open Firefox
2. Type `about:config` in address bar
3. Search for `xpinstall.signatures.required`
4. Set it to `false` (only works in Firefox Developer Edition or Nightly)
5. Then load your extension via `about:debugging` - it will stay

### Method 2: Self-Sign for Personal Use
1. Install web-ext tool:
   ```bash
   npm install -g web-ext
   ```

2. Sign the extension for yourself:
   ```bash
   cd copy-element-id-extension
   web-ext build
   ```

3. This creates a `.zip` file in `web-ext-artifacts/`

4. Install the extension:
   - Go to `about:addons`
   - Click gear icon → "Install Add-on From File"
   - Select the `.zip` file

### Method 3: Firefox Developer Edition (Recommended)
1. Download [Firefox Developer Edition](https://www.mozilla.org/firefox/developer/)
2. This version allows unsigned extensions permanently
3. Load via `about:debugging` and it stays after restart

## Part 2: Submit to Firefox Add-ons (AMO) Marketplace

### Prerequisites

1. **Create Firefox Account**
   - Go to https://addons.mozilla.org/developers/
   - Click "Submit Your First Add-on"
   - Create account or sign in

2. **Prepare Your Extension**

### Step 1: Update manifest.json
```json
{
  "manifest_version": 2,
  "name": "Quick ID Copy Tool",
  "version": "1.1.0",
  "description": "Right-click to copy element IDs, CSS selectors, and XPath - perfect for developers and AI-assisted coding",

  "author": "Paul Preibisch",
  "homepage_url": "https://github.com/paulpreibisch/Useful-Firefox-Extensions",

  "permissions": [
    "contextMenus",
    "activeTab",
    "clipboardWrite",
    "<all_urls>"
  ],

  "browser_specific_settings": {
    "gecko": {
      "id": "quickidcopy@paulpreibisch.com",
      "strict_min_version": "57.0"
    }
  },

  // ... rest of manifest
}
```

### Step 2: Create Package
```bash
cd copy-element-id-extension
zip -r ../quick-id-copy-v1.1.0.zip * -x "*.git*" "*.DS_Store"
```

### Step 3: Submission Process

1. **Go to Submit Page**
   - Visit: https://addons.mozilla.org/developers/addon/submit/distribution

2. **Choose Distribution Method**
   - Select "On this site" (for public listing)
   - Or "On your own" (self-distribution, faster approval)

3. **Upload Your Extension**
   - Upload the `.zip` file
   - Firefox will automatically validate it

4. **Fill Required Information**

   **Extension Name:**
   ```
   Quick ID Copy Tool
   ```

   **Summary (250 chars):**
   ```
   Right-click any element to instantly copy its ID, CSS selector, or XPath. Perfect for developers working with AI assistants or debugging web interfaces.
   ```

   **Description:**
   ```
   Quick ID Copy Tool is a lightweight Firefox extension designed for developers who need to quickly reference DOM elements.

   FEATURES:
   ✓ One-click copy element IDs
   ✓ Copy CSS selectors
   ✓ Copy XPath expressions
   ✓ Copy element classes
   ✓ Visual confirmation notifications
   ✓ Works on all websites
   ✓ No configuration needed

   WHY USE THIS?
   • Perfect for AI-assisted development (ChatGPT, Claude, Copilot)
   • Faster than opening developer tools
   • Instantly share element references with your team
   • Debug web interfaces efficiently
   • Create automated test selectors quickly

   PRIVACY:
   • No data collection
   • No external connections
   • Works entirely offline
   • Open source on GitHub

   Simply right-click any element and select "🤖 Quick ID Copy" for instant access!
   ```

   **Categories:**
   - Developer Tools
   - Web Development

   **Tags:**
   - developer
   - css
   - xpath
   - selector
   - clipboard
   - productivity
   - debugging

   **Support Email:**
   ```
   your-email@example.com
   ```

   **Support URL:**
   ```
   https://github.com/paulpreibisch/Useful-Firefox-Extensions/issues
   ```

   **Privacy Policy:**
   ```
   This extension does not collect, store, or transmit any user data.
   All operations are performed locally on your machine.
   No analytics, no tracking, no external connections.
   ```

5. **Add Screenshots** (Required)
   - Take 1-3 screenshots showing the extension in action
   - Recommended size: 1280x800 or 640x400
   - Show the context menu with your extension

6. **Version Notes:**
   ```
   Initial public release:
   - Quick ID copy with emoji indicator
   - CSS selector copying
   - XPath generation
   - Class name extraction
   - Visual feedback notifications
   ```

### Step 4: Review Process

1. **Automated Review** (few minutes)
   - Code validation
   - Security checks
   - Permission verification

2. **Manual Review** (1-5 days typically)
   - Human reviewer checks functionality
   - May request changes

3. **Common Review Issues to Avoid:**
   - ✅ Already fixed: Clear description of what extension does
   - ✅ Already have: Proper permissions justification
   - ✅ Already included: No minified code
   - ✅ Already done: No external libraries from CDNs

### Step 5: After Approval

1. **Public Listing**
   - Extension appears at: `https://addons.mozilla.org/firefox/addon/[your-extension-name]`
   - Users can install with one click
   - Automatic updates supported

2. **Update Process**
   - Increment version in manifest.json
   - Upload new .zip file
   - Add version notes
   - Usually faster review for updates

## Quick Submission Checklist

- [ ] Create Mozilla developer account
- [ ] Add unique extension ID in manifest
- [ ] Set proper version number (x.y.z format)
- [ ] Add author and homepage_url
- [ ] Create .zip package
- [ ] Write clear description
- [ ] Prepare 1-3 screenshots
- [ ] Add privacy policy
- [ ] Submit for review

## Self-Distribution Option

If you want faster approval or private distribution:

1. Choose "On your own" distribution
2. Get signed .xpi file after review
3. Host on your GitHub releases
4. Users can install directly from your URL

## Monetization Options

Firefox allows:
- Voluntary donations
- No paid extensions in marketplace
- Can link to "Buy me a coffee" or GitHub Sponsors

## Support Resources

- Extension Workshop: https://extensionworkshop.com/
- Review Policies: https://extensionworkshop.com/documentation/publish/add-on-policies/
- Developer Hub: https://addons.mozilla.org/developers/
- Community Forum: https://discourse.mozilla.org/c/add-ons

## Timeline

- Submission: Few minutes
- Automated validation: Instant
- Initial review: 1-5 days
- Updates: Usually < 24 hours

Good luck with your submission! 🚀