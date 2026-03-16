// Extracts meaningful text from the page, removing boilerplate
function extractPageContent() {
  // Clone to avoid mutating the live DOM
  const clone = document.body.cloneNode(true);

  // Remove noise: nav, footer, ads, scripts, styles
  const noiseSelectors = [
    'nav', 'footer', 'header', 'aside', 'script',
    'style', 'noscript', '[role="banner"]',
    '[role="navigation"]', '[aria-label="advertisement"]',
    '.ad', '.ads', '.advertisement', '.cookie-banner',
    '.popup', '.modal', '.sidebar'
  ];
  noiseSelectors.forEach(sel => {
    clone.querySelectorAll(sel).forEach(el => el.remove());
  });

  // Extract text from article body or fall back to main / body
  const article = clone.querySelector('article, [role="main"], main') || clone;
  const text = article.innerText || article.textContent || '';

  // Clean up whitespace
  return text
    .replace(/\s{3,}/g, '\n\n')
    .replace(/\t/g, ' ')
    .trim()
    .slice(0, 8000); // Cap at 8k chars — Gemini handles the rest
}

// Listen for trigger from background service worker
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'extractContent') {
    const content = extractPageContent();
    const pageUrl = window.location.href;
    const pageTitle = document.title;
    sendResponse({ content, pageUrl, pageTitle });
  }
  return true; // Keep message channel open for async response
});
