chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.prediction !== undefined) {
    const iconPath = message.prediction === 1 
      ? "red16.png"  
      : "green16.png";  
    chrome.action.setIcon({ path: iconPath });
  }
});
