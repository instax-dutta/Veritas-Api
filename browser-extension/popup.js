chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    document.getElementById("message").textContent = `Checking ${url}...`;
  });
  