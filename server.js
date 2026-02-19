import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// -------------------
// Middleware
// -------------------
app.use(cors());              // включаем CORS для фронтенда
app.use(express.json());      // чтобы сервер понимал JSON
app.use(express.static(".")); // оставляем корень проекта

// -------------------
// Основной маршрут для общения с routerai
// -------------------
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages пустой или неверный формат" });
  }

  try {
    console.log("Отправка на routerai:", JSON.stringify({ model: "gpt-4", messages }));

    const response = await fetch("https://routerai.ru/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.ROUTERAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "gpt-4", messages }),
    });

    console.log("HTTP статус от routerai:", response.status);

    const data = await response.json();
    console.log("Ответ routerai:", data);

    if (!response.ok) return res.status(response.status).json({ error: data });
    if (!data.choices || !data.choices.length) return res.status(500).json({ error: "Модель вернула пустой ответ" });

    res.json(data);
  } catch (err) {
    console.error("Ошибка сервера:", err);
    res.status(500).json({ error: "Ошибка соединения с routerai" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
