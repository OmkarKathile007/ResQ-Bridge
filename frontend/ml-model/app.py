from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torchvision.transforms as transforms
from PIL import Image
from torchvision import models
import torch.nn as nn
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ---------------------------
# Set Device
# ---------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ---------------------------
# Base Path (project backend/python)
# ---------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ---------------------------
# Binary Food Detection Model (Food vs. Non-Food)
# ---------------------------
binary_model = models.resnet50(weights=None)
num_ftrs_binary = binary_model.fc.in_features
binary_model.fc = nn.Linear(num_ftrs_binary, 2)

binary_model_path = os.path.join(BASE_DIR, "py", "binary_food_detection.pth")
binary_model.load_state_dict(torch.load(binary_model_path, map_location=device))
binary_model.to(device)
binary_model.eval()

# ---------------------------
# Food Type Classification Model
# ---------------------------
food_labels = [
    'adhirasam', 'aloo_gobi', 'aloo_matar', 'aloo_methi', 'aloo_shimla_mirch', 'aloo_tikki', 'anarsa',
    'ariselu', 'bandar_laddu', 'basundi', 'bhatura', 'bhindi_masala', 'biryani', 'boondi', 'butter_chicken',
    'chak_hao_kheer', 'cham_cham', 'chana_masala', 'chapati', 'chhena_kheeri', 'chicken_razala',
    'chicken_tikka', 'chicken_tikka_masala', 'chikki', 'daal_baati_churma', 'daal_puri', 'dal_makhani',
    'dal_tadka', 'dharwad_pedha', 'doodhpak', 'double_ka_meetha', 'dum_aloo', 'gajar_ka_halwa', 'gavvalu',
    'ghevar', 'gulab_jamun', 'imarti', 'jalebi', 'kachori', 'kadai_paneer', 'kadhi_pakoda', 'kajjikaya',
    'kakinada_khaja', 'kalakand', 'karela_bharta', 'kofta', 'kuzhi_paniyaram', 'lassi', 'ledikeni',
    'litti_chokha', 'lyangcha', 'maach_jhol', 'makki_di_roti_sarson_da_saag', 'malapua', 'misi_roti',
    'misti_doi', 'modak', 'mysore_pak', 'naan', 'navrattan_korma', 'palak_paneer', 'paneer_butter_masala',
    'phirni', 'pithe', 'poha', 'poornalu', 'pootharekulu', 'qubani_ka_meetha', 'rabri', 'ras_malai',
    'rasgulla', 'sandesh', 'shankarpali', 'sheer_korma', 'sheera', 'shrikhand', 'sohan_halwa', 'sohan_papdi',
    'sutar_feni', 'unni_appam'
]

food_model = models.resnet50(weights=None)
num_ftrs_food = food_model.fc.in_features
food_model.fc = nn.Linear(num_ftrs_food, 80)  # Output dimension matches number of labels (80)

food_model_path = os.path.join(BASE_DIR, "py", "indian_food_resnet50.pth")
food_model.load_state_dict(torch.load(food_model_path, map_location=device), strict=False)
food_model.to(device)
food_model.eval()

# ---------------------------
# Define Common Image Transform
# ---------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# ---------------------------
# Prediction Functions
# ---------------------------
def predict_binary(image):
    """Determine if the image is Food or Non-Food."""
    img_tensor = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = binary_model(img_tensor)
        _, predicted = torch.max(output, 1)
    return "Food" if predicted.item() == 0 else "Non-Food"

def predict_food_type(image):
    """Predict the specific food type."""
    img_tensor = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        outputs = food_model(img_tensor)
        _, predicted = torch.max(outputs, 1)
    predicted_idx = predicted.item()
    if 0 <= predicted_idx < len(food_labels):
        return food_labels[predicted_idx]
    else:
        return "Unknown Food"

# ---------------------------
# Flask API Route
# ---------------------------
@app.route('/api/predict', methods=['POST'])
def api_predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        image = Image.open(file.stream).convert("RGB")
    except Exception:
        return jsonify({"error": "Invalid image format"}), 400

    binary_result = predict_binary(image)
    if binary_result == "Food":
        food_name = predict_food_type(image)
        return jsonify({
            "binary_result": binary_result,
            "food_name": food_name
        })
    else:
        return jsonify({
            "binary_result": binary_result,
            "message": "Non-food image detected. Please upload a food image."
        })

if __name__ == '__main__':
    app.run(debug=True,port=5010)
