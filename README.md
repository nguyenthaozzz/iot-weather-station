🌤️ IoT Weather Station (ESP32 – Local Deployment)
This project is a locally-hosted IoT Weather Station built using an ESP32, multiple environmental sensors, and a local dashboard for real-time monitoring.
It collects temperature, humidity, and pressure, sends them over MQTT to an InfluxDB time-series database, and displays live charts on a custom web interface.
<img width="578" height="771" alt="image" src="https://github.com/user-attachments/assets/98a0e8fe-14d1-47e9-96ab-367cb03bd3e5" />


📌 Features
🌡️ Real-time temperature, humidity, and pressure monitoring
📡 ESP32 + MQTT (Mosquitto) for lightweight data transmission
🗄️ Local InfluxDB + Telegraf for time-series data storage
📊 Interactive Dashboard (HTML/CSS/JS) with real-time charts
🖼️ TFT LCD Display for on-device visualization
🔄 Auto-refresh weather data every few seconds
🛠️ Fully local deployment — secure, private, and offline-capable

📌 System Architecture
Block Diagram
<img width="1202" height="966" alt="image" src="https://github.com/user-attachments/assets/96ee97c2-53d0-4775-b313-2c14e8a1b06a" />

Schematic Diagram
<img width="972" height="938" alt="image" src="https://github.com/user-attachments/assets/c7da7ef8-fcc0-48c8-b723-b7634c626c13" />

Activity Diagram
<img width="1327" height="691" alt="image" src="https://github.com/user-attachments/assets/3c5632af-18f4-4120-8c90-ca519b5dcc6f" />

1. ESP32 reads sensor data every few seconds.
2. Data is published to MQTT topics.
3. Telegraf listens to these MQTT topics.
4. Telegraf writes data into InfluxDB buckets.
5. Node.js backend queries the latest values.
6. Dashboard displays real-time charts & current values.

Sequence Diagram
<img width="1814" height="864" alt="image" src="https://github.com/user-attachments/assets/def9f172-da88-4d70-8c34-054208a510d4" />


🛠️ Hardware Used
ESP32 NodeMCU Development Board
DHT11 Sensor (Temperature & Humidity)
BMP180 Sensor (Pressure)
ST7735 TFT Display (SPI)

<img width="919" height="675" alt="image" src="https://github.com/user-attachments/assets/4f671cb8-c091-41b6-999c-daf351be54dd" />

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

Result
<img width="1050" height="788" alt="image" src="https://github.com/user-attachments/assets/9ddf882d-8ef9-4be9-9823-cc5b0708cc17" />


