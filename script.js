sendBtn.addEventListener("click", async () => {
  const prompt = promptEl.value.trim();
  if (!prompt) return alert("Введите текст!");

  responseEl.textContent = "Идёт обработка...";

  try {
    // --- ИСПРАВЛЕННЫЙ КОД ---
    const res = await fetch("https://smarthub-proxy.onrender.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
    });

    const data = await res.json();
    if (data.error) responseEl.textContent = `Ошибка: ${JSON.stringify(data.error)}`;
    else responseEl.textContent = data.choices[0].message.content;

  } catch (err) {
    responseEl.textContent = "Ошибка запроса к серверу";
    console.error(err);
  }
});
