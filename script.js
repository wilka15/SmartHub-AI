const promptEl = document.getElementById("prompt");
const sendBtn = document.getElementById("send");
const responseEl = document.getElementById("response");

sendBtn.addEventListener("click", async () => {
  const prompt = promptEl.value.trim();
  if (!prompt) return alert("Введите текст!");

  responseEl.textContent = "Идёт обработка...";

  try {
    const res = await fetch("/api/chat", {
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
