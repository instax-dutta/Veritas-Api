chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    document.getElementById("message").textContent = `Checking ${url}...`;
    // No further logic needed in popup.js, as prediction is handled in background.js
  });
  