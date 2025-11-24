const API_URL = "https://openai-proxy-1-89m3.onrender.com/v1/responses";

let lastAIMessage = "";
let userAvatar = localStorage.getItem("userAvatar") || "user1.png";

/* ------------ ОТПРАВКА ------------ */
async function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";

    addMessage(text, "user");

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            model: "gpt-4o-mini",
            input: text
        })
    });

    const data = await response.json();
    let ai = "";

if (data.output) {
    ai = data.output[0]?.content[0]?.text || "";
}
else if (data.choices) {
    ai = data.choices[0]?.message?.content || "";
}
else {
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
    const voiceSelect = document.getElementById("voiceSelect").value;

    utter.lang = "ru-RU";

    const voices = speechSynthesis.getVoices();

    if (voiceSelect === "male") {
        utter.voice = voices.find(v => v.name.includes("male")) || null;
    } else {
        utter.voice = voices.find(v => v.name.includes("female")) || null;
    }

    speechSynthesis.speak(utter);
}

/* ------------ ГОЛОСОВОЙ ВВОД ------------ */
function voiceInput() {
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Rec) return alert("Голосовой ввод не поддерживается.");

    const rec = new Rec();
    rec.lang = "ru-RU";
    rec.start();

    rec.onresult = e => {
        document.getElementById("userInput").value = e.results[0][0].transcript;
    };
}

/* ------------ ТЕМА ------------ */
function toggleTheme() {
    const body = document.body;
    body.classList.toggle("light");
    body.classList.toggle("dark");
}

/* ------------ МЕНЮ ------------ */
function toggleSettings() {
    document.getElementById("settingsPanel").classList.toggle("show");
}

/* ------------ АВАТАР ------------ */
function setUserAvatar(file) {
    userAvatar = file;
    localStorage.setItem("userAvatar", file);
    document.getElementById("avatarPreview").src = file;
}

/* Загружаем аватар при старте */
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("avatarPreview").src = userAvatar;
});
