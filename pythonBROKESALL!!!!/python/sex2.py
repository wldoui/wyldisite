import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import transforms
from torchvision.utils import save_image
from torch.utils.data import Dataset, DataLoader
import cv2
import numpy as np
import os

# Определяем U-Net архитектуру
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

# Создаем пользовательский датасет
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

# Задаем гиперпараметры
image_dir = "path_to_images"
batch_size = 8
lr = 0.001
epochs = 50

# Подготовка данных
transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((128, 128)),
    transforms.ToTensor()
])
dataset = InpaintingDataset(image_dir, transform)
dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

# Инициализация модели, функции потерь и оптимизатора
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = UNet().to(device)
criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=lr)

# Тренировка модели
for epoch in range(epochs):
    for i, (corrupted, original, mask) in enumerate(dataloader):
        corrupted = corrupted.to(device)
        original = original.to(device)
        mask = mask.to(device)

        output = model(corrupted)
        loss = criterion(output * mask, original * mask)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

    print(f"Epoch [{epoch+1}/{epochs}], Loss: {loss.item():.4f}")
    if (epoch + 1) % 10 == 0:
        save_image(output, f"output_epoch_{epoch+1}.png")

# Пример использования модели
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

# Использование модели
test_image = "path_to_test_image.jpg"
result = inpaint_image(model, test_image, transform, device)
cv2.imwrite("inpainted_result.jpg", cv2.cvtColor(result, cv2.COLOR_RGB2BGR))
