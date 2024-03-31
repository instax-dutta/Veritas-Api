import { InferenceSession } from 'onnxruntime-web';

// Feature extraction (Adapt from your training code)
function extractFeatures(url) {
    const parts = new URL(url);
    const hasProtocol = parts.protocol === 'http:' || parts.protocol === 'https:';

    return {
        length: url.length,
        hyphens: url.count("-"),
        digits: url.count(/[0-9]/), 
        subdomains: parts.hostname.count("."), 
        trusted_tld: ["com", "org", "net", "edu", "gov", "uk", "ca", "au", "de", "io", "info"].includes(parts.hostname.split('.').pop()), 
        has_protocol: hasProtocol
    };
}

async function loadModel() {
    const session = await InferenceSession.create('./phishing_detector.onnx');
    return session;
}

let modelSession = await loadModel(); 

// Prediction with Error Handling
async function predictPhishing(domain) {
    try {
        const features = extractFeatures(domain);

        // Prepare input for ONNX.js (Adjust based on your model)
        const inputTensor = new Float32Array(Object.values(features));
        const feeds = { float_input: inputTensor.reshape([1, inputTensor.length]) };

        // Run inference
        const results = await modelSession.run(feeds);
        const predictionRaw = results.output.data[0];
        const prediction = predictionRaw > 0.5 ? "phishing" : "legitimate"; 

        return prediction; 

    } catch (error) {
        console.error("Prediction Error:", error); 
        return "unknown"; // error handling lmfao 
    }
}

// Message Handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.domain) {
        predictPhishing(message.domain) 
            .then(prediction => chrome.tabs.sendMessage(sender.tab.id, { prediction })) 
            .catch(error => console.error("Prediction Error:", error)); 
    }
});
