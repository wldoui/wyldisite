import os
import random
from pydub.utils import which
from pydub import AudioSegment
from moviepy.editor import *
import tkinter as tk
from tkinter import messagebox
from tkinter.ttk import Progressbar

# Устанавливаем путь до ffmpeg для pydub
ffmpeg_path = os.path.join(os.path.dirname(__file__), 'ffmpeg', 'bin', 'ffmpeg.exe')
os.environ["FFMPEG_BINARY"] = ffmpeg_path

# Пример использования pydub для аудио
def process_audio(input_audio_path, output_audio_path):
    try:
        # Загружаем аудиофайл
        audio = AudioSegment.from_file(input_audio_path)
        
        # Применяем эффекты (например, изменение громкости)
        audio = audio + 10  # Увеличение громкости на 10 дБ
        
        # Экспортируем аудиофайл
        audio.export(output_audio_path, format="mp3")
        print(f"Audio saved as {output_audio_path}")
    except Exception as e:
        print(f"Error processing audio: {e}")

# Функция для добавления шума в изображение
def add_noise(image):
    width, height = image.size
    pixels = image.load()

    for i in range(width):
        for j in range(height):
            pixel = pixels[i, j]

            if isinstance(pixel, int):  # Градации серого
                noise = random.randint(-50, 50)
                pixel = max(0, min(255, pixel + noise))
                pixels[i, j] = pixel

            elif len(pixel) == 3:  # RGB
                r, g, b = pixel
                noise = random.randint(-50, 50)
                r = max(0, min(255, r + noise))
                g = max(0, min(255, g + noise))
                b = max(0, min(255, b + noise))
                pixels[i, j] = (r, g, b)

            elif len(pixel) == 4:  # RGBA
                r, g, b, a = pixel
                noise = random.randint(-50, 50)
                r = max(0, min(255, r + noise))
                g = max(0, min(255, g + noise))
                b = max(0, min(255, b + noise))
                pixels[i, j] = (r, g, b, a)

    return image

# Функция для наложения случайной гифки
def overlay_random_gif(image, gif_folder):
    gif_files = [f for f in os.listdir(gif_folder) if f.endswith('.gif')]
    if not gif_files:
        return image  # Если нет гифок, возвращаем оригинальное изображение

    gif_file = random.choice(gif_files)
    gif_path = os.path.join(gif_folder, gif_file)
    gif = Image.open(gif_path)

    # Случайное местоположение для наложения
    x_offset = random.randint(0, image.width - gif.width)
    y_offset = random.randint(0, image.height - gif.height)

    # Наложение изображения
    image.paste(gif, (x_offset, y_offset), gif.convert('RGBA'))
    
    return image

# Функция для создания mp4 с эффектами
def create_mp4_with_effects(input_path, output_path, gif_folder, progress_callback):
    clip = VideoFileClip(input_path)
    frames = []

    for i, frame in enumerate(clip.iter_frames(fps=clip.fps, dtype="uint8")):
        # Применение эффектов
        corrupted_frame = apply_intense_effects(frame)
        corrupted_frame = overlay_random_gif(corrupted_frame, gif_folder)
        frames.append(corrupted_frame)

        # Обновление прогресса
        progress_callback(i + 1, len(frames))

    # Сохранение нового видео
    clip_out = ImageSequenceClip(frames, fps=clip.fps)
    clip_out.write_videofile(output_path, codec="libx264")
    return output_path

# Генерация звука для видео
def generate_audio_for_gif(gif_path):
    sound = AudioSegment.silent(duration=0)
    
    # Генерация случайного звука на основе GIF
    for _ in range(random.randint(3, 7)):
        frequency = random.randint(400, 1500)
        duration = random.randint(200, 500)
        tone = AudioSegment.sine(frequency=frequency, duration=duration)
        sound += tone

    return sound

# GUI приложение
class MediaCorruptorApp:
    def __init__(self, root, folder_path):
        self.root = root
        self.folder_path = folder_path

        # Проверка существования папки
        if not os.path.exists(self.folder_path):
            messagebox.showerror("Error", f"The folder '{folder_path}' does not exist.")
            return
        
        self.selected_file = None
        self.create_gui()

    def create_gui(self):
        self.root.title("Media Corruptor")
        self.root.geometry("230x380")  # Устанавливаем размер окна 230x350 пикселей
        
        # Список файлов
        self.files = [f for f in os.listdir(self.folder_path) if f.endswith(('.gif', '.mp4', '.avi'))]
        
        # Список для отображения файлов
        self.file_listbox = tk.Listbox(self.root, selectmode=tk.SINGLE)
        for file in self.files:
            self.file_listbox.insert(tk.END, file)
        self.file_listbox.pack(padx=10, pady=10)

        # Поле ввода для строки коррупции
        self.corruption_string_label = tk.Label(self.root, text="Enter corruption string:")
        self.corruption_string_label.pack(padx=10, pady=5)
        
        self.corruption_string_entry = tk.Entry(self.root)
        self.corruption_string_entry.pack(padx=10, pady=5)

        # Кнопка для выбора файла
        self.select_button = tk.Button(self.root, text="Select File", command=self.select_file)
        self.select_button.pack(padx=10, pady=5)

        # Прогресс бар для отображения процесса
        self.progress_label = tk.Label(self.root, text="Progress:")
        self.progress_label.pack(padx=10, pady=5)
        
        self.progress = Progressbar(self.root, length=200, mode='determinate')
        self.progress.pack(padx=10, pady=5)
        
        # Кнопка для коррупции выбранного файла
        self.corrupt_button = tk.Button(self.root, text="Corrupt File", command=self.corrupt_selected_file, state=tk.DISABLED)
        self.corrupt_button.pack(padx=10, pady=5)

    def select_file(self):
        # Получаем выбранный файл из списка
        selected_index = self.file_listbox.curselection()
        if selected_index:
            self.selected_file = self.files[selected_index[0]]
            self.corrupt_button.config(state=tk.NORMAL)
        else:
            messagebox.showerror("Error", "No file selected.")

    def corrupt_selected_file(self):
        if self.selected_file:
            # Получаем строку для коррупции из поля ввода
            corruption_string = self.corruption_string_entry.get()
            if not corruption_string:
                messagebox.showerror("Error", "Please enter a corruption string.")
                return

            input_path = os.path.join(self.folder_path, self.selected_file)
            output_path = input_path.replace(".", "_corrupted.")
            
            # Начинаем генерировать mp4 с эффектами
            corrupted_file = create_mp4_with_effects(input_path, output_path, self.folder_path, self.update_progress)

            if corrupted_file:
                messagebox.showinfo("Success", f"File corrupted and saved as {corrupted_file}")
            else:
                messagebox.showerror("Error", "An error occurred while corrupting the file.")

    def update_progress(self, current, total):
        self.progress['value'] = (current / total) * 100
        self.root.update_idletasks()

# Запуск приложения
if __name__ == "__main__":
    root = tk.Tk()
    folder_path = "media"  # Путь к вашей папке с медиафайлами
    app = MediaCorruptorApp(root, folder_path)
    root.mainloop()
