chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.prediction !== undefined) {
    const iconPath = message.prediction === 1 
      ? "red16.png"  // Replace with your red icon path (16x16)
      : "green16.png";  // Replace with your safe icon path (16x16)
    chrome.action.setIcon({ path: iconPath });
  }
});
