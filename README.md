🌤️ IoT Weather Station (ESP32 – Local Deployment)
This project is a locally-hosted IoT Weather Station built using an ESP32, multiple environmental sensors, and a local dashboard for real-time monitoring.
It collects temperature, humidity, and pressure, sends them over MQTT to an InfluxDB time-series database, and displays live charts on a custom web interface.

📌 Features
🌡️ Real-time temperature, humidity, and pressure monitoring
📡 ESP32 + MQTT (Mosquitto) for lightweight data transmission
🗄️ Local InfluxDB + Telegraf for time-series data storage
📊 Interactive Dashboard (HTML/CSS/JS) with real-time charts
🖼️ TFT LCD Display for on-device visualization
🔄 Auto-refresh weather data every few seconds
🛠️ Fully local deployment — secure, private, and offline-capable

📌 System Architecture
<img width="1327" height="691" alt="image" src="https://github.com/user-attachments/assets/3c5632af-18f4-4120-8c90-ca519b5dcc6f" />

1. ESP32 reads sensor data every few seconds.
2. Data is published to MQTT topics.
3. Telegraf listens to these MQTT topics.
4. Telegraf writes data into InfluxDB buckets.
5. Node.js backend queries the latest values.
6. Dashboard displays real-time charts & current values.

🛠️ Hardware Used
ESP32 NodeMCU Development Board
DHT11 Sensor (Temperature & Humidity)
BMP180 Sensor (Pressure)
ST7735 TFT Display (SPI)

🧰 Software & Tools
Arduino IDE (ESP32 Firmware)
Mosquitto MQTT Broker
InfluxDB 2.x
Telegraf
Node.js + Express (Backend API)
HTML, CSS, JavaScript (Frontend Visualization)

🔧 Installation & Setup
1️⃣ Install Required Services
Install Mosquitto
Install InfluxDB 2.x
Install Telegraf
Install Node.js (LTS)

2️⃣ Flash ESP32
Upload firmware from /firmware with your WiFi & MQTT credentials.

3️⃣ Configure InfluxDB
Create a bucket
Create an API token
Update Telegraf config

4️⃣ Run Backend
node server.js

5️⃣ Open Dashboard
Visit: http://localhost:3000

