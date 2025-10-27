from flask import Flask, request, jsonify
from flask_cors import CORS
from spam_detector import predict_spam

app = Flask(__name__)
CORS(app) 

@app.route('/')
def home():
    return jsonify({"message": "📡 Spam Detection API is running!"})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    message = data.get('message', '')

    if not message.strip():
        return jsonify({'error': 'Empty message provided'}), 400

    result = predict_spam(message)
    return jsonify({'prediction': result})

if __name__ == '__main__':
    app.run(debug=True)
