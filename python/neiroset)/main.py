import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import transforms
from torchvision.utils import save_image
from torch.utils.data import Dataset, DataLoader
import cv2
import numpy as np
import os
import tkinter as tk
from tkinter import filedialog, messagebox

# --- Конфигурация ---
IMAGE_DIR = "images"  # Укажите путь к папке с изображениями
TEST_IMAGE = "test.jpg"  # Укажите тестовое изображение
BATCH_SIZE = 8
LR = 0.001
EPOCHS = 50
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# --- Архитектура U-Net ---
class UNet(nn.Module):
    def __init__(self):
        super(UNet, self).__init__()
        self.encoder = nn.Sequential(
            self.conv_block(3, 64),
            self.conv_block(64, 128),
            self.conv_block(128, 256)
        )
        self.decoder = nn.Sequential(
            self.conv_block(256, 128),
            self.conv_block(128, 64),
            nn.ConvTranspose2d(64, 3, kernel_size=3, stride=1, padding=1)
        )

    def conv_block(self, in_channels, out_channels):
        return nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True)
        )

    def forward(self, x):
        x1 = self.encoder[0](x)
        x2 = self.encoder[1](x1)
        x3 = self.encoder[2](x2)
        x = self.decoder[0](x3)
        x = self.decoder[1](x)
        x = self.decoder[2](x)
        return torch.sigmoid(x)

# --- Датасет ---
class InpaintingDataset(Dataset):
    def __init__(self, image_dir, transform=None):
        self.image_dir = image_dir
        self.transform = transform
        self.images = os.listdir(image_dir)

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        img_path = os.path.join(self.image_dir, self.images[idx])
        img = cv2.imread(img_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        mask = np.zeros_like(img)
        h, w, _ = img.shape
        mask[h//4:3*h//4, w//4:3*w//4] = 1
        corrupted = img * (1 - mask)

        if self.transform:
            img = self.transform(img)
            corrupted = self.transform(corrupted)
            mask = self.transform(mask)

        return corrupted, img, mask

# --- Подготовка данных ---
transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((128, 128)),
    transforms.ToTensor()
])
dataset = InpaintingDataset(IMAGE_DIR, transform)
dataloader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)

# --- Инициализация модели ---
model = UNet().to(DEVICE)
criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=LR)

# --- Функция восстановления изображения ---
def inpaint_image(model, image_path, transform, device):
    model.eval()
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    h, w, _ = img.shape
    mask = np.zeros_like(img)
    mask[h//4:3*h//4, w//4:3*w//4] = 1
    corrupted = img * (1 - mask)
    corrupted_tensor = transform(corrupted).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(corrupted_tensor)

    inpainted = output.squeeze(0).cpu().numpy().transpose(1, 2, 0)
    return np.clip(inpainted * 255, 0, 255).astype(np.uint8)

# --- GUI ---
class InpaintingApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Inpainting App")

        self.epochs_var = tk.StringVar(value=EPOCHS)
        self.lr_var = tk.StringVar(value=LR)
        self.batch_size_var = tk.StringVar(value=BATCH_SIZE)

        tk.Label(root, text="Epochs:").pack()
        tk.Entry(root, textvariable=self.epochs_var).pack()

        tk.Label(root, text="Learning Rate:").pack()
        tk.Entry(root, textvariable=self.lr_var).pack()

        tk.Label(root, text="Batch Size:").pack()
        tk.Entry(root, textvariable=self.batch_size_var).pack()

        tk.Button(root, text="Train Model", command=self.train_model).pack()
        tk.Button(root, text="Test Model", command=self.test_model).pack()

    def train_model(self):
        global EPOCHS, LR, BATCH_SIZE
        EPOCHS = int(self.epochs_var.get())
        LR = float(self.lr_var.get())
        BATCH_SIZE = int(self.batch_size_var.get())

        optimizer = optim.Adam(model.parameters(), lr=LR)
        dataloader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)

        print("Начинаем обучение модели...")
        for epoch in range(EPOCHS):
            for i, (corrupted, original, mask) in enumerate(dataloader):
                corrupted = corrupted.to(DEVICE)
                original = original.to(DEVICE)
                mask = mask.to(DEVICE)

                output = model(corrupted)
                loss = criterion(output * mask, original * mask)

                optimizer.zero_grad()
                loss.backward()
                optimizer.step()

            print(f"Epoch [{epoch+1}/{EPOCHS}], Loss: {loss.item():.4f}")
            if (epoch + 1) % 10 == 0:
                save_image(output, f"output_epoch_{epoch+1}.png")

        print("Обучение завершено. Модель сохранена.")
        torch.save(model.state_dict(), "inpainting_model.pth")
        messagebox.showinfo("Training Complete", "Model has been trained and saved.")

    def test_model(self):
        image_path = filedialog.askopenfilename()
        if image_path:
            model.load_state_dict(torch.load("inpainting_model.pth"))
            result = inpaint_image(model, image_path, transform, DEVICE)
            cv2.imwrite("inpainted_result.jpg", cv2.cvtColor(result, cv2.COLOR_RGB2BGR))
            messagebox.showinfo("Inpainting Complete", "Result saved as inpainted_result.jpg")

if __name__ == "__main__":
    root = tk.Tk()
    app = InpaintingApp(root)
    root.mainloop()
