import os
import random
import cv2
import numpy as np
from moviepy.editor import VideoFileClip, concatenate_videoclips, CompositeVideoClip, vfx, AudioFileClip, CompositeAudioClip

def get_video_files(folder):
    """ Получает список всех видеофайлов в папке """
    return [os.path.join(folder, f) for f in os.listdir(folder) if f.endswith(('.mp4', '.avi', '.mov'))]
    
    
def merge_videos(video_files, output_file="merged.mp4", effects=False):
    """ 
    Объединяет видеофайлы в один 
    Если effects=True, добавляются случайные наложения видео
    """
    clips = [VideoFileClip(f) for f in video_files]

    if effects:
        layers = []
        base_clip = clips[0]  

        for clip in clips[1:]:
            if random.random() < 0.5:
                x_pos = random.randint(0, int(base_clip.size[0] * 0.5))
                y_pos = random.randint(0, int(base_clip.size[1] * 0.5))
                clip = clip.set_position((x_pos, y_pos)).resize(0.5).set_opacity(0.7)
            layers.append(clip)

        final_clip = CompositeVideoClip([base_clip] + layers)
    else:
        final_clip = concatenate_videoclips(clips, method="compose")

    final_clip.audio = CompositeAudioClip([clip.audio for clip in clips if clip.audio])
    final_clip.write_videofile(output_file, codec="libx264", fps=24, audio_codec="aac")
    print(f"Видео сохранено как {output_file}")    

def add_glitch_effect(input_video, output_video="glitched.mp4"):
    """ Добавляет артефакты: цветовые искажения, рассыпание на пиксели, гличи """
    cap = cv2.VideoCapture(input_video)
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_video, fourcc, 24.0, (int(cap.get(3)), int(cap.get(4))))

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if random.random() < 0.3:
            frame = cv2.applyColorMap(frame, random.choice([
                cv2.COLORMAP_JET, cv2.COLORMAP_HOT, cv2.COLORMAP_OCEAN, cv2.COLORMAP_BONE
            ]))

        if random.random() < 0.2:
            noise = np.random.randint(0, 255, frame.shape, dtype='uint8')
            frame = cv2.bitwise_xor(frame, noise)

        if random.random() < 0.1:
            shift = random.randint(-10, 10)
            frame[:, :, 0] = np.roll(frame[:, :, 0], shift, axis=1)
            frame[:, :, 2] = np.roll(frame[:, :, 2], -shift, axis=0)

        out.write(frame)

    cap.release()
    out.release()
    print(f"Видео с гличами сохранено как {output_video}")

def blend_videos_randomly(video1, video2, output_file="final_output.mp4"):
    """ 
    Накладывает части второго видео на первое в случайных местах и с разными эффектами 
    """
    clip1 = VideoFileClip(video1)
    clip2 = VideoFileClip(video2).resize(clip1.size)

    duration = min(clip1.duration, clip2.duration)
    blended_clips = []

    current_time = 0
    while current_time < duration:
        segment_duration = random.uniform(0.5, 3)  # Длина накладываемого сегмента (от 0.5 до 3 сек)
        if current_time + segment_duration > duration:
            segment_duration = duration - current_time
        
        subclip1 = clip1.subclip(current_time, current_time + segment_duration)
        subclip2 = clip2.subclip(current_time, current_time + segment_duration)

        # Случайное положение наложенного куска
        x_pos = random.randint(0, int(subclip1.size[0] * 0.5))
        y_pos = random.randint(0, int(subclip1.size[1] * 0.5))

        # Случайный эффект наложения
        if random.random() < 0.5:
            subclip2 = subclip2.set_opacity(0.5).fx(vfx.colorx, 1.5)
        else:
            subclip2 = subclip2.fx(vfx.lum_contrast, 0.5, 0, 128)

        subclip2 = subclip2.set_position((x_pos, y_pos))

        blended_clips.append(CompositeVideoClip([subclip1, subclip2]))

        current_time += segment_duration

    final_clip = concatenate_videoclips(blended_clips)

    # Объединяем аудио
    if clip1.audio and clip2.audio:
        final_clip.audio = CompositeAudioClip([clip1.audio, clip2.audio])

    final_clip.write_videofile(output_file, codec="libx264", fps=24, audio_codec="aac")
    print(f"Финальное видео сохранено как {output_file}")
   

if __name__ == "__main__":
    folder = "videos"
    video_files = get_video_files(folder)

    if not video_files:
        print("Нет видеофайлов для обработки!")
    else:
        mode = input("Выберите режим (1 - обычное, 2 - с эффектами, 3 - с случайным наложением фрагментов): ")

        if mode == "1":
            merge_videos(video_files, "merged.mp4", effects=False)

        elif mode == "2":
            merge_videos(video_files, "merged.mp4", effects=True)
            add_glitch_effect("merged.mp4", "glitched.mp4")

        elif mode == "3":
            merge_videos(video_files, "merged.mp4", effects=True)
            add_glitch_effect("merged.mp4", "glitched.mp4")
            blend_videos_randomly("merged.mp4", "glitched.mp4", "final_output.mp4")

        else:
            print("Неверный выбор!")
