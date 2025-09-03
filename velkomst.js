import fs from "fs";
import fetch from "node-fetch";

// Secrets fra GitHub
const WEATHER_KEY = process.env.OPENWEATHER_API_KEY;
const LAT = process.env.SKILBREI_LAT;
const LON = process.env.SKILBREI_LON;
const ELEVEN_API = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

// Hent klokke og ukedag
function getNow() {
  const d = new Date();
  const weekday = d.toLocaleDateString("no-NO", { weekday: "long", timeZone: "Europe/Oslo" }).toLowerCase();
  const time = d.toLocaleTimeString("no-NO", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Oslo" });
  return { weekday, time };
}

// Hent vær
async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${WEATHER_KEY}&units=metric&lang=no`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Feil fra OpenWeather: " + (await res.text()));
  const data = await res.json();
  return `${Math.round(data.main.temp)} grader og ${data.weather[0].description}`;
}

// Les meldinger.txt og finn for ukedagen
function getMessage(weekday) {
  const text = fs.readFileSync("meldinger.txt", "utf-8");
  const lines = text.split("\n");
  let active = false;
  let msgs = [];
  for (const line of lines) {
    if (line.startsWith("[")) {
      active = line.toLowerCase().includes(weekday);
      continue;
    }
    if (active && line.trim() !== "") msgs.push(line.trim());
  }
  if (msgs.length === 0) return "Velkommen hjem. Lysa er tent.";
  return msgs[Math.floor(Math.random() * msgs.length)];
}

// Lag MP3 via ElevenLabs
async function makeMp3(text) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVEN_API,
      "Content-Type": "application/json",
      "Accept": "audio/mpeg"
    },
    body: JSON.stringify({
      model_id: "eleven_multilingual_v3",
      text: text,
      voice_settings: { stability: 0.5, similarity_boost: 0.8 }
    })
  });
  if (!res.ok) throw new Error("Feil fra ElevenLabs: " + (await res.text()));
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync("velkomst.mp3", buffer);
  console.log("✅ Ny velkomst.mp3 generert");
}

// Main
(async () => {
  try {
    const { weekday, time } = getNow();
    const weather = await getWeather();
    const message = getMessage(weekday);
    const fullText = `${message} Klokka er ${time}. Ute er det ${weather}.`;
    console.log("[DEBUG] Tekst til tale:", fullText);
    await makeMp3(fullText);
  } catch (err) {
    console.error("❌ Feil:", err);
    process.exit(1);
  }
})();