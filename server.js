import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  try {
    const response = await fetch("https://routerai.ru/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.ROUTERAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Proxy error" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
