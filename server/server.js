import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-zа-я0-9]/gi, "");
}

// простой фильтр
function isBlocked(text) {
  const clean = normalize(text);
  const banned = ["porn", "порно", "sex", "секс"];
  return banned.some(w => clean.includes(w));
}

app.post("/api/chat", async (req, res) => {
  const message = req.body.message;

  if (!message || message.length > 1500) {
    return res.json({ reply: "❌ Слишком длинный запрос" });
  }

  if (isBlocked(message)) {
    return res.json({ reply: "⛔ Запрос заблокирован системой безопасности" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: message
      })
    });

    const data = await response.json();

    const reply =
      data.output?.[0]?.content?.[0]?.text ||
      "Ошибка ответа";

    res.json({ reply });

  } catch (e) {
    res.json({ reply: "❌ Ошибка сервера" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
