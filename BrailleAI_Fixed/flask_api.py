from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import os
import tempfile

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'backend', 'model', 'best.pt')

print('Loading YOLO model...')
model = YOLO(MODEL_PATH)
print('Model loaded!')

@app.route('/ping')
def ping():
    return jsonify({'status':'ok','message':'Flask ML API is running'})

@app.route('/detect', methods=['POST'])
def detect():

    if 'image' not in request.files:
        return jsonify({
            'success':False,
            'detectedText':'No image uploaded'
        })

    image = request.files['image']

    temp = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
    image.save(temp.name)

    results = model(temp.name, conf=0.25)

    boxes = results[0].boxes

    detected = []

    for i in range(len(boxes)):
        cls_id = int(boxes.cls[i].item())
        detected.append(model.names[cls_id])

    text = ' '.join(detected) if detected else 'No Braille detected'

    return jsonify({
        'success':True,
        'detectedText':text
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
