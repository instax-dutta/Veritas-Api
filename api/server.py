from flask import Flask
from flask_restful import Api, Resource, reqparse
from joblib import load
import pandas as pd

app = Flask(__name__)
api = Api(app)

model = load('phishing_detector.joblib') # Load your initial model

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

class Predict(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('url')
        args = parser.parse_args()

        url = args['url']
        features = extract_features(url)
        features_df = pd.DataFrame([features])

        prediction = model.predict(features_df)[0]
        return {'prediction': int(prediction)}

api.add_resource(Predict, '/predict')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True) # Add debug=True for development
