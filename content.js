function extractDomain(url) {
    const hostname = new URL(url).hostname;
    return hostname.split('.').slice(-2).join('.'); // Extract main domain
}

const currentDomain = extractDomain(window.location.href);
chrome.runtime.sendMessage({ domain: currentDomain });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.prediction) {
        chrome.action.setIcon({ path: message.prediction === 'phishing' ? "red16.png" : "green16.png" });
    }
});
