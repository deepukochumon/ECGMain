from flask import Flask, request, jsonify
from flask_cors import CORS
from final_app import model_call
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route('/analyzer', methods=['POST'])
def analyze_ecg():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    uploaded_file = request.files['image']
    result = model_call(uploaded_file)  # Call your ML model function
    return jsonify({'prediction': result})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
