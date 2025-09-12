from flask import Flask, request, jsonify
import joblib
import numpy as np

model = joblib.load("xgb_binary_model.pkl")

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    features = np.array(data["features"]).reshape(1, -1)
    prediction = model.predict(features)
    return jsonify({"prediction": prediction.tolist()})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
