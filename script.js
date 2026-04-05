// --- ЗАМЕНИ <ИМЯ_СЕРВИСА> НА НАЗВАНИЕ ТВОЕГО СЕРВИСА НА RENDER ---
// Например: https://openai-proxy-4.onrender.com
const SERVER_URL = "https://openai-proxy-4.onrender.com/v1/chat/completions";

sendBtn.addEventListener("click", async () => {
  const prompt = promptEl.value.trim();
  if (!prompt) return alert("Введите текст!");

  responseEl.textContent = "Идёт обработка...";

  try {
    const res = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
    });

    const data = await res.json();
    
    if (data.error) {
        responseEl.textContent = `Ошибка сервера: ${data.error.message}`;
    } else if (data.choices && data.choices[0] && data.choices[0].message) {
        responseEl.textContent = data.choices[0].message.content;
    } else {
        responseEl.textContent = "Получен неизвестный ответ от сервера.";
        console.log(data); // Посмотри в консоль, что прислал сервер
    }

  } catch (err) {
    responseEl.textContent = "Ошибка сети. Проверьте консоль.";
    console.error(err);
  }
});
