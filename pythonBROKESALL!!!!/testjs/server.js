const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Замените на ваш токен OpenAI API
const OPENAI_API_KEY = 'ключ тот самый да да';

// Настройка middleware
app.use(cors());
app.use(bodyParser.json());

// Обслуживание статических файлов из текущей директории
app.use(express.static(path.join(__dirname)));

// Возврат HTML-файла для корневого маршрута
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Маршрут для API запросов
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'НУ ПОЖАЛУЙСТА НУ ОТПРАВЬТЕ СООБЩЕНИЕ!!!!!!!(((' });
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo', // Замените на 'gpt-3.5-turbo', если используете эту модель
                messages: [{ role: 'user', content: message }],
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const reply = response.data.choices[0].message.content;
        res.json({ reply });
    } catch (error) {
        console.error('Ошибка API OpenAI:', error.message);
        res.status(500).json({ error: 'сучки не выдали ответа выблядки(((' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
