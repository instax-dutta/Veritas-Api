chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getCurrentStatus" }, (response) => {
        const statusEl = document.getElementById('status');
        if (response) {
            statusEl.textContent = response.status;
            statusEl.className = response.prediction; 
        }
    });
});
