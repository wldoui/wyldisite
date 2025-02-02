import openai

# Установите ваш ключ API
openai.api_key = "token"

# Функция для отправки запроса и получения ответа
def send_message(text):
    # Новый способ создания запроса
    response = openai.Completion.create(
        model="gpt-3.5-turbo",  # Вы можете использовать "gpt-4", если у вас есть доступ
        prompt=text,
        max_tokens=150  # Ограничение на количество токенов
    )
    return response.choices[0].text.strip()

# Пример использования
message = "изыди демонюга тупая"
response = send_message(message)
print(response)
