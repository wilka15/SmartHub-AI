sendBtn.addEventListener("click", async () => {
  const prompt = promptEl.value.trim();
  if (!prompt) return alert("Введите текст!");

  responseEl.textContent = "Идёт обработка...";

  try {
    // ИСПРАВЛЕННЫЙ КОД:
    // 1. Используем функцию fetch().
    // 2. Указываем полный адрес вашего работающего сервера.
    const res = await fetch("https://<ИМЯ_ВАШЕГО_СЕРВИСА>.onrender.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
    });

    const data = await res.json();
    if (data.error) {
        responseEl.textContent = `Ошибка: ${data.error.message}`;
    } else {
        responseEl.textContent = data.choices[0].message.content;
    }

  } catch (err) {
    responseEl.textContent = "Ошибка запроса к серверу";
    console.error(err);
  }
});
