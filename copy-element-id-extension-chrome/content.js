// Content script for Chrome - runs on web pages and captures element information

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
  chrome.runtime.sendMessage({
    type: "elementInfo",
    data: elementInfo
  });
}, true);

// Listen for copy requests from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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

console.log('Quick ID Copy extension loaded successfully!');