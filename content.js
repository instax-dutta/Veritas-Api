function isPhishingSite(url) {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
  
    return (
      phishingDomains.some(site => domain.includes(site)) ||
      phishingLinks.some(link => url.includes(link))
    );
  }
  
  function showWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.style.position = 'fixed';
    warningDiv.style.top = '10px';
    warningDiv.style.left = '10px';
    warningDiv.style.backgroundColor = 'red';
    warningDiv.style.color = 'white';
    warningDiv.style.padding = '10px';
    warningDiv.style.zIndex = '9999';
    warningDiv.textContent = 'Warning: This site is a known phishing site!';
    document.body.appendChild(warningDiv);
  }
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'checkSite') {
      const currentUrl = window.location.href;
      const isSafe = !isPhishingSite(currentUrl);
      sendResponse({ isSafe });
    }
  });
  
  if (isPhishingSite(window.location.href)) {
    showWarning();
  }