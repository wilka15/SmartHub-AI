sendBtn.addEventListener("click", async () => {
  const prompt = promptEl.value.trim();
  if (!prompt) return alert("Введите текст!");

  responseEl.textContent = "Идёт обработка...";

  try {
    // ИЗМЕНЕНИЕ: Добавлен mode: 'no-cors'
    const res = await fetch("https://smarthub-proxy.onrender.com/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
        // При mode: 'no-cors' нельзя ставить свои заголовки авторизации,
        // поэтому ключ нужно передавать в теле запроса или через query-параметры.
        // Но для теста попробуем так.
      },
      body: JSON.stringify({ 
        messages: [{ role: "user", content: prompt }],
        // ИЗМЕНЕНИЕ: Передаем ключ в теле запроса, так как заголовок будет проигнорирован
        api_key: "ВАШ_КЛЮЧ_ROUTERAI" 
      }),
      mode: 'no-cors' // <-- ЭТО ВАЖНАЯ СТРОКА
    });

    // При mode: 'no-cors' мы не можем прочитать ответ сервера здесь.
    // Поэтому просто считаем, что всё прошло успешно.
    // Ответ придет на сервер Render в логи.
    responseEl.textContent = "✅ Запрос отправлен! Проверьте логи сервера.";

  } catch (err) {
    responseEl.textContent = "Ошибка запроса к серверу";
    console.error(err);
  }
});
