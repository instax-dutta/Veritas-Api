import * as ort from 'onnxruntime-web'; 

// Feature extraction (Matches your training code)
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

// Model Loading 
const modelPath = './phishing_detector.onnx'; 

async function loadModel() {
    const session = await ort.InferenceSession.create(modelPath);
    return session;
}

let modelSession = await loadModel(); 

// Prediction Function
async function predictPhishing(domain) {
    try {
        const features = extractFeatures(domain);

        // Ensure all features have values before preparing the tensor
        const allFeaturesHaveValues = Object.values(features).every(value => typeof value !== 'undefined');
        if (!allFeaturesHaveValues) {
            console.error("Missing feature values in extracted features!", features);
            return "unknown"; 
        }

        // Prepare input tensor (assuming types from your training code)
        const inputTensor = new Float32Array(Object.values(features)); 
        const feeds = { float_input: inputTensor.reshape([1, inputTensor.length]) }; 

        // Run inference
        const results = await modelSession.run(feeds);

        // Assuming your model produces a single output
        const predictionRaw = results.output.data[0];
        const prediction = predictionRaw > 0.5 ? "phishing" : "legitimate";

        return prediction; 

    } catch (error) {
        console.error("Prediction Error:", error); 
        return "unknown"; 
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
