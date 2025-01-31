let lastBadgeCount = 0;

function updateBadge() {
  const titleText = document.title;
  // First check for Inbox with number
  const gmailRegex = /.*Inbox \((\d+)\).*/;
  const matches = titleText.match(gmailRegex);

  if (matches) {
    const currentCount = parseInt(matches[1], 10);
    // Only update if the count has changed
    if (currentCount !== lastBadgeCount) {
      if ("setAppBadge" in navigator) {
        navigator.setAppBadge(currentCount).catch((error) => {
          console.error("Failed to set badge:", error);
        });
        lastBadgeCount = currentCount;
      }
    }
  } else if (titleText.includes("Inbox ")) {
    // If we see "Inbox" but no numbers, clear the badge
    if ("setAppBadge" in navigator) {
      navigator.clearAppBadge().catch((error) => {
        console.error("Failed to clear badge:", error);
      });
      lastBadgeCount = 0;
    }
  }
  // If neither condition is met, preserve the current badge
}

// Create a MutationObserver to watch for title changes
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    // Check if title was added or changed
    if (
      mutation.target.nodeName === "HEAD" ||
      mutation.target.nodeName === "TITLE"
    ) {
      updateBadge();
      break;
    }
  }
});

// Start observing
observer.observe(document.head || document.documentElement, {
  subtree: true,
  childList: true,
  characterData: true,
});

// Initial check
updateBadge();
