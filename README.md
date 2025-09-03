# Velkomst-prosjekt (automatisk)

Dette prosjektet lager **én MP3-fil (`velkomst.mp3`)** som oppdateres automatisk hver dag kl. 00:01 via GitHub Actions.

## Funksjoner
- Henter vær fra OpenWeather (norsk).  
- Henter klokkeslett (lokaltid, Oslo).  
- Velger en tilfeldig melding fra `meldinger.txt` for dagens ukedag.  
- Legger til fast lys-setning.  
- Genererer ny `velkomst.mp3` med ElevenLabs.  
- Homey/Chromecast spiller alltid den samme fila.

## Secrets som må settes
- `OPENWEATHER_API_KEY`
- `SKILBREI_LAT`
- `SKILBREI_LON`
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_ID`

## Bruk
- Rediger meldingene i `meldinger.txt` fritt.  
- Workflow kjører automatisk kl 00:01, eller manuelt via "Run workflow".  
- Last ned `velkomst.mp3` fra Actions → Artifacts.  
