from fastapi import FastAPI, Request
from joblib import load
import pandas as pd
from urllib.parse import urlparse 

app = FastAPI()
model = load('phishing_detector.joblib') 

def extract_features(domain):
    return {
        "length": len(domain),
        "hyphens": domain.count("-"),
        "digits": sum(c.isdigit() for c in domain),
        "subdomains": domain.count("."),
        "trusted_tld": domain.split(".")[-1] in [
            "com", "org", "net", "edu", "gov", 
            "uk", "ca", "au", "de", "io", "info"  
        ]  
    }

@app.post("/predict")
async def predict(request: Request):
    data = await request.json()
    url = data["url"]

    domain = urlparse(url).netloc 
    features = extract_features(domain) 
    features_df = pd.DataFrame([features]) 

    prediction = model.predict(features_df)[0]
    return {"prediction": int(prediction)}  

# Instructions to run:
# 1. Ensure `phishing_detector.joblib` is in the same directory
# 2. Install dependencies: pip install fastapi uvicorn pandas scikit-learn urllib
# 3. Run the server: uvicorn main:app --host 0.0.0.0 --port 3000 
