import os
from PIL import Image

def optimize_gif(input_folder, output_folder, max_size=5):
    # Получаем список всех файлов в папке
    files = os.listdir(input_folder)
    
    # Находим все GIF-файлы в папке
    gif_files = [f for f in files if f.lower().endswith('.gif')]
    
    if not gif_files:
        print("Не найдено GIF-файлов в папке!")
        return
    
    # Выбираем первый найденный GIF
    input_path = os.path.join(input_folder, gif_files[0])
    output_path = os.path.join(output_folder, f"optimized_{gif_files[0]}")
    
    print(f"Загрузка GIF: {input_path}")
    
    # Открываем исходную гифку
    gif = Image.open(input_path)
    
    print(f"Обработка кадров GIF...")
    
    # Создаем список для кадров
    frames = []
    
    # Получаем все кадры GIF
    for frame in range(gif.n_frames):
        gif.seek(frame)
        frame_image = gif.convert("RGBA")
        frames.append(frame_image)
    
    print(f"Преобразование палитры изображения...")
    
    # Преобразуем в изображение с уменьшенной палитрой
    gif = frames[0]
    gif = gif.convert("P", palette=Image.ADAPTIVE, colors=256)
    
    print(f"Сохранение оптимизированного GIF в: {output_path}")
    
    # Сохраняем гиф в новый файл с параметрами оптимизации
    gif.save(output_path, save_all=True, append_images=frames[1:], optimize=True, loop=0, duration=gif.info['duration'])
    
    # Проверяем размер файла и уменьшаем качество, если нужно
    while os.path.getsize(output_path) > max_size * 1024 * 1024:
        print(f"Размер файла слишком большой, сжимаем... (текущий размер: {os.path.getsize(output_path) / 1024 / 1024:.2f} MB)")
        gif.save(output_path, save_all=True, append_images=frames[1:], optimize=True, loop=0, duration=gif.info['duration'], quality=75)

    print(f"GIF успешно оптимизировано до {output_path} (финальный размер: {os.path.getsize(output_path) / 1024 / 1024:.2f} MB)")

# Пример использования:
input_folder = 'input'  # Папка с GIF
output_folder = 'output'  # Папка для сохранения оптимизированного GIF

optimize_gif(input_folder, output_folder)
