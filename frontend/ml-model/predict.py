import torch
import torchvision.transforms as transforms
from PIL import Image
from torchvision import models
import torch.nn as nn

# Load Model
model = models.resnet50(pretrained=False)
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 2)
model.load_state_dict(torch.load("binary_food_detection.pth"))
model.eval()

# Define Transform
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Prediction Function
def predict(image_path):
    image = Image.open(image_path)
    image = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(image)
        _, predicted = torch.max(output, 1)

    return "Food" if predicted.item() == 0 else "Non-Food"

# Example C:\Users\Asus\Downloads\poha.jpg
image_path = r"C:/Users/Asus/Downloads/poha.jpg"
result = predict(image_path)
print("Prediction:", result)
