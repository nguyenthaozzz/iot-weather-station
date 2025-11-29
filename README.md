# 🌤️ IoT Weather Station (ESP32 – Local Deployment)
This project is a locally-hosted IoT Weather Station built using an ESP32, multiple environmental sensors, and a local dashboard for real-time monitoring.
It collects temperature, humidity, and pressure, sends them over MQTT to an InfluxDB time-series database, and displays live charts on a custom web interface.
<img width="1050" height="788" alt="image" src="https://github.com/user-attachments/assets/9ddf882d-8ef9-4be9-9823-cc5b0708cc17" />


## 📌 Features
🌡️ Real-time temperature, humidity, and pressure monitoring </br>
📡 ESP32 + MQTT (Mosquitto) for lightweight data transmission </br>
🗄️ Local InfluxDB + Telegraf for time-series data storage </br>
📊 Interactive Dashboard (HTML/CSS/JS) with real-time charts </br>
🖼️ TFT LCD Display for on-device visualization </br>
🔄 Auto-refresh weather data every few seconds </br>
🛠️ Fully local deployment — secure, private, and offline-capable </br>

## 📌 System Architecture
### Block Diagram
<img width="1202" height="966" alt="image" src="https://github.com/user-attachments/assets/96ee97c2-53d0-4775-b313-2c14e8a1b06a" />

### Schematic Diagram
<img width="972" height="938" alt="image" src="https://github.com/user-attachments/assets/c7da7ef8-fcc0-48c8-b723-b7634c626c13" />

### Activity Diagram
<img width="1327" height="691" alt="image" src="https://github.com/user-attachments/assets/3c5632af-18f4-4120-8c90-ca519b5dcc6f" />

1. ESP32 reads sensor data every few seconds.
2. Data is published to MQTT topics.
3. Telegraf listens to these MQTT topics.
4. Telegraf writes data into InfluxDB buckets.
5. Node.js backend queries the latest values.
6. Dashboard displays real-time charts & current values.


## 🛠️ Hardware Used
- ESP32 NodeMCU Development Board
- DHT11 Sensor (Temperature & Humidity)
- BMP180 Sensor (Pressure)
- ST7735 TFT Display (SPI)

<img width="919" height="675" alt="image" src="https://github.com/user-attachments/assets/4f671cb8-c091-41b6-999c-daf351be54dd" />

## 🧰 Software & Tools
- Arduino IDE (ESP32 Firmware)
- Mosquitto MQTT Broker
- InfluxDB 2.x
- Telegraf
- Node.js + Express (Backend API)
- HTML, CSS, JavaScript (Frontend Visualization)

## 🔧 Installation & Setup
1️⃣ Install Required Services
- Install Mosquitto
- Install InfluxDB 2.x
- Install Telegraf
- Install Node.js (LTS)

2️⃣ Flash ESP32
Upload firmware from /firmware with your WiFi & MQTT credentials.

3️⃣Configure Mosquitto `mosquitto.conf`
```
listener 1883
allow_anonymous true
```
4️⃣ Configure InfluxDB
*Open http://localhost:8086/ to config InfuxDB*
- Create a bucket
- Create an API token
- Update Telegraf config

5️⃣ Run Project
- **Run mosquitto**
``"<your url...> \mosquitto.exe" -c "<your url...> \mosquitto.conf" -v  ``
- **Run influxDB**
`telegraf --config "<your url...> \influxdb\telegraf-1.36.2\telegraf.conf"`
- **Run Dashboard**
``
node server.js
``
> [!NOTE] 
> Commands run in CMD at inside the project folder. 

6️⃣ Open Dashboard
Visit: http://localhost:8080
