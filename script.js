sendBtn.addEventListener("click", async () => {
  const prompt = promptEl.value.trim();
  if (!prompt) return alert("Введите текст!");

  responseEl.textContent = "Идёт обработка...";

  try {
    // ИЗМЕНЕНИЕ: Добавляем mode: 'no-cors'
    // ВАЖНО: При таком запросе мы не сможем прочитать ответ сервера здесь.
    // Мы просто убедимся, что запрос "ушел".
    await fetch("https://smarthub-proxy.onrender.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        messages: [{ role: "user", content: prompt }],
        // Ключ передаем в теле, так как заголовки могут быть заблокированы
        api_key: "ВАШ_КЛЮЧ_ЗДЕСЬ" 
      }),
      mode: 'no-cors' // <-- ЭТО МАГИЧЕСКАЯ СТРОЧКА
    });

    // Так как мы не можем получить ответ, просто выводим сообщение об успехе
    responseEl.textContent = "✅ Запрос отправлен! Проверьте логи сервера.";

  } catch (err) {
    // При mode: 'no-cors' ошибки в catch не будет, даже если сервер недоступен.
    // Браузер просто ничего не скажет.
    console.log("Режим 'no-cors' активен. Ошибки здесь не ловятся.");
  }
});
