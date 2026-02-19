import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // разрешаем запросы с фронтенда
app.use(express.json()); // парсинг JSON
app.use(express.static(".")); // статические файлы фронтенда

// Основной маршрут для общения с ИИ
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    // Проверка body
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages пустой или неверный формат" });
    }

    // Отправка запроса на routerai.ru
    const response = await fetch("https://routerai.ru/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.ROUTERAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages,
      }),
    });

    const data = await response.json();

    // Если API вернул ошибку
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    // Если нет ответов от модели
    if (!data.choices || !data.choices.length) {
      return res.status(500).json({ error: "Модель вернула пустой ответ" });
    }

    // Всё ок — возвращаем клиенту
    res.json(data);

  } catch (err) {
    console.error("Ошибка сервера:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Запуск сервера на порту Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
