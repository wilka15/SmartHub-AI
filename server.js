import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// 📌 Разрешаем запросы с фронтенда
app.use(cors());
app.use(express.json());
app.use(express.static("."));

// Основной маршрут
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    // Проверяем формат
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages пустой или неверный формат" });
    }

    const response = await fetch(
      "https://routerai.ru/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.ROUTERAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "gpt-4", messages }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    if (!data.choices || !data.choices.length) {
      return res
        .status(500)
        .json({ error: "Модель вернула пустой ответ" });
    }

    // Отправляем клиенту
    res.json(data);

  } catch (err) {
    console.error("Ошибка сервера:", err);
    res.status(500).json({ error: "Ошибка соединения с routerai" });
  }
});

// Слушаем порт Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
