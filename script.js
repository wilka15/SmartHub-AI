sendBtn.addEventListener("click", async () => {
  const prompt = promptEl.value.trim();
  if (!prompt) return alert("Введите текст!");

  responseEl.textContent = "Идёт обработка...";

  try {
    // ИСПРАВЛЕНО: Используем функцию fetch и добавляем путь /v1/chat/completions
    const res = await fetch("https://smarthub-proxy.onrender.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
    });

    const data = await res.json();
    
    // Проверяем, пришел ли ответ в ожидаемом формате
    if (data.error) {
        responseEl.textContent = `Ошибка: ${JSON.stringify(data.error)}`;
    } else {
        // Пытаемся получить ответ от ИИ
        responseEl.textContent = data.choices[0].message.content;
    }

  } catch (err) {
    responseEl.textContent = "Ошибка запроса к серверу";
    console.error(err);
  }
});
