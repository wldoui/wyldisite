import os
import subprocess
import sys

def run_command(command):
    """Функция для выполнения команд с проверкой ошибок"""
    try:
        subprocess.check_call(command, shell=True)
    except subprocess.CalledProcessError as e:
        print(f"Ошибка при выполнении команды: {command}\n{e}")
        sys.exit(1)

def main():
    # Укажите путь к Python 3.10
    python_path = r"path"  # Убедитесь, что путь верный!

    # Проверка, существует ли Python 3.10 по указанному пути
    if not os.path.exists(python_path):
        print(f"Ошибка: Python 3.10 не найден по пути {python_path}. Пожалуйста, установите Python 3.10.")
        sys.exit(1)

    # Создание виртуального окружения
    print("Создаю виртуальное окружение...")
    if not os.path.exists("venv"):
        run_command(f"{python_path} -m venv venv")

    # Активация виртуального окружения
    print("Активирую виртуальное окружение...")
    activate_script = os.path.join("venv", "Scripts", "activate")
    if not os.path.exists(activate_script):
        print("Ошибка: Скрипт активации виртуального окружения не найден.")
        sys.exit(1)

    # Обновление pip
    print("Обновляю pip...")
    run_command(r"venv\Scripts\python.exe -m pip install --upgrade pip")

    # Установка PyTorch
    print("Устанавливаю PyTorch...")
    run_command(r"venv\Scripts\python.exe -m pip install torch torchvision torchaudio")

if __name__ == "__main__":
    main()
