const API_URL = "https://openai-proxy-1-89m3.onrender.com/v1/responses";

let lastAIMessage = "";
let userAvatar = localStorage.getItem("userAvatar") || "user1.png";

let voices = [];
let selectedVoice = localStorage.getItem("voiceGender") || "female";

/* ------------ ОТПРАВКА ------------ */
async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";

  addMessage(text, "user");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      input: text
    })
  });

  const data = await response.json();
  console.log("Ответ от прокси:", data);

  let ai = "";
  if (data.output) {
    ai = data.output[0]?.content[0]?.text || "";
  } else if (data.choices) {
    ai = data.choices[0]?.message?.content || "";
  } else {
    ai = "Ошибка: сервер вернул неизвестный формат ответа.";
  }

  addMessage(ai, "ai");
  lastAIMessage = ai;
}

/* ------------ ДОБАВЛЕНИЕ СООБЩЕНИЙ ------------ */
function addMessage(text, role) {
  const chat = document.getElementById("chat");

  const wrap = document.createElement("div");
  wrap.className = "msg " + role;

  const avatar = document.createElement("img");
  avatar.className = "msg-avatar";
  avatar.src = role === "user" ? userAvatar : "avatar-ai.png";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);

  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;
}

/* ------------ ОЗВУЧКА ------------ */
function speakLast() {
  if (!lastAIMessage) return;
  speak(lastAIMessage);
}

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ru-RU";

  if (voices.length === 0) {
    voices = speechSynthesis.getVoices();
  }

  if (selectedVoice === "male") {
    utter.voice = voices.find(v => /male|man/i.test(v.name)) || voices[0];
  } else {
    utter.voice = voices.find(v => /female|woman/i.test(v.name)) || voices[0];
  }

  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

/* ------------ ГОЛОСОВОЙ ВВОД ------------ */
function voiceInput() {
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Rec) {
    alert("Голосовой ввод не поддерживается.");
    return;
  }

  const rec = new Rec();
  rec.lang = "ru-RU";
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  rec.onresult = (e) => {
    const text = e.results[0][0].transcript;
    document.getElementById("userInput").value = text;
  };
  rec.onerror = (e) => {
    console.error("Ошибка распознавания голоса:", e);
  };

  rec.start();
}

/* ------------ ТЕМА ------------ */
function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.toggle("light");
  body.classList.toggle("dark", !isLight);
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    document.body.classList.add("light");
    document.body.classList.remove("dark");
  } else if (saved === "dark") {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
  } else {
    // если нет сохраненной темы — можно принять системную или по-умолчанию темную
    document.body.classList.add("dark");
  }
}

/* ------------ НАСТРОЙКИ АВАТАРА ------------ */
function toggleSettings() {
  document.getElementById("settingsPanel").classList.toggle("show");
}

function setUserAvatar(file) {
  userAvatar = file;
  localStorage.setItem("userAvatar", file);
  const prev = document.getElementById("avatarPreview");
  if (prev) prev.src = file;
}

/* ------------ ИНИЦИАЛИЗАЦИЯ ------------ */
document.addEventListener("DOMContentLoaded", () => {
  // тема
  initTheme();

  // голоса
  voices = speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => {
    voices = speechSynthesis.getVoices();
  };

  // голос из настроек
  const vs = document.getElementById("voiceSelect");
  if (vs) {
    vs.value = selectedVoice;
    vs.addEventListener("change", () => {
      selectedVoice = vs.value;
      localStorage.setItem("voiceGender", selectedVoice);
    });
  }

  // аватар
  const prev = document.getElementById("avatarPreview");
  if (prev) prev.src = userAvatar;
});
