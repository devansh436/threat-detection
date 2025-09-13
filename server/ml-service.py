from flask import Flask, request, jsonify
import joblib
import numpy as np

model = joblib.load("xgb_binary_model.pkl")

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        print("Received data:", data)
        features = np.array(data["features"])
        print("Features shape before reshape:", features.shape)
        features = features.reshape(1, -1)
        print("Features shape after reshape:", features.shape)
        prediction = model.predict(features)
        print("Prediction:", prediction)
        return jsonify({"prediction": prediction.tolist()})
    except Exception as e:
        print("Error in /predict:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
