from flask import Flask, render_template, request
import joblib
import numpy as np

app = Flask(__name__)
model = joblib.load("model.pkl")

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/predict', methods=["POST"])
def predict():
    try:
        systolic = float(request.form["systolic"])
        diastolic = float(request.form["diastolic"])
        spo2 = float(request.form["spo2"])
        temperature = float(request.form["temperature"])

        features = np.array([[systolic, diastolic, spo2, temperature]])
        prediction = model.predict(features)[0]

        return render_template("index.html", result=f"🩺 Predicted Disease: {prediction}")
    except Exception as e:
        return render_template("index.html", result=f"❌ Error: {e}")

if __name__ == "__main__":
    app.run(debug=True)
