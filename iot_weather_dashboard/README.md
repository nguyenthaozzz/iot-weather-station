# IoT Weather Dashboard (HTML + Node/Express)

A web dashboard that displays weather data based on a template UI and
**receives dynamic data** from: - **InfluxDB** (temperature, humidity,
pressure + charts) - **Open-Meteo API** (current weather conditions for
icons/UI) - **MQTT** (a *Sleep mode* button sending commands to ESP32;
*Connected/Disconnected* status via topic `esp32/status`)

> The design is focused on *localhost* environment for academic
> projects. You can switch to OpenWeather if needed.

## Structure

    .
    iot_weather_dashboard/
    ├─ public/            # Frontend UI folder
    │  ├─ index.html      # Main dashboard interface
    │  ├─ style.css       # Layout, colors, fonts
    │  ├─ app.js          # Display logic, realtime updates
    │  └─ images/         # Icons & images (smile, sad, location,...)
    ├─ server.js          # Backend (Express + InfluxDB + MQTT)
    ├─ .env               # Environment variables (token, URL, port...)
    └─ package.json       # Dependencies & scripts

## Requirements

-   Node.js 18+
-   InfluxDB v2 with configured bucket & token
-   MQTT broker (Mosquitto) running (optional if you need Sleep button +
    status)

## Installation & Run

``` bash
cd iot_weather_dashboard
cp .env.example .env   # update token, bucket, MQTT...
npm i
npm run dev
# Open browser: http://localhost:8080
```

### InfluxDB

The server queries measurement **`weather`** with fields: `temperature`,
`humidity`, `pressure`, and tag `city` (e.g.,
`city="Ho Chi Minh City"`).\
You can use telegraf/inserter to write data following this schema.

**Sample Flux query for testing:**

``` flux
from(bucket: "my-bucket")
  |> range(start: -6h)
  |> filter(fn: (r) => r._measurement == "weather")
  |> filter(fn: (r) => r.city == "Ho Chi Minh City")
  |> filter(fn: (r) => r._field == "temperature" or r._field == "humidity" or r._field == "pressure")
  |> aggregateWindow(every: 15m, fn: mean, createEmpty: false)
```

### MQTT (ESP32)

-   ESP32 publishes its status to **`esp32/status`** with `"online"` /
    `"offline"`.
-   Sleep mode button publishes `{"action":"sleep"}` to **`esp32/cmd`**.

### Changing Location

-   Click **Change** → enter city → page calls `/api/metrics?city=...`
    and `/api/weather?city=...`.
-   Backend uses **Open‑Meteo Geocoding** (no API key needed).

### Mood Icon

-   **Smile**: 24--28°C and (humidity 40--60% or pressure 1005--1015
    hPa)\
-   **Sad**: otherwise\
    Modify in `app.js` → function `pickMood`.

## Customization

-   Edit UI via `style.css`
-   Client never exposes Influx token (handled by backend)
-   To use OpenWeather: edit `/api/weather` in `server.js` and add
    `OPENWEATHER_API_KEY`
