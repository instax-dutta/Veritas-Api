let phishingDomains = [];
let phishingLinks = [];

// Read the list of phishing domains from the file
fetch(chrome.runtime.getURL('phishing_domains.txt'))
  .then(response => response.text())
  .then(data => {
    phishingDomains = data.split('\n').filter(site => site.trim() !== '');
  })
  .catch(error => console.error('Error reading phishing domains:', error));

// Read the list of phishing links from the file
fetch(chrome.runtime.getURL('phishing_links.txt'))
  .then(response => response.text())
  .then(data => {
    phishingLinks = data.split('\n').filter(link => link.trim() !== '');
  })
  .catch(error => console.error('Error reading phishing links:', error));

function updateExtensionIcon(isSafe) {
  const iconPaths = {
    safe: {
      16: 'safe_icon_16.png',
      32: 'safe_icon_32.png',
      48: 'safe_icon_48.png',
      128: 'safe_icon_128.png'
    },
    unsafe: {
      16: 'unsafe_icon_16.png',
      32: 'unsafe_icon_32.png',
      48: 'unsafe_icon_48.png',
      128: 'unsafe_icon_128.png'
    }
  };

  const iconPath = isSafe ? iconPaths.safe : iconPaths.unsafe;
  chrome.browserAction.setIcon({ path: iconPath });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    const url = tab.url;
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    const isSafe =
      !phishingDomains.some(site => domain.includes(site)) &&
      !phishingLinks.some(link => url.includes(link));

    updateExtensionIcon(isSafe);
  }
});