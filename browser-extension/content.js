const trustedTlds = [  // Expand as needed
    "com", "org", "net", "edu", "gov", 
    "uk", "ca", "au", "de", "io", "info"
]; 

const predictionServerURL = "http://65.0.89.194:3000/predict"; 

async function predictPhishing(url) {
    try {
        const response = await fetch(predictionServerURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "url": url }) 
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const prediction = await response.json();
        return prediction; 

    } catch (error) {
        console.error("Prediction Error:", error); 
        throw error;
    }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        const currentURL = tab.url;

        predictPhishing(currentURL)
            .then(prediction => {
                chrome.runtime.sendMessage({ prediction: prediction.prediction });  
            })
            .catch(error => console.error("Error in content.js:", error)); 
    }
});
